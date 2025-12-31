import { Injectable } from "@nestjs/common";
import { ActividadRepository } from "../../../domain/repositories/Asignatura/Actividad";
import { PrismaService } from "../../prisma/prisma.service";
import { Actividad } from "../../../domain/Asignatura/Actividad";
import { Subactividad } from "../../../domain/Asignatura/Subactividad";

@Injectable()
export class ActividadPrismaRepository implements ActividadRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Actividad | null> {
        const actividadPrisma = await this.prisma.actividad.findUnique({
            where: { id },
            include: {
                subactividades: true
            }
        });

        if (!actividadPrisma) return null;

        return this.mapActividadPrismaToDomain(actividadPrisma);
    }

    async getByPonderacionId(ponderacionId: number): Promise<Actividad[]> {
        const actividadesPrisma = await this.prisma.actividad.findMany({
            where: { ponderacionId },
            include: {
                subactividades: true
            }
        });

        return actividadesPrisma.map(a => this.mapActividadPrismaToDomain(a));
    }

    async save(ponderacionId: number, actividad: Actividad, actividadId?: number): Promise<void> {
        const id = actividadId || actividad.id;

        if (id) {
            await this.prisma.actividad.update({
                where: { id },
                data: {
                    nombre: actividad.nombre,
                    porcentaje: actividad.porcentaje
                }
            });

            // 1. Absolute List: Delete Subactividades not in the domain object
            const currentSubIds = actividad.listaSubactividades
                .map(s => s.id)
                .filter(sid => sid !== undefined) as number[];

            await this.prisma.subactividad.deleteMany({
                where: {
                    actividadId: id,
                    id: { notIn: currentSubIds }
                }
            });

            // 2. Update or Create Subactividades
            for (const sub of actividad.listaSubactividades) {
                if (sub.id) {
                    await this.prisma.subactividad.update({
                        where: { id: sub.id },
                        data: {
                            nombre: sub.nombre,
                            porcentaje: sub.porcentaje
                        }
                    });
                } else {
                    const newSub = await this.prisma.subactividad.create({
                        data: {
                            nombre: sub.nombre,
                            porcentaje: sub.porcentaje,
                            actividadId: id
                        }
                    });

                    // Trigger Calificacion creation for the new Subactividad
                    await this.createCalificacionesForSubactividad(newSub.id, id, ponderacionId);
                }
            }
        } else {
            const newActividad = await this.prisma.actividad.create({
                data: {
                    nombre: actividad.nombre,
                    porcentaje: actividad.porcentaje,
                    ponderacionId: ponderacionId
                }
            });

            for (const sub of actividad.listaSubactividades) {
                const newSub = await this.prisma.subactividad.create({
                    data: {
                        nombre: sub.nombre,
                        porcentaje: sub.porcentaje,
                        actividadId: newActividad.id
                    }
                });

                // Trigger Calificacion creation for the new Subactividad
                await this.createCalificacionesForSubactividad(newSub.id, newActividad.id, ponderacionId);
            }
        }
    }

    private async createCalificacionesForSubactividad(subactividadId: number, actividadId: number, ponderacionId: number) {
        // 1. Get Asignatura ID via Ponderacion -> Unidad
        const ponderacion = await this.prisma.ponderacion.findUnique({
            where: { id: ponderacionId },
            include: {
                unidad: {
                    select: { asignaturaId: true }
                }
            }
        });

        if (!ponderacion || !ponderacion.unidad) return;
        const asignaturaId = ponderacion.unidad.asignaturaId;

        // 2. Find all Cursos for this Asignatura
        const cursos = await this.prisma.curso.findMany({
            where: { asignaturaId: asignaturaId },
            select: { grupoId: true }
        });

        const grupoIds = cursos.map(c => c.grupoId);
        if (grupoIds.length === 0) return;

        // 3. Find all Estudiantes in these Grupos
        const estudiantes = await this.prisma.estudiante.findMany({
            where: { grupoId: { in: grupoIds } },
            select: { id: true }
        });

        if (estudiantes.length === 0) return;

        // 4. Create Calificacion records
        const calificacionesData = estudiantes.map(estudiante => ({
            estudianteId: estudiante.id,
            actividadId: actividadId,
            subactividadId: subactividadId,
            valor: 0, // Default grade
            comentarios: ""
        }));

        await this.prisma.calificacion.createMany({
            data: calificacionesData
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.actividad.delete({
            where: { id }
        });
    }

    private mapActividadPrismaToDomain(a: any): Actividad {
        return new Actividad(
            a.id,
            a.nombre,
            "", // Descripcion not in Schema
            a.porcentaje,
            a.subactividades.map((s: any) => new Subactividad(s.id, s.nombre, s.porcentaje))
        );
    }
}
