import { Injectable } from "@nestjs/common";
import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";
import { PrismaService } from "../../prisma/prisma.service";
import { UnidadCurso } from "../../../domain/Curso/UnidadCurso";
import { PonderacionCurso } from "../../../domain/Curso/PonderacionCurso";
import { ActividadCurso } from "../../../domain/Curso/ActividadCurso";
import { SubactividadCurso } from "../../../domain/Curso/SubactividadCurso";
import { AlumnoSubactividadCalificacion } from "../../../domain/Curso/AlumnoSubactividadCalificacion";
import { AlumnoActividadCalificacion } from "../../../domain/Curso/AlumnoActividadCalificacion";
import { ClaseCurso } from "../../../domain/Curso/ClaseCurso";
import { EstudianteAsistencia } from "../../../domain/Curso/EstudianteAsistencia";
import { EstudianteParticipacion } from "../../../domain/Curso/EstudianteParticipacion";
import { TipoAsistencia } from "@prisma/client";

@Injectable()
export class UnidadCursoPrismaRepository implements UnidadCursoRepository {
    constructor(private prisma: PrismaService) { }

    async get(cursoId: number, unidadId: number): Promise<UnidadCurso | null> {
        const curso = await this.prisma.curso.findUnique({
            where: { id: cursoId },
            include: {
                grupo: {
                    include: { estudiantes: true }
                }
            }
        });

        if (!curso) return null;

        const unidadPrisma = await this.prisma.unidad.findUnique({
            where: { id: unidadId },
            include: {
                ponderaciones: {
                    include: {
                        actividades: {
                            include: {
                                subactividades: {
                                    include: {
                                        calificaciones: {
                                            include: { estudiante: true }
                                        }
                                    }
                                },
                                calificaciones: {
                                    include: { estudiante: true }
                                }
                            }
                        }
                    }
                },
                fechasClase: {
                    where: { grupoId: curso.grupoId },
                    include: {
                        asistencias: {
                            include: { estudiante: true }
                        }
                    }
                },
                participaciones: {
                    include: { estudiante: true }
                }
            }
        });

        if (!unidadPrisma) return null;

        return this.mapUnidadPrismaToDomain(unidadPrisma, curso.grupoId, curso.grupo.estudiantes.map(e => e.id), cursoId);
    }

    async getByCursoId(cursoId: number): Promise<UnidadCurso[]> {
        const curso = await this.prisma.curso.findUnique({
            where: { id: cursoId },
            include: {
                asignatura: {
                    include: {
                        unidades: true
                    }
                }
            }
        });

        if (!curso) return [];

        // Shallow mapping: just basic info, empty lists
        return curso.asignatura.unidades.map(u => new UnidadCurso(
            u.id,
            u.nombre,
            [], // Empty ponderaciones
            [], // Empty clases
            [], // Empty participaciones
            cursoId
        ));
    }

    async save(cursoId: number, unidadCurso: UnidadCurso): Promise<void> {
        // Update Calificaciones
        for (const ponderacion of unidadCurso.listaPonderacionesCurso) {
            for (const actividad of ponderacion.listaActividadescurso) {
                // Update Subactividades grades
                for (const sub of actividad.listaSubactividadesCurso) {
                    for (const cal of sub.listaAlumnosSubactividadCalificacion) {
                        if (cal.id) {
                            await this.prisma.calificacion.update({
                                where: { id: cal.id },
                                data: { valor: cal.calificacion }
                            });
                        }
                    }
                }
                // Update Actividad grades (direct)
                for (const cal of actividad.listaAlumnosActividadCalificacion) {
                    if (cal.id) {
                        await this.prisma.calificacion.update({
                            where: { id: cal.id },
                            data: { valor: cal.calificacion }
                        });
                    }
                }
            }
        }

        // Update Asistencias
        for (const clase of unidadCurso.listaClaseCurso) {
            for (const asistencia of clase.listaAsistencia) {
                if (asistencia.id) {
                    await this.prisma.asistenciaParticipacion.update({
                        where: { id: asistencia.id },
                        data: {
                            asistencia: this.mapAsistenciaDomainToPrisma(asistencia.asistio),
                            comentarios: asistencia.comentarios
                        }
                    });
                }
            }
        }

        // Update Participaciones
        for (const part of unidadCurso.listaEstudianteParticipacion) {
            if (part.id) {
                await this.prisma.participacion.update({
                    where: { id: part.id },
                    data: { numeroParticipaciones: part.numeroParticipacion }
                });
            }
        }
    }

