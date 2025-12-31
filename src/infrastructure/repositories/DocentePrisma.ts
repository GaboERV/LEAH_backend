import { Injectable } from "@nestjs/common";
import { DocenteRepository } from "../../domain/repositories/Docente";
import { PrismaService } from "../prisma/prisma.service";
import { Docente } from "../../domain/Docente";
import { Curso } from "../../domain/Curso/Curso";
import { UnidadCurso } from "../../domain/Curso/UnidadCurso";
import { ActividadCurso } from "../../domain/Curso/ActividadCurso";
import { SubactividadCurso } from "../../domain/Curso/SubactividadCurso";
import { PonderacionCurso } from "../../domain/Curso/PonderacionCurso";
import { AlumnoSubactividadCalificacion } from "../../domain/Curso/AlumnoSubactividadCalificacion";
import { AlumnoActividadCalificacion } from "../../domain/Curso/AlumnoActividadCalificacion";
import { ClaseCurso } from "../../domain/Curso/ClaseCurso";
import { EstudianteAsistencia } from "../../domain/Curso/EstudianteAsistencia";
import { EstudianteParticipacion } from "../../domain/Curso/EstudianteParticipacion";

@Injectable()
export class DocentePrismaRepository implements DocenteRepository {
    constructor(private prisma: PrismaService) { }

    async getByEmail(email: string): Promise<Docente | null> {
        const docentePrisma = await this.prisma.docente.findUnique({
            where: { email }
        });

        if (!docentePrisma) return null;

        // Return simple object without courses
        return new Docente(
            docentePrisma.nombre,
            docentePrisma.email,
            docentePrisma.password,
            [], // Empty list as requested
            docentePrisma.id
        );
    }

    async save(docente: Docente): Promise<void> {
        if (docente.id) {
            await this.prisma.docente.update({
                where: { id: docente.id },
                data: {
                    nombre: docente.nombre,
                    email: docente.correo,
                    password: docente.contrasenia
                }
            });
        } else {
            await this.prisma.docente.create({
                data: {
                    nombre: docente.nombre,
                    email: docente.correo,
                    password: docente.contrasenia
                }
            });
        }
    }

    async get(id: number): Promise<Docente | null> {
        const docentePrisma = await this.prisma.docente.findUnique({
            where: { id },
            include: {
                asignaturas: {
                    include: {
                        cursos: {
                            include: {
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
                            }
                        }
                    }
                }
            }
        });

        if (!docentePrisma) return null;

        const cursosDomain: Curso[] = [];

        for (const asignatura of docentePrisma.asignaturas) {
            for (const cursoPrisma of asignatura.cursos) {
                cursosDomain.push(this.mapCursoPrismaToDomain(cursoPrisma));
            }
        }

        return new Docente(
            docentePrisma.nombre,
            docentePrisma.email,
            docentePrisma.password,
            cursosDomain,
            docentePrisma.id
        );
    }

    private mapCursoPrismaToDomain(c: any): Curso {
        const grupoId = c.grupoId;
        // Filter students belonging to this group (though c.grupo.estudiantes should be correct if c.grupo is correct)
        // Actually, we need to filter relations (calificaciones, asistencias) by students in this group.
        const studentIds = new Set(c.grupo.estudiantes.map((e: any) => e.id));

        const unidadesCurso = c.asignatura.unidades.map((u: any) => {

            // 1. Map Ponderaciones
            const ponderacionesCurso = u.ponderaciones.map((p: any) => {

                const actividadesCurso = p.actividades.map((a: any) => {

                    const subactividadesCurso = a.subactividades.map((s: any) => {
                        // Filter qualifications for this subactivity and students in this group
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

                    // Filter qualifications for this activity (direct grades) and students in this group
                    // Note: Calificaciones linked to Actividad (where subactividadId is null usually, or just linked to Actividad)
                    // The schema allows linking to both.
                    // Domain logic usually implies 'Actividad' grade is either direct or aggregate.
                    // If no subactividades, it might be direct.
                    // However, ActividadCurso constructor takes 'listaAlumnosActividadCalificacion'.
                    // We will map the direct calificaciones found on the activity.
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
            // Filter by group
            const fechasClaseGrupo = u.fechasClase.filter((fc: any) => fc.grupoId === grupoId);
            const clasesCurso = fechasClaseGrupo.map((fc: any) => {
                const listaAsistencia = fc.asistencias.map((asist: any) => new EstudianteAsistencia(
                    asist.id,
                    asist.estudianteId,
                    asist.estudiante.nombre,
                    asist.asistencia, // Assuming enum/string compatibility or mapping needed if strict
                    asist.comentarios
                ));

                return new ClaseCurso(
                    fc.fecha,
                    listaAsistencia,
                    undefined, // Session optional
                    fc.id
                );
            });

            // 3. Map Participaciones
            // Filter by students in group (Participacion has estudianteId)
            const participacionesGrupo = u.participaciones.filter((part: any) => studentIds.has(part.estudianteId));
            const estudianteParticipacion = participacionesGrupo.map((part: any) => new EstudianteParticipacion(
                part.id,
                part.estudianteId,
                u.id, // unidadId
                part.numeroParticipaciones
            ));

            return new UnidadCurso(
                u.id,
                u.nombre,
                ponderacionesCurso,
                clasesCurso,
                estudianteParticipacion,
                c.id // Curso ID
            );
        });

        return new Curso(
            c.asignatura.nombre,
            c.asignaturaId,
            c.grupoId,
            unidadesCurso,
            true,
            c.id
        );
    }
}
