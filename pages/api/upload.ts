import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import Wikiapi from 'wikiapi';
import exifr from 'exifr';
import {
  serverFetchOsmUser,
  ServerOsmUser,
} from '../../src/services/osmApiAuthServer';
import { fetchFeatureWithCenter } from '../../src/services/osmApi';
import type { Feature } from '../../src/services/types';
import { getApiId } from '../../src/services/helpers';
import { setIntl } from '../../src/services/intl';
import getConfig from 'next/config';
import {
  File,
  getWikiapiUploadRequest,
} from '../../src/services/server/uploadService';

export const config = {
  api: {
    bodyParser: false,
  },
};

// https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
// https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

export const uploadToWikimediaCommons = async (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
) => {
  const wikiapiUploadRequest = getWikiapiUploadRequest(
    user,
    feature,
    file,
    lang,
  );

  return wikiapiUploadRequest;

  const wiki = new Wikiapi();
  await wiki.login('OsmappBot', 'pass', 'test');
  const result = await wiki.upload(wikiapiUploadRequest);

  // TODO  ošetřit existující filename jakoby (2)
  // TODO  check for API errors

  // TODO  send structured data

  // Step 3: Final upload using the filekey to commit the upload out of the stash area
  // api.php?action=upload&format=json&filename=File_1.jpg&filekey=somefilekey1234.jpg&token=123Token&comment=upload_comment_here&text=file_description [try in ApiSandbox]

  // TODO LATER  pokud se vkládal nový osm prvek, tak updatnout link a přidat rename do description:
  // {{Rename|required newname.ext|required rationale number|reason=required text reason}}

  return result;
};

const parseHttpRequest = async (req: NextApiRequest) => {
  const form = formidable({ uploadDir: '/tmp' });
  const [fields, files] = await form.parse(req);
  const { filepath, size, mtime } = files.file[0];
  if (size > 100 * 1024 * 1024) {
    throw new Error('File larger than 100MB');
  }

  const name = fields.filename[0];
  const apiId = getApiId(fields.osmShortId[0]);
  const lang = fields.lang[0];
  if (!getConfig().publicRuntimeConfig.languages[lang]) {
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

// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await serverFetchOsmUser(req);
    const { file, apiId, lang } = await parseHttpRequest(req);

    setIntl({ lang, messages: [] });
    const feature = await fetchFeatureWithCenter(apiId);

    const out = await uploadToWikimediaCommons(user, feature, file, lang);

    res.status(200).json({
      user,
      feature,
      file,
      success: true,
      // out,
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
