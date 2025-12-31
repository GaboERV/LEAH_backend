import { PrismaModule } from './infrastructure/prisma/Prisma.module';
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';

// Controllers
import { AsignaturaController } from './infrastructure/controllers/asignatura/AsignaturaController';
import { ActividadController } from './infrastructure/controllers/asignatura/ActividadController';
import { PonderacionController } from './infrastructure/controllers/asignatura/PonderacionController';
import { UnidadController } from './infrastructure/controllers/asignatura/UnidadController';
import { SubactividadController } from './infrastructure/controllers/asignatura/SubactividadController';
import { SesionController } from './infrastructure/controllers/asignatura/SesionController';
import { GrupoController } from './infrastructure/controllers/grupospace/GrupoController';
import { EstudianteController } from './infrastructure/controllers/grupospace/EstudianteController';
import { CursoController } from './infrastructure/controllers/cursospace/CursoController';
import { UnidadCursoController } from './infrastructure/controllers/cursospace/UnidadCursoController';
import { ClaseController } from './infrastructure/controllers/cursospace/ClaseController';

// Repositories
import { AsignaturaPrismaRepository } from './infrastructure/repositories/Asignatura/AsignaturaPrisma';
import { AsignaturaRepository } from './domain/repositories/Asignatura/Asignatura';
import { ActividadPrismaRepository } from './infrastructure/repositories/Asignatura/ActividadPrisma';
import { ActividadRepository } from './domain/repositories/Asignatura/Actividad';
import { PonderacionPrismaRepository } from './infrastructure/repositories/Asignatura/PonderacionPrisma';
import { PonderacionRepository } from './domain/repositories/Asignatura/Ponderacion';
import { UnidadPrismaRepository } from './infrastructure/repositories/Asignatura/UnidadPrisma';
import { UnidadRepository } from './domain/repositories/Asignatura/Unidad';
import { SesionPrismaRepository } from './infrastructure/repositories/Asignatura/SesionPrisma';
import { SesionesRepository } from './domain/repositories/Asignatura/Sesiones';
import { GrupoPrismaRepository } from './infrastructure/repositories/Grupo/GrupoPrisma';
import { GrupoRepository } from './domain/repositories/Grupos/Grupo';
import { EstudiantePrismaRepository } from './infrastructure/repositories/Grupo/EstudiantePrisma';
import { EstudianteRepository } from './domain/repositories/Grupos/Estudiante';
import { DocentePrismaRepository } from './infrastructure/repositories/DocentePrisma';
import { DocenteRepository } from './domain/repositories/Docente';
import { CursoPrismaRepository } from './infrastructure/repositories/Curso/CursoPrisma';
import { CursoRepository } from './domain/repositories/Curso/Curso';
import { UnidadCursoPrismaRepository } from './infrastructure/repositories/Curso/UnidadCursoPrisma';
import { UnidadCursoRepository } from './domain/repositories/Curso/UnidadCurso';
import { ClaseCursoPrismaRepository } from './infrastructure/repositories/Curso/ClaseCursoPrisma';
import { ClaseCursoRepository } from './domain/repositories/Curso/ClaseCurso';

// Use Cases - Asignatura
import { CreateAsignaturaCase } from './use-cases/asignaturaspace/Asignatura/CreateAsignaturaCase';
import { GetAsignaturasDocenteCase } from './use-cases/asignaturaspace/Asignatura/GetAsignaturasDocenteCase';
import { GetAsignaturaCase } from './use-cases/asignaturaspace/Asignatura/GetAsignaturaCase';
import { UpdateAsignaturaCase } from './use-cases/asignaturaspace/Asignatura/UpdateAsignaturaCase';
import { DeleteAsignaturaCase } from './use-cases/asignaturaspace/Asignatura/DeleteAsignaturaCase';

// Use Cases - Actividad
import { GetActividadesPonderacionCase } from './use-cases/asignaturaspace/Actividad/GetActividadesPonderacionCase';
import { UpdateActividadesCase } from './use-cases/asignaturaspace/Actividad/UpdateActividadesCase';

// Use Cases - Ponderacion
import { GetPonderacionesUnidadCase } from './use-cases/asignaturaspace/Ponderacion/GetPonderacionesUnidadCase';
import { UpdatePonderacionCase } from './use-cases/asignaturaspace/Ponderacion/UpdatePonderacionCase';

// Use Cases - Unidad
import { CreateUnidadCase } from './use-cases/asignaturaspace/Unidad/CreateUnidadCase';
import { GetUnidadesCursoCase } from './use-cases/asignaturaspace/Unidad/GetUnidadesCursoCase';
import { UpdateUnidadCase } from './use-cases/asignaturaspace/Unidad/UpdateUnidadCase';
import { DeleteUnidadCase } from './use-cases/asignaturaspace/Unidad/DeleteUnidadCase';

// Use Cases - Subactividad
import { UpdateSubactividadesCase } from './use-cases/asignaturaspace/Subactividad/UpdateSubactividadesCase';

// Use Cases - Sesion
import { CreateSesionesCase } from './use-cases/asignaturaspace/Sesion/CreateSesionesCase';
import { GetSesionesUnidadCase } from './use-cases/asignaturaspace/Sesion/GetSesionesUnidadCase';
import { UpdateSesionCase } from './use-cases/asignaturaspace/Sesion/UpdateSesionCase';
import { DeleteSesionesCase } from './use-cases/asignaturaspace/Sesion/DeleteSesionesCase';

