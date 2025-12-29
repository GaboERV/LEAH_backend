import { Subactividad } from "./Subactividad"

export class Actividad {

    constructor(
        private _id: number,
        public nombre: string,
        public descripcion: string,
        private _porcentaje: number,
        private _listaSubactividades: Subactividad[]
    ) { }

    get id() { return this._id }
    get porcentaje() { return this._porcentaje }
    get listaSubactividades() { return this._listaSubactividades }

    set porcentaje(numero: number) {
        if (numero < 0 || numero > 100) {
            throw new Error("El porcentaje debe estar entre 0 y 100");
        }
        this._porcentaje = numero
    }

    public modificarSubactividades(subactividades: Subactividad[]) {
        const suma = subactividades.reduce((acc, p) => acc + p.porcentaje, 0);
        if (Math.abs(suma - 100) > 1e-6) throw new Error("La cantidad de porcentaje no es exacta");
        this._listaSubactividades = subactividades;
    }

}