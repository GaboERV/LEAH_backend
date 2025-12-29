import { ActividadCurso } from "./ActividadCurso"
import { IReportePonderacion, IActividadDetalle, IPonderacionDetalle } from "./Interfaces";

export class PonderacionCurso {
    constructor(
        private _id: number,
        public nombre: string,
        private _porcentaje: number,
        private _listaActividadescurso: ActividadCurso[]
    ) { }

    get id() { return this._id }
    get porcentaje() { return this._porcentaje }
    get listaActividadescurso() { return this._listaActividadescurso }


    public obtenerCalificacionAlumno(alumnoId: number): IReportePonderacion {
        if (this.listaActividadescurso.length === 0) {
            return {
                id: 0, // Placeholder
                alumnoId: alumnoId,
                idPonderacion: this.id,
                nombreAlumno: "",
                calificacion: 0,
                actividades: []
            };
        }

        let totalCalificacion = 0;
        let totalPorcentaje = 0;
        const actividadesDetalle: any[] = [];
        let nombreAlumno = "";

        this.listaActividadescurso.forEach(actividad => {
            const calificacionActividad = actividad.obtenerCalificacionAlumno(alumnoId);

            if (calificacionActividad.nombreAlumno) {
                nombreAlumno = calificacionActividad.nombreAlumno;
            }

            totalCalificacion += (calificacionActividad.calificacion * actividad.porcentaje) / 100;
            totalPorcentaje += actividad.porcentaje;

            actividadesDetalle.push({
                idActividad: actividad.id,
                nombre: actividad.nombre,
                porcentaje: actividad.porcentaje,
                calificacion: calificacionActividad.calificacion,
                subactividades: calificacionActividad.subactividades
            });
        });

        const calificacionFinal = totalPorcentaje > 0 ? (totalCalificacion / totalPorcentaje) * 100 : 0;

        return {
            id: 0,
            alumnoId: alumnoId,
            idPonderacion: this.id,
            nombreAlumno: nombreAlumno,
            calificacion: calificacionFinal,
            actividades: actividadesDetalle
        };
    }

    public obtenerCalificaciones() {
        if (this.listaActividadescurso.length === 0) {
            return [];
        }

        // Collect all unique student IDs from all activities
        const alumnosIds = new Set<number>();
        this.listaActividadescurso.forEach(actividad => {
            const calificaciones = actividad.obtenerCalificaciones();
            calificaciones.forEach((c: any) => alumnosIds.add(c.alumnoId));
        });

        const resultados: any[] = [];
        alumnosIds.forEach(alumnoId => {
            resultados.push(this.obtenerCalificacionAlumno(alumnoId));
        });

        return resultados;
    }

    public obtenerPromedio() {
        const promedios = this.listaActividadescurso.map(a => {
            return {
                porcentaje: a.porcentaje,
                promedio: a.obtenerPromedio()
            }
        })
        const promedioFinal = promedios.reduce((total, promedio) => total + (promedio.promedio * promedio.porcentaje) / 100, 0)
        return promedioFinal
    }

    public obtenerPromedioAlumno(alumnoId: number): number {
        if (this.listaActividadescurso.length === 0) {
            return 0;
        }

        let totalCalificacion = 0;
        let totalPorcentaje = 0;

        this.listaActividadescurso.forEach(actividad => {
            const calificacionActividad = actividad.obtenerPromedioAlumno(alumnoId);
            totalCalificacion += (calificacionActividad * actividad.porcentaje) / 100;
            totalPorcentaje += actividad.porcentaje;
        });

        return totalPorcentaje > 0 ? (totalCalificacion / totalPorcentaje) * 100 : 0;
    }

    public actualizarCalificaciones(alumnoId: number, detalle: IPonderacionDetalle): void {
        detalle.actividades.forEach(actividadDetalle => {
            const actividad = this.listaActividadescurso.find(a => a.id === actividadDetalle.idActividad);
            if (actividad) {
                actividad.actualizarCalificaciones(alumnoId, actividadDetalle);
            }
        });
    }
}