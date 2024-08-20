import type { NextApiRequest } from 'next';
import formidable from 'formidable';
import { getApiId } from '../../services/helpers';
import { LANGUAGES } from '../../config.mjs';
import exifr from 'exifr';
import { File } from './types';

export const parseHttpRequest = async (req: NextApiRequest) => {
  const form = formidable({ uploadDir: '/tmp' });
  const [fields, files] = await form.parse(req);
  const { filepath, size, mtime } = files.file[0];
  if (size > 100 * 1024 * 1024) {
    throw new Error('File larger than 100MB');
  }

  const name = fields.filename[0];
  const apiId = getApiId(fields.osmShortId[0]);
  const lang = fields.lang[0];
  if (!LANGUAGES[lang]) {
    throw new Error('Invalid language');
  }

  const exif = await exifr.parse(filepath);
  const location =
    exif?.latitude && exif?.longitude ? [exif.longitude, exif.latitude] : null;
  const date = exif?.DateTimeOriginal
    ? new Date(exif.DateTimeOriginal)
    : new Date(mtime);

  const file = { filepath, name, location, date } as File;
  return { file, apiId, lang };
};
