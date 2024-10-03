import { useFeatureContext } from '../../../utils/FeatureContext';
import { Feature } from '../../../../services/types';
import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { t } from '../../../../services/intl';
import { getUrlOsmId } from '../../../../services/helpers';
import { Stops } from './Stops';

export const PublicTransportRoute = () => {
  const { feature } = useFeatureContext();

  if (!feature.memberFeatures) return null;
  if (!feature.members) return null;

  const stopIds = feature.members
    .filter(({ role }) => role === 'stop')
    .map(({ ref, type }) => getUrlOsmId({ id: ref, type }));
  const stops = feature.memberFeatures.filter(({ osmMeta }) =>
    stopIds.includes(getUrlOsmId(osmMeta)),
  );

  if (stops.length === 0) {
    return null;
  }

  return <StopList stops={stops} />;
};

const StopList = ({ stops }: { stops: Feature[] }) => {
  const [minimized, setMinimized] = React.useState(stops.length > 7);
  const getStops = React.useCallback(() => {
    if (minimized) {
      return [stops[0], 'hidden' as const, stops[stops.length - 1]];
    }
    return stops;
  }, [minimized, stops]);
  const [renderedStops, setRenderedStops] = React.useState(getStops());

  React.useEffect(() => {
    setRenderedStops(getStops());
  }, [minimized, getStops]);

  return (
    <>
      <h3>{t('publictransport.route')}</h3>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={!minimized}
              onChange={() => {
                setMinimized((b) => !b);
              }}
            />
          }
          label={t('publictransport.show_complete_route')}
          labelPlacement="start"
        />
      </div>
      <Stops
        stops={renderedStops}
        stopCount={stops.length}
        onExpand={() => {
          setMinimized(false);
        }}
      />
    </>
  );
};
