import { IAsistenciaClase } from "../../../domain/Curso/Interfaces";
import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";

export class UpdateAsistenciasUnidadCase {
    constructor(
        private unidadCursoRepository: UnidadCursoRepository
    ) { }
    async execute(cursoId: number, unidadId: number, asistencias: IAsistenciaClase[]): Promise<void> {
        const unidadCurso = await this.unidadCursoRepository.get(cursoId, unidadId);
        if (!unidadCurso) throw new Error("UnidadCurso no encontrado");
        unidadCurso.actualizarAsistencias(asistencias);
        await this.unidadCursoRepository.save(cursoId, unidadCurso);
    }
}
