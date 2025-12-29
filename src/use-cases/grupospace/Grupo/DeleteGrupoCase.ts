import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";

export class DeleteGrupoCase {
    constructor(private grupoRepository: GrupoRepository) { }

    async execute(id: number): Promise<void> {
        await this.grupoRepository.delete(id);
    }
}
