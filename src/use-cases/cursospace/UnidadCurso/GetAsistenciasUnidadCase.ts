import { IAsistenciaClase } from "../../../domain/Curso/Interfaces";
import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";

export class GetAsistenciasUnidadCase {
    constructor(
        private unidadCursoRepository: UnidadCursoRepository
    ) { }
    async execute(cursoId: number, unidadId: number): Promise<IAsistenciaClase[]> {
        const unidadCurso = await this.unidadCursoRepository.get(cursoId, unidadId);
        if (!unidadCurso) throw new Error("UnidadCurso no encontrado");
        return unidadCurso.obtenerListaAsistencias();
    }
}
