import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Environment } from '../config/env.validation.js';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

@Injectable()
export class AvatarStorageService {
  private readonly directory: string;

  constructor(config: ConfigService<Environment, true>) {
    this.directory = config.get('AVATAR_STORAGE_DIR', { infer: true });
  }

  async save(file: { buffer: Buffer; mimetype: string; size: number }) {
    const extension = MIME_EXTENSIONS[file.mimetype];
    if (!extension) {
      throw new BadRequestException('Format accepté : JPEG, PNG ou WebP');
    }
    if (!file.buffer.length || file.size > MAX_AVATAR_SIZE) {
      throw new BadRequestException("L'avatar ne doit pas dépasser 5 Mo");
    }
    if (!this.matchesSignature(file.buffer, file.mimetype)) {
      throw new BadRequestException('Le contenu du fichier image est invalide');
    }

    await mkdir(this.directory, { recursive: true });
    const key = `${randomUUID()}${extension}`;
    await writeFile(join(this.directory, key), file.buffer, { flag: 'wx' });
    return key;
  }

  async read(key: string): Promise<{ data: Buffer; contentType: string }> {
    const extension = extname(key).toLowerCase();
    if (key !== key.split(/[\\/]/).pop()) {
      throw new NotFoundException('Avatar introuvable');
    }
    const contentType = Object.entries(MIME_EXTENSIONS).find(
      ([, value]) => value === extension,
    )?.[0];
    if (!contentType) throw new NotFoundException('Avatar introuvable');
    try {
      return { data: await readFile(join(this.directory, key)), contentType };
    } catch {
      throw new NotFoundException('Avatar introuvable');
    }
  }

  async remove(key: string | null): Promise<void> {
    if (!key || key !== key.split(/[\\/]/).pop()) return;
    await unlink(join(this.directory, key)).catch(() => undefined);
  }

  private matchesSignature(buffer: Buffer, mimetype: string): boolean {
    if (mimetype === 'image/jpeg') {
      return (
        buffer.length >= 3 &&
        buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
      );
    }
    if (mimetype === 'image/png') {
      return (
        buffer.length >= 8 &&
        buffer
          .subarray(0, 8)
          .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      );
    }
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
}
