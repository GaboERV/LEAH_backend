import { Injectable } from "@nestjs/common";
import { EstudianteRepository } from "../../../domain/repositories/Grupos/Estudiante";
import { PrismaService } from "../../prisma/prisma.service";
import { Estudiante } from "../../../domain/Grupo/Estudiante";

@Injectable()
export class EstudiantePrismaRepository implements EstudianteRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Estudiante | null> {
        const estudiantePrisma = await this.prisma.estudiante.findUnique({
            where: { id }
        });

        if (!estudiantePrisma) return null;

        return new Estudiante(
            estudiantePrisma.nombre,
            estudiantePrisma.matricula,
            estudiantePrisma.id
        );
    }

    async save(estudiante: Estudiante, grupoId?: number): Promise<void> {
        if (estudiante.id) {
            await this.update(estudiante);
        } else {
            if (!grupoId) throw new Error("GrupoId is required for creating a new Estudiante");

            const newEstudiante = await this.prisma.estudiante.create({
                data: {
                    nombre: estudiante.nombre,
                    matricula: estudiante.matricula,
                    grupoId: grupoId
                }
            });

            // Trigger automatic grade creation
            await this.createCalificacionesForEstudiante(newEstudiante.id, grupoId);
        }
    }

    async update(estudiante: Estudiante): Promise<void> {
        if (!estudiante.id) return;
        await this.prisma.estudiante.update({
            where: { id: estudiante.id },
            data: {
                nombre: estudiante.nombre,
                matricula: estudiante.matricula
            }
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.estudiante.delete({
            where: { id }
        });
    }

    private async createCalificacionesForEstudiante(estudianteId: number, grupoId: number) {
        // 1. Find all Cursos for the Grupo
        const cursos = await this.prisma.curso.findMany({
            where: { grupoId },
            include: {
                asignatura: {
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
                }
            }
        });

        const calificacionesData: any[] = [];

        // 2. Iterate through structure to find all Actividades and Subactividades
        for (const curso of cursos) {
            for (const unidad of curso.asignatura.unidades) {
                for (const ponderacion of unidad.ponderaciones) {
                    for (const actividad of ponderacion.actividades) {

                        // Create Calificacion for Actividad (SubactividadId = null)
                        calificacionesData.push({
                            estudianteId: estudianteId,
                            actividadId: actividad.id,
                            subactividadId: null,
                            valor: 0,
                            comentarios: ""
                        });

                        // Create Calificacion for each Subactividad
                        for (const sub of actividad.subactividades) {
                            calificacionesData.push({
                                estudianteId: estudianteId,
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

        // 3. Bulk create Calificaciones
        if (calificacionesData.length > 0) {
            await this.prisma.calificacion.createMany({
                data: calificacionesData
            });
        }
    }
}
