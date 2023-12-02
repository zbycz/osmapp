import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import Wikiapi from 'wikiapi';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// https://commons.wikimedia.org/wiki/File:Drive_approaching_the_Grecian_Lodges_-_geograph.org.uk_-_5765640.jpg
// https://github.com/multichill/toollabs/blob/master/bot/commons/geograph_uploader.py
// MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
// https://commons.wikimedia.org/wiki/Template:Geograph_from_structured_data

const uploadToWikimediaCommons = async (filepath: string) => {
  const username = 'zby-cz';
  const userId = '123123';
  const name = 'Na Vrškách';
  const location = [50.123, 14.123];
  const presetKey = 'amenity/restaurant';
  const presetName = 'Restaurace';
  const filename = 'IMG_1234.jpg';
  const osmEntity = 'node/11111111';
  const filemtime = fs.statSync(filepath).mtime.toISOString(); //.replace(/\.\d+Z$/, 'Z'); // případně file[0].mtime
  // TODO EXIF location, date information.date = {{According to Exif data|2023-11-16}}

  // transform
  const extension = filename.split('.').pop();
  const title = `${presetName} ${name || location} - OsmAPP.${extension}`; // Restaurace Na Vrškách - OsmAPP.jpg

  // TODO construct description (categories)
  // TODO  each file must belong to at least one category that describes its content or function
  // TODO  get category based on location eg


  // checks

  const text = `{{description|1=${presetKey}|2=${name}|3=${location}}}`; // {{description|amenity/restaurant|Na Vrškách|50.123,14.123}}


  // camera location
  // location made

  // language=html
  const text2 = `
    <h2><span class="mw-headline" id="Summary">{{int:filedesc}}</span></h2>
    {{Information
      |description    = ${presetName} ${name || location}
      |date           = ${filemtime}
      |source         = {{Own photo}}
      |author         = OpenStreetMap user [https://www.openstreetmap.org/user/${username}#id${userId} ${username}]
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

    <h2><span class="mw-headline" id="Licensing">{{int:license-header}}</span></h2>
    {{Self|cc-by-4.0|author=OpenStreetMap user [https://www.openstreetmap.org/user/${username}#id${userId} ${username}]}}
    {{FoP-Czech_Republic}}
    `;
  // TODO choose correct FOP based on country: https://commons.wikimedia.org/wiki/Category:FoP_templates


  const wiki = new Wikiapi();
  await wiki.login('OsmappBot', 'password', 'test');


  // TODO  check duplicate by sha1

  // SEND

  /* https://www.mediawiki.org/wiki/API:Upload
      filename //Target filename.
      comment //Upload comment. Also used as the initial page text for new files if text is not specified.
      tags  //Change tags to apply to the upload log entry and file page revision.
      text  //Initial page text for new files.
      ignorewarnings //Ignore any warnings.
      file // Must be posted as a file upload using multipart/form-data.
      filekey // Key that identifies a previous upload that was stashed temporarily.
      stash // If set, the server will stash the file temporarily instead of adding it to the repository.
      filesize
      // offset // Offset of chunk in bytes.
      // chunk Must be posted as a file upload using multipart/form-data. -- chunks 1 MB
      // async // Make potentially large file operations asynchronous when possible.
      checkstatus // Only fetch the upload status for the given file key.
      token // A "csrf" token retrieved from action=query&meta=tokens
  * */

  let result = await wiki.upload({
    file_path: filepath,
    filename: title,
    comment: 'Initial upload from OsmAPP.org',
    ignorewarnings: 1, // overwrite existing file
    description: text,
    date: filemtime,
    source_url: 'https://github.com/kanasimi/wikiapi',
    author: `[https://www.openstreetmap.org/user/${username} ${username}] (${userId})`,
    permission: '{{cc-by-sa-2.5}}',
    other_versions: '',
    other_fields: '',
    license: ['{{cc-by-sa-2.5}}'],
    categories: ['[[Category:test images]]'],
    bot: 1,
    tags: 'tag1|tag2',

    token: '', // TODO ??? GET a CSRF token: api.php?action=query&format=json&meta=tokens
  });

  // TODO  ošetřit existující filename jakoby (2)
  // TODO  check for API errors

  // TODO  send structured data


  // Step 3: Final upload using the filekey to commit the upload out of the stash area
  // api.php?action=upload&format=json&filename=File_1.jpg&filekey=somefilekey1234.jpg&token=123Token&comment=upload_comment_here&text=file_description [try in ApiSandbox]


  // TODO LATER  pokud se vkládal nový osm prvek, tak updatnout link a přidat rename do description:
  // {{Rename|required newname.ext|required rationale number|reason=required text reason}}
};

// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const form = formidable({ uploadDir: '/tmp' });
    // const [fields, files] = await form.parse(req);
    //
    // const path = files.file[0].filepath;
    // const size = files.file[0].size;
    // const filemtime = files.file[0].mtime;
    // const name = fields.filename[0];
    // const osmEntity = fields.osmEntity[0];
    //
    // if (size > 100 * 1024 * 1024) {
    //   throw new Error('File larger than 100MB');
    // }

    await uploadToWikimediaCommons('./IMG_3379.HEIC');
    // reply 200 + { name, url} to show Succes Dialog

    res.status(200).json({
      status: 'ok',
      // path,
      // name,
      // osmEntity,
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
