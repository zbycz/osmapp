import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getShortId } from '../../../../../services/helpers';
import { FeatureRow } from '../FeatureRow';
import { t } from '../../../../../services/intl';
import { useCurrentItem, useExpandedSections } from '../../context/EditContext';
import { isClimbingRoute as getIsClimbingRoute } from '../../../../../utils';
import { AreaIcon } from '../../../Climbing/AreaIcon';
import { CragIcon } from '../../../Climbing/CragIcon';
import {
  useHandleItemClick,
  useHandleOpenAllParents,
} from '../useHandleItemClick';
import { Feature } from '../../../../../services/types';
import { OpenAllButton } from './helpers';
import { useGetParents } from './useGetParents';

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

const getLabel = (parent: Feature) => {
  const shortId = getShortId(parent.osmMeta);
  return parent.tags?.name || parent.schema?.label || shortId;
};

const CustomAccordion = ({
  children,
  parentsLength,
}: {
  children: React.ReactNode;
  parentsLength: number | undefined;
}) => {
  const { expanded, toggleExpanded } = useExpandedSections('parents');
  return (
    <>
      <Divider />
      <Accordion // TODO replace Accordion with custom collapse component, it is not accordion anymore :)
        disableGutters
        elevation={0}
        square
        expanded={expanded}
        slotProps={{ transition: { timeout: 0 } }}
        sx={{
          '&.MuiAccordion-root:before': {
            opacity: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-parents-header"
          onClick={toggleExpanded}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="button">
              <SectionName />
            </Typography>
            <Chip size="small" label={parentsLength} variant="outlined" />
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <List disablePadding>{children}</List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export const ParentsEditor = () => {
  const handleClick = useHandleItemClick();
  const parents = useGetParents();
  const handleOpenAll = useHandleOpenAllParents(parents);

  if (!parents || parents.length === 0) {
    return null;
  }

  return (
    <CustomAccordion parentsLength={parents?.length}>
      {parents.map((parent) => {
        const shortId = getShortId(parent.osmMeta);
        return (
          <FeatureRow
            key={shortId}
            shortId={shortId}
            originalLabel={getLabel(parent)}
            onClick={(e) => handleClick(e, shortId)}
          />
        );
      })}

      {parents.length > 1 && (
        <Stack alignItems="end">
          <OpenAllButton onClick={handleOpenAll} />
        </Stack>
      )}
    </CustomAccordion>
  );
};
