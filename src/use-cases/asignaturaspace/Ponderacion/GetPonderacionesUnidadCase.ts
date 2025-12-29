import { PonderacionRepository } from "../../../domain/repositories/Asignatura/Ponderacion";
import { PonderacionDto } from "../../../domain/dtos/ResponseDtos";

export class GetPonderacionesUnidadCase {
    constructor(private ponderacionRepository: PonderacionRepository) { }

    async execute(unidadId: number): Promise<PonderacionDto[]> {
        const ponderaciones = await this.ponderacionRepository.getByUnidadId(unidadId);
        return ponderaciones.map(p => ({
            id: p.id || 0,
            nombre: p.nombre,
            porcentaje: p.porcentaje
        }));
    }
}
