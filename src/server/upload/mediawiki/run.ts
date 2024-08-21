import { getMediaWikiSession } from './mediawiki';
import { findFreeSuffix } from '../utils';
import { getUploadData } from '../getUploadData';
import { fetchFeatureWithCenter } from '../../../services/osmApi';
import { File } from '../types';
import { readFile } from 'node:fs/promises';

const file: File = {
  name: 'test.jpg',
  filepath: './test.jpg',
  location: [],
  date: undefined,
};

(async () => {
  const password = (await readFile('../../../../.env.local', 'utf-8'))
    .split('\n')[0]
    .split('=')[1];

  const feature = await fetchFeatureWithCenter({
    type: 'node',
    id: 3528889584,
  });

  const session = getMediaWikiSession();
  console.log(await session.login('OsmappBot@osmapp-upload', password));

  console.log(await session.getCsrfToken());

  // const suffix = await findFreeSuffix(feature, file);
  // const data = getUploadData(user, feature, file, lang, suffix);
  // console.log(data.filepath, data.filename);

  // const uploadResult = await session.upload(
  //   data.filepath,
  //   data.filename,
  //   data.text,
  // );
  // console.log(uploadResult);
})();
