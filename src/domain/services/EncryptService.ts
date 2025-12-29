export abstract class EncryptService {
    abstract encrypt(data: string): Promise<string>;
    abstract compare(data: string, encrypted: string): Promise<boolean>;
}