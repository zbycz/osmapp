import { EditDataItem } from '../../../../components/FeaturePanel/EditDialog/useEditItems';
import { parseToXmljs } from '../xmlHelpers';
import { DiffResultXmljs } from '../xmlTypes';
import { getFirstId } from '../../getFirstId';

const diffResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <diffResult version="0.6" generator="openstreetmap-cgimap 2.0.1.2504041438 (3164272 faffy.openstreetmap.org)">
        <node old_id="-6" new_id="4359364811" new_version="1"/>
        <way old_id="-21" new_id="3333331" new_version="1"/>
        <way old_id="-22" new_id="3333332" new_version="1"/>
      </diffResult>
    `;

describe('getFirstId', () => {
  it('should return mapped ID for new node', async () => {
    const changes: EditDataItem[] = [{ shortId: 'n-6' } as EditDataItem];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstId(xml, changes);

    expect(osmId).toEqual({
      type: 'node',
      id: 4359364811,
    });
  });

  it('should return mapped ID for new way', async () => {
    const changes: EditDataItem[] = [{ shortId: 'w-22' } as EditDataItem];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstId(xml, changes);

    expect(osmId).toEqual({
      type: 'way',
      id: 3333332,
    });
  });

  it('should return the ID when first ID is positive', async () => {
    const changes: EditDataItem[] = [{ shortId: 'r23456' } as EditDataItem];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstId(xml, changes);

    expect(osmId).toEqual({
      type: 'relation',
      id: 23456,
    });
  });
});
