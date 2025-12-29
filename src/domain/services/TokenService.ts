export abstract class TokenService {
    abstract generarToken(payload: object): string;
    abstract verificarToken(token: string): boolean ;
}