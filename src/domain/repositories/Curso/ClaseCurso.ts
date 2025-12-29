import { ClaseCurso } from "../../Curso/ClaseCurso";

export abstract class ClaseCursoRepository {
    abstract get(cursoId: number,unidadId: number): Promise<ClaseCurso[]>;
    abstract save(unidadId: number,claseCurso:ClaseCurso): Promise<void>;
    abstract delete(claseId: number): Promise<void>;
    abstract asignarFechaASesion(claseId: number,sesionId: number): Promise<void>;
    abstract quitarFechaDeSesion(claseId: number): Promise<void>;
}