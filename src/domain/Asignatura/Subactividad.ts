export class Subactividad {
    constructor(
        private _id: number,
        public nombre: string,
        private _porcentaje: number
    ) { }

    get id(): number { return this._id }
    get porcentaje(): number { return this._porcentaje }

    set porcentaje(numero: number) {
        if (numero < 0 || numero > 100) {
            throw new Error("El porcentaje debe estar entre 0 y 100");
        }
        this._porcentaje = numero
    }
}