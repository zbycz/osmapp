import type { Feature, LonLat } from '../types';
import type { ServerOsmUser } from '../osmApiAuthServer';
import { getName, getTypeLabel } from '../../helpers/featureLabel';

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

  // TODO  check duplicate by sha1

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
