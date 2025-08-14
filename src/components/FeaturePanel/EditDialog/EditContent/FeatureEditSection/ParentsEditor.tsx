import React, { useEffect, useState } from 'react';
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
import { useCurrentItem, useEditContext } from '../../EditContext';
import { isClimbingRoute as getIsClimbingRoute } from '../../../../../utils';
import { AreaIcon } from '../../../Climbing/AreaIcon';
import { CragIcon } from '../../../Climbing/CragIcon';
import {
  useHandleItemClick,
  useHandleOpenAllParents,
} from '../useHandleItemClick';
import { Feature } from '../../../../../services/types';
import { OpenAllButton } from './helpers';

const SectionName = () => {
  const theme = useTheme();
  const { tags } = useCurrentItem();

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

const useGetParents = () => {
  const { current } = useEditContext();
  const [parents, setParents] = useState<Feature[]>([]);

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
  return parents;
};

const getLabel = (parent: Feature) => {
  const shortId = getShortId(parent.osmMeta);
  return parent.tags?.name || parent.schema?.label || shortId;
};

export const ParentsEditor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = useHandleItemClick(setIsExpanded);
  const parents = useGetParents();
  const handleOpenAll = useHandleOpenAllParents(parents);

  if (!parents || parents.length === 0) {
    return null;
  }

  return (
    <Accordion disableGutters elevation={0} square expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">
            <SectionName />
          </Typography>
          <Chip size="small" label={parents.length} variant="outlined" />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {parents.map((parent) => {
            const shortId = getShortId(parent.osmMeta);
            return (
              <FeatureRow
                key={shortId}
                shortId={shortId}
                label={getLabel(parent)}
                onClick={(e) => handleClick(e, shortId)}
              />
            );
          })}

          {parents.length > 1 && (
            <Stack alignItems="end">
              <OpenAllButton onClick={handleOpenAll} />
            </Stack>
          )}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
