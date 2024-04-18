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
import type { LonLat } from '../../src/services/types';
import { getName, getTypeLabel } from '../../src/helpers/featureLabel';

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

export const getWikiapiUploadRequest = (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
) => {
  const name = getName(feature);
  const location = file.location ?? feature.center;
  const presetKey = feature.schema.presetKey;
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
     |value = {{#invoke:Information|SDC_Location|icon=true}} {{#if:{{#property:P1071|from=M{{PAGEID}} }}|(<small>{{#invoke:PropertyChain|PropertyChain|qID={{#invoke:WikidataIB |followQid |props=P1071}}|pID=P131|endpID=P17}}</small>)}}
    }}
}}

=={{int:license-header}}==
{{Self|cc-by-4.0|author=OpenStreetMap user [${osmUserUrl} ${user.username}]}}
{{FoP-Czech_Republic}}
`;

  // TODO choose correct FOP based on country: https://commons.wikimedia.org/wiki/Category:FoP_templates

  return {
    file_path: file.filepath,
    filename: title + suffix,
    comment: 'Initial upload from OsmAPP.org', // Upload comment. Also used as the initial page text for new files if text is not specified.
    ignorewarnings: 1, // overwrite existing file
    description: text, // text  //Initial page text for new files.
    date: date,
    source_url: 'https://github.com/kanasimi/wikiapi',
    author: `[https://www.openstreetmap.org/user/${user.username} ${user.username}] (${user.id})`,
    permission: '{{cc-by-sa-2.5}}',
    other_versions: '',
    other_fields: '',
    license: ['{{cc-by-sa-2.5}}'],
    categories: ['[[Category:test images]]'],
    bot: 1,

    token: '', // TODO ??? GET a CSRF token: api.php?action=query&format=json&meta=tokens
    // https://www.mediawiki.org/wiki/API:Upload
    // tags: 'tag1|tag2', // Change tags to apply to the upload log entry and file page revision.
    // filekey // Key that identifies a previous upload that was stashed temporarily.
    // stash // If set, the server will stash the file temporarily instead of adding it to the repository.
    // filesize
    // offset // Offset of chunk in bytes.
    // chunk Must be posted as a file upload using multipart/form-data. -- chunks 1 MB
    // async // Make potentially large file operations asynchronous when possible.
    // checkstatus // Only fetch the upload status for the given file key.
    // token // A "csrf" token retrieved from action=query&meta=tokens
  };
};

// https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
// https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

export const uploadToWikimediaCommons = async (wikiapiUploadRequest) => {
  const password = process.env.OSMAPPBOT_PASSWORD;
  if (!password) {
    throw new Error('OSMAPPBOT_PASSWORD not set');
  }


  const wiki = new Wikiapi();
  await wiki.login('OsmappBot', password, 'commons');

  // TODO  check duplicate by sha1

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

    const wikiapiUploadRequest = getWikiapiUploadRequest(
      user,
      feature,
      file,
      lang,
    );
    const out = await uploadToWikimediaCommons(wikiapiUploadRequest);

    res.status(200).json({
      success: true,
      wikiapiUploadRequest,
      out,
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
