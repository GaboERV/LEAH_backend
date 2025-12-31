import { Controller, Post, Body, Get, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateSesionesCase } from '../../../use-cases/asignaturaspace/Sesion/CreateSesionesCase';
import { GetSesionesUnidadCase } from '../../../use-cases/asignaturaspace/Sesion/GetSesionesUnidadCase';
import { DeleteSesionesCase } from '../../../use-cases/asignaturaspace/Sesion/DeleteSesionesCase';

import type { CreateSesionDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Sesion')
@Controller('sesiones')
export class SesionController {
    constructor(
        private readonly createSesionesCase: CreateSesionesCase,
        private readonly getSesionesUnidadCase: GetSesionesUnidadCase,
        private readonly deleteSesionesCase: DeleteSesionesCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear Sesión' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                tema: { type: 'string' },
                objetivos: { type: 'string' },
                recursos: { type: 'string' },
                tipo: { type: 'string' },
                unidadId: { type: 'number' }
            },
            required: ['tema', 'objetivos', 'recursos', 'tipo', 'unidadId']
        }
    })
    @ApiResponse({ status: 201, description: 'El registro ha sido creado exitosamente.' })
    async createSesion(@Body() dto: CreateSesionDto) {
        try {
            return await this.createSesionesCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la sesión');
        }
    }

    @Get('unidad/:id')
    @ApiOperation({ summary: 'Obtener Sesiones por ID de Unidad' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todas las sesiones de la unidad.' })
    async getSesionesUnidad(@Param('id') id: string) {
        try {
            return await this.getSesionesUnidadCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las sesiones de la unidad');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar Sesión' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'El registro ha sido eliminado exitosamente.' })
    async deleteSesion(@Param('id') id: string) {
        try {
            return await this.deleteSesionesCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la sesión');
        }
    }
}
