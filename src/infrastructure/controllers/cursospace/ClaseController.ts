import { Controller, Post, Body, Get, Param, Delete, Patch, Query, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { AddFechaClaseCase } from '../../../use-cases/cursospace/ClaseSesisones/AddFechaClaseCase';
import { AsignarSesionAFechaCase } from '../../../use-cases/cursospace/ClaseSesisones/AsignarSesionAFechaCase';
import { DeleteFechaClaseCase } from '../../../use-cases/cursospace/ClaseSesisones/DeleteFechaClaseCase';
import { DesasignarFechaSesionCase } from '../../../use-cases/cursospace/ClaseSesisones/DesasignarFechaSesionCase';
import { GetFechasUnidadCase } from '../../../use-cases/cursospace/ClaseSesisones/GetFechasUnidadCase';
import { GetSesionesCursosCase } from '../../../use-cases/cursospace/ClaseSesisones/GetSesionesCursos';

import type { AddFechaClaseDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Clase')
@Controller('clases')
export class ClaseController {
    constructor(
        private readonly addFechaClaseCase: AddFechaClaseCase,
        private readonly asignarSesionAFechaCase: AsignarSesionAFechaCase,
        private readonly deleteFechaClaseCase: DeleteFechaClaseCase,
        private readonly desasignarFechaSesionCase: DesasignarFechaSesionCase,
        private readonly getFechasUnidadCase: GetFechasUnidadCase,
        private readonly getSesionesCursosCase: GetSesionesCursosCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Agregar Fecha de Clase' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fecha: { type: 'string', format: 'date-time' },
                unidadId: { type: 'number' },
                grupoId: { type: 'number' },
                sesionId: { type: 'number' }
            },
            required: ['fecha', 'unidadId', 'grupoId']
        }
    })
    @ApiResponse({ status: 201, description: 'Fecha de clase agregada exitosamente.' })
    async addFechaClase(@Body() dto: AddFechaClaseDto) {
        try {
            return await this.addFechaClaseCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al agregar la fecha de clase');
        }
    }

    @Patch('asignar-sesion')
    @ApiOperation({ summary: 'Asignar Sesión a Fecha de Clase' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fechaClaseId: { type: 'number' },
                sesionId: { type: 'number' }
            },
            required: ['fechaClaseId', 'sesionId']
        }
    })
    @ApiResponse({ status: 200, description: 'Sesión asignada exitosamente.' })
    async asignarSesion(@Body() dto: any) {
        try {
            return await this.asignarSesionAFechaCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException('Error al asignar la sesión');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar Fecha de Clase' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Fecha de clase eliminada exitosamente.' })
    async deleteFechaClase(@Param('id') id: string) {
        try {
            return await this.deleteFechaClaseCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la fecha de clase');
        }
    }

    @Patch('desasignar-sesion')
    @ApiOperation({ summary: 'Desasignar Sesión de Fecha de Clase' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fechaClaseId: { type: 'number' }
            },
            required: ['fechaClaseId']
        }
    })
    @ApiResponse({ status: 200, description: 'Sesión desasignada exitosamente.' })
    async desasignarSesion(@Body() dto: any) {
        try {
            return await this.desasignarFechaSesionCase.execute(dto.fechaClaseId);
        } catch (error) {
            throw new InternalServerErrorException('Error al desasignar la sesión');
        }
    }

    @Get('unidad/:id')
    @ApiOperation({ summary: 'Obtener Fechas de Clase por Unidad' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'grupoId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve todas las fechas de clase de la unidad.' })
    async getFechasUnidad(@Param('id') id: string, @Query('grupoId') grupoId: string) {
        try {
            return await this.getFechasUnidadCase.execute(+grupoId, +id);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las fechas de clase');
        }
    }

    @Get('sesiones-disponibles/:id')
    @ApiOperation({ summary: 'Obtener Sesiones Disponibles para el Curso' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiQuery({ name: 'grupoId', type: 'number', required: true })
    @ApiResponse({ status: 200, description: 'Devuelve las sesiones disponibles para asignar.' })
    async getSesionesDisponibles(@Param('id') id: string, @Query('grupoId') grupoId: string) {
        try {
            return await this.getSesionesCursosCase.execute(+grupoId, +id);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las sesiones disponibles');
        }
    }
}
