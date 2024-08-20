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
    fetch('https://test.wikipedia.org/w/api.php', {
      headers: {
        'content-type':
          'multipart/form-data; boundary=----WebKitFormBoundaryn4nr36VFDeyzCBVa',
        cookie:
          'GeoIP=CZ:10:Prague:50.05:14.40:v4; centralauth_ss0-User=Zbytovsky; centralauth_ss0-Token=56de1dfd013e04a14e5a73e2d6c44c6b; ss0-centralauth_Session=1a24faeefb5f9bf12ce0a105690e42c2; centralauth_User=Zbytovsky; WMF-Last-Access-Global=15-May-2024; testwikiSession=dp9lik93hgnjd7bp1nng70ttk4tritpv; testwikiUserID=61401; testwikiUserName=Zbytovsky; WMF-Last-Access=15-May-2024; testwikimwuser-sessionId=8e0f311dd85f1124e562; centralauth_Token=56de1dfd013e04a14e5a73e2d6c44c6b; centralauth_Session=e597ed1d7406dd83d8fcdda5c3225966; NetworkProbeLimit=0.001',
      },
      body: '------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="action"\r\n\r\nupload\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="format"\r\n\r\njsonfm\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="filename"\r\n\r\nFile_1.jpg\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="file"; filename="IMG_3379-EDIT Small.jpeg"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="formatversion"\r\n\r\n2\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="wrappedhtml"\r\n\r\n1\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name="token"\r\n\r\n6c671cec5e3046118e5d3494575b7a616644b2ce+\\\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa--\r\n',
      method: 'POST',
    });

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
