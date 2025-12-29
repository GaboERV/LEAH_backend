import { IReporteUnidad } from "../../../domain/Curso/Interfaces";
import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";

export class GetAlumnosPonderacionActividadesCase {
    constructor(
        private unidadCursoRepository: UnidadCursoRepository
    ) { }
    async execute(id:number):Promise<IReporteUnidad[]> {
        const unidadCurso = await this.unidadCursoRepository.get(id);
        if (!unidadCurso) throw new Error("UnidadCurso no encontrado");
        return unidadCurso.obtenerCalificaciones();
    }
}