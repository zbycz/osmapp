import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../src/server/osmApiAuthServer';
import { fetchFeatureWithCenter } from '../../src/services/osmApi';
import { setIntl } from '../../src/services/intl';
import { getExifData } from '../../src/server/upload/getExifData';
import { uploadToWikimediaCommons } from '../../src/server/upload/uploadToWikimediaCommons';
import { getApiId } from '../../src/services/helpers';
import { File } from '../../src/server/upload/types';
import * as fs from 'node:fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { setProjectForSSR } from '../../src/services/project';

// inspiration: https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// TODO https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

const fetchToFile = async (url: string) => {
  const filepath = `/tmp/${Math.random()}`;
  const response = await fetch(url);
  const inStream = Readable.fromWeb(response.body as unknown as any);
  const outStream = fs.createWriteStream(filepath);
  await finished(inStream.pipe(outStream));

  return filepath;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { shortId, lang, url, filename } = JSON.parse(req.body);
    setIntl({ lang, messages: [] });
    setProjectForSSR(req);

    const apiId = getApiId(shortId);
    const feature = await fetchFeatureWithCenter(apiId);
    const user = await serverFetchOsmUser(req.cookies.osmAccessToken);

    const filepath = await fetchToFile(url);
    const { location, date } = await getExifData(filepath);
    const file: File = { filepath, filename, location, date };
    const out = await uploadToWikimediaCommons(user, feature, file, lang);

    res.status(200).json(out);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
