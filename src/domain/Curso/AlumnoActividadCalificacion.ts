export class AlumnoActividadCalificacion {
    constructor(
        private _id: number,
        private _alumnoId: number,
        private _nombreAlumno: string,
        public calificacion: number
    ) { }
    get id() { return this._id }
    get alumnoId() { return this._alumnoId }
    get nombreAlumno() { return this._nombreAlumno }
}