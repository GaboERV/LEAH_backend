import { SubactividadCurso } from "./SubactividadCurso"
import { AlumnoActividadCalificacion } from "./AlumnoActividadCalificacion"
import { IReporteActividad, ISubactividadDetalle, IActividadDetalle } from "./Interfaces";

export class ActividadCurso {
    constructor(
        private _id: number,
        private _nombre: string,
        private _porcentaje: number,
        private _listaSubactividadesCurso: SubactividadCurso[],
        private _listaAlumnosActividadCalificacion: AlumnoActividadCalificacion[]
    ) { }



    get id() { return this._id }
    get nombre() { return this._nombre }
    get porcentaje() { return this._porcentaje }
    get listaAlumnosActividadCalificacion() { return this._listaAlumnosActividadCalificacion }
    get listaSubactividadesCurso() { return this._listaSubactividadesCurso }

    public obtenerCalificacionAlumno(alumnoId: number): IReporteActividad {
        if (this.listaSubactividadesCurso.length === 0) {
            const alumnoCalificacion = this.listaAlumnosActividadCalificacion.find(a => a.alumnoId === alumnoId);
            return {
                id: alumnoCalificacion ? alumnoCalificacion.id : 0,
                alumnoId: alumnoId,
                idactividad: this.id,
                nombreAlumno: alumnoCalificacion ? alumnoCalificacion.nombreAlumno : "",
                calificacion: alumnoCalificacion ? alumnoCalificacion.calificacion : 0,
                subactividades: []
            };
        }

        let totalCalificacion = 0;
        let totalPorcentaje = 0;
        const subactividadesDetalle: ISubactividadDetalle[] = [];
        let nombreAlumno = "";

        this.listaSubactividadesCurso.forEach(subactividad => {
            const calificacionSub = subactividad.listaAlumnosSubactividadCalificacion.find(a => a.alumnoId === alumnoId);
            if (calificacionSub) {
                nombreAlumno = calificacionSub.nombreAlumno; // Capture name from any subactivity
                totalCalificacion += (calificacionSub.calificacion * subactividad.porcentaje) / 100;
                totalPorcentaje += subactividad.porcentaje;
            }

            subactividadesDetalle.push({
                idsubactividad: subactividad.id,
                nombre: subactividad.nombre,
                porcentaje: subactividad.porcentaje,
                calificacion: calificacionSub ? calificacionSub.calificacion : 0
            });
        });

        const calificacionFinal = totalPorcentaje > 0 ? (totalCalificacion / totalPorcentaje) * 100 : 0;

        return {
            id: 0, // Placeholder, will be updated in bulk method
            alumnoId: alumnoId,
            idactividad: this.id,
            nombreAlumno: nombreAlumno,
            calificacion: calificacionFinal,
            subactividades: subactividadesDetalle
        };
    }

    public obtenerCalificaciones() {
        // Collect all unique student IDs
        const alumnosIds = new Set<number>();

        if (this.listaSubactividadesCurso.length === 0) {
            this.listaAlumnosActividadCalificacion.forEach(a => alumnosIds.add(a.alumnoId));
        } else {
            this.listaSubactividadesCurso.forEach(sub => {
                sub.listaAlumnosSubactividadCalificacion.forEach(a => alumnosIds.add(a.alumnoId));
            });
        }

        const resultados: any[] = [];

        alumnosIds.forEach(alumnoId => {
            resultados.push(this.obtenerCalificacionAlumno(alumnoId));
        });

        // Update internal list
        resultados.forEach(r => {
            const alumnoCalificacion = this._listaAlumnosActividadCalificacion.find(a => a.alumnoId === r.alumnoId);
            if (alumnoCalificacion) {
                alumnoCalificacion.calificacion = r.calificacion;
                r.id = alumnoCalificacion.id;
            }
        });

        return resultados;
    }

    obtenerPromedio() {
        this.obtenerCalificaciones()
        const calificaciones = this.listaAlumnosActividadCalificacion.reduce((total, alumno) => total + alumno.calificacion, 0)
        return this.listaAlumnosActividadCalificacion.length > 0 ? calificaciones / this.listaAlumnosActividadCalificacion.length : 0;
    }

    public obtenerPromedioAlumno(alumnoId: number): number {
        if (this.listaSubactividadesCurso.length === 0) {
            const alumnoCalificacion = this.listaAlumnosActividadCalificacion.find(a => a.alumnoId === alumnoId);
            return alumnoCalificacion ? alumnoCalificacion.calificacion : 0;
        }

        let totalCalificacion = 0;
        let totalPorcentaje = 0;

        this.listaSubactividadesCurso.forEach(subactividad => {
            const calificacionSub = subactividad.listaAlumnosSubactividadCalificacion.find(a => a.alumnoId === alumnoId);
            if (calificacionSub) {
                totalCalificacion += (calificacionSub.calificacion * subactividad.porcentaje) / 100;
                totalPorcentaje += subactividad.porcentaje;
            }
        });

        return totalPorcentaje > 0 ? (totalCalificacion / totalPorcentaje) * 100 : 0;
    }

    public actualizarCalificaciones(alumnoId: number, detalle: IActividadDetalle): void {
        if (this.listaSubactividadesCurso.length > 0) {
            detalle.subactividades.forEach(subDetalle => {
                const subactividad = this.listaSubactividadesCurso.find(s => s.id === subDetalle.idsubactividad);
                if (subactividad) {
                    subactividad.actualizarCalificacion(alumnoId, subDetalle.calificacion);
                }
            });
        } else {
            const alumnoCalificacion = this.listaAlumnosActividadCalificacion.find(a => a.alumnoId === alumnoId);
            if (alumnoCalificacion) {
                alumnoCalificacion.calificacion = detalle.calificacion;
            }
        }
    }
}