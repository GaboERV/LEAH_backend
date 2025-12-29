import { UnidadRepository } from "../../../domain/repositories/Asignatura/Unidad";

export class DeleteUnidadCase {
    constructor(
        private unidadRepository: UnidadRepository
    ) { }

    async execute(id: number): Promise<void> {
        await this.unidadRepository.delete(id);
    }
}