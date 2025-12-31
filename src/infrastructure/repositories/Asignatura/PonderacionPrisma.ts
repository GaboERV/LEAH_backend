import { Injectable } from "@nestjs/common";
import { PonderacionRepository } from "../../../domain/repositories/Asignatura/Ponderacion";
import { PrismaService } from "../../prisma/prisma.service";
import { Ponderacion } from "../../../domain/Asignatura/Ponderacion";
import { Actividad } from "../../../domain/Asignatura/Actividad";
import { Subactividad } from "../../../domain/Asignatura/Subactividad";

@Injectable()
export class PonderacionPrismaRepository implements PonderacionRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Ponderacion | null> {
        const ponderacionPrisma = await this.prisma.ponderacion.findUnique({
            where: { id },
            include: {
                actividades: {
                    include: {
                        subactividades: true
                    }
                }
            }
        });

        if (!ponderacionPrisma) return null;

        return this.mapPonderacionPrismaToDomain(ponderacionPrisma);
    }

    async getByUnidadId(unidadId: number): Promise<Ponderacion[]> {
        const ponderacionesPrisma = await this.prisma.ponderacion.findMany({
            where: { unidadId },
            include: {
                actividades: {
                    include: {
                        subactividades: true
                    }
                }
            }
        });

        return ponderacionesPrisma.map(p => this.mapPonderacionPrismaToDomain(p));
    }

    async save(unidadId: number, ponderacion: Ponderacion, ponderacionId?: number): Promise<void> {
        const id = ponderacionId || ponderacion.id;

        if (id) {
            await this.prisma.ponderacion.update({
                where: { id },
                data: {
                    nombre: ponderacion.nombre,
                    porcentaje: ponderacion.porcentaje
                }
            });

            // 1. Absolute List: Delete Actividades not in the domain object
            const currentActividadIds = ponderacion.listaActividades
                .map(a => a.id)
                .filter(aid => aid !== undefined) as number[];

            await this.prisma.actividad.deleteMany({
                where: {
                    ponderacionId: id,
                    id: { notIn: currentActividadIds }
                }
            });

            // 2. Update or Create Actividades
            for (const actividad of ponderacion.listaActividades) {
                if (actividad.id) {
                    await this.prisma.actividad.update({
                        where: { id: actividad.id },
                        data: {
                            nombre: actividad.nombre,
                            porcentaje: actividad.porcentaje
                        }
                    });
                } else {
                    const newActividad = await this.prisma.actividad.create({
                        data: {
                            nombre: actividad.nombre,
                            porcentaje: actividad.porcentaje,
                            ponderacionId: id
                        }
                    });

                    // Trigger Calificacion creation directly for the Actividad (subactividadId = null)
                    await this.createCalificacionesForActividad(newActividad.id, unidadId, null);
                }
            }
        } else {
            const newPonderacion = await this.prisma.ponderacion.create({
                data: {
                    nombre: ponderacion.nombre,
                    porcentaje: ponderacion.porcentaje,
                    unidadId: unidadId
                }
            });

            for (const actividad of ponderacion.listaActividades) {
                const newActividad = await this.prisma.actividad.create({
                    data: {
                        nombre: actividad.nombre,
                        porcentaje: actividad.porcentaje,
                        ponderacionId: newPonderacion.id
                    }
                });

                // Trigger Calificacion creation directly for the Actividad (subactividadId = null)
                await this.createCalificacionesForActividad(newActividad.id, unidadId, null);
            }
        }
    }

    private async createCalificacionesForActividad(actividadId: number, unidadId: number, subactividadId: number | null) {
        // 1. Get Asignatura ID from Unidad
        const unidad = await this.prisma.unidad.findUnique({
            where: { id: unidadId },
            select: { asignaturaId: true }
        });
        if (!unidad) return;

        // 2. Find all Cursos for this Asignatura
        const cursos = await this.prisma.curso.findMany({
            where: { asignaturaId: unidad.asignaturaId },
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
            subactividadId: subactividadId, // Can be null now
            valor: 0, // Default grade
            comentarios: ""
        }));

        await this.prisma.calificacion.createMany({
            data: calificacionesData
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.ponderacion.delete({
            where: { id }
        });
    }

    private mapPonderacionPrismaToDomain(p: any): Ponderacion {
        return new Ponderacion(
            p.nombre,
            p.porcentaje,
            p.actividades.map((a: any) => this.mapActividadPrismaToDomain(a)),
            p.id
        );
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
