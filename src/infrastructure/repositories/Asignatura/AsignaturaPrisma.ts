import { Injectable } from "@nestjs/common";
import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";
import { PrismaService } from "../../prisma/prisma.service";
import { Asignatura } from "../../../domain/Asignatura/Asignatura";
import { Unidad } from "../../../domain/Asignatura/Unidad";
import { Ponderacion } from "../../../domain/Asignatura/Ponderacion";
import { Actividad } from "../../../domain/Asignatura/Actividad";
import { Subactividad } from "../../../domain/Asignatura/Subactividad";
import { Sesion } from "../../../domain/Asignatura/Sesion";
import { tipoClase } from "../../../domain/Asignatura/tipoclase.enum";
import { TipoSesion } from "@prisma/client";

@Injectable()
export class AsignaturaPrismaRepository implements AsignaturaRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Asignatura | null> {
        const asignaturaPrisma = await this.prisma.asignatura.findUnique({
            where: { id },
            include: {
                unidades: {
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
                }
            }
        });

        if (!asignaturaPrisma) return null;

        return new Asignatura(
            asignaturaPrisma.nombre,
            asignaturaPrisma.calificacionMinimaAprobatoria,
            asignaturaPrisma.porcentajeAsistenciaMinima,
            asignaturaPrisma.unidades.map(u => this.mapUnidadPrismaToDomain(u)),
            asignaturaPrisma.id
        );
    }

    async getByDocenteId(docenteId: number): Promise<Asignatura[]> {
        const asignaturasPrisma = await this.prisma.asignatura.findMany({
            where: { docenteId },
            include: {
                unidades: {
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
                }
            }
        });

        return asignaturasPrisma.map(a => new Asignatura(
            a.nombre,
            a.calificacionMinimaAprobatoria,
            a.porcentajeAsistenciaMinima,
            a.unidades.map(u => this.mapUnidadPrismaToDomain(u)),
            a.id
        ));
    }

    async save(docenteId: number, asignatura: Asignatura, asignaturaId?: number): Promise<void> {
        const id = asignaturaId || asignatura.id;

        if (id) {
            await this.prisma.asignatura.update({
                where: { id },
                data: {
                    nombre: asignatura.nombre,
                    calificacionMinimaAprobatoria: asignatura.calificacionMinimaAprobacion,
                    porcentajeAsistenciaMinima: asignatura.porcentajeAsistenciaMinima,
                }
            });
        } else {
            await this.prisma.asignatura.create({
                data: this.mapAsignaturaToPrismaCreateInput(asignatura, docenteId)
            });
        }
    }

    async delete(id: number): Promise<void> {
        await this.prisma.asignatura.delete({
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
            [], // subactividades IDs not directly in Sesion in Schema
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
            "", // Descripcion not in Schema Actividad model? Checked schema: Actividad has nombre, porcentaje, ponderacionId, sesionId. NO descripcion.
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
    private mapAsignaturaToPrismaCreateInput(asignatura: Asignatura, docenteId: number): any {
        return {
            nombre: asignatura.nombre,
            calificacionMinimaAprobatoria: asignatura.calificacionMinimaAprobacion,
            porcentajeAsistenciaMinima: asignatura.porcentajeAsistenciaMinima,
            docenteId: docenteId,
            unidades: {
                create: asignatura.listaUnidades.map(unidad => ({
                    nombre: unidad.nombre,
                    publicado: unidad.publicado,
                    ponderaciones: {
                        create: unidad.listaPonderaciones.map(ponderacion => ({
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
                        }))
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
                }))
            }
        };
    }
}