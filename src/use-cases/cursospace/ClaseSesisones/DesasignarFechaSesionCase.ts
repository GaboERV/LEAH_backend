import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";

export class DesasignarFechaSesionCase {
    constructor(private claseCursoRepository: ClaseCursoRepository) { }
    async execute(claseId: number): Promise<void> {
        await this.claseCursoRepository.quitarFechaDeSesion(claseId);
    }
}