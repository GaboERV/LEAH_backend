export interface CreateCursoDto {
    nombre: string;
    asignaturaId: number;
    grupoId: number;
}

export interface CreateUnidadDto {
    nombre: string;
    asignaturaId: number;
}

export interface RegistrarClaseDto {
    nombre: string;
    fecha: Date;
    sesionId: number;
    unidadId: number;
}

export interface CrearPonderacionDto {
    nombre: string;
    porcentaje: number;
    unidadId: number;
}

export interface RegistrarParticipacionDto {
    alumnoId: number;
    unidadId: number;
    numeroParticipacion: number;
}

export interface CreateSesionDto {
    tema: string;
    objetivos: string;
    recursos: string;
    tipo: string; // Using string to avoid importing enum, or should I import? I'll use string or any for now to avoid import issues if enum path is complex, but ideally enum.
    // Actually, let's try to be precise. `tipoClase` is in `domain/Asignatura/tipoclase.enum`.
    // I'll use `any` or `string` for DTO simplicity or try to import.
    // Let's use `string` as DTOs usually use primitives.
    unidadId: number;
}

export interface CreateAsignaturaDto {
    nombre: string;
    calificacionMinimaAprobacion: number;
    porcentajeAsistenciaMinima: number;
    docenteId: number;
}

export interface UpdateAsignaturaDto {
    id: number;
    nombre: string;
    calificacionMinimaAprobacion: number;
    porcentajeAsistenciaMinima: number;
    docenteId: number;
}

export interface UpdatePonderacionDto {
    unidadId: number;
    asignaturaId: number;
    ponderaciones: {
        id?: number;
        nombre: string;
        porcentaje: number;
    }[];
}

export interface UpdateActividadesDto {
    ponderacionId: number;
    unidadId: number;
    actividades: {
        id?: number;
        nombre: string;
        descripcion: string;
        porcentaje: number;
    }[];
}

export interface UpdateSubactividadesDto {
    actividadId: number;
    ponderacionId: number;
    subactividades: {
        id?: number;
        nombre: string;
        porcentaje: number;
    }[];
}

export interface CreateGrupoDto {
    nombre: string;
    docenteId: number;
    asignaturaId: number;
    numeroGrupo: number;
}

export interface UpdateGrupoDto {
    id: number;
    nombre: string;
    docenteId: number;
    asignaturaId: number;
    numeroGrupo: number;
}

export interface CreateEstudianteDto {
    nombre: string;
    matricula: string;
    grupoId: number;
}

export interface UpdateEstudianteDto {
    id: number;
    nombre: string;
    matricula: string;
}

export interface AddFechaClaseDto {
    unidadId: number;
    sesionId?: number;
    fecha: Date;
}

export interface AsignarSesionDto {
    claseId: number;
    sesionId: number;
}
