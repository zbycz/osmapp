import { EditDataItem } from '../../../../components/FeaturePanel/EditDialog/useEditItems';
import { parseToXmljs } from '../xmlHelpers';
import { DiffResultXmljs } from '../xmlTypes';
import { getFirstExistingId } from '../../getFirstExistingId';

const diffResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <diffResult version="0.6" generator="openstreetmap-cgimap 2.0.1.2504041438 (3164272 faffy.openstreetmap.org)">
        <node old_id="-5" new_id="55555" new_version="1"/>
        <way old_id="-21" new_id="3333331" new_version="1"/>
        <way old_id="-22" new_id="3333332" new_version="1"/>
      </diffResult>
    `;

describe('getFirstExistingId', () => {
  it('should return mapped ID for new node', async () => {
    const changes: EditDataItem[] = [{ shortId: 'n-5' } as EditDataItem];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstExistingId(xml, changes);

    expect(osmId).toEqual({
      type: 'node',
      id: 55555,
    });
  });

  it('should return mapped ID for new way', async () => {
    const changes: EditDataItem[] = [{ shortId: 'w-22' } as EditDataItem];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstExistingId(xml, changes);

    expect(osmId).toEqual({
      type: 'way',
      id: 3333332,
    });
  });

  it('should return the ID when first ID is positive', async () => {
    const changes: EditDataItem[] = [{ shortId: 'r23456' } as EditDataItem];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstExistingId(xml, changes);

    expect(osmId).toEqual({
      type: 'relation',
      id: 23456,
    });
  });

  it('should return next ID when first ID is missing', async () => {
    const changes: EditDataItem[] = [
      { shortId: 'r-888888' } as EditDataItem,
      { shortId: 'n-999999' } as EditDataItem,
      { shortId: 'n-5' } as EditDataItem,
    ];

    const xml = await parseToXmljs<DiffResultXmljs>(diffResponse);
    const osmId = getFirstExistingId(xml, changes);

    expect(osmId).toEqual({
      type: 'node',
      id: 55555,
    });
  });
});
