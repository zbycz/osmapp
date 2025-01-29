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
import { useEditContext } from '../EditContext';
import {
  isClimbingRoute,
  isClimbingRoute as getIsClimbingRoute,
} from '../../../../utils';

export const ParentsEditor = () => {
  const { current } = useEditContext();
  const { tags } = useFeatureEditData();
  const [parents, setParents] = useState([]);
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = useGetHandleClick({ setIsExpanded });

  const getSectionName = () => {
    const isClimbingCrag = tags.climbing === 'crag';
    const isClimbingRoute = getIsClimbingRoute(tags);
    if (isClimbingCrag) {
      return t('editdialog.climbing_areas');
    }
    if (isClimbingRoute) {
      return t('editdialog.climbing_crags');
    }
    return t('editdialog.parents');
  };

  useEffect(() => {
    (async () => {
      setParents([]);
      if (getApiId(current).id < 0) {
        return;
      }
      const [parentFeatures, waysFeatures] = await Promise.all([
        fetchParentFeatures(getApiId(current)),
        fetchNodesWaysFeatures(getApiId(current)),
      ]);
      setParents([...parentFeatures, ...waysFeatures]);
    })();
  }, [current]);

  if (!parents || parents.length === 0) return null;

  return (
    <Accordion disableGutters elevation={0} square expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">{getSectionName()}</Typography>
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
                onClick={(e) => {
                  setIsExpanded(false);
                  handleClick(e, shortId);
                }}
              />
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
