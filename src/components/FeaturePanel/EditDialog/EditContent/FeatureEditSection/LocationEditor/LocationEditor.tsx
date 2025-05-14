import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t, Translation } from '../../../../../../services/intl';
import { getApiId } from '../../../../../../services/helpers';
import { fetchWays } from '../../../../../../services/osm/fetchWays';
import { OsmId } from '../../../../../../services/types';
import PlaceIcon from '@mui/icons-material/Place';
import { useCurrentItem } from '../../../EditContext';

const EditFeatureMapDynamic = dynamic(() => import('./EditFeatureMap'), {
  ssr: false,
  loading: () => <div style={{ height: 500 }} />,
});

const WayWarning = () => {
  const { shortId } = useCurrentItem();
  const osmId = getApiId(shortId);
  const link = `https://www.openstreetmap.org/edit?${osmId.type}=${osmId.id}`;

  return (
    <Translation
      id="editdialog.location_editor_to_be_added"
      values={{ link }}
    />
  );
};

const useNodeWithoutWayCheck = (osmId: OsmId) => {
  const isNew = osmId.id < 0;
  const [isNodeWithoutWay, setIsNodeWithoutWay] = useState(false);

  useEffect(() => {
    if (osmId.type === 'node' && !isNew) {
      // this is already cached from ParentsEditor
      fetchWays(osmId).then((waysOfNodes) =>
        setIsNodeWithoutWay(waysOfNodes.length === 0),
      );
    }
  }, [isNew, osmId]);

  return isNew || isNodeWithoutWay;
};

export const LocationEditor = () => {
  const [expanded, setExpanded] = useState(false);
  const { shortId } = useCurrentItem();
  const osmId = getApiId(shortId);
  const isNodeWithoutWay = useNodeWithoutWayCheck(osmId);
  const [mapStyle, setMapStyle] = useState<'outdoor' | 'satellite'>('outdoor');

  if (osmId.type === 'relation') {
    return null;
  }

  let content = null;
  if (expanded) {
    if (osmId.type === 'node') {
      content = isNodeWithoutWay ? (
        <EditFeatureMapDynamic mapStyle={mapStyle} setMapStyle={setMapStyle} />
      ) : (
        <WayWarning />
      );
    }
    if (osmId.type === 'way') {
      content = <WayWarning />;
    }
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" gap={1} alignItems="center">
          <PlaceIcon />
          <Typography variant="button">{t('editdialog.location')}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
};
