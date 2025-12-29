import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";
import { Asignatura } from "../../../domain/Asignatura/Asignatura";
import { CreateAsignaturaDto } from "../../../domain/dtos/CreationDtos";

export class CreateAsignaturaCase {
    constructor(private asignaturaRepository: AsignaturaRepository) { }

    async execute(dto: CreateAsignaturaDto): Promise<void> {
        const asignatura = new Asignatura(dto.nombre, dto.calificacionMinimaAprobacion, dto.porcentajeAsistenciaMinima, []);
        // Repository signature: save(docenteId, asignatura, asignaturaId?)
        await this.asignaturaRepository.save(dto.docenteId, asignatura);
    }
}
