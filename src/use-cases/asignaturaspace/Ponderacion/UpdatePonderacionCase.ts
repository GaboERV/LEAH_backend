import { UnidadRepository } from "../../../domain/repositories/Asignatura/Unidad";
import { UpdatePonderacionDto } from "../../../domain/dtos/CreationDtos";
import { Ponderacion } from "../../../domain/Asignatura/Ponderacion";

export class UpdatePonderacionCase {
    constructor(private unidadRepository: UnidadRepository) { }

    async execute(dto: UpdatePonderacionDto): Promise<void> {
        const unidad = await this.unidadRepository.get(dto.unidadId);

        if (!unidad) throw new Error("Unidad no encontrada");

        const ponderaciones = dto.ponderaciones.map(p => new Ponderacion(p.nombre, p.porcentaje, [], p.id));

        unidad.modificarPonderacion(ponderaciones);

        // Repository signature: save(asignaturaId, unidad, unidadId?)
        await this.unidadRepository.save(dto.asignaturaId, unidad, unidad.id);
    }
}