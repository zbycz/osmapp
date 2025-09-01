import { DiffResultXmljs } from './auth/xmlTypes';
import {
  DataItem,
} from '../../components/FeaturePanel/EditDialog/useEditItems';
import { getApiId } from '../helpers';
import { OsmId } from '../types';

const extractExistingId = (change: DataItem, result: DiffResultXmljs) => {
  const id = getApiId(change.shortId);

  if (id.id > 0) {
    return id;
  }

  const idMapping = result[id.type]?.find(({ $ }) => `${id.id}` === $.old_id);
  if (!idMapping) {
    // it may be missing only for ignored changes (like new item which is deleted)
    return false;
  }

  return {
    type: id.type,
    id: parseInt(idMapping.$.new_id, 10),
  };
};

export const getFirstExistingId = (
  result: DiffResultXmljs,
  changes: DataItem[],
): OsmId => {
  for (const change of changes) {
    const existingId = extractExistingId(change, result);
    if (existingId) {
      return existingId;
    }
  }

  throw new Error('Cannot find a persisted id for any change');
};
