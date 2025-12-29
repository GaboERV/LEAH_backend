import { Unidad } from "./Unidad";

export class Asignatura {
    constructor(
        public nombre: string,
        private _calificacionMinimaAprobacion: number,
        private _porcentajeAsistenciaMinima: number,
        private _listaUnidades: Unidad[],
        private _id?: number,
    ) { }

    get id() { return this._id }
    get listaUnidades() { return this._listaUnidades }
    get calificacionMinimaAprobacion() { return this._calificacionMinimaAprobacion }
    get porcentajeAsistenciaMinima() { return this._porcentajeAsistenciaMinima }

    public agregarUnidad(nombre: string) {
        const nuevaUnidad = new Unidad(nombre, [], [])
        this._listaUnidades.push(nuevaUnidad)
    }


    public quitarUnidad(id: Number) {
        const indice = this._listaUnidades.findIndex((unidad) => {
            unidad.id === id
        })
        if (!indice) { throw new Error("Unidad no encontrada") }

        const nuevaListaUnidad: Unidad[] = []

        for (const unidad of this._listaUnidades) {
            if (unidad.id === indice) continue
            nuevaListaUnidad.push(unidad)
        }

        this._listaUnidades = nuevaListaUnidad
    }

    public update(nombre: string, calificacionMinima: number, porcentajeAsistencia: number) {
        this.nombre = nombre;
        this._calificacionMinimaAprobacion = calificacionMinima;
        this._porcentajeAsistenciaMinima = porcentajeAsistencia;
    }

}