import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";
import { GrupoDto } from "../../../domain/dtos/ResponseDtos";
import { DocenteRepository } from "../../../domain/repositories/Docente";

export class GetGrupoCase {
    constructor(
        private grupoRepository: GrupoRepository,
        private docenteRepository: DocenteRepository
    ) { }

    async execute(id: number,docenteId: number): Promise<GrupoDto | null> {
        const grupo = await this.grupoRepository.get(id);
        if (!grupo) return null;

        const docente = await this.docenteRepository.get(docenteId);
        if (!docente) throw new Error("Docente no encontrado");

        return {
            id: grupo.id ?? 0,
            nombre: grupo.nombre,
            cantidadEstudiantes: grupo.listaEstudiantes.length,
            promedio: docente.obtenerListaPromediosPorGrupo().find(d => d.id === grupo.id)?.promedio,
            porcentajeAsistencia: docente.obtenerListaPorcentajeGeneralAsistenciaPorGrupo().find(d => d.id === grupo.id)?.porcentaje,
        };
    }
}
