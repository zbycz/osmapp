import type { NextApiRequest, NextApiResponse } from 'next';
import { PROJECT_NAME, PROJECT_URL } from '../../src/services/project';

// Abort after approximately 200kb
const READ_LIMIT = 200_000;

const regex1 = /<meta\s+property="og:image"\s+content="([^"]+)"/;
const regex2 = /<meta\s+content="([^"]+)"\s+property="og:image"/;

const loadOgImage = async (url: string): Promise<string | null> => {
  const abortController = new AbortController();

  const response = await fetch(url, {
    signal: abortController.signal,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': `${PROJECT_NAME} (+${PROJECT_URL})`,
    },
  });

  const reader = response.body.getReader();

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();

    buffer += decoder.decode(value, { stream: true });

    const match = buffer.match(regex1) ?? buffer.match(regex2);
    if (match) {
      abortController.abort();
      return match[1];
    }

    if (done || buffer.length > READ_LIMIT) {
      break;
    }
  }

  return null;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { href } = req.query;
  if (!href || Array.isArray(href)) {
    return res
      .status(400)
      .json({ error: 'provide an url under the query parameter `href`' });
  }

  const ogImage = await loadOgImage(href);

  if (ogImage) {
    return res.status(200).json({ ogImage });
  }
  return res.status(404).json({ error: 'og:image not found/available' });
};
