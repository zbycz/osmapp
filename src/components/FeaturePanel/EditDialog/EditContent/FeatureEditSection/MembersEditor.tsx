import React from 'react';
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
import { FeatureRow } from '../FeatureRow';
import { t } from '../../../../../services/intl';
import { useGetHandleClick } from '../helpers';
import { AddMemberForm } from './AddMemberForm';

export const MembersEditor = () => {
  const { members, tags, nodeLonLat } = useCurrentItem();
  const theme = useTheme();
  const isClimbingCrag = tags.climbing === 'crag';
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = useGetHandleClick({ setIsExpanded });

  const getSectionName = () => {
    const isClimbingArea = tags.climbing === 'area';
    if (isClimbingArea) {
      return t('editdialog.climbing_crags');
    }
    if (isClimbingCrag) {
      return t('editdialog.climbing_routes');
    }
    return t('editdialog.members');
  };

  const AccordionComponent = ({
    children,
    membersLength,
  }: {
    children: React.ReactNode;
    membersLength?: number;
  }) => (
    <Accordion disableGutters elevation={0} square expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">{getSectionName()}</Typography>
          {membersLength && (
            <Chip size="small" label={membersLength} variant="outlined" />
          )}
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
            onClick={(e) => {
              handleClick(e, member.shortId);
            }}
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
