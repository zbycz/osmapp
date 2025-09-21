import { DataItem } from '../../../context/types';
import { findInItems } from '../../../context/utils';
import { getOsmElement } from '../../../../../../services/osm/quickFetchFeature';
import { getApiId } from '../../../../../../services/helpers';
import { LonLat } from '../../../../../../services/types';
import { getGlobalMap } from '../../../../../../services/mapStorage';

const getParent = (items: DataItem[], shortId: string) =>
  items
    .filter((item) => item.shortId[0] === 'r')
    .find((item) => item.members?.some((member) => member.shortId === shortId));

const isNodeOrWay = ({ shortId }) => ['n', 'w'].includes(shortId[0]);

const getMapCenter = (): LonLat => getGlobalMap().getCenter().toArray();

const isExisting = (shortId: string) => !shortId.includes('-');

const getNodeOrWayPoint = async (shortId: string): Promise<LonLat> => {
  const element = await getOsmElement(getApiId(shortId));
  if (shortId[0] === 'n') {
    return [element.lon, element.lat];
  }

  if (shortId[0] === 'w') {
    if (element.nodes?.length > 0) {
      const firstNode = await getOsmElement({
        type: 'node',
        id: element.nodes[0],
      });
      return [firstNode.lon, firstNode.lat];
    }
  }

  return undefined;
};

const getPositionFromMembers = async (items: DataItem[], parent: DataItem) => {
  const membersBackwards = parent.members.filter(isNodeOrWay).toReversed();
  if (!membersBackwards.length) {
    return undefined;
  }

  for (const member of membersBackwards) {
    const item = findInItems(items, member.shortId);
    if (item?.nodeLonLat) {
      return item.nodeLonLat;
    }
    if (isExisting(member.shortId)) {
      return await getNodeOrWayPoint(member.shortId);
    }
  }
};

const getNextNodePosition = async (items: DataItem[], shortId: string) => {
  const parent = getParent(items, shortId);
  if (!parent) {
    return undefined;
  }

  const location = await getPositionFromMembers(items, parent);
  const moved = location?.map((x) => x + 0.00005) as LonLat; // +- 5m

  return moved ?? parent.relationClickedLonLat; // may be also undefined
};

export const getTmpNodePosition = async (items: DataItem[], shortId: string) =>
  (await getNextNodePosition(items, shortId)) ?? getMapCenter();

// TODO test cases:
// convertedRelation empty - returns clicked...
// convertedRelation first node without lonLat - returns click
// convertedRelation first node with lonLat - returns it
// existing relation with existing node + new node
// existing relation with existing way + new node
