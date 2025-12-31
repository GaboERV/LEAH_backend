import { Controller, Post, Body, Get, Param, Delete, Patch, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { CreateGrupoCase } from '../../../use-cases/grupospace/Grupo/CreateGrupoCase';
import { GetGruposCase } from '../../../use-cases/grupospace/Grupo/GetGruposCase';
import { GetGrupoCase } from '../../../use-cases/grupospace/Grupo/GetGrupoCase';
import { UpdateGrupoCase } from '../../../use-cases/grupospace/Grupo/UpdateGrupoCase';
import { DeleteGrupoCase } from '../../../use-cases/grupospace/Grupo/DeleteGrupoCase';

import type { CreateGrupoDto, UpdateGrupoDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Grupo')
@Controller('grupos')
export class GrupoController {
    constructor(
        private readonly createGrupoCase: CreateGrupoCase,
        private readonly getGruposCase: GetGruposCase,
        private readonly getGrupoCase: GetGrupoCase,
        private readonly updateGrupoCase: UpdateGrupoCase,
        private readonly deleteGrupoCase: DeleteGrupoCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear Grupo' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                docenteId: { type: 'number' },
                asignaturaId: { type: 'number' },
                numeroGrupo: { type: 'number' }
            },
            required: ['nombre', 'docenteId', 'asignaturaId', 'numeroGrupo']
        }
    })
    @ApiResponse({ status: 201, description: 'El registro ha sido creado exitosamente.' })
    async createGrupo(@Body() dto: CreateGrupoDto) {
        try {
            return await this.createGrupoCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('docente/:id')
    @ApiOperation({ summary: 'Obtener Grupos por ID de Docente' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todos los grupos del docente.' })
    async getGruposDocente(@Param('id') id: string) {
        try {
            return await this.getGruposCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener Grupo por ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'docenteId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve el grupo.' })
    @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
    async getGrupo(@Param('id') id: string, @Query('docenteId') docenteId: string) {
        try {
            const grupo = await this.getGrupoCase.execute(+id, +docenteId);
            if (!grupo) {
                throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
            }
            return grupo;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch()
    @ApiOperation({ summary: 'Actualizar Grupo' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                nombre: { type: 'string' },
                docenteId: { type: 'number' },
                asignaturaId: { type: 'number' },
                numeroGrupo: { type: 'number' }
            },
            required: ['id', 'nombre', 'docenteId', 'asignaturaId', 'numeroGrupo']
        }
    })
    @ApiResponse({ status: 200, description: 'El registro ha sido actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
    async updateGrupo(@Body() dto: UpdateGrupoDto) {
        try {
            return await this.updateGrupoCase.execute(dto);
        } catch (error) {
            if (error instanceof Error && error.message === 'Grupo no encontrado') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar Grupo' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'El registro ha sido eliminado exitosamente.' })
    async deleteGrupo(@Param('id') id: string) {
        try {
            return await this.deleteGrupoCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
