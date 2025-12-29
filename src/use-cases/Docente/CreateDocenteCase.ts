import { Docente } from "../../domain/Docente";
import { DocenteRepository } from "../../domain/repositories/Docente";
import { EncryptService } from "../../domain/services/EncryptService";

export class CreateDocenteCase {
    constructor(private docenteRepository: DocenteRepository, private encryptService: EncryptService) { }
    async execute(nombre: string, correo: string, contrasenia: string): Promise<void> {
        const contraseniaEncriptada = await this.encryptService.encrypt(contrasenia);
        const docente = new Docente(nombre, correo, contraseniaEncriptada, []);
        await this.docenteRepository.save(docente);
    }
}