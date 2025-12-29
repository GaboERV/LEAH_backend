import { Estudiante } from "../../Grupo/Estudiante";

export abstract class EstudianteRepository {
    abstract get(id: number): Promise<Estudiante | null>;
    abstract save(estudiante: Estudiante, grupoId?: number): Promise<void>;
    abstract delete(id: number): Promise<void>;
    abstract update(estudiante: Estudiante): Promise<void>;
}
