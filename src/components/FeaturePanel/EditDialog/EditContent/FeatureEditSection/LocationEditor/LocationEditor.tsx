import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t, Translation } from '../../../../../../services/intl';
import { useCurrentItem } from '../CurrentContext';
import { getApiId } from '../../../../../../services/helpers';
import { fetchWays } from '../../../../../../services/osm/fetchWays';
import { OsmId } from '../../../../../../services/types';

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
  const [isNodeWithoutWay, setIsNodeWithoutWay] = useState(false);

  useEffect(() => {
    if (osmId.type === 'node') {
      // this is already cached from ParentsEditor
      fetchWays(osmId).then((waysOfNodes) =>
        setIsNodeWithoutWay(waysOfNodes.length === 0),
      );
    }
  }, [osmId]);

  return isNodeWithoutWay;
};

export const LocationEditor = () => {
  const [expanded, setExpanded] = useState(false);
  const { shortId } = useCurrentItem();
  const osmId = getApiId(shortId);
  const isNodeWithoutWay = useNodeWithoutWayCheck(osmId);

  if (osmId.type === 'relation') {
    return null;
  }

  let content = null;
  if (expanded) {
    if (osmId.type === 'node') {
      content = isNodeWithoutWay ? <EditFeatureMapDynamic /> : <WayWarning />;
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
        <Typography variant="button">{t('editdialog.location')}</Typography>
      </AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
};
