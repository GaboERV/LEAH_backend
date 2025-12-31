import { UnidadCurso } from "../../Curso/UnidadCurso";

export abstract class UnidadCursoRepository {
    abstract get(cursoId: number, unidadId: number): Promise<UnidadCurso | null>;
    abstract getByCursoId(cursoId: number): Promise<UnidadCurso[]>;
    abstract save(cursoId: number, unidadCurso: UnidadCurso): Promise<void>;
}