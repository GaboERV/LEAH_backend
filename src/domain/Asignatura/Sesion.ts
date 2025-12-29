import { tipoClase } from "./tipoclase.enum";

export class Sesion {
    constructor(
        public tema: string,
        public objetivos: string,
        public recursos: string,
        public tipo: tipoClase,
        public idActividades: number[],
        public idSubactividades: number[],
        public id?: number
    ) { }
}