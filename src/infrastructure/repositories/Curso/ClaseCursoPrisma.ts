import { Injectable } from "@nestjs/common";
import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";
import { PrismaService } from "../../prisma/prisma.service";
import { ClaseCurso } from "../../../domain/Curso/ClaseCurso";
import { EstudianteAsistencia } from "../../../domain/Curso/EstudianteAsistencia";
import { Sesion } from "../../../domain/Asignatura/Sesion";
import { TipoAsistencia } from "@prisma/client";

@Injectable()
export class ClaseCursoPrismaRepository implements ClaseCursoRepository {
    constructor(private prisma: PrismaService) { }

    async get(grupoId: number, unidadId: number): Promise<ClaseCurso[]> {
        const fechasClase = await this.prisma.fechaClase.findMany({
            where: {
                grupoId,
                unidadId
            },
            include: {
                asistencias: {
                    include: {
                        estudiante: true
                    }
                },
                sesion: {
                    include: {
                        actividades: true
                    }
                }
            }
        });

        return fechasClase.map(fc => this.mapFechaClaseToDomain(fc));
    }

    async save(grupoId: number, unidadId: number, claseCurso: ClaseCurso): Promise<void> {
        if (claseCurso.id) {
            // Update existing
            await this.prisma.fechaClase.update({
                where: { id: claseCurso.id },
                data: {
                    fecha: claseCurso.fecha
                }
            });

            // Update attendances
            for (const asistencia of claseCurso.listaAsistencia) {
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
        } else {
            // Create new
            const newFechaClase = await this.prisma.fechaClase.create({
                data: {
                    fecha: claseCurso.fecha,
                    grupoId: grupoId,
                    unidadId: unidadId,
                    sesionId: claseCurso.session ? claseCurso.session.id : null
                }
            });

            // Create attendance records for all students in the group
            const grupo = await this.prisma.grupo.findUnique({
                where: { id: grupoId },
                include: { estudiantes: true }
            });

            if (grupo && grupo.estudiantes.length > 0) {
                const asistenciasData = grupo.estudiantes.map(estudiante => ({
                    estudianteId: estudiante.id,
                    fechaClaseId: newFechaClase.id,
                    asistencia: TipoAsistencia.Asistio, // Default
                    comentarios: ""
                }));

                await this.prisma.asistenciaParticipacion.createMany({
                    data: asistenciasData
                });
            }
        }
    }

    async asignarFechaASesion(claseId: number, sesionId: number): Promise<void> {
        await this.prisma.fechaClase.update({
            where: { id: claseId },
            data: { sesionId }
        });
    }

    async quitarFechaDeSesion(claseId: number): Promise<void> {
        await this.prisma.fechaClase.update({
            where: { id: claseId },
            data: { sesionId: null }
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.fechaClase.delete({
            where: { id }
        });
    }

    private mapFechaClaseToDomain(fc: any): ClaseCurso {
        const listaAsistencia = fc.asistencias.map((a: any) => new EstudianteAsistencia(
            a.id,
            a.estudianteId,
            a.estudiante.nombre, 
            a.estudiante.matricula,
            this.mapAsistenciaPrismaToDomain(a.asistencia),
            a.comentarios
        ));

        let sesionDomain: Sesion | undefined = undefined;
        if (fc.sesion) {
            const actividadesIds = fc.sesion.actividades ? fc.sesion.actividades.map((act: any) => act.id) : [];

            sesionDomain = new Sesion(
                fc.sesion.tema,
                fc.sesion.objetivo,
                fc.sesion.recursos,
                fc.sesion.tipo,
                actividadesIds,
                [],
                fc.sesion.id
            );
        }

        return new ClaseCurso(
            fc.fecha,
            listaAsistencia,
            sesionDomain,
            fc.id
        );
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
