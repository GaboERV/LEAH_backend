import { Controller, Post, Body, Get, Param, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { CreateDocenteCase } from '../../../use-cases/Docente/CreateDocenteCase';
import { LoginCase } from '../../../use-cases/Docente/LoginCase';
import { GetDatosDashboard } from '../../../use-cases/Docente/GetDatosDashboard';
import { CorreoValidatorService } from '../../../domain/services/CorreoValidatorService';

@ApiTags('Docente')
@Controller('docente')
export class DocenteController {
    constructor(
        private readonly createDocenteCase: CreateDocenteCase,
        private readonly loginCase: LoginCase,
        private readonly getDatosDashboard: GetDatosDashboard,
        private readonly correoValidatorService: CorreoValidatorService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo docente' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                correo: { type: 'string' },
                contrasenia: { type: 'string' }
            },
            required: ['nombre', 'correo', 'contrasenia']
        }
    })
    @ApiResponse({ status: 201, description: 'Docente creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o correo no válido.' })
    async create(@Body() body: { nombre: string, correo: string, contrasenia: string }) {
        if (!this.correoValidatorService.validarCorreo(body.correo)) {
            throw new BadRequestException('Correo electrónico no válido');
        }
        try {
            await this.createDocenteCase.execute(body.nombre, body.correo, body.contrasenia);
            return { message: 'Docente creado exitosamente' };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                correo: { type: 'string' },
                contrasenia: { type: 'string' }
            },
            required: ['correo', 'contrasenia']
        }
    })
    @ApiResponse({ status: 200, description: 'Login exitoso.' })
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
    async login(@Body() body: { correo: string, contrasenia: string }) {
        try {
            return await this.loginCase.execute(body.correo, body.contrasenia);
        } catch (error) {
            if (error instanceof Error && (error.message === 'Docente no encontrado' || error.message === 'Contrasenia incorrecta')) {
                throw new BadRequestException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('dashboard/:id')
    @ApiOperation({ summary: 'Obtener datos del dashboard del docente' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Datos del dashboard obtenidos exitosamente.' })
    @ApiResponse({ status: 404, description: 'Docente no encontrado.' })
    async getDashboard(@Param('id') id: string) {
        try {
            return await this.getDatosDashboard.execute(+id);
        } catch (error) {
            if (error instanceof Error && error.message === 'Docente no encontrado') {
                throw new NotFoundException(error.message);
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
