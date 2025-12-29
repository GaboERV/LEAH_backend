import { UnidadRepository } from "../../../domain/repositories/Asignatura/Unidad";
import { Unidad } from "../../../domain/Asignatura/Unidad";
import { CreateUnidadDto } from "../../../domain/dtos/CreationDtos";

export class CreateUnidadCase {
    constructor(private unidadRepository: UnidadRepository) { }

    async execute(dto: CreateUnidadDto): Promise<void> {
        const unidad = new Unidad(dto.nombre, [], []);
        // Repository signature: save(asignaturaId, unidad, unidadId?)
        await this.unidadRepository.save(dto.asignaturaId, unidad);
    }
}
