import { Injectable } from "@nestjs/common";
import { UnidadRepository } from "../../../domain/repositories/Asignatura/Unidad";
import { PrismaService } from "../../prisma/prisma.service";
import { Unidad } from "../../../domain/Asignatura/Unidad";
import { Ponderacion } from "../../../domain/Asignatura/Ponderacion";
import { Sesion } from "../../../domain/Asignatura/Sesion";
import { Actividad } from "../../../domain/Asignatura/Actividad";
import { Subactividad } from "../../../domain/Asignatura/Subactividad";
import { tipoClase } from "../../../domain/Asignatura/tipoclase.enum";
import { TipoSesion } from "@prisma/client";

@Injectable()
export class UnidadPrismaRepository implements UnidadRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Unidad | null> {
        const unidadPrisma = await this.prisma.unidad.findUnique({
            where: { id },
            include: {
                ponderaciones: {
                    include: {
                        actividades: {
                            include: {
                                subactividades: true
                            }
                        }
                    }
                },
                sesiones: {
                    include: {
                        actividades: true
                    }
                }
            }
        });

        if (!unidadPrisma) return null;

        return this.mapUnidadPrismaToDomain(unidadPrisma);
    }

    async getByCursoId(cursoId: number): Promise<Unidad[]> {
        // Assuming we want the Units defined in the Asignatura of this Curso
        const curso = await this.prisma.curso.findUnique({
            where: { id: cursoId },
            select: { asignaturaId: true }
        });

        if (!curso) return [];

        const unidadesPrisma = await this.prisma.unidad.findMany({
            where: { asignaturaId: curso.asignaturaId },
            include: {
                ponderaciones: {
                    include: {
                        actividades: {
                            include: {
                                subactividades: true
                            }
                        }
                    }
                },
                sesiones: {
                    include: {
                        actividades: true
                    }
                }
            }
        });

        return unidadesPrisma.map(u => this.mapUnidadPrismaToDomain(u));
    }

    async save(asignaturaId: number, unidad: Unidad, unidadId?: number): Promise<void> {
        const id = unidadId || unidad.id;

        if (id) {
            await this.prisma.unidad.update({
                where: { id },
                data: {
                    nombre: unidad.nombre,
                    publicado: unidad.publicado,
                }
            });

            // 1. Get IDs of Ponderaciones currently in the Domain Object
            const currentPonderacionIds = unidad.listaPonderaciones
                .map(p => p.id)
                .filter(id => id !== undefined) as number[];

            // 2. Delete Ponderaciones that are in DB but NOT in the Domain Object (The list is absolute)
            // We use deleteMany for efficiency. 
            // WARNING: This is a Hard Delete. If Soft Delete is preferred, update 'deletedAt' instead.
            await this.prisma.ponderacion.deleteMany({
                where: {
                    unidadId: id,
                    id: { notIn: currentPonderacionIds }
                }
            });

            // 3. Update or Create Ponderaciones
            for (const ponderacion of unidad.listaPonderaciones) {
                if (ponderacion.id) {
                    await this.prisma.ponderacion.update({
                        where: { id: ponderacion.id },
                        data: {
                            nombre: ponderacion.nombre,
                            porcentaje: ponderacion.porcentaje
                        }
                    });
                } else {
                    await this.prisma.ponderacion.create({
                        data: {
                            ...this.mapPonderacionToPrismaCreateInput(ponderacion),
                            unidadId: id
                        }
                    });
                }
            }
        } else {
            await this.prisma.unidad.create({
                data: this.mapUnidadToPrismaCreateInput(unidad, asignaturaId)
            });
        }
    }

    async delete(id: number): Promise<void> {
        await this.prisma.unidad.delete({
            where: { id }
        });
    }

    private mapUnidadPrismaToDomain(u: any): Unidad {
        return new Unidad(
            u.nombre,
            u.sesiones.map((s: any) => this.mapSesionPrismaToDomain(s)),
            u.ponderaciones.map((p: any) => this.mapPonderacionPrismaToDomain(p)),
            u.id
        );
    }

    private mapSesionPrismaToDomain(s: any): Sesion {
        return new Sesion(
            s.tema,
            s.objetivo,
            s.recursos,
            this.mapTipoSesionPrismaToDomain(s.tipo),
            s.actividades ? s.actividades.map((a: any) => a.id) : [],
            [],
            s.id
        );
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
            "",
            a.porcentaje,
            a.subactividades.map((s: any) => new Subactividad(s.id, s.nombre, s.porcentaje))
        );
    }

    private mapTipoSesionPrismaToDomain(t: TipoSesion): tipoClase {
        switch (t) {
            case TipoSesion.clase: return tipoClase.clase;
            case TipoSesion.evaluacion: return tipoClase.evaluacion;
            case TipoSesion.inhabil: return tipoClase.inhabil;
            default: return tipoClase.clase;
        }
    }

    private mapTipoSesionDomainToPrisma(t: tipoClase): TipoSesion {
        switch (t) {
            case tipoClase.clase: return TipoSesion.clase;
            case tipoClase.evaluacion: return TipoSesion.evaluacion;
            case tipoClase.inhabil: return TipoSesion.inhabil;
            default: return TipoSesion.clase;
        }
    }

    private mapUnidadToPrismaCreateInput(unidad: Unidad, asignaturaId: number): any {
        return {
            nombre: unidad.nombre,
            publicado: unidad.publicado,
            asignaturaId: asignaturaId,
            ponderaciones: {
                create: unidad.listaPonderaciones.map(ponderacion => this.mapPonderacionToPrismaCreateInput(ponderacion))
            },
            sesiones: {
                create: unidad.listaSesiones.map(sesion => ({
                    tema: sesion.tema,
                    objetivo: sesion.objetivos,
                    recursos: sesion.recursos,
                    tipo: this.mapTipoSesionDomainToPrisma(sesion.tipo),
                    entregas: "",
                }))
            }
        };
    }

    private mapPonderacionToPrismaCreateInput(ponderacion: Ponderacion): any {
        return {
            nombre: ponderacion.nombre,
            porcentaje: ponderacion.porcentaje,
            actividades: {
                create: ponderacion.listaActividades.map(actividad => ({
                    nombre: actividad.nombre,
                    porcentaje: actividad.porcentaje,
                    subactividades: {
                        create: actividad.listaSubactividades.map(sub => ({
                            nombre: sub.nombre,
                            porcentaje: sub.porcentaje
                        }))
                    }
                }))
            }
        };
    }
}
