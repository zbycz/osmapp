import React, { useEffect, useState } from 'react';
import { useCurrentItem } from './CurrentContext';
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
import { fetchParentFeatures } from '../../../../../services/osm/fetchParentFeatures';
import { getApiId, getShortId } from '../../../../../services/helpers';
import { FeatureRow } from '../FeatureRow';
import { t } from '../../../../../services/intl';
import { fetchWays } from '../../../../../services/osm/fetchWays';
import { useEditContext } from '../../EditContext';
import { isClimbingRoute as getIsClimbingRoute } from '../../../../../utils';
import { AreaIcon } from '../../../Climbing/AreaIcon';
import { CragIcon } from '../../../Climbing/CragIcon';
import { useHandleItemClick } from '../useHandleItemClick';

export const ParentsEditor = () => {
  const { current } = useEditContext();
  const { tags } = useCurrentItem();
  const [parents, setParents] = useState([]);
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = useHandleItemClick(setIsExpanded);

  const getSectionName = () => {
    const isClimbingCrag = tags.climbing === 'crag';
    const isClimbingRoute = getIsClimbingRoute(tags);
    if (isClimbingCrag) {
      return (
        <Stack direction="row" gap={1}>
          <AreaIcon
            fill={theme.palette.text.primary}
            stroke={theme.palette.text.primary}
            height={24}
            width={24}
          />
          <Typography variant="button">
            {t('editdialog.climbing_areas')}{' '}
            <Typography variant="caption" color="secondary">
              ({t('editdialog.parents')})
            </Typography>
          </Typography>
        </Stack>
      );
    }
    if (isClimbingRoute) {
      return (
        <Stack direction="row" gap={1}>
          <CragIcon
            fill={theme.palette.text.primary}
            stroke={theme.palette.text.primary}
            height={24}
            width={24}
          />
          <Typography variant="button">
            {t('editdialog.climbing_crags')}{' '}
            <Typography variant="caption" color="secondary">
              ({t('editdialog.parents')})
            </Typography>
          </Typography>
        </Stack>
      );
    }
    return <Typography variant="button">{t('editdialog.parents')}</Typography>;
  };

  useEffect(() => {
    (async () => {
      setParents([]);
      if (getApiId(current).id < 0) {
        return;
      }
      const [parentFeatures, waysFeatures] = await Promise.all([
        fetchParentFeatures(getApiId(current)),
        fetchWays(getApiId(current)),
      ]);
      setParents([...parentFeatures, ...waysFeatures]);
    })();
  }, [current]);

  if (!parents || parents.length === 0) return null;
  const sectionName = getSectionName();

  return (
    <Accordion disableGutters elevation={0} square expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">{sectionName}</Typography>
          <Chip size="small" label={parents.length} variant="outlined" />
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