    private mapUnidadPrismaToDomain(u: any, grupoId: number, studentIds: number[], cursoId: number): UnidadCurso {
        const studentIdsSet = new Set(studentIds);

        // 1. Map Ponderaciones
        const ponderacionesCurso = u.ponderaciones.map((p: any) => {
            const actividadesCurso = p.actividades.map((a: any) => {
                const subactividadesCurso = a.subactividades.map((s: any) => {
                    const calificacionesSub = s.calificaciones.filter((cal: any) => studentIdsSet.has(cal.estudianteId));
                    const alumnosSubactividadCalificacion = calificacionesSub.map((cal: any) => new AlumnoSubactividadCalificacion(
                        cal.id,
                        cal.estudianteId,
                        cal.estudiante.nombre,
                        cal.valor
                    ));
                    return new SubactividadCurso(s.id, s.nombre, s.porcentaje, alumnosSubactividadCalificacion);
                });

                const calificacionesAct = a.calificaciones.filter((cal: any) => studentIdsSet.has(cal.estudianteId) && cal.subactividadId === null);
                const alumnosActividadCalificacion = calificacionesAct.map((cal: any) => new AlumnoActividadCalificacion(
                    cal.id,
                    cal.estudianteId,
                    cal.estudiante.nombre,
                    cal.valor
                ));

                return new ActividadCurso(a.id, a.nombre, a.porcentaje, subactividadesCurso, alumnosActividadCalificacion);
            });
            return new PonderacionCurso(p.id, p.nombre, p.porcentaje, actividadesCurso);
        });

        // 2. Map Clases (FechasClase) - Already filtered by query but good to ensure
        const clasesCurso = u.fechasClase.map((fc: any) => {
            const listaAsistencia = fc.asistencias.map((asist: any) => new EstudianteAsistencia(
                asist.id,
                asist.estudianteId,
                asist.estudiante.nombre,
                asist.estudiante.matricula,
                this.mapAsistenciaPrismaToDomain(asist.asistencia),
                asist.comentarios
            ));
            return new ClaseCurso(fc.fecha, listaAsistencia, undefined, fc.id);
        });

        // 3. Map Participaciones
        const participacionesGrupo = u.participaciones.filter((part: any) => studentIdsSet.has(part.estudianteId));
        const estudianteParticipacion = participacionesGrupo.map((part: any) => new EstudianteParticipacion(
            part.id,
            part.estudianteId,
            u.id,
            part.numeroParticipaciones
        ));

        return new UnidadCurso(u.id, u.nombre, ponderacionesCurso, clasesCurso, estudianteParticipacion, cursoId);
    }

    private mapAsistenciaDomainToPrisma(asistencia: string): TipoAsistencia {
        switch (asistencia) {
            case 'presente': return TipoAsistencia.Asistio;
            case 'tardanza': return TipoAsistencia.Retardo;
            case 'ausente': return TipoAsistencia.Ausente;
            case 'justificado': return TipoAsistencia.Justificado;
            default: return TipoAsistencia.Asistio;
        }
    }

    private mapAsistenciaPrismaToDomain(asistencia: TipoAsistencia): any {
        switch (asistencia) {
            case TipoAsistencia.Asistio: return 'presente';
            case TipoAsistencia.Retardo: return 'tardanza';
            case TipoAsistencia.Ausente: return 'ausente';
            case TipoAsistencia.Justificado: return 'justificado';
            default: return 'presente';
        }
    }
}
