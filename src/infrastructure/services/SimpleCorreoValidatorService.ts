import { Injectable } from '@nestjs/common';
import { CorreoValidatorService } from '../../domain/services/CorreoValidatorService';

@Injectable()
export class SimpleCorreoValidatorService implements CorreoValidatorService {
    validarCorreo(correo: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(correo);
    }
}
