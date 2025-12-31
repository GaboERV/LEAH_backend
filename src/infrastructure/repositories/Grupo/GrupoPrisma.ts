import { Injectable } from "@nestjs/common";
import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";
import { PrismaService } from "../../prisma/prisma.service";
import { Grupo } from "../../../domain/Grupo/Grupo";
import { Estudiante } from "../../../domain/Grupo/Estudiante";

@Injectable()
export class GrupoPrismaRepository implements GrupoRepository {
    constructor(private prisma: PrismaService) { }

    async getAll(): Promise<Grupo[]> {
        const gruposPrisma = await this.prisma.grupo.findMany({
            include: {
                estudiantes: true
            }
        });
        return gruposPrisma.map(g => this.mapGrupoPrismaToDomain(g));
    }

    async getByDocenteId(docenteId: number): Promise<Grupo[]> {
        const gruposPrisma = await this.prisma.grupo.findMany({
            where: { docenteId },
            include: {
                estudiantes: true
            }
        });
        return gruposPrisma.map(g => this.mapGrupoPrismaToDomain(g));
    }

    async get(id: number): Promise<Grupo | null> {
        const grupoPrisma = await this.prisma.grupo.findUnique({
            where: { id },
            include: {
                estudiantes: true
            }
        });

        if (!grupoPrisma) return null;

        return this.mapGrupoPrismaToDomain(grupoPrisma);
    }

    async save(docenteId: number, grupo: Grupo): Promise<void> {
        if (grupo.id) {
            await this.prisma.grupo.update({
                where: { id: grupo.id },
                data: {
                    nombre: grupo.nombre,
                }
            });
        } else {
            await this.prisma.grupo.create({
                data: {
                    nombre: grupo.nombre,
                    docenteId: docenteId
                }
            });
        }
    }

    async delete(id: number): Promise<void> {
        await this.prisma.grupo.delete({
            where: { id }
        });
    }

    private mapGrupoPrismaToDomain(g: any): Grupo {
        return new Grupo(
            g.nombre,
            g.estudiantes.map((e: any) => new Estudiante(e.nombre, e.matricula, e.id)),
            g.id
        );
    }
}
