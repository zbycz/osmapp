import React from 'react';
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
import { FeatureRow } from './FeatureRow';
import { t } from '../../../../services/intl';
import { useGetHandleClick } from './helpers';
import { AddMemberForm } from './AddMemberForm';
import { useEditContext } from '../EditContext';

export const MembersEditor = () => {
  const { members, tags, nodeLonLat } = useFeatureEditData();
  const { current } = useEditContext();
  const theme = useTheme();
  const handleClick = useGetHandleClick();

  const AccordionComponent = ({
    children,
    membersLength,
  }: {
    children: React.ReactNode;
    membersLength?: number;
  }) => (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">{t('editdialog.members')}</Typography>
          {membersLength && <Chip size="small" label={membersLength} />}
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
          {children}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  const isClimbingCrag = tags.climbing === 'crag';
  const selectedPresetKey = isClimbingCrag
    ? 'climbing/route_bottom'
    : undefined;
  const hasNoMembers = !members || members.length === 0;

  if (!isClimbingCrag && hasNoMembers) return null;

  return (
    <AccordionComponent membersLength={members?.length}>
      {members?.map((member) => {
        return (
          <FeatureRow
            key={member.shortId}
            shortId={member.shortId}
            label={member.label}
            onClick={(e) => handleClick(e, member.shortId)}
          />
        );
      })}
      {isClimbingCrag && hasNoMembers ? (
        <AddMemberForm
          newLonLat={nodeLonLat}
          selectedPresetKey={selectedPresetKey}
        />
      ) : (
        <AddMemberForm selectedPresetKey={selectedPresetKey} />
      )}
    </AccordionComponent>
  );
};
