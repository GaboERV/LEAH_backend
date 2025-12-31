import { UnidadRepository } from "../../../domain/repositories/Asignatura/Unidad";
import { Unidad } from "../../../domain/Asignatura/Unidad";
import { UpdateUnidadDto } from "../../../domain/dtos/CreationDtos";

export class UpdateUnidadCase {
    constructor(private readonly unidadRepository: UnidadRepository) { }

    async execute(dto: UpdateUnidadDto): Promise<void> {
        const unidadExistente = await this.unidadRepository.get(dto.id);
        if (!unidadExistente) {
            throw new Error('Unidad no encontrada');
        }

        const unidad = new Unidad(
            dto.nombre,
            unidadExistente.listaSesiones,
            unidadExistente.listaPonderaciones,
            dto.id
        );
        unidad.publico = unidadExistente.publicado;

        await this.unidadRepository.save(dto.asignaturaId, unidad, dto.id);
    }
}
