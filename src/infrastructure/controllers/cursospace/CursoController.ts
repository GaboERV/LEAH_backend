import { Controller, Post, Body, Get, Param, Delete, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateCursoCase } from '../../../use-cases/cursospace/Curso/CreateCursoCase';
import { GetCursosDocenteCase } from '../../../use-cases/cursospace/Curso/GetCursosDocenteCase';
import { GetCursoCase } from '../../../use-cases/cursospace/Curso/GetCursoCase';
import { DeleteCursoCase } from '../../../use-cases/cursospace/Curso/DeleteCursoCase';

import type { CreateCursoDto } from '../../../domain/dtos/CreationDtos';

@ApiTags('Curso')
@Controller('cursos')
export class CursoController {
    constructor(
        private readonly createCursoCase: CreateCursoCase,
        private readonly getCursosDocenteCase: GetCursosDocenteCase,
        private readonly getCursoCase: GetCursoCase,
        private readonly deleteCursoCase: DeleteCursoCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear Curso' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                asignaturaId: { type: 'number' },
                grupoId: { type: 'number' }
            },
            required: ['asignaturaId', 'grupoId']
        }
    })
    @ApiResponse({ status: 201, description: 'El registro ha sido creado exitosamente.' })
    async createCurso(@Body() dto: CreateCursoDto) {
        try {
            return await this.createCursoCase.execute(dto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('docente/:id')
    @ApiOperation({ summary: 'Obtener Cursos por ID de Docente' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve todos los cursos del docente.' })
    async getCursosDocente(@Param('id') id: string) {
        try {
            return await this.getCursosDocenteCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener Curso por ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Devuelve el curso.' })
    @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
    async getCurso(@Param('id') id: string) {
        try {
            const curso = await this.getCursoCase.execute(+id);
            if (!curso) {
                throw new NotFoundException(`Curso con ID ${id} no encontrado`);
            }
            return curso;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar Curso' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'El registro ha sido eliminado exitosamente.' })
    async deleteCurso(@Param('id') id: string) {
        try {
            return await this.deleteCursoCase.execute(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
