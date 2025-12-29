import { Actividad } from "./Actividad"

export class Ponderacion {
    constructor(
        public nombre: string,
        private _porcentaje: number,
        private _listaActividades: Actividad[],
        private _id?: number
    ) { }

    get porcentaje() { return this._porcentaje }
    get id() { return this._id }
    get listaActividades() { return this._listaActividades }

    set porcentaje(numero: number) {
        if (numero < 0 || numero > 100) {
            throw new Error("El porcentaje debe estar entre 0 y 100");
        }
        this._porcentaje = numero
    }

    public modificarActividades(actividades: Actividad[]) {
        const suma = actividades.reduce((acc, p) => acc + p.porcentaje, 0);
        if (Math.abs(suma - 100) > 1e-6) throw new Error("La cantidad de porcentaje no es exacta");
        this._listaActividades = actividades;
    }
}