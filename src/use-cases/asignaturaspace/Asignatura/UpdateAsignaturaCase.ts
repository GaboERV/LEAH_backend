import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";
import { UpdateAsignaturaDto } from "../../../domain/dtos/CreationDtos";

export class UpdateAsignaturaCase {
    constructor(private asignaturaRepository: AsignaturaRepository) { }

    async execute(dto: UpdateAsignaturaDto): Promise<void> {
        const asignatura = await this.asignaturaRepository.get(dto.id);
        if (!asignatura) throw new Error("Asignatura no encontrada");

        asignatura.update(dto.nombre, dto.calificacionMinimaAprobacion, dto.porcentajeAsistenciaMinima);

        // Repository signature: save(docenteId, asignatura, asignaturaId?)
        await this.asignaturaRepository.save(dto.docenteId, asignatura, dto.id);
    }
}
