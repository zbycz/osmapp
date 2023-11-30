import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import Wikiapi from 'wikiapi';

export const config = {
  api: {
    bodyParser: false,
  },
};

/*
alg:

sanitize title
check duplicate by sha1
construct description (categories)
each file must belong to at least one category that describes its content or function
get category based on location eg
check for API errors
send structured data

reply 200 + { name, url} to show Succes Dialog

pokud se vkládal nový osm prvek, tak updatnout link a přidat rename do description:
{{Rename|required newname.ext|required rationale number|reason=required text reason}}


 */

// https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py

const uploadToWikimediaCommons = async (
  filepath: string,
  filename: string,
  osmEntity: string,
  username: string = 'zby-cz',
  userId: string = '123',
) => {
  const filename = 'aktuální nazev z dialogu nebo souřadnice - OsmAPP.org - node/123.jpg';

  const featureName = 'nazev z dialogu nebo souřadnice';
  const featureLocation = 'z dialogu';


  // EXIF location ...


  const wiki = new Wikiapi();
  await wiki.login('OsmappBot', 'password', 'test');

  /* ***************************************************** */
  /* FILES *********************************************** */
  // Note: parameter `text`, filled with the right wikicode `{{description|}}`, can replace most parameters.
  let options = {
    description: 'Photo of Osaka',
    date: new Date(),
    source_url: 'https://github.com/kanasimi/wikiapi',
    author: `[https://www.openstreetmap.org/user/${username} ${username}] (${userId})`,
    permission: '{{cc-by-sa-2.5}}',
    other_versions: '',
    other_fields: '',
    license: ['{{cc-by-sa-2.5}}'],
    categories: ['[[Category:test images]]'],
    bot: 1,
    tags: 'tag1|tag2',
  };

  let result = await wiki.upload({
    file_path: filepath,
    filename: filename,
    comment: '',
    ignorewarnings: 1, // overwrite existing file
    ...options,
  });
};

// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const form = formidable({ uploadDir: '/tmp' });
    const [fields, files] = await form.parse(req);

    const path = files.file[0].filepath;
    const size = files.file[0].size;
    const name = fields.filename[0];
    const osmEntity = fields.osmEntity[0];

    if (size > 100 * 1024 * 1024) {
      throw new Error('File larger than 100MB');
    }

    await uploadToWikimediaCommons(path, name, osmEntity);

    res.status(200).json({
      status: 'ok',
      path,
      name,
      osmEntity,
    });
  } catch (err) {
    console.error(err);
    res.status(err.httpCode || 400).send(String(err));
  }
};

// import { writeFile } from 'fs/promises'
// import { NextRequest, NextResponse } from 'next/server'
//
// export async function POST(request: NextRequest) {
//   const data = await request.formData()
//   const file: File | null = data.get('file') as unknown as File
//
//   if (!file) {
//     return NextResponse.json({ success: false })
//   }
//
//   const bytes = await file.arrayBuffer()
//   const buffer = Buffer.from(bytes)
//
//   // With the file data in the buffer, you can do whatever you want with it.
//   // For this, we'll just write it to the filesystem in a new location
//   const path = `/tmp/${file.name}`
//   await writeFile(path, buffer)
//   console.log(`open ${path} to see the uploaded file`)
//
//   return NextResponse.json({ success: true })
// }
