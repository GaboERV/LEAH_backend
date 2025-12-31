import { ClaseCurso } from "../../Curso/ClaseCurso";

export abstract class ClaseCursoRepository {
    abstract get(grupoId: number,unidadId: number): Promise<ClaseCurso[]>;
    abstract save(grupoId: number,unidadId: number,claseCurso:ClaseCurso): Promise<void>;
    abstract asignarFechaASesion(claseId: number,sesionId: number): Promise<void>;
    abstract quitarFechaDeSesion(claseId: number): Promise<void>;
    abstract delete(id: number): Promise<void>;
}