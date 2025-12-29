import { CursoRepository } from "../../../domain/repositories/Curso/Curso";
import { AsignaturaRepository } from "../../../domain/repositories/Asignatura/Asignatura";
import { AsignaturaConCursosDto } from "../../../domain/dtos/ResponseDtos";

export class GetCursosDocenteCase {
    constructor(
        private cursoRepository: CursoRepository,
        private asignaturaRepository: AsignaturaRepository
    ) { }

    async execute(docenteId: number): Promise<AsignaturaConCursosDto[]> {
        const asignaturas = await this.asignaturaRepository.getByDocenteId(docenteId);
        const cursos = await this.cursoRepository.getByDocenteId(docenteId);

        return asignaturas.map(asignatura => ({
            id: asignatura.id || 0,
            nombre: asignatura.nombre,
            calificacionMinimaAprobacion: asignatura.calificacionMinimaAprobacion,
            porcentajeAsistenciaMinima: asignatura.porcentajeAsistenciaMinima,
            cursos: cursos
                .filter(curso => curso.idasignatura === asignatura.id)
                .map(c => ({
                    id: c.id || 0,
                    nombre: c.nombre,
                    activo: c.activo,
                    asignaturaId: c.idasignatura,
                    grupoId: c.idgrupo,
                    promedio: c.obtenerPromedio(),
                    porcentajeAsistencia: c.obtenerPorecentajeAsistencia()
                }))
        }));
    }
}
