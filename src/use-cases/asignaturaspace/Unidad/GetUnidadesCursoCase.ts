import { UnidadRepository } from "../../../domain/repositories/Asignatura/Unidad";
import { UnidadDto } from "../../../domain/dtos/ResponseDtos";

export class GetUnidadesCursoCase {
    constructor(private unidadRepository: UnidadRepository) { }

    async execute(cursoId: number): Promise<UnidadDto[]> {
        const unidades = await this.unidadRepository.getByCursoId(cursoId);
        return unidades.map(u => ({
            id: u.id || 0,
            nombre: u.nombre,
            publicado: u.publicado,
            ponderaciones: u.listaPonderaciones.map(p => ({
                id: p.id || 0,
                nombre: p.nombre,
                porcentaje: p.porcentaje
            }))
        }));
    }
}
