import { DocenteRepository } from "../../domain/repositories/Docente";

export class GetDatosDashboard {
    constructor(
        private docenteRepository: DocenteRepository,
    ) { }
    async execute(id:number) {
        const docente = await this.docenteRepository.get(id);
        if (!docente) throw new Error("Docente no encontrado");

        const datosDashboard = {
            promedioGeneral: docente.obtenerPromedioGeneral(),
            porcentajeGeneralAsistencia: docente.obtenerPorcentajeGeneralAsistencia(),
            listaPromediosPorAsignatura: docente.obtenerListaPromediosPorAsignatura(),
            listaPromediosPorGrupo: docente.obtenerListaPromediosPorGrupo(),
            listaPorcentajeGeneralAsistenciaPorGrupo: docente.obtenerListaPorcentajeGeneralAsistenciaPorGrupo(),
        };
        return datosDashboard;
    }
}