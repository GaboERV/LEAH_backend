import { UnidadCurso } from "../../Curso/UnidadCurso";

export abstract class UnidadCursoRepository {
    abstract get(id:number):Promise<UnidadCurso | null>;
    abstract getByCursoId(cursoId:number):Promise<UnidadCurso[]>;
    abstract save(cursoId:number, unidadCurso:UnidadCurso):Promise<void>;
    abstract delete(id:number):Promise<void>;
}