import { useToggleState } from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { PanelFooterWrapper, PanelSidePadding } from '../utils/PanelHelpers';
import { FeatureDescription, FromOsm } from './FeatureDescription';
import Coordinates from './Coordinates';
import { t } from '../../services/intl';
import { ObjectsAround } from './ObjectsAround';
import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Setter } from '../../types';

type Props = {
  advanced: boolean;
  setAdvanced: Setter<boolean>;
  toggleShowTags: () => void;
  showTagsTable: boolean;
};
export const FeaturePanelFooter = ({
  advanced,
  setAdvanced,
  showTagsTable,
  toggleShowTags,
}: Props) => {
  const [showAround, toggleShowAround] = useToggleState(false);
  const { feature } = useFeatureContext();
  const { point, skeleton, deleted } = feature;

  const onClick = (e: React.MouseEvent) => {
    // Alt+Shift+click to enable FeaturePanel advanced mode
    if (e.shiftKey && e.altKey) {
      setAdvanced((v) => !v);
    }
  };

  return (
    <Accordion disableGutters elevation={0} square onClick={onClick}>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography variant="caption">
          <FeatureDescription />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <PanelFooterWrapper>
          <PanelSidePadding>
            {feature.point ? null : <FromOsm />}
            <Box mt={3} mb={1}>
              <Typography color="secondary">
                <label>
                  <input
                    type="checkbox"
                    onChange={toggleShowTags}
                    checked={showTagsTable}
                    disabled={
                      point || deleted || (!skeleton && !feature.schema)
                    }
                  />{' '}
                  {t('featurepanel.show_tags')}
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    onChange={toggleShowAround}
                    checked={showAround}
                  />{' '}
                  {t('featurepanel.show_objects_around')}
                </label>
                {showAround && <ObjectsAround advanced={advanced} />}
              </Typography>
            </Box>
            <Coordinates />
          </PanelSidePadding>
        </PanelFooterWrapper>
      </AccordionDetails>
    </Accordion>
  );
};
