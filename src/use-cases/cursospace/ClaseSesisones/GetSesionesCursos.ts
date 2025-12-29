import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";
import { ClaseCursoRepository } from "../../../domain/repositories/Curso/ClaseCurso";
import { SesionConFechaDto } from "../../../domain/dtos/ResponseDtos";

export class GetSesionesCursosCase {
    constructor(
        private sesionesRepository: SesionesRepository,
        private claseCursoRepository: ClaseCursoRepository
    ) { }

    async execute(cursoId: number, unidadId: number): Promise<SesionConFechaDto[]> {
        const sesiones = await this.sesionesRepository.getByUnidadId(unidadId);
        const clases = (await this.claseCursoRepository.get(cursoId, unidadId))
            .filter(clase => clase.session !== undefined );

        return sesiones.map(sesion => {
            const claseAsignada = clases.find(c => c.session?.id === sesion.id);

            return {
                id: sesion.id || 0,
                tema: sesion.tema,
                objetivos: sesion.objetivos,
                recursos: sesion.recursos,
                tipo: sesion.tipo,
                fecha: claseAsignada ? claseAsignada.fecha : null
            };
        });
    }
}