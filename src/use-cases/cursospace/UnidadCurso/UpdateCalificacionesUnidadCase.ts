import { UnidadCursoRepository } from "../../../domain/repositories/Curso/UnidadCurso";
import { IReporteUnidad } from "../../../domain/Curso/Interfaces";

export class UpdateCalificacionesUnidadCase {
    constructor(private unidadCursoRepository: UnidadCursoRepository) { }

    async execute(reporte: IReporteUnidad): Promise<void> {
        const unidad = await this.unidadCursoRepository.get(reporte.idUnidad);
        if (!unidad) {
            throw new Error(`UnidadCurso con id ${reporte.idUnidad} no encontrada`);
        }
        unidad.actualizarCalificaciones(reporte);
        await this.unidadCursoRepository.save(unidad.cursoId, unidad);
    }
}
