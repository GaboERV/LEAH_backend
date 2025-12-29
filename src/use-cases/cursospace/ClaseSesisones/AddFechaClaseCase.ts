import { ClaseCurso } from "../../../domain/Curso/ClaseCurso";
import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";
import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";
import { AddFechaClaseDto } from "../../../domain/dtos/CreationDtos";
import { Sesion } from "../../../domain/Asignatura/Sesion";

export class AddFechaClaseCase {
    constructor(
        private fechaClaseRepository: ClaseCursoRepository,
        private sesionesRepository: SesionesRepository
    ) { }

    async execute(dto: AddFechaClaseDto): Promise<void> {
        let sesion: Sesion | undefined;

        if (dto.sesionId) {
            const foundSesion = await this.sesionesRepository.get(dto.sesionId);
            if (!foundSesion) throw new Error("Sesion no encontrada");
            sesion = foundSesion;
        }

        const nuevaFechaClase = new ClaseCurso(dto.fecha, [], sesion);

        await this.fechaClaseRepository.save(dto.unidadId, nuevaFechaClase);
    }
}