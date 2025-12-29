import { EstudianteRepository } from "../../../domain/repositories/Grupos/Estudiante";

export class DeleteEstudianteCase {
    constructor(private estudianteRepository: EstudianteRepository) { }

    async execute(id: number): Promise<void> {
        await this.estudianteRepository.delete(id);
    }
}
