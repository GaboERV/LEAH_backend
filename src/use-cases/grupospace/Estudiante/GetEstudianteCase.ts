import { EstudianteRepository } from "../../../domain/repositories/Grupos/Estudiante";
import { EstudianteDto } from "../../../domain/dtos/ResponseDtos";

export class GetEstudianteCase {
    constructor(private estudianteRepository: EstudianteRepository) { }

    async execute(id: number): Promise<EstudianteDto | null> {
        const estudiante = await this.estudianteRepository.get(id);
        if (!estudiante) return null;
        return {
            id: estudiante.id ?? 0,
            nombre: estudiante.nombre,
            matricula: estudiante.matricula
        };
    }
}
