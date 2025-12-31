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
import { DeleteUnidadCase } from './use-cases/asignaturaspace/Unidad/DeleteUnidadCase';

// Use Cases - Subactividad
import { UpdateSubactividadesCase } from './use-cases/asignaturaspace/Subactividad/UpdateSubactividadesCase';

// Use Cases - Sesion
import { CreateSesionesCase } from './use-cases/asignaturaspace/Sesion/CreateSesionesCase';
import { GetSesionesUnidadCase } from './use-cases/asignaturaspace/Sesion/GetSesionesUnidadCase';
import { DeleteSesionesCase } from './use-cases/asignaturaspace/Sesion/DeleteSesionesCase';


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
    SesionController
  ],
  providers: [
    { provide: AsignaturaRepository, useClass: AsignaturaPrismaRepository },
    { provide: ActividadRepository, useClass: ActividadPrismaRepository },
    { provide: PonderacionRepository, useClass: PonderacionPrismaRepository },
    { provide: UnidadRepository, useClass: UnidadPrismaRepository },
    { provide: SesionesRepository, useClass: SesionPrismaRepository },

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
    DeleteUnidadCase,

    UpdateSubactividadesCase,

    CreateSesionesCase,
    GetSesionesUnidadCase,
    DeleteSesionesCase
  ],
})
export class AppModule { }