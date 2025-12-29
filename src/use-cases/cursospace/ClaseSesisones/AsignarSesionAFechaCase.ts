import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";
import { AsignarSesionDto } from "../../../domain/dtos/CreationDtos";

export class AsignarSesionAFechaCase {
    constructor(private claseCursoRepository: ClaseCursoRepository) { }
    async execute(dto: AsignarSesionDto): Promise<void> {
        await this.claseCursoRepository.asignarFechaASesion(dto.claseId, dto.sesionId);
    }
}