import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FeatureRow } from '../FeatureRow';
import { t, Translation } from '../../../../../services/intl';
import { AddMemberForm } from './AddMemberForm';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { CragIcon } from '../../../Climbing/CragIcon';
import { Setter } from '../../../../../types';
import {
  useHandleItemClick,
  useHandleOpenAllMembers,
} from '../useHandleItemClick';
import { ConvertNodeToRelation, isConvertible } from './ConvertNodeToRelation';
import { useCurrentItem } from '../../EditContext';
import { OpenAllButton } from './helpers';

const SectionName = () => {
  const theme = useTheme();
  const { tags } = useCurrentItem();

  if (tags.climbing === 'area') {
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
            ({t('editdialog.members')})
          </Typography>
        </Typography>
      </Stack>
    );
  }

  if (tags.climbing === 'crag') {
    return (
      <Stack direction="row" gap={1}>
        <ShowChartIcon />
        <Typography variant="button">
          {t('editdialog.climbing_routes')}{' '}
          <Typography variant="caption" color="secondary">
            ({t('editdialog.members')})
          </Typography>
        </Typography>
      </Stack>
    );
  }
  return <Typography variant="button">{t('editdialog.members')}</Typography>;
};

const CustomAccordion = ({
  children,
  membersLength,
  isExpanded,
  setIsExpanded,
}: {
  children: React.ReactNode;
  membersLength?: number;
  isExpanded?: boolean;
  setIsExpanded?: Setter<boolean>;
}) => (
  <>
    <Divider />
    <Accordion
      disableGutters
      elevation={0}
      square
      expanded={isExpanded}
      sx={{
        '&.MuiAccordion-root:before': {
          opacity: 1,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <SectionName />
          {membersLength ? (
            <Chip size="small" label={membersLength} variant="outlined" />
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <List disablePadding>{children}</List>
      </AccordionDetails>
    </Accordion>
  </>
);

export const MembersEditor = () => {
  const { shortId, members, tags } = useCurrentItem();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = useHandleItemClick(setIsExpanded);
  const convertible = isConvertible(shortId, tags);
  const handleOpenAll = useHandleOpenAllMembers();

  if (!members && !convertible) {
    return null;
  }

  return (
    <CustomAccordion
      membersLength={members?.length}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      {members?.map((member) => (
        <FeatureRow
          key={member.shortId}
          shortId={member.shortId}
          label={member.label}
          role={member.role}
          onClick={(e: React.MouseEvent) => handleClick(e, member.shortId)}
        />
      ))}

      <Stack direction="row" spacing={2} mt={1} ml={1}>
        {convertible ? <ConvertNodeToRelation /> : <AddMemberForm />}

        <Box sx={{ flex: '1' }} />

        {handleOpenAll && <OpenAllButton onClick={handleOpenAll} />}
      </Stack>
      {members?.length && tags.climbing && (
        <Typography variant="body2" color="textSecondary" ml={1}>
          <Translation id="editdialog.members_climbing_info" />
          {/* If we convert a natural=peak to crag relation, the peak stays as a member - this must be visible esp. for this scenario. */}
        </Typography>
      )}
    </CustomAccordion>
  );
};
