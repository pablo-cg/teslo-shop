import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export function fileNamer(
  request: Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) {
  const fileType = file.mimetype.split('/')[1];

  const newFileName = `${uuid()}.${fileType}`;

  return callback(null, newFileName);
}
