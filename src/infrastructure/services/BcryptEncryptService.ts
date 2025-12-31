import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EncryptService } from '../../domain/services/EncryptService';

@Injectable()
export class BcryptEncryptService implements EncryptService {
    private readonly saltRounds = 10;

    async encrypt(data: string): Promise<string> {
        return await bcrypt.hash(data, this.saltRounds);
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return await bcrypt.compare(data, encrypted);
    }
}
