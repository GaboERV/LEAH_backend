import { Grupo } from "../../Grupo/Grupo";

export abstract class GrupoRepository {
    abstract getAll(): Promise<Grupo[]>;
    abstract getByDocenteId(docenteId: number): Promise<Grupo[]>;
    abstract get(id: number): Promise<Grupo | null>;
    abstract save(grupo: Grupo): Promise<void>;
    abstract delete(id: number): Promise<void>;
}