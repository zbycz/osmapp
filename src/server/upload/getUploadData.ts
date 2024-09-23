import { ServerOsmUser } from '../osmApiAuthServer';
import type { Feature } from '../../services/types';
import { File } from './types';
import { getName } from '../../helpers/featureLabel';
import { getFilename, getTitle } from './utils';
import {
  getFullOsmappLink,
  getOsmappLink,
  getUrlOsmId,
} from '../../services/helpers';
import { PROJECT_ID } from '../../services/project';

const getOsmUrls = (feature: Feature) => {
  const osmUrl = `https://www.openstreetmap.org/${getUrlOsmId(feature.osmMeta)}`;
  const osmappUrl = `https://osmapp.org${getOsmappLink(feature)}`;
  const projectUrl = getFullOsmappLink(feature);

  if (PROJECT_ID === 'osmapp') {
    return `${osmUrl}<br>${osmappUrl}`;
  } else {
    return `${osmUrl}<br>${osmappUrl}<br>${projectUrl}`;
  }
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
  const date = file.date.toISOString().replace(/\.\d+Z$/, 'Z');
  const osmUrls = getOsmUrls(feature);

  // TODO construct description (categories)
  // TODO  each file must belong to at least one category that describes its content or function
  // TODO  get category based on location eg

  // TODO add some overpass link https://www.wikidata.org/w/index.php?title=Template:Overpasslink&action=edit
  const text = `
=={{int:filedesc}}==
{{Information
    |description    = {{${lang}|1=${title}}}
    |date           = ${date}
    |source         = {{Own photo}}
    |author         = OpenStreetMap user [${osmUserUrl} ${user.username}]
    |other_fields =
        {{Information field
          |name  = {{Label|P1259|link=-|capitalization=ucfirst}}
          |value = {{#property:P1259|from=M{{PAGEID}} }}&nbsp;[[File:OOjs UI icon edit-ltr-progressive.svg |frameless |text-top |10px |link={{fullurl:{{FULLPAGENAME}}}}#P1259|alt=Edit this on Structured Data on Commons|Edit this on Structured Data on Commons]]
        }}
        {{Information field
          |name  = {{Label|P9149|link=-|capitalization=ucfirst}}
          |value = {{#property:P9149|from=M{{PAGEID}} }}&nbsp;[[File:OOjs UI icon edit-ltr-progressive.svg |frameless |text-top |10px |link={{fullurl:{{FULLPAGENAME}}}}#P9149|alt=Edit this on Structured Data on Commons|Edit this on Structured Data on Commons]]
        }}
        {{Information field
          |name= OpenStreetMap
          |value= ${osmUrls}
        }}
    }}

=={{int:license-header}}==
{{Self|cc-by-sa-4.0|author=OpenStreetMap user [${osmUserUrl} ${user.username}]}}
${feature.countryCode === 'CZ' ? '{{FoP-Czech_Republic}}' : ''}
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
