import { Injectable } from "@nestjs/common";
import { CursoRepository } from "../../../domain/repositories/Curso/Curso";
import { PrismaService } from "../../prisma/prisma.service";
import { Curso } from "../../../domain/Curso/Curso";
import { UnidadCurso } from "../../../domain/Curso/UnidadCurso";
import { ActividadCurso } from "../../../domain/Curso/ActividadCurso";
import { SubactividadCurso } from "../../../domain/Curso/SubactividadCurso";
import { PonderacionCurso } from "../../../domain/Curso/PonderacionCurso";
import { AlumnoSubactividadCalificacion } from "../../../domain/Curso/AlumnoSubactividadCalificacion";
import { AlumnoActividadCalificacion } from "../../../domain/Curso/AlumnoActividadCalificacion";
import { ClaseCurso } from "../../../domain/Curso/ClaseCurso";
import { EstudianteAsistencia } from "../../../domain/Curso/EstudianteAsistencia";
import { EstudianteParticipacion } from "../../../domain/Curso/EstudianteParticipacion";

@Injectable()
export class CursoPrismaRepository implements CursoRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Curso | null> {
        const cursoPrisma = await this.prisma.curso.findUnique({
            where: { id },
            include: this.getIncludes()
        });

        if (!cursoPrisma) return null;

