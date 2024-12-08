import React from 'react';
import { useFeatureEditData } from './FeatureEditSection/SingleFeatureEditContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchFeature } from '../../../../services/osmApi';
import { OsmId } from '../../../../services/types';
import { getApiId, getShortId } from '../../../../services/helpers';
import { fetchSchemaTranslations } from '../../../../services/tagging/translations';
import { useEditContext } from '../EditContext';

export const MemberRow = ({ member }) => {
  const { addFeature, setCurrent } = useEditContext();
  const { label, shortId } = member;

  const handleClick = async () => {
    const apiId: OsmId = getApiId(member.shortId);
    await fetchSchemaTranslations();
    const feature = await fetchFeature(apiId);
    addFeature(feature);
    setCurrent(getShortId(feature.osmMeta));
  };

  return (
    <>
      <ListItem onClick={handleClick}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          width="100%"
        >
          <ListItemText>{label ?? shortId}</ListItemText>
          <ChevronRightIcon />
        </Stack>
      </ListItem>
      <Divider />
    </>
  );
};

export const MembersEditor = () => {
  const { members } = useFeatureEditData();
  const theme = useTheme();

  if (!members || members.length === 0) return null;

  return (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">Members ({members.length})</Typography>
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
          {members.map((member) => (
            <MemberRow key={member.shortId} member={member} />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
