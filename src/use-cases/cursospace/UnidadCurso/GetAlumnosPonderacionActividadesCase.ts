import { IReporteUnidad } from "../../../domain/Curso/Interfaces";
import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";

export class GetAlumnosPonderacionActividadesCase {
    constructor(
        private unidadCursoRepository: UnidadCursoRepository
    ) { }
    async execute(cursoId: number, unidadId: number):Promise<IReporteUnidad[]> {
        const unidadCurso = await this.unidadCursoRepository.get(cursoId,unidadId);
        if (!unidadCurso) throw new Error("UnidadCurso no encontrado");
        return unidadCurso.obtenerCalificaciones();
    }
}