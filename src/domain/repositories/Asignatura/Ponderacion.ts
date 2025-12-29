import { Ponderacion } from "../../Asignatura/Ponderacion";

export abstract class PonderacionRepository{
    abstract get(id:number):Promise<Ponderacion | null>;
    abstract getByUnidadId(unidadId:number):Promise<Ponderacion[]>;
    abstract save(unidadId:number,ponderacion:Ponderacion,ponderacionId?:number):Promise<void>;
    abstract delete(id:number):Promise<void>;
}