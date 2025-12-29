import { Asignatura } from "../Asignatura/Asignatura";
import { Grupo } from "../Grupo/Grupo";
import { UnidadCurso } from "./UnidadCurso";
import { IReporteCurso, IUnidadDetalle, IAsistenciaAlumno } from "./Interfaces";

export class Curso {
    constructor(
        public nombre: string,
        private _idasignatura: number,
        private _idgrupo: number,
        private _UnidadesCurso: UnidadCurso[] = [],
        private _activo: boolean = true,
        private _id?: number,
    ) { }
    get id() { return this._id }
    get UnidadesCurso() { return this._UnidadesCurso }
    get activo() { return this._activo }
    get idasignatura() { return this._idasignatura }
    get idgrupo() { return this._idgrupo }
    set activo(estado: boolean) { this._activo = estado }


    public obtenerCalificacionAlumno(alumnoId: number): IReporteCurso {
        if (this.UnidadesCurso.length === 0) {
            return {
                alumnoId: alumnoId,
                idCurso: this.id || 0,
                nombreAlumno: "",
                calificacion: 0,
                unidades: []
            };
        }

        let totalCalificacion = 0;
        const unidadesDetalle: IUnidadDetalle[] = [];
        let nombreAlumno = "";

        this.UnidadesCurso.forEach(unidad => {
            const calificacionUnidad = unidad.obtenerCalificacionAlumno(alumnoId);

            if (calificacionUnidad.nombreAlumno) {
                nombreAlumno = calificacionUnidad.nombreAlumno;
            }

            // Assuming simple average for Units as they don't have percentage
            totalCalificacion += calificacionUnidad.calificacion;

            unidadesDetalle.push({
                idUnidad: unidad.id,
                nombre: unidad.nombre,
                calificacion: calificacionUnidad.calificacion,
                ponderaciones: calificacionUnidad.ponderaciones
            });
        });

        const calificacionFinal = this.UnidadesCurso.length > 0 ? totalCalificacion / this.UnidadesCurso.length : 0;

        return {
            alumnoId: alumnoId,
            idCurso: this.id || 0,
            nombreAlumno: nombreAlumno,
            calificacion: calificacionFinal,
            unidades: unidadesDetalle
        };
    }

    public obtenerCalificaciones(): IReporteCurso[] {
        if (this.UnidadesCurso.length === 0) {
            return [];
        }

        // Collect all unique student IDs
        const alumnosIds = new Set<number>();
        this.UnidadesCurso.forEach(unidad => {
            const calificaciones = unidad.obtenerCalificaciones();
            calificaciones.forEach((c) => alumnosIds.add(c.alumnoId));
        });

        const resultados: IReporteCurso[] = [];
        alumnosIds.forEach(alumnoId => {
            resultados.push(this.obtenerCalificacionAlumno(alumnoId));
        });

        return resultados;
    }

    public obtenerPromedio() {
        const promedios = this.UnidadesCurso.map(u => {
            return u.obtenerPromedio()

        })
        const promedioFinal = this.UnidadesCurso.length > 0 ? promedios.reduce((total, promedio) => total + promedio / this.UnidadesCurso.length, 0) : 0;
        return promedioFinal
    }

    public obtenerPromedioAlumno(alumnoId: number): number {
        if (this.UnidadesCurso.length === 0) {
            return 0;
        }

        let totalCalificacion = 0;

        this.UnidadesCurso.forEach(unidad => {
            totalCalificacion += unidad.obtenerPromedioAlumno(alumnoId);
        });

        return this.UnidadesCurso.length > 0 ? totalCalificacion / this.UnidadesCurso.length : 0;
    }
    obtenerPorecentajeAsistencia(): number {
        const asistencias = this.UnidadesCurso.map(u => {
            return u.obtenerPorecentajeAsistencia()
        })
        const asistenciaFinal = asistencias.reduce((total, asistencia) => total + asistencia / this.UnidadesCurso.length, 0)
        return asistenciaFinal
    }

    public obtenerListaPorcentajeAsistenciaAlumnos(): IAsistenciaAlumno[] {
        if (this.UnidadesCurso.length === 0) {
            return [];
        }

        const alumnosIds = new Set<number>();
        this.UnidadesCurso.forEach(unidad => {
            const asistencias = unidad.obtenerListaPorcentajeAsistenciaAlumnos();
            asistencias.forEach((a) => alumnosIds.add(a.alumnoId));
        });

        const resultados: IAsistenciaAlumno[] = [];
        alumnosIds.forEach(alumnoId => {
            // Calculate average attendance across all units for this student
            let totalAsistencia = 0;
            this.UnidadesCurso.forEach(unidad => {
                totalAsistencia += unidad.obtenerPorecentajeAsistenciaAlumno(alumnoId);
            });
            const promedioAsistencia = this.UnidadesCurso.length > 0 ? totalAsistencia / this.UnidadesCurso.length : 0;

            // We need the student name, we can get it from one of the unit reports or it might be passed in. 
            // Since we are iterating IDs, we need to find the name.
            // We can try to find the name from the unit reports.
            let nombreAlumno = "";
            for (const unidad of this.UnidadesCurso) {
                const asistenciasUnidad = unidad.obtenerListaPorcentajeAsistenciaAlumnos();
                const alumno = asistenciasUnidad.find(a => a.alumnoId === alumnoId);
                if (alumno) {
                    nombreAlumno = alumno.nombreAlumno;
                    break;
                }
            }

            resultados.push({
                alumnoId: alumnoId,
                nombreAlumno: nombreAlumno,
                porcentaje: promedioAsistencia
            });
        });

        return resultados;
    }


}