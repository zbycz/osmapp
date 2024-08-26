import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../src/server/osmApiAuthServer';
import { fetchFeatureWithCenter } from '../../src/services/osmApi';
import { setIntl } from '../../src/services/intl';
import { parseHttpRequest } from '../../src/server/upload/parseHttpRequest';
import { uploadToWikimediaCommons } from '../../src/server/upload/uploadToWikimediaCommons';

// inspiration: https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// TODO https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

export const config = {
  api: {
    bodyParser: false,
  },
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
      success: true,
      out,
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
