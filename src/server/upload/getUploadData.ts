import { ServerOsmUser } from '../osmApiAuthServer';
import type { Feature } from '../../services/types';
import { File } from './types';
import { getName } from '../../helpers/featureLabel';
import { getFilename, getTitle } from './utils';
import { getFullOsmappLink, getUrlOsmId } from '../../services/helpers';

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
    |value = {{#invoke:Information|SDC_Location|icon=true}} {{#if:{{#property:P1259|from=M{{PAGEID}} }}|(<small>{{#invoke:PropertyChain|PropertyChain|qID={{#invoke:WikidataIB
      |followQid |props=P1259}}|pID=P131|endpID=P17}}</small>)}}
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
