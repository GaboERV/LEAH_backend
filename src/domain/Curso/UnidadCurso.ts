import { ClaseCurso } from "./ClaseCurso";
import { EstudianteParticipacion } from "./EstudianteParticipacion";
import { PonderacionCurso } from "./PonderacionCurso";
import { IReporteUnidad, IPonderacionDetalle, IAsistenciaAlumno, IAsistenciaClase, IParticipacionDetalle } from "./Interfaces";

export class UnidadCurso {
    constructor(
        private _id: number,
        public nombre: string,
        private _listaPonderacionesCurso: PonderacionCurso[],
        private _listaClaseCurso: ClaseCurso[],
        private _listaEstudianteParticipacion: EstudianteParticipacion[],
        private _cursoId: number
    ) { }
    get id() { return this._id }
    get cursoId() { return this._cursoId }
    get listaPonderacionesCurso() { return this._listaPonderacionesCurso }
    get listaClaseCurso() { return this._listaClaseCurso }
    get listaEstudianteParticipacion() { return this._listaEstudianteParticipacion }
    public obtenerCalificacionAlumno(alumnoId: number): IReporteUnidad {
        if (this.listaPonderacionesCurso.length === 0) {
            throw new Error("No se encontraron ponderaciones para la unidad");
        }

        let totalCalificacion = 0;
        let totalPorcentaje = 0;
        const ponderacionesDetalle: IPonderacionDetalle[] = [];
        let nombreAlumno = "";

        this.listaPonderacionesCurso.forEach(ponderacion => {
            const calificacionPonderacion = ponderacion.obtenerCalificacionAlumno(alumnoId);

            if (calificacionPonderacion.nombreAlumno) {
                nombreAlumno = calificacionPonderacion.nombreAlumno;
            }

            totalCalificacion += (calificacionPonderacion.calificacion * ponderacion.porcentaje) / 100;
            totalPorcentaje += ponderacion.porcentaje;

            ponderacionesDetalle.push({
                idPonderacion: ponderacion.id,
                nombre: ponderacion.nombre,
                porcentaje: ponderacion.porcentaje,
                calificacion: calificacionPonderacion.calificacion,
                actividades: calificacionPonderacion.actividades
            });
        });

        const calificacionFinal = totalPorcentaje > 0 ? (totalCalificacion / totalPorcentaje) * 100 : 0;

        return {
            alumnoId: alumnoId,
            idUnidad: this.id,
            nombreAlumno: nombreAlumno,
            calificacion: calificacionFinal,
            ponderaciones: ponderacionesDetalle
        };
    }

    public obtenerCalificaciones(): IReporteUnidad[] {
        if (this.listaPonderacionesCurso.length === 0) {
            return [];
        }

        // Collect all unique student IDs
        const alumnosIds = new Set<number>();
        this.listaPonderacionesCurso.forEach(ponderacion => {
            const calificaciones = ponderacion.obtenerCalificaciones();
            calificaciones.forEach((c) => alumnosIds.add(c.alumnoId));
        });

        const resultados: IReporteUnidad[] = [];
        alumnosIds.forEach(alumnoId => {
            resultados.push(this.obtenerCalificacionAlumno(alumnoId));
        });

        return resultados;
    }
    public obtenerPromedio() {
        const promedios = this.listaPonderacionesCurso.map(p => {
            return {
                porcentaje: p.porcentaje,
                promedio: p.obtenerPromedio()
            }
        })
        const promedioFinal = promedios.reduce((total, promedio) => total + (promedio.promedio * promedio.porcentaje) / 100, 0)
        return promedioFinal
    }

    public obtenerPromedioAlumno(alumnoId: number): number {
        if (this.listaPonderacionesCurso.length === 0) {
            return 0;
        }

        let totalCalificacion = 0;
        let totalPorcentaje = 0;

        this.listaPonderacionesCurso.forEach(ponderacion => {
            const calificacionPonderacion = ponderacion.obtenerPromedioAlumno(alumnoId);
            totalCalificacion += (calificacionPonderacion * ponderacion.porcentaje) / 100;
            totalPorcentaje += ponderacion.porcentaje;
        });

        return totalPorcentaje > 0 ? (totalCalificacion / totalPorcentaje) * 100 : 0;
    }

