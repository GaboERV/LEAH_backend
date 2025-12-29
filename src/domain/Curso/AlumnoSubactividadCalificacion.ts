export class AlumnoSubactividadCalificacion {
    constructor(
        private _id: number,
        private _alumnoId: number,
        private _nombreAlumno: string,
        private _calificacion: number
    ) { }

    get id() { return this._id }
    get alumnoId() { return this._alumnoId }
    get nombreAlumno() { return this._nombreAlumno }
    get calificacion() { return this._calificacion }
    set calificacion(calificacion: number) { this._calificacion = calificacion }
}