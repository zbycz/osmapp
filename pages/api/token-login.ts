import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchOsmUsername, setAccessToken } from "../../src/services/osmApiAuth";

// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
    }

    if (!req.body.accessToken) {
      res.status(400).send({ message: 'accessToken mising' })
      return
    }

    setAccessToken(req.body.accessToken);
    const username = await fetchOsmUsername();

    res.status(200).json({ body: req.body, username });

  } catch (err) {
    console.error(err);
    res.status(err.httpCode || 400).send(String(err));
  }
};
