export interface ISubactividadDetalle {
    idsubactividad: number;
    nombre: string;
    porcentaje: number;
    calificacion: number;
}

export interface IActividadDetalle {
    idActividad: number;
    nombre: string;
    porcentaje: number;
    calificacion: number;
    subactividades: ISubactividadDetalle[];
}

export interface IPonderacionDetalle {
    idPonderacion: number;
    nombre: string;
    porcentaje: number;
    calificacion: number;
    actividades: IActividadDetalle[];
}

export interface IUnidadDetalle {
    idUnidad: number;
    nombre: string;
    calificacion: number;
    ponderaciones: IPonderacionDetalle[];
}

export interface IReporteActividad {
    id: number;
    alumnoId: number;
    idactividad: number;
    nombreAlumno: string;
    calificacion: number;
    subactividades: ISubactividadDetalle[];
}

export interface IReportePonderacion {
    id: number;
    alumnoId: number;
    idPonderacion: number;
    nombreAlumno: string;
    calificacion: number;
    actividades: IActividadDetalle[];
}

export interface IReporteUnidad {
    alumnoId: number;
    idUnidad: number;
    nombreAlumno: string;
    calificacion: number;
    ponderaciones: IPonderacionDetalle[];
}

export interface IReporteCurso {
    alumnoId: number;
    idCurso: number;
    nombreAlumno: string;
    calificacion: number;
    unidades: IUnidadDetalle[];
}

export interface IAsistenciaAlumno {
    alumnoId: number;
    nombreAlumno: string;
    porcentaje: number;
}
export interface IAsistenciaDetalle {
    alumnoId: number;
    nombreAlumno: string;
    comentario: string;
    asistio: string;
}

export interface IAsistenciaClase {
    id: number;
    fecha: Date;
    asistencia: IAsistenciaDetalle[];
}

export interface IParticipacionDetalle {
    id: number;
    alumnoId: number;
    numeroParticipacion: number;
}


