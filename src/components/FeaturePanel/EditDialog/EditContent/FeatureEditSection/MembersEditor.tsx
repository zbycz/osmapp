import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FeatureRow } from '../FeatureRow';
import { t } from '../../../../../services/intl';
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

const AccordionComponent = ({
  children,
  membersLength,
  isExpanded,
  setIsExpanded,
}: {
  children: React.ReactNode;
  membersLength?: number;
  isExpanded?: boolean;
  setIsExpanded?: Setter<boolean>;
}) => {
  return (
    <Accordion disableGutters elevation={0} square expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <SectionName />
          {membersLength ? (
            <Chip size="small" label={membersLength} variant="outlined" />
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <List>{children}</List>
      </AccordionDetails>
    </Accordion>
  );
};

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
    <AccordionComponent
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

      <Stack direction="row" spacing={2}>
        {convertible ? <ConvertNodeToRelation /> : <AddMemberForm />}

        <Box sx={{ flex: '1' }} />

        {members?.length > 1 && <OpenAllButton onClick={handleOpenAll} />}
      </Stack>
    </AccordionComponent>
  );
};
