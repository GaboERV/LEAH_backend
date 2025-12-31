import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";
import { UpdateGrupoDto } from "../../../domain/dtos/CreationDtos";

export class UpdateGrupoCase {
    constructor(private grupoRepository: GrupoRepository) { }

    async execute(dto: UpdateGrupoDto): Promise<void> {
        const grupo = await this.grupoRepository.get(dto.id);
        if (!grupo) {
            throw new Error("Grupo no encontrado");
        }
        grupo.nombre = dto.nombre;
        // Assuming other fields might be updated in the future or are handled elsewhere
        // For now, only name is updated based on Grupo entity
        await this.grupoRepository.save(dto.docenteId, grupo);
    }
}
