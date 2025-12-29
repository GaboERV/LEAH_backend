import { CursoRepository } from "../../../domain/repositories/Curso/Curso";

export class DeleteCursoCase {
    constructor(private cursoRepository: CursoRepository) { }

    async execute(id: number): Promise<void> {
        await this.cursoRepository.delete(id);
    }
}