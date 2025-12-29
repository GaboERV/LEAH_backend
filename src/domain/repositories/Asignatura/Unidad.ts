import { Unidad } from "../../Asignatura/Unidad";


export abstract class UnidadRepository {
    abstract get(id: number): Promise<Unidad | null>;
    abstract getByCursoId(cursoId: number): Promise<Unidad[]>;
    abstract save(asignaturaId: number, unidad: Unidad, unidadId?: number): Promise<void>;
    abstract delete(id: number): Promise<void>;
}