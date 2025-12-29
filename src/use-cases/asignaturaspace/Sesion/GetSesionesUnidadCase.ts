import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";
import { SesionDto } from "../../../domain/dtos/ResponseDtos";

export class GetSesionesUnidadCase {
    constructor(private sesionRepository: SesionesRepository) { }

    async execute(unidadId: number): Promise<SesionDto[]> {
        const sesiones = await this.sesionRepository.getByUnidadId(unidadId);
        return sesiones.map(s => ({
            id: s.id || 0,
            tema: s.tema,
            objetivos: s.objetivos,
            recursos: s.recursos,
            tipo: s.tipo.toString() // Convert enum to string
        }));
    }
}