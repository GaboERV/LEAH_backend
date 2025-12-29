import { ActividadRepository } from "../../../domain/repositories/Asignatura/Actividad";
import { ActividadDto } from "../../../domain/dtos/ResponseDtos";

export class GetActividadesPonderacionCase {
    constructor(private actividadRepository: ActividadRepository) { }

    async execute(ponderacionId: number): Promise<ActividadDto[]> {
        const actividades = await this.actividadRepository.getByPonderacionId(ponderacionId);

        return actividades.map(a => ({
            id: a.id,
            nombre: a.nombre,
            descripcion: a.descripcion,
            porcentaje: a.porcentaje,
            subactividades: a.listaSubactividades.map(s => ({
                id: s.id,
                nombre: s.nombre,
                porcentaje: s.porcentaje
            }))
        }));
    }
}
