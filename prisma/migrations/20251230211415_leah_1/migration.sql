-- CreateTable
CREATE TABLE `docente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `docente_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `calificacionMinimaAprobatoria` DOUBLE NOT NULL,
    `porcentajeAsistenciaMinima` INTEGER NOT NULL,
    `docenteId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `asignatura_docenteId_idx`(`docenteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `docenteId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `grupo_docenteId_idx`(`docenteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupoId` INTEGER NOT NULL,
    `asignaturaId` INTEGER NOT NULL,
    `periodoEscolar` VARCHAR(50) NULL,
    `anio` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `curso_grupoId_idx`(`grupoId`),
    INDEX `curso_asignaturaId_idx`(`asignaturaId`),
    UNIQUE INDEX `curso_grupoId_asignaturaId_periodoEscolar_key`(`grupoId`, `asignaturaId`, `periodoEscolar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `publicado` BOOLEAN NOT NULL DEFAULT false,
    `asignaturaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `unidad_asignaturaId_idx`(`asignaturaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ponderacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `porcentaje` INTEGER NOT NULL,
    `unidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `ponderacion_unidadId_idx`(`unidadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actividad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `porcentaje` INTEGER NOT NULL,
    `ponderacionId` INTEGER NOT NULL,
    `sesionId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `actividad_ponderacionId_idx`(`ponderacionId`),
    INDEX `actividad_sesionId_idx`(`sesionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subactividad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `porcentaje` INTEGER NOT NULL,
    `actividadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `subactividad_actividadId_idx`(`actividadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estudiante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `grupoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `estudiante_matricula_key`(`matricula`),
    INDEX `estudiante_grupoId_idx`(`grupoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estudianteId` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,
    `comentarios` VARCHAR(191) NULL,
    `subactividadId` INTEGER NULL,
    `actividadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `calificacion_estudianteId_idx`(`estudianteId`),
    INDEX `calificacion_subactividadId_idx`(`subactividadId`),
    INDEX `calificacion_actividadId_idx`(`actividadId`),
    UNIQUE INDEX `calificacion_actividadId_estudianteId_subactividadId_key`(`actividadId`, `estudianteId`, `subactividadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidadId` INTEGER NOT NULL,
    `tema` TEXT NOT NULL,
    `tipo` ENUM('clase', 'evaluacion', 'inhabil') NOT NULL,
    `objetivo` TEXT NOT NULL,
    `entregas` TEXT NOT NULL,
    `recursos` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `sesion_unidadId_idx`(`unidadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fecha_clase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sesionId` INTEGER NULL,
    `grupoId` INTEGER NOT NULL,
    `fecha` DATE NOT NULL,
    `unidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `fecha_clase_grupoId_idx`(`grupoId`),
    INDEX `fecha_clase_unidadId_idx`(`unidadId`),
    INDEX `fecha_clase_fecha_idx`(`fecha`),
    UNIQUE INDEX `fecha_clase_sesionId_grupoId_key`(`sesionId`, `grupoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asistencia_participacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estudianteId` INTEGER NOT NULL,
    `fechaClaseId` INTEGER NOT NULL,
    `asistencia` ENUM('Asistio', 'Retardo', 'Ausente', 'Justificado') NOT NULL DEFAULT 'Asistio',
    `comentarios` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `asistencia_participacion_fechaClaseId_idx`(`fechaClaseId`),
    INDEX `asistencia_participacion_estudianteId_idx`(`estudianteId`),
    UNIQUE INDEX `asistencia_participacion_estudianteId_fechaClaseId_key`(`estudianteId`, `fechaClaseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estudianteId` INTEGER NOT NULL,
    `unidadId` INTEGER NOT NULL,
    `numeroParticipaciones` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `participacion_unidadId_idx`(`unidadId`),
    INDEX `participacion_estudianteId_idx`(`estudianteId`),
    UNIQUE INDEX `participacion_estudianteId_unidadId_key`(`estudianteId`, `unidadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asignatura` ADD CONSTRAINT `asignatura_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupo` ADD CONSTRAINT `grupo_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curso` ADD CONSTRAINT `curso_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `grupo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curso` ADD CONSTRAINT `curso_asignaturaId_fkey` FOREIGN KEY (`asignaturaId`) REFERENCES `asignatura`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unidad` ADD CONSTRAINT `unidad_asignaturaId_fkey` FOREIGN KEY (`asignaturaId`) REFERENCES `asignatura`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ponderacion` ADD CONSTRAINT `ponderacion_unidadId_fkey` FOREIGN KEY (`unidadId`) REFERENCES `unidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actividad` ADD CONSTRAINT `actividad_ponderacionId_fkey` FOREIGN KEY (`ponderacionId`) REFERENCES `ponderacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actividad` ADD CONSTRAINT `actividad_sesionId_fkey` FOREIGN KEY (`sesionId`) REFERENCES `sesion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subactividad` ADD CONSTRAINT `subactividad_actividadId_fkey` FOREIGN KEY (`actividadId`) REFERENCES `actividad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estudiante` ADD CONSTRAINT `estudiante_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `grupo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calificacion` ADD CONSTRAINT `calificacion_estudianteId_fkey` FOREIGN KEY (`estudianteId`) REFERENCES `estudiante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calificacion` ADD CONSTRAINT `calificacion_subactividadId_fkey` FOREIGN KEY (`subactividadId`) REFERENCES `subactividad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calificacion` ADD CONSTRAINT `calificacion_actividadId_fkey` FOREIGN KEY (`actividadId`) REFERENCES `actividad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesion` ADD CONSTRAINT `sesion_unidadId_fkey` FOREIGN KEY (`unidadId`) REFERENCES `unidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fecha_clase` ADD CONSTRAINT `fecha_clase_sesionId_fkey` FOREIGN KEY (`sesionId`) REFERENCES `sesion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fecha_clase` ADD CONSTRAINT `fecha_clase_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `grupo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fecha_clase` ADD CONSTRAINT `fecha_clase_unidadId_fkey` FOREIGN KEY (`unidadId`) REFERENCES `unidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia_participacion` ADD CONSTRAINT `asistencia_participacion_estudianteId_fkey` FOREIGN KEY (`estudianteId`) REFERENCES `estudiante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia_participacion` ADD CONSTRAINT `asistencia_participacion_fechaClaseId_fkey` FOREIGN KEY (`fechaClaseId`) REFERENCES `fecha_clase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participacion` ADD CONSTRAINT `participacion_estudianteId_fkey` FOREIGN KEY (`estudianteId`) REFERENCES `estudiante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participacion` ADD CONSTRAINT `participacion_unidadId_fkey` FOREIGN KEY (`unidadId`) REFERENCES `unidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
