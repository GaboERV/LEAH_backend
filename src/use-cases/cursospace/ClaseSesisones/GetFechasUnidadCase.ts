import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";
import { ClaseCursoDto } from "../../../domain/dtos/ResponseDtos";

export class GetFechasUnidadCase {
    constructor(private claseCursoRepository: ClaseCursoRepository) { }

    async execute(cursoId: number, unidadId: number): Promise<ClaseCursoDto[]> {
        const clases = await this.claseCursoRepository.get(cursoId, unidadId);

        return clases.map(c => ({
            id: c.id || 0,
            nombre: c.session?.tema || "Sin sesión asignada",
            fecha: c.fecha,
            sesionId: c.session?.id
        }));
    }
}
