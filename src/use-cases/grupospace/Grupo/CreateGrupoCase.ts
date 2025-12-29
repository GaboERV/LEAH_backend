import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";
import { CreateGrupoDto } from "../../../domain/dtos/CreationDtos";
import { Grupo } from "../../../domain/Grupo/Grupo";

export class CreateGrupoCase {
    constructor(private grupoRepository: GrupoRepository) { }

    async execute(dto: CreateGrupoDto): Promise<void> {
        const grupo = new Grupo(
            dto.nombre,
            [] // New group starts with no students
        );
        await this.grupoRepository.save(grupo);
    }
}
