import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getProductImagePath(filename: string) {
    const imagePath = join(
      __dirname,
      '../../static/uploads/products',
      filename,
    );

    if (!existsSync(imagePath))
      throw new NotFoundException(
        `No product image found with name ${filename}`,
      );

    return imagePath;
  }
}
