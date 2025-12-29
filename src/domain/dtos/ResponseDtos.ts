export interface CursoDto {
    id: number;
    nombre: string;
    activo: boolean;
    asignaturaId: number;
    grupoId: number;
}

export interface UnidadDto {
    id: number;
    nombre: string;
    publicado: boolean;
}

export interface ClaseCursoDto {
    id: number;
    nombre: string;
    fecha: Date;
    sesionId?: number;
}

export interface PonderacionDto {
    id: number;
    nombre: string;
    porcentaje: number;
}

export interface SesionDto {
    id: number;
    tema: string;
    objetivos: string;
    recursos: string;
    tipo: string;
}

export interface AsignaturaDto {
    id: number;
    nombre: string;
    calificacionMinimaAprobacion: number;
    porcentajeAsistenciaMinima: number;
}

export interface SubactividadDto {
    id: number;
    nombre: string;
    porcentaje: number;
}

export interface ActividadDto {
    id: number;
    nombre: string;
    descripcion: string;
    porcentaje: number;
    subactividades: SubactividadDto[];
}

export interface GrupoDto {
    id: number;
    nombre: string;
    cantidadEstudiantes: number;
    promedio?: number;
    porcentajeAsistencia?: number;
}

export interface EstudianteDto {
    id: number;
    nombre: string;
    matricula: string;
    promedio?: number;
    porcentajeAsistencia?: number;
}

export interface AsignaturaConCursosDto extends AsignaturaDto {
    cursos: CursoDto[];
}

export interface SesionConFechaDto {
    id: number;
    tema: string;
    objetivos: string;
    recursos: string;
    tipo: string;
    fecha: Date | null;
}
