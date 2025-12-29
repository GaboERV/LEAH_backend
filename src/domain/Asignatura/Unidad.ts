import { Ponderacion } from "./Ponderacion"
import { Sesion } from "./Sesion"

export class Unidad {
    private _publico: boolean
    constructor(
        public nombre: string,
        private _listaSesiones: Sesion[],
        private _listaPonderaciones: Ponderacion[],
        private _id?: number
    ) {
        this._publico = false
    }
    get id() { return this._id }
    get publicado() { return this._publico }
    get listaSesiones() { return this._listaSesiones }
    get listaPonderaciones() { return this._listaPonderaciones }

    set publico(publico: boolean) { this._publico = publico }

    public modificarPonderacion(ponderaciones: Ponderacion[]) {
        const suma = ponderaciones.reduce((acc, p) => acc + p.porcentaje, 0);
        if (Math.abs(suma - 100) > 1e-6) throw new Error("La cantidad de porcentaje no es exacta");
        this._listaPonderaciones = ponderaciones;
    }
}