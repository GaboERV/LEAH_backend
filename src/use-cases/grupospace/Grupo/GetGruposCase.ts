import { GrupoRepository } from "../../../domain/repositories/Grupos/Grupo";
import { GrupoDto } from "../../../domain/dtos/ResponseDtos";
import { DocenteRepository } from "../../../domain/repositories/Docente";

export class GetGruposCase {
    constructor(private grupoRepository: GrupoRepository,
        private docenteRepository: DocenteRepository
    ) { }
    async execute(docenteId: number): Promise<GrupoDto[]> {
        const grupos = await this.grupoRepository.getByDocenteId(docenteId);
        const docente = await this.docenteRepository.get(docenteId);
        if (!docente) throw new Error("Docente no encontrado");

        const datosgrupoPromedios = docente.obtenerListaPromediosPorGrupo();
        const datosgrupoPorcentajeAsistencia = docente.obtenerListaPorcentajeGeneralAsistenciaPorGrupo();

        return grupos.map(g => ({
            id: g.id ?? 0,
            nombre: g.nombre,
            cantidadEstudiantes: g.listaEstudiantes.length,
            promedio: datosgrupoPromedios.find(d => d.id === g.id)?.promedio,
            porcentajeAsistencia: datosgrupoPorcentajeAsistencia.find(d => d.id === g.id)?.porcentaje
        }));
    }
}