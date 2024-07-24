import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { PanelLabel } from '../FeaturePanel/Climbing/PanelLabel';
import { GradeSystemSelect } from '../FeaturePanel/Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../utils/UserSettingsContext';

export const UserSettingsDialog = ({ onClose, isOpened }) => {
  const { setUserSetting, userSettings } = useUserSettingsContext();

  return (
    <Dialog onClose={onClose} open={isOpened} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>

      <ClosePanelButton right onClick={onClose} />
      <DialogContent>
        <PanelLabel>Climbing</PanelLabel>
        <List>
          <ListItem>
            <ListItemText>Default grade system</ListItemText>
            <GradeSystemSelect
              setGradeSystem={(gradeSystem) => {
                setUserSetting('climbing.gradeSystem', gradeSystem);
              }}
              selectedGradeSystem={userSettings['climbing.gradeSystem']}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};
