import { CreateCursoDto } from "../../../domain/dtos/CreationDtos";
import { CursoRepository } from "../../../domain/repositories/Curso/Curso";

export class CreateCursoCase {
    constructor(private cursoRepository: CursoRepository) { }
    async execute(dto: CreateCursoDto): Promise<void> {
        await this.cursoRepository.create(dto.asignaturaId, dto.grupoId);
    }
}
