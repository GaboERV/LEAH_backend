import { Asignatura } from "../../Asignatura/Asignatura";


export abstract class AsignaturaRepository {
    abstract get(id: number): Promise<Asignatura | null>;
    abstract getByDocenteId(docenteId: number): Promise<Asignatura[]>;
    abstract save(docenteId:number,asignatura: Asignatura, asignaturaId?: number): Promise<void>;
    abstract delete(id: number): Promise<void>;
}
