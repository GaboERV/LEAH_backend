import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";
import { AsignaturaDto } from "../../../domain/dtos/ResponseDtos";

export class GetAsignaturaCase {
    constructor(private asignaturaRepository: AsignaturaRepository) { }

    async execute(id: number): Promise<AsignaturaDto | null> {
        const asignatura = await this.asignaturaRepository.get(id);
        if (!asignatura) return null;
        return {
            id: asignatura.id || 0,
            nombre: asignatura.nombre,
            calificacionMinimaAprobacion: asignatura.calificacionMinimaAprobacion,
            porcentajeAsistenciaMinima: asignatura.porcentajeAsistenciaMinima
        };
    }
}
