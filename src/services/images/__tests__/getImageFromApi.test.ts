import { getImageFromApiRaw } from '../getImageFromApi';
import * as fetchModule from '../../fetch';
import { apiMocks } from './apiMocks.fixture';

const mockApi = (key) => {
  jest.spyOn(fetchModule, 'fetchJson').mockImplementation((url) => {
    expect(url).toEqual(apiMocks[key].url);
    return Promise.resolve(apiMocks[key].response);
  });
};

beforeEach(() => {
  jest.restoreAllMocks();
  expect.hasAssertions();
});

test('ImageFromCenter - mapillary', async () => {
  mockApi('mapillary');
  expect(
    await getImageFromApiRaw({
      type: 'center',
      service: 'mapillary',
      center: [14.4212535, 50.0874654],
    }),
  ).toEqual({
    imageUrl:
      'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9_ZPkbARt980mz9eWfhxjyaydvZqGcdmnZurAOOznSqNbGX-nyG9In2hsJKZeZkMTk8N60SG-yQ3ax2vui0T4Uq6aRNP6m1HfCrLysAfarumjlm9S8I50Jx9K7tDHzB47T90Of_FioWreMPECyVQ?stp=s1024x512&ccb=10-5&oh=00_AYBlBDx5gSiTqwPuXV-oPmhXbQm7d9wysegzusC6BNXQzw&oe=66ACE703&_nc_sid=201bca&_nc_zt=28',
  });
});

test('ImageFromCenter - fody', async () => {
  mockApi('fody');
  expect(
    await getImageFromApiRaw({
      type: 'center',
      service: 'fody',
      center: [14.304877, 50.0995841],
    }),
  ).toEqual({
    imageUrl: 'https://osm.fit.vutbr.cz/fody/files/250px/25530.jpg',
  });
});

test('wikidata', async () => {
  mockApi('wikidata');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikidata',
      v: 'Q180402',
      instant: false,
    }),
  ).toEqual({
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Half_Dome_with_Eastern_Yosemite_Valley_(50MP).jpg/400px-Half_Dome_with_Eastern_Yosemite_Valley_(50MP).jpg',
  });
});

test('image=File:', async () => {
  mockApi('commonsFile');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'image',
      v: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      instant: false,
    }),
  ).toEqual({
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/640px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
  });
});

test('wikimedia_commons=File:', async () => {
  mockApi('commonsFile');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikimedia_commons',
      v: 'File:Hlubočepské plotny - Pravá plotna.jpg',
      instant: false,
    }),
  ).toEqual({
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/640px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
  });
});

test('wikimedia_commons=Category:', async () => {
  mockApi('commonsCategory');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikimedia_commons:2',
      v: 'Category:Yosemite National Park',
      instant: false,
    }),
  ).toEqual(null);
});

test('wikipedia', async () => {
  mockApi('wikipedia');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikipedia',
      v: 'Yosemite National Park',
      instant: false,
    }),
  ).toEqual({
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/640px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
  });
});

test('wikipedia=cs:', async () => {
  mockApi('wikipediaCs');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikipedia:2',
      v: 'cs:Yosemite National Park',
      instant: false,
    }),
  ).toEqual({
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/640px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
  });
});

test('wikipedia:cs=cs:', async () => {
  mockApi('wikipediaCs');
  expect(
    await getImageFromApiRaw({
      type: 'tag',
      k: 'wikipedia:cs',
      v: 'Yosemite National Park',
      instant: false,
    }),
  ).toEqual({
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/640px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
  });
});
