import { Sesion } from "../Asignatura/Sesion";
import { EstudianteAsistencia } from "./EstudianteAsistencia";


export class ClaseCurso {
    constructor(
        public fecha: Date,
        private _listaAsistencia: EstudianteAsistencia[],
        private _session?: Sesion,
        private _id?: number

    ) { }

    get listaAsistencia() { return this._listaAsistencia }
    get session() { return this._session }

    get id() { return this._id }

    public actualizarAsistencia(asistencias: { alumnoId: number; asistio: string; comentario: string }[]) {
        asistencias.forEach(asistencia => {
            const estudianteAsistencia = this.listaAsistencia.find(a => a.alumnoId === asistencia.alumnoId);
            if (estudianteAsistencia) {
                // Assuming 'asistencia' enum is compatible with string or needs casting/mapping
                // If 'asistio' is string and enum is expected, we might need to cast or validate
                // For now assuming direct assignment or compatible types based on previous context
                estudianteAsistencia.asistio = asistencia.asistio as any;
                estudianteAsistencia.comentarios = asistencia.comentario;
            }
        });
    }
}