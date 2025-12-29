export class EstudianteParticipacion{
    constructor(
        private _id: number,
        private _alumnoId: number,
        private _unidadId: number,
        private _numeroParticipacion: number,
    ) { }
    get id() { return this._id }
    get alumnoId() { return this._alumnoId }
    get unidadId() { return this._unidadId }
    get numeroParticipacion() { return this._numeroParticipacion }

    set numeroParticipacion(numeroParticipacion: number) { this._numeroParticipacion = numeroParticipacion }
}