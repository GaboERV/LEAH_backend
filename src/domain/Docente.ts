import { Curso } from "./Curso/Curso"

export class Docente {
    constructor(
        private _nombre: string,
        private _correo: string,
        private _constrasenia: string,
        private _listaCursos: Curso[],
        private _id?: number,
    ) { }

    get id() { return this._id }
    get nombre() { return this._nombre }
    get contrasenia() { return this._constrasenia }
    get listaCursos() { return this._listaCursos }
    get correo() { return this._correo }

    public obtenerPromedioPorAsignatura(asignaturaId: number) {
        const cursos = this.listaCursos.filter(c => c.idasignatura === asignaturaId)

        if (cursos.length === 0) throw new Error("No se encontro el curso")

        const promedios = cursos.map(c => c.obtenerPromedio())
        const promedioFinal = promedios.reduce((total, promedio) => total + promedio, 0)
        return promedioFinal / promedios.length
    }
    public obtenerPromedioPorGrupo(grupoId: number) {
        const cursos = this.listaCursos.filter(c => c.idgrupo === grupoId)
        if (cursos.length === 0) throw new Error("No se encontro el curso")
        const promedios = cursos.map(c => c.obtenerPromedio())
        const promedioFinal = promedios.reduce((total, promedio) => total + promedio, 0)
        return promedioFinal / promedios.length
    }

    public obtenerPromedioGeneral() {
        if (this.listaCursos.length === 0) {
            return 0;
        }
        const promedios = this.listaCursos.map(c => c.obtenerPromedio())
        const promedioFinal = promedios.reduce((total, promedio) => total + promedio, 0)
        return promedioFinal / this.listaCursos.length
    }
    public obtenerPorcentajeGeneralAsistencia(): number {
        if (this.listaCursos.length === 0) {
            return 0;
        }
        const porcentajesAsistencia = this.listaCursos.map(c => c.obtenerPorecentajeAsistencia());
        const porcentajeFinal = porcentajesAsistencia.reduce((total, porcentaje) => total + porcentaje, 0);
        return porcentajeFinal / this.listaCursos.length;
    }
    public obtenerPorcentajeGeneralAsistenciaGrupo(grupoId: number): number {
        const cursos = this.listaCursos.filter(c => c.idgrupo === grupoId);
        if (cursos.length === 0) {
            throw new Error("No se encontro el curso");
        }

        const porcentajesAsistencia = cursos.map(c => c.obtenerPorecentajeAsistencia());
        const porcentajeFinal = porcentajesAsistencia.reduce((total, porcentaje) => total + porcentaje, 0);
        return porcentajeFinal / cursos.length;
    }

    public obtenerListaPromediosPorAsignatura() {
        const promediosMap = new Map<number, { nombre: string, total: number, count: number }>();

        this.listaCursos.forEach(c => {
            if (!promediosMap.has(c.idasignatura)) {
                promediosMap.set(c.idasignatura, { nombre: c.nombre, total: 0, count: 0 });
            }
            const entry = promediosMap.get(c.idasignatura)!;
            entry.total += c.obtenerPromedio();
            entry.count++;
        });

        const listaPromediosPorAsignatura: { id: number, nombreAsignatura: string, promedio: number }[] = [];
        promediosMap.forEach((value, key) => {
            listaPromediosPorAsignatura.push({
                id: key,
                nombreAsignatura: value.nombre,
                promedio: value.total / value.count
            });
        });

        return listaPromediosPorAsignatura;
    }

    public obtenerListaPromediosPorGrupo() {
        const promediosMap = new Map<number, { nombre: string, total: number, count: number }>();

        this.listaCursos.forEach(c => {
            if (!promediosMap.has(c.idgrupo)) {
                promediosMap.set(c.idgrupo, { nombre: c.nombre, total: 0, count: 0 });
            }
            const entry = promediosMap.get(c.idgrupo)!;
            entry.total += c.obtenerPromedio();
            entry.count++;
        });

        const listaPromediosPorGrupo: { id: number, nombreGrupo: string, promedio: number }[] = [];
        promediosMap.forEach((value, key) => {
            listaPromediosPorGrupo.push({
                id: key,
                nombreGrupo: value.nombre,
                promedio: value.total / value.count
            });
        });

        return listaPromediosPorGrupo;
    }

    public obtenerListaPorcentajeGeneralAsistenciaPorGrupo() {
        const porcentajesMap = new Map<number, { nombre: string, total: number, count: number }>();

        this.listaCursos.forEach(c => {
            if (!porcentajesMap.has(c.idgrupo)) {
                porcentajesMap.set(c.idgrupo, { nombre: c.nombre, total: 0, count: 0 });
            }
            const entry = porcentajesMap.get(c.idgrupo)!;
            entry.total += c.obtenerPorecentajeAsistencia();
            entry.count++;
        });

        const listaPorcentajesPorGrupo: { id: number, nombreGrupo: string, porcentaje: number }[] = [];
        porcentajesMap.forEach((value, key) => {
            listaPorcentajesPorGrupo.push({
                id: key,
                nombreGrupo: value.nombre,
                porcentaje: value.total / value.count
            });
        });

        return listaPorcentajesPorGrupo;
    }


}