export class Estudiante {
    constructor(
        public nombre: string,
        public matricula: string,
        private _id?: number
    ) { }

    get id(): number | undefined { return this._id }
}   