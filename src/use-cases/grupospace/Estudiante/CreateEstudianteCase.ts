import { EstudianteRepository } from "../../../domain/repositories/Grupos/Estudiante";
import { CreateEstudianteDto } from "../../../domain/dtos/CreationDtos";
import { Estudiante } from "../../../domain/Grupo/Estudiante";

export class CreateEstudianteCase {
    constructor(private estudianteRepository: EstudianteRepository) { }

    async execute(dto: CreateEstudianteDto): Promise<void> {
        const estudiante = new Estudiante(
            dto.nombre,
            dto.matricula,
            
        );
        await this.estudianteRepository.save(estudiante, dto.grupoId);
    }
}
