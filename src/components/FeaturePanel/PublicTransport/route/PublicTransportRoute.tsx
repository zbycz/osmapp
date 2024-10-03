import Link from 'next/link';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { StationItem, StationsList } from './helpers';
import { Feature, OsmId } from '../../../../services/types';

const getUrl = (osmMeta: OsmId) => `${osmMeta.type}/${osmMeta.id}`;

export const PublicTransportRoute = () => {
  const { feature } = useFeatureContext();

  if (!feature.memberFeatures) return null;
  if (!feature.members) return null;

  const stopIds = feature.members
    .filter(({ role }) => role === 'stop')
    .map(({ ref, type }) => getUrl({ id: ref, type }));
  const stops = feature.memberFeatures.filter(({ osmMeta }) =>
    stopIds.includes(getUrl(osmMeta)),
  );

  if (stops.length === 0) {
    return null;
  }

  return <StopList stops={stops} />;
};

const StopList = ({ stops }: { stops: Feature[] }) => {
  return (
    <StationsList>
      {stops.map((stop, i) => (
        <StationItem
          key={getUrl(stop.osmMeta)}
          isFirst={i === 0}
          isLast={i === stops.length - 1}
          stop={stop}
        />
      ))}
    </StationsList>
  );
};
