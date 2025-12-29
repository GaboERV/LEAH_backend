import { Sesion } from "../../Asignatura/Sesion";

export abstract class SesionesRepository{
    abstract get(id:number):Promise<Sesion | null>;
    abstract getByUnidadId(unidadId:number):Promise<Sesion[]>;
    abstract save(unidadId:number,sesion:Sesion,sesionId?:number):Promise<void>;
    abstract delete(id:number):Promise<void>;
    
}