import { EstudianteRepository } from "../../../domain/repositories/Grupos/Estudiante";
import { UpdateEstudianteDto } from "../../../domain/dtos/CreationDtos";

export class UpdateEstudianteCase {
    constructor(private estudianteRepository: EstudianteRepository) { }

    async execute(dto: UpdateEstudianteDto): Promise<void> {
        const estudiante = await this.estudianteRepository.get(dto.id);
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }
        estudiante.nombre = dto.nombre;
        estudiante.matricula = dto.matricula;
        await this.estudianteRepository.update(estudiante);
    }
}
