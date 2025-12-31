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

            // Trigger automatic data initialization
            await this.initializeEstudianteData(newEstudiante.id, grupoId);
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

    private async initializeEstudianteData(estudianteId: number, grupoId: number) {
        // 1. Find all Cursos and FechasClase for the Grupo
        const [cursos, fechasClase] = await Promise.all([
            this.prisma.curso.findMany({
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
            }),
            this.prisma.fechaClase.findMany({
                where: { grupoId }
            })
        ]);

        const calificacionesData: any[] = [];
        const participacionesData: any[] = [];

        // 2. Iterate through structure to find all Actividades, Subactividades and Unidades
        for (const curso of cursos) {
            for (const unidad of curso.asignatura.unidades) {
                // Prepare Participacion data
                participacionesData.push({
                    estudianteId: estudianteId,
                    unidadId: unidad.id,
                    numeroParticipaciones: 0
                });

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

        // 3. Prepare AsistenciaParticipacion data
        const asistenciasData = fechasClase.map(fc => ({
            estudianteId: estudianteId,
            fechaClaseId: fc.id,
            asistencia: 'Asistio' as any, // Using string literal as any for enum compatibility
            comentarios: ""
        }));

        // 4. Bulk create all records
        await Promise.all([
            calificacionesData.length > 0 ? this.prisma.calificacion.createMany({ data: calificacionesData }) : Promise.resolve(),
            participacionesData.length > 0 ? this.prisma.participacion.createMany({ data: participacionesData }) : Promise.resolve(),
            asistenciasData.length > 0 ? this.prisma.asistenciaParticipacion.createMany({ data: asistenciasData }) : Promise.resolve(),
        ]);
    }
}
