import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";
import { DocenteRepository } from "../../../domain/repositories/Docente";
import { EstudianteDto } from "../../../domain/dtos/ResponseDtos";

export class GetEstudiantesByGrupoIdCase {
    constructor(
        private grupoRepository: GrupoRepository,
        private docenteRepository: DocenteRepository
    ) { }

    async execute(id: number, docenteId: number): Promise<EstudianteDto[]> {
        const grupo = await this.grupoRepository.get(id);
        if (!grupo) throw new Error("Grupo no encontrado");

        const docente = await this.docenteRepository.get(docenteId);
        if (!docente) throw new Error("Docente no encontrado");

        const datosEstudiantePromedios = docente.listaCursos.filter(c => c.idgrupo === id).map(c => c.obtenerCalificaciones());
        const datosEstudianteAsistencia = docente.listaCursos.filter(c => c.idgrupo === id).map(c => c.obtenerListaPorcentajeAsistenciaAlumnos());

        return grupo.listaEstudiantes
            .filter(e => e.id !== undefined)
            .map(e => {
                const studentId = e.id!;

                // Flatten all course reports and filter for the current student
                const reportesAlumno = datosEstudiantePromedios.flat().filter(r => r.alumnoId === studentId);
                const asistenciasAlumno = datosEstudianteAsistencia.flat().filter(r => r.alumnoId === studentId);

                // Calculate average of averages
                const promedioGeneral = reportesAlumno.length > 0
                    ? reportesAlumno.reduce((sum, r) => sum + r.calificacion, 0) / reportesAlumno.length
                    : 0;

                const porcentajeAsistencia = asistenciasAlumno.length > 0
                    ? asistenciasAlumno.reduce((sum, r) => sum + r.porcentaje, 0) / asistenciasAlumno.length
                    : 0;

                return {
                    id: studentId,
                    nombre: e.nombre,
                    matricula: e.matricula,
                    promedio: promedioGeneral,
                    porcentajeAsistencia: porcentajeAsistencia
                };
            });
    }
}