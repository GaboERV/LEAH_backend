import { DocenteRepository } from "../../domain/repositories/Docente";
import { EncryptService } from "../../domain/services/EncryptService";
import { TokenService } from "../../domain/services/TokenService";

export class LoginCase {
    constructor(
        private docenteRepository: DocenteRepository,
        private encryptService: EncryptService,
        private tokenService: TokenService
    ) { }
    async execute(correo:string,contrasenia:string):Promise<{token:string,nombre:string,correo:string,id:number}> {
        const docente = await this.docenteRepository.getByEmail(correo);
        if (!docente || !docente.id) throw new Error("Docente no encontrado");
        
        if (!await this.encryptService.compare(contrasenia, docente.contrasenia)) throw new Error("Contrasenia incorrecta");
        const token = this.tokenService.generarToken({ id: docente.id });
        return {
           token: token,
           nombre: docente.nombre,
           correo: docente.correo,
           id: docente.id, 
        };
    }
}