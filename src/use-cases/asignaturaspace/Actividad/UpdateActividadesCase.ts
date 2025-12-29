import { PonderacionRepository } from "../../../domain/repositories/Asignatura/Ponderacion";
import { UpdateActividadesDto } from "../../../domain/dtos/CreationDtos";
import { Actividad } from "../../../domain/Asignatura/Actividad";

export class UpdateActividadesCase {
    constructor(private ponderacionRepository: PonderacionRepository) { }

    async execute(dto: UpdateActividadesDto): Promise<void> {
        const ponderacion = await this.ponderacionRepository.get(dto.ponderacionId);

        if (!ponderacion) throw new Error("Ponderacion no encontrada");

        const actividades = dto.actividades.map(a => new Actividad(a.id || 0, a.nombre, a.descripcion, a.porcentaje, []));

        ponderacion.modificarActividades(actividades);

        // Repository signature: save(unidadId, ponderacion, ponderacionId?)
        await this.ponderacionRepository.save(dto.unidadId, ponderacion, ponderacion.id);
    }
}
