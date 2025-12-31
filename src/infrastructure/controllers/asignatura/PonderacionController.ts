import { Controller, Get, Param, Patch, NotFoundException, InternalServerErrorException, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { GetPonderacionesUnidadCase } from '../../../use-cases/asignaturaspace/Ponderacion/GetPonderacionesUnidadCase';
import { UpdatePonderacionCase } from '../../../use-cases/asignaturaspace/Ponderacion/UpdatePonderacionCase';

import type { UpdatePonderacionDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Ponderacion')
@Controller('ponderaciones')
export class PonderacionController {
    constructor(
        private readonly getPonderacionesUnidadCase: GetPonderacionesUnidadCase,
        private readonly updatePonderacionCase: UpdatePonderacionCase,
    ) { }

    @Get('unidad/:id')
    @ApiOperation({ summary: 'Obtener Ponderaciones por ID de Unidad' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todas las ponderaciones de la unidad.' })
    async getPonderacionesUnidad(@Param('id') id: string) {
        try {
            return await this.getPonderacionesUnidadCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch('bulk')
    @ApiOperation({ summary: 'Actualizar Ponderaciones (Bulk)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                unidadId: { type: 'number' },
                asignaturaId: { type: 'number' },
                ponderaciones: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            nombre: { type: 'string' },
                            porcentaje: { type: 'number' }
                        }
                    }
                }
            },
            required: ['unidadId', 'asignaturaId', 'ponderaciones']
        }
    })
    @ApiResponse({ status: 200, description: 'Los registros han sido actualizados exitosamente.' })
    async updatePonderacion(@Body() dto: UpdatePonderacionDto) {
        try {
            return await this.updatePonderacionCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Unidad no encontrada') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
