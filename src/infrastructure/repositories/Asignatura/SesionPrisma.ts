import { Injectable } from "@nestjs/common";
import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";
import { PrismaService } from "../../prisma/prisma.service";
import { Sesion } from "../../../domain/Asignatura/Sesion";
import { tipoClase } from "../../../domain/Asignatura/tipoclase.enum";
import { TipoSesion } from "@prisma/client";

@Injectable()
export class SesionPrismaRepository implements SesionesRepository {
    constructor(private prisma: PrismaService) { }

    async get(id: number): Promise<Sesion | null> {
        const sesionPrisma = await this.prisma.sesion.findUnique({
            where: { id },
            include: {
                actividades: {
                    select: { id: true }
                }
            }
        });

        if (!sesionPrisma) return null;

        return this.mapSesionPrismaToDomain(sesionPrisma);
    }

    async getByUnidadId(unidadId: number): Promise<Sesion[]> {
        const sesionesPrisma = await this.prisma.sesion.findMany({
            where: { unidadId },
            include: {
                actividades: {
                    select: { id: true }
                }
            }
        });

        return sesionesPrisma.map(s => this.mapSesionPrismaToDomain(s));
    }

    async save(unidadId: number, sesion: Sesion, sesionId?: number): Promise<void> {
        const id = sesionId || sesion.id;

        if (id) {
            await this.prisma.sesion.update({
                where: { id },
                data: {
                    tema: sesion.tema,
                    objetivo: sesion.objetivos,
                    recursos: sesion.recursos,
                    tipo: this.mapTipoSesionDomainToPrisma(sesion.tipo),
                    // entregas is missing in domain, keeping existing or empty? 
                    // Prisma update only updates specified fields.
                }
            });

            // Update Actividades relations
            // First disconnect all
            await this.prisma.actividad.updateMany({
                where: { sesionId: id },
                data: { sesionId: null }
            });

            // Then connect new ones
            if (sesion.idActividades && sesion.idActividades.length > 0) {
                await this.prisma.actividad.updateMany({
                    where: { id: { in: sesion.idActividades } },
                    data: { sesionId: id }
                });
            }

        } else {
            const newSesion = await this.prisma.sesion.create({
                data: {
                    tema: sesion.tema,
                    objetivo: sesion.objetivos,
                    recursos: sesion.recursos,
                    tipo: this.mapTipoSesionDomainToPrisma(sesion.tipo),
                    entregas: "", // Default as it's missing in domain
                    unidadId: unidadId
                }
            });

            if (sesion.idActividades && sesion.idActividades.length > 0) {
                await this.prisma.actividad.updateMany({
                    where: { id: { in: sesion.idActividades } },
                    data: { sesionId: newSesion.id }
                });
            }
        }
    }

    async delete(id: number): Promise<void> {
        await this.prisma.sesion.delete({
            where: { id }
        });
    }

    private mapSesionPrismaToDomain(s: any): Sesion {
        return new Sesion(
            s.tema,
            s.objetivo, // Domain has 'objetivos', Prisma has 'objetivo'
            s.recursos,
            this.mapTipoSesionPrismaToDomain(s.tipo),
            s.actividades ? s.actividades.map((a: any) => a.id) : [],
            [], // idSubactividades - not tracked in Sesion relation directly
            s.id
        );
    }

    private mapTipoSesionDomainToPrisma(t: tipoClase): TipoSesion {
        switch (t) {
            case tipoClase.clase: return TipoSesion.clase;
            case tipoClase.evaluacion: return TipoSesion.evaluacion;
            case tipoClase.inhabil: return TipoSesion.inhabil;
            default: return TipoSesion.clase;
        }
    }

    private mapTipoSesionPrismaToDomain(t: TipoSesion): tipoClase {
        switch (t) {
            case TipoSesion.clase: return tipoClase.clase;
            case TipoSesion.evaluacion: return tipoClase.evaluacion;
            case TipoSesion.inhabil: return tipoClase.inhabil;
            default: return tipoClase.clase;
        }
    }
}
