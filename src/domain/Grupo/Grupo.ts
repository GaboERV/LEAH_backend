import { Estudiante } from "./Estudiante";

export class Grupo {
    constructor(
        public nombre: string,
        private _listaEstudiantes: Estudiante[],
        private _id?: number
    ) { }

    get id(){ return this._id }
    get listaEstudiantes(){ return this._listaEstudiantes }
}