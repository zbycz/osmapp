import type { Feature } from '../types';
import { getUploadData } from '../../../pages/api/upload';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { languages: ['en'] },
}));

const feature = {
  type: 'Feature',
  center: [14.5255208, 50.5776264],
  osmMeta: {
    type: 'way',
    id: 255654888,
  },
  tags: {
    amenity: 'place_of_worship',
    name: 'svatý Mikuláš',
    wikidata: 'Q15393875',
    wikipedia: 'cs:Kostel svatého Mikuláše (Drchlava)',
  },
  properties: {
    class: 'place_of_worship',
    subclass: 'place_of_worship',
  },
  schema: {
    presetKey: 'amenity/place_of_worship/christian',
    label: 'Christian Church',
  },
} as Feature;

const file = {
  filepath: '/tmp/cda0f39b9e13dc5cd1ea4cb07',
  name: 'IMG_4424.jpg',
  location: [14.525191666666668, 50.577450000000006],
  date: new Date('2024-03-16T11:35:56.000Z'),
};

const user = { id: 162287, username: 'zby-cz' };

const lang = 'en';

const out = {
  file_path: '/tmp/cda0f39b9e13dc5cd1ea4cb07',
  filename: 'svatý Mikuláš (Christian Church) - OsmAPP.jpg',
  comment: 'Initial upload from OsmAPP.org',
  ignorewarnings: 1,
  description: expect.anything(),
  date: '2024-03-16T11:35:56Z',
  source_url: 'https://github.com/kanasimi/wikiapi',
  author: '[https://www.openstreetmap.org/user/zby-cz zby-cz] (162287)',
  permission: '{{cc-by-sa-2.5}}',
  other_versions: '',
  other_fields: '',
  license: ['{{cc-by-sa-2.5}}'],
  categories: ['[[Category:test images]]'],
  bot: 1,
  token: '',
};

//language=html
const outDescription = `
=={{int:filedesc}}==
{{Information
  |description    = {{en|1=svatý Mikuláš (Christian Church)}}
  |date           = 2024-03-16T11:35:56Z
  |source         = {{Own photo}}
  |author         = OpenStreetMap user [https://www.openstreetmap.org/user/zby-cz#id=162287 zby-cz]
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
{{Self|cc-by-4.0|author=OpenStreetMap user [https://www.openstreetmap.org/user/zby-cz#id=162287 zby-cz]}}
{{FoP-Czech_Republic}}
`;

test('getWikiapiUploadRequest', () => {
  const wikiapiUploadRequest = getUploadData(
    user,
    feature,
    file,
    lang,
  );
  expect(wikiapiUploadRequest).toEqual(out);
  expect(wikiapiUploadRequest.description.trim()).toEqual(
    outDescription.trim(),
  );
});