// Use Cases - Grupo
import { CreateGrupoCase } from './use-cases/grupospace/Grupo/CreateGrupoCase';
import { GetGruposCase } from './use-cases/grupospace/Grupo/GetGruposCase';
import { GetGrupoCase } from './use-cases/grupospace/Grupo/GetGrupoCase';
import { UpdateGrupoCase } from './use-cases/grupospace/Grupo/UpdateGrupoCase';
import { DeleteGrupoCase } from './use-cases/grupospace/Grupo/DeleteGrupoCase';

// Use Cases - Estudiante
import { CreateEstudianteCase } from './use-cases/grupospace/Estudiante/CreateEstudianteCase';
import { GetEstudiantesByGrupoIdCase } from './use-cases/grupospace/Estudiante/GetEstudiantesByGrupoIdCase';
import { UpdateEstudianteCase } from './use-cases/grupospace/Estudiante/UpdateEstudianteCase';

// Use Cases - Curso
import { CreateCursoCase } from './use-cases/cursospace/Curso/CreateCursoCase';
import { GetCursoCase } from './use-cases/cursospace/Curso/GetCursoCase';
import { DeleteCursoCase } from './use-cases/cursospace/Curso/DeleteCursoCase';
import { GetCursosDocenteCase } from './use-cases/cursospace/Curso/GetCursosDocenteCase';

// Use Cases - UnidadCurso
import { GetAlumnosPonderacionActividadesCase } from './use-cases/cursospace/UnidadCurso/GetAlumnosPonderacionActividadesCase';
import { GetAsistenciasUnidadCase } from './use-cases/cursospace/UnidadCurso/GetAsistenciasUnidadCase';
import { GetParticipacionesUnidadCase } from './use-cases/cursospace/UnidadCurso/GetParticipacionesUnidadCase';
import { UpdateAsistenciasUnidadCase } from './use-cases/cursospace/UnidadCurso/UpdateAsistenciasUnidadCase';
import { UpdateCalificacionesUnidadCase } from './use-cases/cursospace/UnidadCurso/UpdateCalificacionesUnidadCase';
import { UpdateParticipacionesUnidadCase } from './use-cases/cursospace/UnidadCurso/UpdateParticipacionesUnidadCase';

// Use Cases - Clase/Sesiones
import { AddFechaClaseCase } from './use-cases/cursospace/ClaseSesisones/AddFechaClaseCase';
import { AsignarSesionAFechaCase } from './use-cases/cursospace/ClaseSesisones/AsignarSesionAFechaCase';
import { DeleteFechaClaseCase } from './use-cases/cursospace/ClaseSesisones/DeleteFechaClaseCase';
import { DesasignarFechaSesionCase } from './use-cases/cursospace/ClaseSesisones/DesasignarFechaSesionCase';
import { GetFechasUnidadCase } from './use-cases/cursospace/ClaseSesisones/GetFechasUnidadCase';
import { GetSesionesCursosCase } from './use-cases/cursospace/ClaseSesisones/GetSesionesCursos';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // <--- Esto ya carga el servicio
  ],
  controllers: [
    AsignaturaController,
    ActividadController,
    PonderacionController,
    UnidadController,
    SubactividadController,
    SesionController,
    GrupoController,
    EstudianteController,
    CursoController,
    UnidadCursoController,
    ClaseController
  ],
  providers: [
    { provide: AsignaturaRepository, useClass: AsignaturaPrismaRepository },
    { provide: ActividadRepository, useClass: ActividadPrismaRepository },
    { provide: PonderacionRepository, useClass: PonderacionPrismaRepository },
    { provide: UnidadRepository, useClass: UnidadPrismaRepository },
    { provide: SesionesRepository, useClass: SesionPrismaRepository },
    { provide: GrupoRepository, useClass: GrupoPrismaRepository },
    { provide: EstudianteRepository, useClass: EstudiantePrismaRepository },
    { provide: DocenteRepository, useClass: DocentePrismaRepository },
    { provide: CursoRepository, useClass: CursoPrismaRepository },
    { provide: UnidadCursoRepository, useClass: UnidadCursoPrismaRepository },
    { provide: ClaseCursoRepository, useClass: ClaseCursoPrismaRepository },

    CreateAsignaturaCase,
    GetAsignaturasDocenteCase,
    GetAsignaturaCase,
    UpdateAsignaturaCase,
    DeleteAsignaturaCase,

    GetActividadesPonderacionCase,
    UpdateActividadesCase,

    GetPonderacionesUnidadCase,
    UpdatePonderacionCase,

    CreateUnidadCase,
    GetUnidadesCursoCase,
    UpdateUnidadCase,
    DeleteUnidadCase,

    UpdateSubactividadesCase,

    CreateSesionesCase,
    GetSesionesUnidadCase,
    UpdateSesionCase,
    DeleteSesionesCase,

    CreateGrupoCase,
    GetGruposCase,
    GetGrupoCase,
    UpdateGrupoCase,
    DeleteGrupoCase,

    CreateEstudianteCase,
    GetEstudiantesByGrupoIdCase,
    UpdateEstudianteCase,

    CreateCursoCase,
    GetCursoCase,
    DeleteCursoCase,
    GetCursosDocenteCase,

    GetAlumnosPonderacionActividadesCase,
    GetAsistenciasUnidadCase,
    GetParticipacionesUnidadCase,
    UpdateAsistenciasUnidadCase,
    UpdateCalificacionesUnidadCase,
    UpdateParticipacionesUnidadCase,

    AddFechaClaseCase,
    AsignarSesionAFechaCase,
    DeleteFechaClaseCase,
    DesasignarFechaSesionCase,
    GetFechasUnidadCase,
    GetSesionesCursosCase
  ],
})
export class AppModule { }