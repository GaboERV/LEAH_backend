import { Controller, Get, Body, Param, Patch, Query, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { GetAlumnosPonderacionActividadesCase } from '../../../use-cases/cursospace/UnidadCurso/GetAlumnosPonderacionActividadesCase';
import { GetAsistenciasUnidadCase } from '../../../use-cases/cursospace/UnidadCurso/GetAsistenciasUnidadCase';
import { GetParticipacionesUnidadCase } from '../../../use-cases/cursospace/UnidadCurso/GetParticipacionesUnidadCase';
import { UpdateAsistenciasUnidadCase } from '../../../use-cases/cursospace/UnidadCurso/UpdateAsistenciasUnidadCase';
import { UpdateCalificacionesUnidadCase } from '../../../use-cases/cursospace/UnidadCurso/UpdateCalificacionesUnidadCase';
import { UpdateParticipacionesUnidadCase } from '../../../use-cases/cursospace/UnidadCurso/UpdateParticipacionesUnidadCase';

@ApiTags('UnidadCurso')
@Controller('unidades-curso')
export class UnidadCursoController {
    constructor(
        private readonly getAlumnosPonderacionActividadesCase: GetAlumnosPonderacionActividadesCase,
        private readonly getAsistenciasUnidadCase: GetAsistenciasUnidadCase,
        private readonly getParticipacionesUnidadCase: GetParticipacionesUnidadCase,
        private readonly updateAsistenciasUnidadCase: UpdateAsistenciasUnidadCase,
        private readonly updateCalificacionesUnidadCase: UpdateCalificacionesUnidadCase,
        private readonly updateParticipacionesUnidadCase: UpdateParticipacionesUnidadCase,
    ) { }

    @Get('ponderacion-actividades/:id')
    @ApiOperation({ summary: 'Obtener Calificaciones de Alumnos por Ponderación' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'cursoId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve las calificaciones de los alumnos para las actividades de la ponderación.' })
    async getAlumnosPonderacionActividades(@Param('id') id: string, @Query('cursoId') cursoId: string) {
        try {
            return await this.getAlumnosPonderacionActividadesCase.execute(+cursoId, +id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('asistencias/:id')
    @ApiOperation({ summary: 'Obtener Asistencias por Unidad' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'cursoId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve el reporte de asistencias de la unidad.' })
    async getAsistenciasUnidad(@Param('id') id: string, @Query('cursoId') cursoId: string) {
        try {
            return await this.getAsistenciasUnidadCase.execute(+cursoId, +id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('participaciones/:id')
    @ApiOperation({ summary: 'Obtener Participaciones por Unidad' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'cursoId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve las participaciones de los alumnos en la unidad.' })
    async getParticipacionesUnidad(@Param('id') id: string, @Query('cursoId') cursoId: string) {
        try {
            return await this.getParticipacionesUnidadCase.execute(+cursoId, +id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch('asistencias')
    @ApiOperation({ summary: 'Actualizar Asistencias de la Unidad' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                cursoId: { type: 'number' },
                unidadId: { type: 'number' },
                asistencias: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            alumnoId: { type: 'number' },
                            asistencia: { type: 'string' },
                            comentario: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Asistencias actualizadas exitosamente.' })
    async updateAsistencias(@Body() dto: any) {
        try {
            return await this.updateAsistenciasUnidadCase.execute(dto.cursoId, dto.unidadId, dto.asistencias);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch('calificaciones')
    @ApiOperation({ summary: 'Actualizar Calificaciones de la Unidad' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                cursoId: { type: 'number' },
                reporte: { type: 'object' } // IReporteUnidad structure
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Calificaciones actualizadas exitosamente.' })
    async updateCalificaciones(@Body() dto: any) {
        try {
            return await this.updateCalificacionesUnidadCase.execute(dto.cursoId, dto.reporte);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch('participaciones')
    @ApiOperation({ summary: 'Actualizar Participaciones de la Unidad' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                cursoId: { type: 'number' },
                unidadId: { type: 'number' },
                participaciones: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            alumnoId: { type: 'number' },
                            participaciones: { type: 'number' }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Participaciones actualizadas exitosamente.' })
    async updateParticipaciones(@Body() dto: any) {
        try {
            return await this.updateParticipacionesUnidadCase.execute(dto.cursoId, dto.unidadId, dto.participaciones);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
