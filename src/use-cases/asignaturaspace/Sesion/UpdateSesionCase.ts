import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";
import { Sesion } from "../../../domain/Asignatura/Sesion";
import { UpdateSesionDto } from "../../../domain/dtos/CreationDtos";
import { tipoClase } from "../../../domain/Asignatura/tipoclase.enum";

export class UpdateSesionCase {
    constructor(private readonly sesionesRepository: SesionesRepository) { }

    async execute(dto: UpdateSesionDto): Promise<void> {
        const sesionExistente = await this.sesionesRepository.get(dto.id);
        if (!sesionExistente) {
            throw new Error('Sesión no encontrada');
        }

        const sesion = new Sesion(
            dto.tema,
            dto.objetivos,
            dto.recursos,
            dto.tipo as unknown as tipoClase,
            sesionExistente.idActividades,
            sesionExistente.idSubactividades,
            dto.id
        );

        await this.sesionesRepository.save(dto.unidadId, sesion, dto.id);
    }
}
