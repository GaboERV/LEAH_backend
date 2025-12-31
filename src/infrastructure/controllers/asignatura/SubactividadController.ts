import { Controller, Body, Patch, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { UpdateSubactividadesCase } from '../../../use-cases/asignaturaspace/Subactividad/UpdateSubactividadesCase';

import type { UpdateSubactividadesDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Subactividad')
@Controller('subactividades')
export class SubactividadController {
    constructor(
        private readonly updateSubactividadesCase: UpdateSubactividadesCase,
    ) { }

    @Patch('bulk')
    @ApiOperation({ summary: 'Actualizar Subactividades (Bulk)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                actividadId: { type: 'number' },
                ponderacionId: { type: 'number' },
                subactividades: {
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
            required: ['actividadId', 'ponderacionId', 'subactividades']
        }
    })
    @ApiResponse({ status: 200, description: 'Los registros han sido actualizados exitosamente.' })
    async updateSubactividades(@Body() dto: UpdateSubactividadesDto) {
        try {
            return await this.updateSubactividadesCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Actividad no encontrada') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
