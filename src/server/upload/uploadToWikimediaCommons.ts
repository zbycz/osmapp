import { ServerOsmUser } from '../osmApiAuthServer';
import type { Feature } from '../../services/types';
import { File } from './types';
import { getMediaWikiSession } from './mediawiki/mediawiki';
import { findFreeSuffix } from './utils';
import { getUploadData } from './getUploadData';

export const uploadToWikimediaCommons = async (
  user: ServerOsmUser,
  feature: Feature,
  file: File,
  lang: string,
) => {
  const password = process.env.OSMAPPBOT_PASSWORD;
  if (!password) {
    throw new Error('OSMAPPBOT_PASSWORD not set');
  }

  const session = getMediaWikiSession();
  await session.login('OsmappBot@osmapp-upload', password);

  const suffix = await findFreeSuffix(feature, file);
  const data = getUploadData(user, feature, file, lang, suffix);

  console.log("uploadToWikimediaCommons", data.filepath, data.filename);

  const uploadResult = await session.upload(
    data.filepath,
    data.filename,
    data.text,
  );

  console.log({uploadResult});

  // const pageId = '147484063';
  // const claims = [
  //   claimsHelpers.createDate(data.date),
  //   claimsHelpers.createPlaceLocation(data.placeLocation),
  //   claimsHelpers.createPhotoLocation(data.photoLocation),
  // ];
  // console.log(JSON.stringify(claims, null, 2));
  // const claimsResult = await session.editClaims(`M${pageId}`, claims);

  // TODO check duplicate by sha1 before upload
  return {
    uploadResult,
    //claimsResult,
    filename: data.filename,
  };
  // MD5 hash wikidata https://commons.wikimedia.org/w/index.php?title=File%3AArea_needs_fixing-Syria_map.png&diff=801153548&oldid=607140167
};
