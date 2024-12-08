import React, { useEffect, useState } from 'react';
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
import { fetchParentFeatures } from '../../../../services/osmApi';
import { getApiId, getShortId } from '../../../../services/helpers';
import { fetchSchemaTranslations } from '../../../../services/tagging/translations';
import { useEditContext } from '../EditContext';
import { FeatureRow } from './FeatureRow';
import { items } from '../../QuickActions/ShareDialog/items';
import { t } from '../../../../services/intl';

export const ParentsEditor = () => {
  const { shortId } = useFeatureEditData();
  const [parents, setParents] = useState([]);
  const theme = useTheme();
  const { addFeature, setCurrent, items } = useEditContext();

  useEffect(() => {
    const fetchParents = async () => {
      const data = await fetchParentFeatures(getApiId(shortId));

      setParents(data);
    };

    fetchParents();
  }, [shortId]);

  if (!parents || parents.length === 0) return null;

  return (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="button">
            {t('editdialog.parents')} ({parents.length})
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
          {parents.map((parent) => {
            const shortId = getShortId(parent.osmMeta);
            return (
              <FeatureRow
                key={shortId}
                shortId={shortId}
                label={parent.tags.name}
                onClick={() => {
                  const isNotInItems = !items.find(
                    (item) => item.shortId === shortId,
                  );
                  fetchSchemaTranslations();
                  if (isNotInItems) {
                    addFeature(parent);
                  }
                  setCurrent(shortId);
                }}
              />
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
