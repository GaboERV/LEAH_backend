import { Grupo } from "../Grupo/Grupo";

export abstract class GrupoRepository {
    abstract get(id: number): Promise<Grupo | null>;
    abstract getDocenteId(docenteId:number): Promise<Grupo[]> | null;
    abstract save(grupo: Grupo): Promise<void>;
    abstract delete(id: number): Promise<void>;
}