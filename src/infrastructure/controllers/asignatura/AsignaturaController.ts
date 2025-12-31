import { Controller, Post, Body, Get, Param, Put, Delete, Patch, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateAsignaturaCase } from '../../../use-cases/asignaturaspace/Asignatura/CreateAsignaturaCase';
import { GetAsignaturasDocenteCase } from '../../../use-cases/asignaturaspace/Asignatura/GetAsignaturasDocenteCase';
import { GetAsignaturaCase } from '../../../use-cases/asignaturaspace/Asignatura/GetAsignaturaCase';
import { UpdateAsignaturaCase } from '../../../use-cases/asignaturaspace/Asignatura/UpdateAsignaturaCase';
import { DeleteAsignaturaCase } from '../../../use-cases/asignaturaspace/Asignatura/DeleteAsignaturaCase';

import type { CreateAsignaturaDto, UpdateAsignaturaDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Asignatura')
@Controller('asignaturas')
export class AsignaturaController {
    constructor(
        private readonly createAsignaturaCase: CreateAsignaturaCase,
        private readonly getAsignaturasDocenteCase: GetAsignaturasDocenteCase,
        private readonly getAsignaturaCase: GetAsignaturaCase,
        private readonly updateAsignaturaCase: UpdateAsignaturaCase,
        private readonly deleteAsignaturaCase: DeleteAsignaturaCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear Asignatura' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                calificacionMinimaAprobacion: { type: 'number' },
                porcentajeAsistenciaMinima: { type: 'number' },
                docenteId: { type: 'number' }
            },
            required: ['nombre', 'calificacionMinimaAprobacion', 'porcentajeAsistenciaMinima', 'docenteId']
        }
    })
    @ApiResponse({ status: 201, description: 'El registro ha sido creado exitosamente.' })
    @ApiResponse({ status: 403, description: 'Prohibido.' })
    async createAsignatura(@Body() dto: CreateAsignaturaDto) {
        try {
            return await this.createAsignaturaCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('docente/:id')
    @ApiOperation({ summary: 'Obtener Asignaturas por ID de Docente' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todas las asignaturas del docente.' })
    async getAsignaturasDocente(@Param('id') id: string) {
        try {
            return await this.getAsignaturasDocenteCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener Asignatura por ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve la asignatura.' })
    @ApiResponse({ status: 404, description: 'Asignatura no encontrada.' })
    async getAsignatura(@Param('id') id: string) {
        try {
            const asignatura = await this.getAsignaturaCase.execute(+id);
            if (!asignatura) {
                throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
            }
            return asignatura;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch()
    @ApiOperation({ summary: 'Actualizar Asignatura' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                nombre: { type: 'string' },
                calificacionMinimaAprobacion: { type: 'number' },
                porcentajeAsistenciaMinima: { type: 'number' },
                docenteId: { type: 'number' }
            },
            required: ['id', 'nombre', 'calificacionMinimaAprobacion', 'porcentajeAsistenciaMinima', 'docenteId']
        }
    })
    @ApiResponse({ status: 200, description: 'El registro ha sido actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Asignatura no encontrada.' })
    async updateAsignatura(@Body() dto: UpdateAsignaturaDto) {
        try {
            return await this.updateAsignaturaCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Asignatura no encontrada') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar Asignatura' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'El registro ha sido eliminado exitosamente.' })
    async deleteAsignatura(@Param('id') id: string) {
        try {
            return await this.deleteAsignaturaCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}