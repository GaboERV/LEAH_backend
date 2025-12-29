import { Actividad } from "../../Asignatura/Actividad";

export abstract class ActividadRepository {
    abstract get(id: number): Promise<Actividad | null>;
    abstract getByPonderacionId(ponderacionId: number): Promise<Actividad[]>;
    abstract save(poderacionId:number, actividad: Actividad, actividadId?: number): Promise<void>;
    abstract delete(id: number): Promise<void>;
}