import { Docente } from "../Docente";

export abstract class DocenteRepository {
    abstract get(id: number): Promise<Docente | null>;
    abstract getByEmail(email: string): Promise<Docente | null>;
    abstract save(docente: Docente): Promise<void>;
}
