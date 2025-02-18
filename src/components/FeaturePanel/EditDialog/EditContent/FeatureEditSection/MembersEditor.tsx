import React from 'react';
import { useCurrentItem } from './CurrentContext';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Icon,
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
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { CragIcon } from '../../../Climbing/CragIcon';

export const MembersEditor = () => {
  const { members, tags, nodeLonLat } = useCurrentItem();
  const theme = useTheme();
  const isClimbingCrag = tags.climbing === 'crag';
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleClick = useGetHandleClick({ setIsExpanded });

  const SectionName = () => {
    const isClimbingArea = tags.climbing === 'area';

    if (isClimbingArea) {
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
    if (isClimbingCrag) {
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
          <SectionName />
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
