import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { t, Translation } from '../../../../../../services/intl';
import { getApiId } from '../../../../../../services/helpers';
import { fetchWays } from '../../../../../../services/osm/fetchWays';
import { OsmId } from '../../../../../../services/types';
import PlaceIcon from '@mui/icons-material/Place';
import {
  useCurrentItem,
  useExpandedSections,
} from '../../../context/EditContext';

const EditFeatureMapDynamic = dynamic(() => import('./EditFeatureMap'), {
  ssr: false,
  loading: () => <div style={{ height: 500 }} />,
});

const NotYetEditableWarning = () => {
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

const useNodeEditableCheck = (osmId: OsmId) => {
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

const Content = () => {
  const { shortId } = useCurrentItem();
  const osmId = getApiId(shortId);
  const isNodeEditable = useNodeEditableCheck(osmId);
  const [mapStyle, setMapStyle] = useState<'outdoor' | 'satellite'>('outdoor');

  if (osmId.type === 'way') {
    return <NotYetEditableWarning />;
  }
  if (osmId.type !== 'node') {
    return null;
  }
  if (!isNodeEditable) {
    return <NotYetEditableWarning />;
  }
  return (
    <EditFeatureMapDynamic mapStyle={mapStyle} setMapStyle={setMapStyle} />
  );
};

export const LocationEditor = () => {
  const { expanded, toggleExpanded } = useExpandedSections('location');
  const { shortId } = useCurrentItem();
  const osmId = getApiId(shortId);

  if (osmId.type === 'relation') {
    return null;
  }

  return (
    <>
      <Divider />
      <Accordion // TODO replace Accordion with custom collapse component, it is not accordion anymore :)
        disableGutters
        elevation={0}
        square
        expanded={expanded}
        onChange={toggleExpanded}
        slotProps={{ transition: { timeout: 0 } }}
        sx={{
          '&.MuiAccordion-root:before': {
            opacity: 0,
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" gap={1} alignItems="center">
            <PlaceIcon />
            <Typography variant="button">{t('editdialog.location')}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>{expanded && <Content />}</AccordionDetails>
      </Accordion>
    </>
  );
};
