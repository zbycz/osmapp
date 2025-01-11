import React, { useEffect, useState } from 'react';
import { useFeatureEditData } from './FeatureEditSection/SingleFeatureEditContext';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchParentFeatures } from '../../../../services/osm/fetchParentFeatures';
import { getApiId, getShortId } from '../../../../services/helpers';
import { FeatureRow } from './FeatureRow';
import { t } from '../../../../services/intl';
import { useGetHandleClick } from './helpers';
import { fetchNodesWaysFeatures } from '../../../../services/osm/fetchNodesWaysFeatures';

export const ParentsEditor = () => {
  const { shortId } = useFeatureEditData();
  const [parents, setParents] = useState([]);
  const theme = useTheme();
  const handleClick = useGetHandleClick();

  useEffect(() => {
    (async () => {
      setParents([]);
      if (getApiId(shortId).id < 0) {
        return;
      }

      const [parentFeatures, waysFeatures] = await Promise.all([
        fetchParentFeatures(getApiId(shortId)),
        fetchNodesWaysFeatures(getApiId(shortId)),
      ]);
      setParents([...parentFeatures, ...waysFeatures]);
    })();
  }, [shortId]);

  if (!parents || parents.length === 0) return null;

  return (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">{t('editdialog.parents')}</Typography>
          <Chip size="small" label={parents.length} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <List
          sx={{
            '& > .MuiListItem-root:hover': {
              backgroundColor: theme.palette.background.hover,
              cursor: 'pointer',
            },
          }}
        >
          {parents.map((parent) => {
            const shortId = getShortId(parent.osmMeta);
            return (
              <FeatureRow
                key={shortId}
                shortId={shortId}
                label={parent.tags.name}
                onClick={() => handleClick(shortId)}
              />
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
