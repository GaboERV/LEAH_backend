import { AlumnoSubactividadCalificacion } from "./AlumnoSubactividadCalificacion"

export class SubactividadCurso {
    constructor(
        private _id: number,
        private _nombre: string,
        private _porcentaje: number,
        private _listaAlumnosSubactividadCalificacion: AlumnoSubactividadCalificacion[]
    ) { }

    get id() { return this._id }
    get nombre() { return this._nombre }
    get porcentaje() { return this._porcentaje }
    get listaAlumnosSubactividadCalificacion() { return this._listaAlumnosSubactividadCalificacion }


    obtenerCalificaciones() {
        return this.listaAlumnosSubactividadCalificacion.map(alumno => {
            return {
                id: alumno.id,
                alumnoId: alumno.alumnoId,
                nombreAlumno: alumno.nombreAlumno,
                calificacion: alumno.calificacion
            }
        }
        )
    }

    obtenerPromedio() {
        const calificaciones = this.listaAlumnosSubactividadCalificacion.reduce((total, alumno) => total + alumno.calificacion, 0)
        return calificaciones / this.listaAlumnosSubactividadCalificacion.length
    }

    public actualizarCalificacion(alumnoId: number, calificacion: number): void {
        const alumnoCalificacion = this.listaAlumnosSubactividadCalificacion.find(a => a.alumnoId === alumnoId);
        if (alumnoCalificacion) {
            alumnoCalificacion.calificacion = calificacion;
        }
    }
}