        return this.mapCursoPrismaToDomain(cursoPrisma);
    }

    async getByDocenteId(docenteId: number): Promise<Curso[]> {
        // We need to find courses via Asignatura or Grupo where docenteId matches?
        // Schema: Curso -> Asignatura -> Docente. Also Curso -> Grupo -> Docente.
        // Usually "Cursos del Docente" means courses of asignaturas taught by the docente.
        // Or groups where the docente is the tutor?
        // Let's assume Asignatura.docenteId.
        const cursosPrisma = await this.prisma.curso.findMany({
            where: {
                asignatura: {
                    docenteId: docenteId
                }
            },
            include: this.getIncludes()
        });

        return cursosPrisma.map(c => this.mapCursoPrismaToDomain(c));
    }

    async getByAsignaturaId(asignaturaId: number): Promise<Curso[]> {
        const cursosPrisma = await this.prisma.curso.findMany({
            where: { asignaturaId },
            include: this.getIncludes()
        });

        return cursosPrisma.map(c => this.mapCursoPrismaToDomain(c));
    }

    async create(asignaturaId: number, grupoId: number): Promise<void> {
        // 1. Create the Curso
        await this.prisma.curso.create({
            data: {
                asignaturaId,
                grupoId
            }
        });

        // 2. Fetch necessary data for bulk creation
        const grupo = await this.prisma.grupo.findUnique({
            where: { id: grupoId },
            include: { estudiantes: true }
        });

        const asignatura = await this.prisma.asignatura.findUnique({
            where: { id: asignaturaId },
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
                        }
                    }
                }
            }
        });

        if (!grupo || !asignatura) return; // Should handle error better but void return

        const calificacionesData: any[] = [];
        const participacionesData: any[] = [];

        // 3. Prepare data
        for (const estudiante of grupo.estudiantes) {
            for (const unidad of asignatura.unidades) {
                // Participacion per Unidad per Estudiante
                participacionesData.push({
                    estudianteId: estudiante.id,
                    unidadId: unidad.id,
                    numeroParticipaciones: 0
                });

                for (const ponderacion of unidad.ponderaciones) {
                    for (const actividad of ponderacion.actividades) {
                        // Calificacion for Actividad
                        calificacionesData.push({
                            estudianteId: estudiante.id,
                            actividadId: actividad.id,
                            subactividadId: null,
                            valor: 0,
                            comentarios: ""
                        });

                        // Calificacion for Subactividades
                        for (const sub of actividad.subactividades) {
                            calificacionesData.push({
                                estudianteId: estudiante.id,
                                actividadId: actividad.id,
                                subactividadId: sub.id,
                                valor: 0,
                                comentarios: ""
                            });
                        }
                    }
                }
            }
        }

        // 4. Bulk Insert
        if (participacionesData.length > 0) {
            await this.prisma.participacion.createMany({
                data: participacionesData
            });
        }

        if (calificacionesData.length > 0) {
            await this.prisma.calificacion.createMany({
                data: calificacionesData
            });
        }
    }

    async delete(id: number): Promise<void> {
        await this.prisma.curso.delete({
            where: { id }
        });
    }

    private getIncludes() {
        return {
            grupo: {
                include: {
                    estudiantes: true
                }
            },
            asignatura: {
                include: {
                    unidades: {
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
                    }
                }
            }
        };
    }

    private mapCursoPrismaToDomain(c: any): Curso {
        const grupoId = c.grupoId;
        const studentIds = new Set(c.grupo.estudiantes.map((e: any) => e.id));

        const unidadesCurso = c.asignatura.unidades.map((u: any) => {

            // 1. Map Ponderaciones
            const ponderacionesCurso = u.ponderaciones.map((p: any) => {

                const actividadesCurso = p.actividades.map((a: any) => {

                    const subactividadesCurso = a.subactividades.map((s: any) => {
                        const calificacionesSub = s.calificaciones.filter((cal: any) => studentIds.has(cal.estudianteId));

                        const alumnosSubactividadCalificacion = calificacionesSub.map((cal: any) => new AlumnoSubactividadCalificacion(
                            cal.id,
                            cal.estudianteId,
                            cal.estudiante.nombre,
                            cal.valor
                        ));

                        return new SubactividadCurso(
                            s.id,
                            s.nombre,
                            s.porcentaje,
                            alumnosSubactividadCalificacion
                        );
                    });

                    const calificacionesAct = a.calificaciones.filter((cal: any) => studentIds.has(cal.estudianteId) && cal.subactividadId === null);

                    const alumnosActividadCalificacion = calificacionesAct.map((cal: any) => new AlumnoActividadCalificacion(
                        cal.id,
                        cal.estudianteId,
                        cal.estudiante.nombre,
                        cal.valor
                    ));

                    return new ActividadCurso(
                        a.id,
                        a.nombre,
                        a.porcentaje,
                        subactividadesCurso,
                        alumnosActividadCalificacion
                    );
                });

                return new PonderacionCurso(
                    p.id,
                    p.nombre,
                    p.porcentaje,
                    actividadesCurso
                );
            });

            // 2. Map Clases (FechasClase)
            const fechasClaseGrupo = u.fechasClase.filter((fc: any) => fc.grupoId === grupoId);
            const clasesCurso = fechasClaseGrupo.map((fc: any) => {
                const listaAsistencia = fc.asistencias.map((asist: any) => new EstudianteAsistencia(
                    asist.id,
                    asist.estudianteId,
                    asist.estudiante.nombre,
                    asist.estudiante.matricula, // Added matricula as per EstudianteAsistencia constructor
                    asist.asistencia,
                    asist.comentarios
                ));

                return new ClaseCurso(
                    fc.fecha,
                    listaAsistencia,
                    undefined,
                    fc.id
                );
            });

            // 3. Map Participaciones
            const participacionesGrupo = u.participaciones.filter((part: any) => studentIds.has(part.estudianteId));
            const estudianteParticipacion = participacionesGrupo.map((part: any) => new EstudianteParticipacion(
                part.id,
                part.estudianteId,
                u.id,
                part.numeroParticipaciones
            ));

            return new UnidadCurso(
                u.id,
                u.nombre,
                ponderacionesCurso,
                clasesCurso,
                estudianteParticipacion,
                c.id
            );
        });

        return new Curso(
            c.asignatura.nombre,
            c.asignaturaId,
            c.grupoId,
            unidadesCurso,
            true, // Activo default
            c.id
        );
    }
}
