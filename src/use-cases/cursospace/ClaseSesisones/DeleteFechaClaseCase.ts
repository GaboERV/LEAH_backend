import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";

export class DeleteFechaClaseCase {
    constructor(private claseCursoRepository: ClaseCursoRepository) { }

    async execute(id: number): Promise<void> {
        await this.claseCursoRepository.delete(id);
    }
}
