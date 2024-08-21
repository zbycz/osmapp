import { getMediaWikiSession } from './mediawiki';
import { readFile } from 'node:fs/promises';

(async () => {
  const password = (await readFile('../../../../.env.local', 'utf-8'))
    .split('\n')[0]
    .split('=')[1];

  const session = getMediaWikiSession();
  console.log(await session.login('OsmappBot@osmapp-upload', password));
})();
