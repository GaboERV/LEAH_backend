import { Controller, Post, Body, Get, Param, Delete, Patch, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateSesionesCase } from '../../../use-cases/asignaturaspace/Sesion/CreateSesionesCase';
import { GetSesionesUnidadCase } from '../../../use-cases/asignaturaspace/Sesion/GetSesionesUnidadCase';
import { UpdateSesionCase } from '../../../use-cases/asignaturaspace/Sesion/UpdateSesionCase';
import { DeleteSesionesCase } from '../../../use-cases/asignaturaspace/Sesion/DeleteSesionesCase';

import type { CreateSesionDto, UpdateSesionDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Sesion')
@Controller('sesiones')
export class SesionController {
    constructor(
        private readonly createSesionesCase: CreateSesionesCase,
        private readonly getSesionesUnidadCase: GetSesionesUnidadCase,
        private readonly updateSesionCase: UpdateSesionCase,
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
            throw new InternalServerErrorException(error.message);
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
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch()
    @ApiOperation({ summary: 'Actualizar Sesión' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                tema: { type: 'string' },
                objetivos: { type: 'string' },
                recursos: { type: 'string' },
                tipo: { type: 'string' },
                unidadId: { type: 'number' }
            },
            required: ['id', 'tema', 'objetivos', 'recursos', 'tipo', 'unidadId']
        }
    })
    @ApiResponse({ status: 200, description: 'El registro ha sido actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Sesión no encontrada.' })
    async updateSesion(@Body() dto: UpdateSesionDto) {
        try {
            return await this.updateSesionCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Sesión no encontrada') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
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
            throw new InternalServerErrorException(error.message);
        }
    }
}
