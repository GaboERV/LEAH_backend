import { ActividadRepository } from "../../../domain/repositories/Asignatura/Actividad";
import { UpdateSubactividadesDto } from "../../../domain/dtos/CreationDtos";
import { Subactividad } from "../../../domain/Asignatura/Subactividad";

export class UpdateSubactividadesCase {
    constructor(private actividadRepository: ActividadRepository) { }

    async execute(dto: UpdateSubactividadesDto): Promise<void> {
        const actividad = await this.actividadRepository.get(dto.actividadId);

        if (!actividad) throw new Error("Actividad no encontrada");

        const subactividades = dto.subactividades.map(s => new Subactividad(s.id || 0, s.nombre, s.porcentaje));

        actividad.modificarSubactividades(subactividades);

        // Repository signature: save(ponderacionId, actividad, actividadId?)
        await this.actividadRepository.save(dto.ponderacionId, actividad, actividad.id);
    }
}
