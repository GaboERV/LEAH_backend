import { Curso } from "../../Curso/Curso";

export abstract class CursoRepository {
    abstract get(id:number):Promise<Curso | null>;
    abstract getByDocenteId(docenteId:number):Promise<Curso[]>;
    abstract getByAsignaturaId(asignaturaId:number):Promise<Curso[]>;
    abstract create(asignaturaId:number,grupoId:number):Promise<void>;
    abstract update(curso:Curso):Promise<void>;
    abstract delete(id:number):Promise<void>;
}