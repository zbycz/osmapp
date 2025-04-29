import { DiffResultXmljs } from './auth/xmlTypes';
import { EditDataItem } from '../../components/FeaturePanel/EditDialog/useEditItems';
import { getApiId } from '../helpers';

export const getFirstId = (
  result: DiffResultXmljs,
  changes: EditDataItem[],
) => {
  const firstId = getApiId(changes[0].shortId);

  if (firstId.id < 0) {
    const idMapping = result[firstId.type].find(
      ({ $ }) => `${firstId.id}` === $.old_id,
    );
    return {
      type: firstId.type,
      id: parseInt(idMapping.$.new_id, 10),
    };
  }

  return firstId;
};
