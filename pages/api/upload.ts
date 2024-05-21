import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import exifr from 'exifr';
import fs from 'fs';
import {
  serverFetchOsmUser,
  ServerOsmUser,
} from '../../src/services/osmApiAuthServer';
import { fetchFeatureWithCenter } from '../../src/services/osmApi';
import type { Feature, LonLat } from '../../src/services/types';
import { getApiId, getFullOsmappLink, getUrlOsmId } from "../../src/services/helpers";
import { setIntl } from '../../src/services/intl';
import getConfig from 'next/config';
import { getName, getTypeLabel } from '../../src/helpers/featureLabel';
import {
  getMediaWikiSession,
  isTitleAvailable,
  UploadParams,
} from '../../src/services/mediawiki';

// inspiration: https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// TODO https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

export const config = {
  api: {
    bodyParser: false,
  },
};

export type File = {
  filepath: string;
  name: string;
  location: LonLat | null;
  date: Date;
};

const getTitle = (feature, file) => {
  const name = getName(feature);
  const presetName = getTypeLabel(feature);
  const location = file.location ?? feature.center;
  return name
    ? `${name} (${presetName})`
    : `${presetName} at ${location.map((x) => x.toFixed(5))}`;
};

const getFilename = (feature, file, suffix) => {
  const title = getTitle(feature, file);

  const extension = file.name.split('.').pop();
  return `${title} - OsmAPP${suffix}.${extension}`;
};

export const getUploadData = (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
  suffix: string,
) => {
  const name = getName(feature);
  // const presetKey = feature.schema.presetKey;
  const title = getTitle(feature, file);
  const filename = getFilename(feature, file, suffix);
  const osmUserUrl = `https://www.openstreetmap.org/user/${user.username}#id=${user.id}`;
  const date = file.date.toISOString().replace(/\.\d+Z$/, 'Z'); // TODO EXIF location, date information.date = {{According to Exif data|2023-11-16}}
  const osmUrl = `https://www.openstreetmap.org/${getUrlOsmId(feature.osmMeta)}`;
  const osmappUrl = getFullOsmappLink(feature);

  // TODO construct description (categories)
  // TODO  each file must belong to at least one category that describes its content or function
  // TODO  get category based on location eg

  // language=html
  const text = `
=={{int:filedesc}}==
{{Information
  |description    = {{${lang}|1=${title}}}
  |date           = ${date}
  |source         = {{Own photo}}
  |author         = OpenStreetMap user [${osmUserUrl} ${user.username}]
  |other_fields_1 =
    {{Information field
     |name  = {{Label|P180|link=-|capitalization=ucfirst}}
     |value = {{#property:P180|from=M{{PAGEID}} }}&nbsp;[[File:OOjs UI icon edit-ltr-progressive.svg |frameless |text-top |10px |link={{fullurl:{{FULLPAGENAME}}}}#P180|alt=Edit this on Structured Data on Commons|Edit this on Structured Data on Commons]]
    }}
  |other_fields =
    {{Information field
     |name  = {{ucfirst: {{I18n/location|made}} }}
     |value = {{#invoke:Information|SDC_Location|icon=true}} {{#if:{{#property:P1259|from=M{{PAGEID}} }}|(<small>{{#invoke:PropertyChain|PropertyChain|qID={{#invoke:WikidataIB |followQid |props=P1259}}|pID=P131|endpID=P17}}</small>)}}
    }}
    {{Information field |name= OpenStreetMap |value= ${osmUrl}<br>${osmappUrl} }}
}}

=={{int:license-header}}==
{{Self|cc-by-4.0|author=OpenStreetMap user [${osmUserUrl} ${user.username}]}}
{{FoP-Czech_Republic}}
`;
  // TODO choose correct FOP based on country: https://commons.wikimedia.org/wiki/Category:FoP_templates
  // TODO https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

  return {
    filepath: file.filepath,
    filename,
    text,
    date,
    photoLocation: file.location,
    placeLocation: feature.center,
  };
};

async function findFreeSuffix(feature: Feature, file: File) {
  for (let i = 1; i < 20; i++) {
    const suffix = i === 1 ? '' : ` (${i})`;
    const filename = getFilename(feature, file, suffix);
    const isFree = await isTitleAvailable(`File:${filename}`);
    if (isFree) {
      return suffix;
    }
  }

  throw new Error(`Could not find free suffix for ${file.name}`);
}

export const uploadToWikimediaCommons = async (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
) => {
  const password = process.env.OSMAPPBOT_PASSWORD;
  if (!password) {
    throw new Error('OSMAPPBOT_PASSWORD not set');
  }

  const session = getMediaWikiSession();
  await session.login('OsmappBot@osmapp-upload', password);

  const suffix = await findFreeSuffix(feature, file);
  const data = getUploadData(user, feature, file, lang, suffix);

  console.log(data.filepath, data.filename)

  const uploadResult = await session.upload(data.filepath, data.filename, data.text);

  // const pageId = '147484063';

  // const claims = [
  //   claimsHelpers.createDate(data.date),
  //   claimsHelpers.createPlaceLocation(data.placeLocation),
  //   claimsHelpers.createPhotoLocation(data.photoLocation),
  // ];
  // console.log(JSON.stringify(claims, null, 2));
  // const claimsResult = await session.editClaims(`M${pageId}`, claims);

  // TODO check duplicate by sha1 before upload
  return {
    uploadResult,
    //claimsResult,
    filename: data.filename,
  };
  // MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
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
    fetch("https://test.wikipedia.org/w/api.php", {
      "headers": {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryn4nr36VFDeyzCBVa",
        "cookie": "GeoIP=CZ:10:Prague:50.05:14.40:v4; centralauth_ss0-User=Zbytovsky; centralauth_ss0-Token=56de1dfd013e04a14e5a73e2d6c44c6b; ss0-centralauth_Session=1a24faeefb5f9bf12ce0a105690e42c2; centralauth_User=Zbytovsky; WMF-Last-Access-Global=15-May-2024; testwikiSession=dp9lik93hgnjd7bp1nng70ttk4tritpv; testwikiUserID=61401; testwikiUserName=Zbytovsky; WMF-Last-Access=15-May-2024; testwikimwuser-sessionId=8e0f311dd85f1124e562; centralauth_Token=56de1dfd013e04a14e5a73e2d6c44c6b; centralauth_Session=e597ed1d7406dd83d8fcdda5c3225966; NetworkProbeLimit=0.001",
      },
      "body": "------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"action\"\r\n\r\nupload\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\njsonfm\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"filename\"\r\n\r\nFile_1.jpg\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"file\"; filename=\"IMG_3379-EDIT Small.jpeg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"formatversion\"\r\n\r\n2\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"wrappedhtml\"\r\n\r\n1\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n6c671cec5e3046118e5d3494575b7a616644b2ce+\\\r\n------WebKitFormBoundaryn4nr36VFDeyzCBVa--\r\n",
      "method": "POST"
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
