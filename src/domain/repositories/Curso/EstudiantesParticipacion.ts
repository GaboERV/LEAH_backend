import { EstudianteParticipacion } from "../../Curso/EstudianteParticipacion";


export abstract class EstudianteParticipacionRepository{
    abstract get(id:number):Promise<EstudianteParticipacion | null>;
    abstract getByUnidadId(unidadId:number):Promise<EstudianteParticipacion[]>;
    abstract save(estudianteParticipacion:EstudianteParticipacion):Promise<void>;
    abstract saveMany(estudianteParticipacion:EstudianteParticipacion[]):Promise<void>;
    abstract delete(id:number):Promise<void>;
}