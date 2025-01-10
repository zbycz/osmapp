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

export const MembersEditor = () => {
  const { members } = useFeatureEditData();
  const theme = useTheme();
  const handleClick = useGetHandleClick();

  if (!members || members.length === 0) return null;

  return (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">{t('editdialog.members')}</Typography>
          <Chip size="small" label={members.length} />
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
          {members.map((member) => {
            return (
              <FeatureRow
                key={member.shortId}
                shortId={member.shortId}
                label={member.label}
                onClick={() => handleClick(member.shortId)}
              />
            );
          })}

          <AddMemberForm />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
