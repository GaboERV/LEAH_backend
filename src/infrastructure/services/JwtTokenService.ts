import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/services/TokenService';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService implements TokenService {
    private readonly secret: string;

    constructor(private configService: ConfigService) {
        this.secret = this.configService.get<string>('JWT_SECRET') || 'default_secret';
    }

    generarToken(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: '1d' });
    }

    verificarToken(token: string): boolean {
        try {
            jwt.verify(token, this.secret);
            return true;
        } catch (error) {
            return false;
        }
    }
}
