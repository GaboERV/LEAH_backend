import { Controller, Post, Body, Get, Param, Patch, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { CreateEstudianteCase } from '../../../use-cases/grupospace/Estudiante/CreateEstudianteCase';
import { GetEstudiantesByGrupoIdCase } from '../../../use-cases/grupospace/Estudiante/GetEstudiantesByGrupoIdCase';
import { UpdateEstudianteCase } from '../../../use-cases/grupospace/Estudiante/UpdateEstudianteCase';

import type { CreateEstudianteDto, UpdateEstudianteDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Estudiante')
@Controller('estudiantes')
export class EstudianteController {
    constructor(
        private readonly createEstudianteCase: CreateEstudianteCase,
        private readonly getEstudiantesByGrupoIdCase: GetEstudiantesByGrupoIdCase,
        private readonly updateEstudianteCase: UpdateEstudianteCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear Estudiante' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                matricula: { type: 'string' },
                grupoId: { type: 'number' }
            },
            required: ['nombre', 'matricula', 'grupoId']
        }
    })
    @ApiResponse({ status: 201, description: 'El registro ha sido creado exitosamente.' })
    async createEstudiante(@Body() dto: CreateEstudianteDto) {
        try {
            return await this.createEstudianteCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('grupo/:id')
    @ApiOperation({ summary: 'Obtener Estudiantes por ID de Grupo' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'docenteId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve todos los estudiantes del grupo.' })
    async getEstudiantesByGrupoId(@Param('id') id: string, @Query('docenteId') docenteId: string) {
        try {
            return await this.getEstudiantesByGrupoIdCase.execute(+id, +docenteId);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch()
    @ApiOperation({ summary: 'Actualizar Estudiante' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                nombre: { type: 'string' },
                matricula: { type: 'string' }
            },
            required: ['id', 'nombre', 'matricula']
        }
    })
    @ApiResponse({ status: 200, description: 'El registro ha sido actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
    async updateEstudiante(@Body() dto: UpdateEstudianteDto) {
        try {
            return await this.updateEstudianteCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Estudiante no encontrado') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
