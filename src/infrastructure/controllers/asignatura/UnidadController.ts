import { Controller, Post, Body, Get, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateUnidadCase } from '../../../use-cases/asignaturaspace/Unidad/CreateUnidadCase';
import { GetUnidadesCursoCase } from '../../../use-cases/asignaturaspace/Unidad/GetUnidadesCursoCase';
import { DeleteUnidadCase } from '../../../use-cases/asignaturaspace/Unidad/DeleteUnidadCase';

import type { CreateUnidadDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Unidad')
@Controller('unidades')
export class UnidadController {
    constructor(
        private readonly createUnidadCase: CreateUnidadCase,
        private readonly getUnidadesCursoCase: GetUnidadesCursoCase,
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
