import React from 'react';
import { useFeatureEditData } from './FeatureEditSection/SingleFeatureEditContext';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FeatureRow } from './FeatureRow';
import { OsmId } from '../../../../services/types';
import { getApiId, getShortId } from '../../../../services/helpers';
import { fetchSchemaTranslations } from '../../../../services/tagging/translations';
import { fetchFeature } from '../../../../services/osmApi';
import { useEditContext } from '../EditContext';
import { t } from '../../../../services/intl';

export const MembersEditor = () => {
  const { members } = useFeatureEditData();
  const theme = useTheme();
  const { addFeature, items, setCurrent } = useEditContext();

  if (!members || members.length === 0) return null;

  const handleClick = async (shortId) => {
    const apiId: OsmId = getApiId(shortId);
    await fetchSchemaTranslations();
    const isNotInItems = !items.find((item) => item.shortId === shortId);
    const feature = await fetchFeature(apiId);
    if (isNotInItems) {
      addFeature(feature);
    }
    setCurrent(getShortId(feature.osmMeta));
  };

  return (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">
            {t('editdialog.members')} ({members.length})
          </Typography>
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
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
