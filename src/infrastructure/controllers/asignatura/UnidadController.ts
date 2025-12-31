import { Controller, Post, Body, Get, Param, Delete, Patch, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateUnidadCase } from '../../../use-cases/asignaturaspace/Unidad/CreateUnidadCase';
import { GetUnidadesCursoCase } from '../../../use-cases/asignaturaspace/Unidad/GetUnidadesCursoCase';
import { UpdateUnidadCase } from '../../../use-cases/asignaturaspace/Unidad/UpdateUnidadCase';
import { DeleteUnidadCase } from '../../../use-cases/asignaturaspace/Unidad/DeleteUnidadCase';

import type { CreateUnidadDto, UpdateUnidadDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Unidad')
@Controller('unidades')
export class UnidadController {
    constructor(
        private readonly createUnidadCase: CreateUnidadCase,
        private readonly getUnidadesCursoCase: GetUnidadesCursoCase,
        private readonly updateUnidadCase: UpdateUnidadCase,
        private readonly deleteUnidadCase: DeleteUnidadCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear Unidad' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                asignaturaId: { type: 'number' }
            },
            required: ['nombre', 'asignaturaId']
        }
    })
    @ApiResponse({ status: 201, description: 'El registro ha sido creado exitosamente.' })
    async createUnidad(@Body() dto: CreateUnidadDto) {
        try {
            return await this.createUnidadCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la unidad');
        }
    }

    @Get('curso/:id')
    @ApiOperation({ summary: 'Obtener Unidades por ID de Curso' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todas las unidades del curso.' })
    async getUnidadesCurso(@Param('id') id: string) {
        try {
            return await this.getUnidadesCursoCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las unidades del curso');
        }
    }

    @Patch()
    @ApiOperation({ summary: 'Actualizar Unidad' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                nombre: { type: 'string' },
                asignaturaId: { type: 'number' }
            },
            required: ['id', 'nombre', 'asignaturaId']
        }
    })
    @ApiResponse({ status: 200, description: 'El registro ha sido actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Unidad no encontrada.' })
    async updateUnidad(@Body() dto: UpdateUnidadDto) {
        try {
            return await this.updateUnidadCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Unidad no encontrada') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException('Error al actualizar la unidad');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar Unidad' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'El registro ha sido eliminado exitosamente.' })
    async deleteUnidad(@Param('id') id: string) {
        try {
            return await this.deleteUnidadCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la unidad');
        }
    }
}
