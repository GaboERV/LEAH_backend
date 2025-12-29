import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";
import { AsignaturaDto } from "../../../domain/dtos/ResponseDtos";

export class GetAsignaturasDocenteCase {
    constructor(private asignaturaRepository: AsignaturaRepository) { }

    async execute(docenteId: number): Promise<AsignaturaDto[]> {
        const asignaturas = await this.asignaturaRepository.getByDocenteId(docenteId);
        return asignaturas.map(a => ({
            id: a.id || 0,
            nombre: a.nombre,
            calificacionMinimaAprobacion: a.calificacionMinimaAprobacion,
            porcentajeAsistenciaMinima: a.porcentajeAsistenciaMinima
        }));
    }
}
