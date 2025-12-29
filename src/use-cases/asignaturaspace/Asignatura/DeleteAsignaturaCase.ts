import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";

export class DeleteAsignaturaCase {
    constructor(private asignaturaRepository: AsignaturaRepository) { }

    async execute(id: number): Promise<void> {
        await this.asignaturaRepository.delete(id);
    }
}
