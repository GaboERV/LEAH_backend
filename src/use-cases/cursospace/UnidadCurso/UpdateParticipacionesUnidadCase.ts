import { IParticipacionDetalle } from "../../../domain/Curso/Interfaces";
import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";

export class UpdateParticipacionesUnidadCase {
    constructor(
        private unidadCursoRepository: UnidadCursoRepository
    ) { }
    async execute(cursoId: number, unidadId: number, participaciones: IParticipacionDetalle[]): Promise<void> {
        const unidadCurso = await this.unidadCursoRepository.get(cursoId, unidadId);
        if (!unidadCurso) throw new Error("UnidadCurso no encontrado");
        unidadCurso.actualizarParticipaciones(participaciones);
        await this.unidadCursoRepository.save(cursoId, unidadCurso);
    }
}
