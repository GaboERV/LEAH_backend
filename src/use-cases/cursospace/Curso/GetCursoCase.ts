
import { CursoDto } from "../../../domain/dtos/ResponseDtos";
import { CursoRepository } from "../../../domain/repositories/Curso/Curso";

export class GetCursoCase {
    constructor(private cursoRepository: CursoRepository) { }

    async execute(id: number): Promise<CursoDto | null> {
        const curso = await this.cursoRepository.get(id);
        if (!curso) return null;
        return {
            id: curso.id || 0,
            nombre: curso.nombre,
            activo: curso.activo,
            asignaturaId: curso.idasignatura,
            grupoId: curso.idgrupo
        };
    }
}
