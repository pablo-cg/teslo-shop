import { Request } from 'express';

const validTypes = ['jpg', 'jpeg', 'png', 'gif'];

export function fileFilter(
  request: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) {
  if (!file) {
    return callback(new Error('File is Empty'), false);
  }

  const fileType = file.mimetype.split('/')[1];

  if (validTypes.includes(fileType)) {
    return callback(null, true);
  }

  callback(null, false);
}
