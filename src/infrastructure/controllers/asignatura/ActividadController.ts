import { Controller, Get, Param, Patch, NotFoundException, InternalServerErrorException, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { GetActividadesPonderacionCase } from '../../../use-cases/asignaturaspace/Actividad/GetActividadesPonderacionCase';
import { UpdateActividadesCase } from '../../../use-cases/asignaturaspace/Actividad/UpdateActividadesCase';

import type { UpdateActividadesDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Actividad')
@Controller('actividades')
export class ActividadController {
    constructor(
        private readonly getActividadesPonderacionCase: GetActividadesPonderacionCase,
        private readonly updateActividadesCase: UpdateActividadesCase,
    ) { }

    @Get('ponderacion/:id')
    @ApiOperation({ summary: 'Obtener Actividades por ID de Ponderación' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todas las actividades de la ponderación.' })
    async getActividadesPonderacion(@Param('id') id: string) {
        try {
            return await this.getActividadesPonderacionCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las actividades de la ponderación');
        }
    }

    @Patch('bulk')
    @ApiOperation({ summary: 'Actualizar Actividades (Bulk)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                ponderacionId: { type: 'number' },
                unidadId: { type: 'number' },
                actividades: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            nombre: { type: 'string' },
                            descripcion: { type: 'string' },
                            porcentaje: { type: 'number' }
                        }
                    }
                }
            },
            required: ['ponderacionId', 'unidadId', 'actividades']
        }
    })
    @ApiResponse({ status: 200, description: 'Los registros han sido actualizados exitosamente.' })
    async updateActividades(@Body() dto: UpdateActividadesDto) {
        try {
            return await this.updateActividadesCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Ponderacion no encontrada') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException('Error al actualizar las actividades');
        }
    }
}
