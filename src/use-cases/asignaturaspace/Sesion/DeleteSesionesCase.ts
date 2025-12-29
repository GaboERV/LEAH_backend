import { SesionesRepository } from "../../../domain/repositories/Asignatura/Sesiones";

export class DeleteSesionesCase {
    constructor(
        private sesionRepository: SesionesRepository
    ) { }
    async execute(id: number): Promise<void> {
        await this.sesionRepository.delete(id);
    }
}