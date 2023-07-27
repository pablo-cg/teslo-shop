import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:filename')
  findProductImage(
    @Res() response: Response,
    @Param('filename') filename: string,
  ) {
    const imagePath = this.filesService.getProductImagePath(filename);

    return response.sendFile(imagePath);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        'Make sure that the file uploaded is an image',
      );

    const HOST_API = this.configService.get('HOST_API');

    const secureUrl = `${HOST_API}/files/product/${file.filename}`;

    return { url: secureUrl };
  }
}
