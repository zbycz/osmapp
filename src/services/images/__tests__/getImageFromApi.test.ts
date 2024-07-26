import { getImageFromApiRaw } from '../getImageFromApi';
import * as fetchModule from '../../fetch';
import {
  ApiMock,
  COMMONS_CATEGORY,
  COMMONS_FILE,
  FODY,
  MAPILLARY,
  WIKIDATA,
  WIKIPEDIA,
  WIKIPEDIA_CS,
} from './apiMocks.fixture';

const mockApi = (mock: ApiMock) => {
  jest.spyOn(fetchModule, 'fetchJson').mockImplementation((url) => {
    expect(url).toEqual(mock.url);
    return Promise.resolve(mock.response);
  });
};

beforeEach(() => {
  jest.restoreAllMocks();
  expect.hasAssertions();
});

test('ImageFromCenter - mapillary', async () => {
  mockApi(MAPILLARY);
  expect(
    await getImageFromApiRaw({
      type: 'center',
      service: 'mapillary',
      center: [14.4212535, 50.0874654],
    }),
  ).toEqual({
    description: 'Mapillary image from 3/13/2020, 11:46:50 AM',
    imageUrl: 'mapillary_url_1024',
    link: '321151246189360',
    linkUrl: 'https://www.mapillary.com/app/?focus=photo&pKey=321151246189360',
    uncertainImage: true,
    panoramaUrl: 'mapillary_url_original',
  });
});

test('ImageFromCenter - fody', async () => {
  mockApi(FODY);
  expect(
    await getImageFromApiRaw({
      type: 'center',
      service: 'fody',
      center: [14.304877, 50.0995841],
    }),
  ).toEqual({
    description: 'Fody photodb from Milancer (2019-11-10 15:19:18)',
    imageUrl: 'https://osm.fit.vutbr.cz/fody/files/250px/25530.jpg',
    link: 25530,
    linkUrl: 'https://osm.fit.vutbr.cz/fody/?id=25530',
  });
});

test('wikidata=*', async () => {
  mockApi(WIKIDATA);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikidata',
      v: 'Q180402',
      instant: false,
    }),
  ).toEqual({
    description: 'Wikidata image (wikidata=*)',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Half_Dome_with_Eastern_Yosemite_Valley_(50MP).jpg/410px-Half_Dome_with_Eastern_Yosemite_Valley_(50MP).jpg',
    link: 'Q180402',
    linkUrl: 'https://www.wikidata.org/wiki/Q180402',
  });
});

test('image=File:', async () => {
  mockApi(COMMONS_FILE);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'image',
      v: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      instant: false,
    }),
  ).toEqual({
    description: 'Wikimedia Commons (image=*)',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubočepské_plotny_-_Pravá_plotna.jpg/410px-Hlubočepské_plotny_-_Pravá_plotna.jpg',
    link: 'File:Hlubočepské plotny - Pravá plotna.jpg',
    linkUrl: 'https://commons.wikimedia.org/w/index.php?curid=145779916',
  });
});

test('wikimedia_commons=File:', async () => {
  mockApi(COMMONS_FILE);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikimedia_commons',
      v: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      instant: false,
    }),
  ).toEqual({
    description: 'Wikimedia Commons (wikimedia_commons=*)',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubočepské_plotny_-_Pravá_plotna.jpg/410px-Hlubočepské_plotny_-_Pravá_plotna.jpg',
    link: 'File:Hlubočepské plotny - Pravá plotna.jpg',
    linkUrl: 'https://commons.wikimedia.org/w/index.php?curid=145779916',
  });
});

test('wikimedia_commons=Category:', async () => {
  mockApi(COMMONS_CATEGORY);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikimedia_commons:2',
      v: 'Category:Yosemite National Park',
      instant: false,
    }),
  ).toEqual(null);
});

test('wikipedia=*', async () => {
  mockApi(WIKIPEDIA);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikipedia',
      v: 'Yosemite National Park',
      instant: false,
    }),
  ).toEqual({
    description: 'Wikipedia (wikipedia=*)',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/410px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
    link: 'File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
    linkUrl:
      'https://commons.wikimedia.org/wiki/File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
  });
});

test('wikipedia=* with lang prefix in value', async () => {
  mockApi(WIKIPEDIA_CS);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikipedia:2',
      v: 'cs:Yosemite National Park',
      instant: false,
    }),
  ).toEqual({
    description: 'Wikipedia (wikipedia:2=*)',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/410px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
    link: 'File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
    linkUrl:
      'https://commons.wikimedia.org/wiki/File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
  });
});

test('wikipedia:cs=* with lang prefix in key', async () => {
  mockApi(WIKIPEDIA_CS);
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikipedia:cs',
      v: 'Yosemite National Park',
      instant: false,
    }),
  ).toEqual({
    description: 'Wikipedia (wikipedia:cs=*)',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/410px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
    link: 'File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
    linkUrl:
      'https://commons.wikimedia.org/wiki/File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
  });
});