    public obtenerPorecentajeAsistencia(): number {
        const asistencias = this.listaClaseCurso.map(c => {
            return {
                asistencia: c.listaAsistencia,
                fecha: c.fecha
            }
        })
        if (asistencias.length === 0) return 0;
        const asistenciaFinal = asistencias.reduce((total, item) =>
            total + (item.asistencia.length > 0 ? item.asistencia.reduce((subTotal, reg) =>
                subTotal + (reg.asistio === "ausente" ? 0 : 1), 0) / item.asistencia.length : 0), 0);
        return (asistenciaFinal / asistencias.length) * 100;
    }
    public obtenerListaPorcentajeAsistenciaAlumnos(): IAsistenciaAlumno[] {
        const alumnosMap = new Map<number, string>();
        this.listaClaseCurso.forEach(clase => {
            const asistencias = clase.listaAsistencia;
            asistencias.forEach((asistencia) => {
                if (!alumnosMap.has(asistencia.alumnoId)) {
                    alumnosMap.set(asistencia.alumnoId, asistencia.nombre);
                }
            });
        });
        const resultados: IAsistenciaAlumno[] = [];
        alumnosMap.forEach((nombre, alumnoId) => {
            resultados.push({
                alumnoId: alumnoId,
                nombreAlumno: nombre,
                porcentaje: this.obtenerPorecentajeAsistenciaAlumno(alumnoId)
            });
        });
        return resultados;
    }
    public obtenerPorecentajeAsistenciaAlumno(alumnoId: number): number {
        const asistencias = this.listaClaseCurso.map(c => {
            return {
                asistencia: c.listaAsistencia,
                fecha: c.fecha
            }
        })
        if (asistencias.length === 0) return 0;
        const asistenciaFinal = asistencias.reduce((total, item) =>
            total + (item.asistencia.length > 0 ? item.asistencia.reduce((subTotal, reg) =>
                subTotal + (reg.alumnoId === alumnoId ? (reg.asistio === "ausente" ? 0 : 1) : 0), 0) / item.asistencia.length : 0), 0);
        return (asistenciaFinal / asistencias.length) * 100;
    }

    public actualizarCalificaciones(reporte: IReporteUnidad): void {
        if (reporte.idUnidad !== this.id) {
            throw new Error("El reporte no corresponde a esta unidad");
        }

        reporte.ponderaciones.forEach(ponderacionDetalle => {
            const ponderacion = this.listaPonderacionesCurso.find(p => p.id === ponderacionDetalle.idPonderacion);
            if (ponderacion) {
                ponderacion.actualizarCalificaciones(reporte.alumnoId, ponderacionDetalle);
            }
        });
    }

    public obtenerListaAsistencias(): IAsistenciaClase[] {
        return this.listaClaseCurso.map(c => ({
            id: c.id ?? 0,
            fecha: c.fecha,
            asistencia: c.listaAsistencia.map(a => ({
                alumnoId: a.alumnoId,
                nombreAlumno: a.nombre,
                comentario: a.comentarios || "",
                asistio: a.asistio
            }))
        }));
    }

    public actualizarAsistencias(asistencias: IAsistenciaClase[]) {
        asistencias.forEach(asistenciaClase => {
            const clase = this.listaClaseCurso.find(c => c.id === asistenciaClase.id);
            if (clase) {
                clase.actualizarAsistencia(asistenciaClase.asistencia);
            }
        });
    }

    public obtenerListaParticipaciones(): IParticipacionDetalle[] {
        return this.listaEstudianteParticipacion.map(p => ({
            id: p.id,
            alumnoId: p.alumnoId,
            numeroParticipacion: p.numeroParticipacion
        }));
    }

    public actualizarParticipaciones(participaciones: IParticipacionDetalle[]) {
        participaciones.forEach(participacionDetalle => {
            const participacion = this.listaEstudianteParticipacion.find(p => p.id === participacionDetalle.id);
            if (participacion) {
                participacion.numeroParticipacion = participacionDetalle.numeroParticipacion;
            }
        });
    }
}