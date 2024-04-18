import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import exifr from 'exifr';
import fs from 'fs';
import {
  serverFetchOsmUser,
  ServerOsmUser,
} from '../../src/services/osmApiAuthServer';
import { fetchFeatureWithCenter } from '../../src/services/osmApi';
import type { Feature } from '../../src/services/types';
import { getApiId } from '../../src/services/helpers';
import { setIntl } from '../../src/services/intl';
import getConfig from 'next/config';
import type { LonLat } from '../../src/services/types';
import { getName, getTypeLabel } from '../../src/helpers/featureLabel';
import {
  getMediaWikiSession,
  UploadParams,
} from '../../src/services/mediawiki';

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

export const getUploadData = (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
) => {
  const name = getName(feature);
  const location = file.location ?? feature.center;
  // const presetKey = feature.schema.presetKey;
  const presetName = getTypeLabel(feature);
  const filename = file.name;
  const date = file.date.toISOString().replace(/\.\d+Z$/, 'Z'); // TODO EXIF location, date information.date = {{According to Exif data|2023-11-16}}
  const title = name
    ? `${name} (${presetName})`
    : `${presetName} at ${location.map((x) => x.toFixed(5))}`;
  const suffix = ` - OsmAPP.${filename.split('.').pop()}`;
  const osmUserUrl = `https://www.openstreetmap.org/user/${user.username}#id=${user.id}`;

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
}}

=={{int:license-header}}==
{{Self|cc-by-4.0|author=OpenStreetMap user [${osmUserUrl} ${user.username}]}}
{{FoP-Czech_Republic}}
`;
  // TODO choose correct FOP based on country: https://commons.wikimedia.org/wiki/Category:FoP_templates

  return {
    uploadParams: {
      file: fs.createReadStream(file.filepath),
      filename: title + suffix,
      text,
      comment: 'Initial upload from OsmAPP.org',
      ignorewarnings: true,
    } as UploadParams,
    date,
    photoLocation: file.location,
    placeLocation: feature.center,
  };
};

// https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
// https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

export const uploadToWikimediaCommons = async (data) => {
  const password = process.env.OSMAPPBOT_PASSWORD;
  if (!password) {
    throw new Error('OSMAPPBOT_PASSWORD not set');
  }

  const wiki = getMediaWikiSession();
  await wiki.login('OsmappBot@osmapp-upload', password);
  // const result = await wiki.upload(data.uploadParams);

  const filename = data.uploadParams.filename;
  // const result = await wiki.addClaimDate(filename, data.date);
  const result = await wiki.addPhotoLocation(869250201, data.photoLocation);
  // const result = await wiki.addPlaceLocation(filename, data.placeLocation);

  // TODO check duplicate by sha1 before upload
  // TODO check duplicate name before upload
  // TODO return filename;
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

    const data = getUploadData(user, feature, file, lang);
    const out = await uploadToWikimediaCommons(data);

    res.status(200).json({
      success: true,
      out,
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
