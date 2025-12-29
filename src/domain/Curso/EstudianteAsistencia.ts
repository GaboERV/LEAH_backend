import { asistencia } from "./enumasistencia"

export class EstudianteAsistencia {
    constructor(
        private _id: number,
        private _alumnoId: number,
        private _nombre: string,
        private _matricula: string,
        public asistio: asistencia,
        public comentarios?: string
    ) { }
    get id() { return this._id }
    get nombre() { return this._nombre }
    get matricula() { return this._matricula }
    get alumnoId() { return this._alumnoId }
}