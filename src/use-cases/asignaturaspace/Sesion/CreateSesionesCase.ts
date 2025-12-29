import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";
import { Sesion } from "../../../domain/Asignatura/Sesion";
import { CreateSesionDto } from "../../../domain/dtos/CreationDtos";
import { tipoClase } from "../../../domain/Asignatura/tipoclase.enum";

export class CreateSesionesCase {
    constructor(private sesionRepository: SesionesRepository) { }

    async execute(dto: CreateSesionDto): Promise<void> {
        // Assuming tipo is string in DTO but enum in entity. Casting or mapping needed.
        // For now, casting as any to satisfy type checker if strict.
        const sesion = new Sesion(dto.tema, dto.objetivos, dto.recursos, dto.tipo as unknown as tipoClase, [], []);

        // Repository signature: save(unidadId, sesion, sesionId?)
        await this.sesionRepository.save(dto.unidadId, sesion);
    }
}
