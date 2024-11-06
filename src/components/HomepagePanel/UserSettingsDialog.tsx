import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Switch,
} from '@mui/material';
import React from 'react';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { PanelLabel } from '../FeaturePanel/Climbing/PanelLabel';
import { GradeSystemSelect } from '../FeaturePanel/Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { TickStyleSelect } from '../FeaturePanel/Climbing/Ticks/TickStyleSelect';

type Props = {
  onClose: (event: unknown) => void;
  isOpened: boolean;
};

export const UserSettingsDialog = ({ onClose, isOpened }: Props) => {
  const { setUserSetting, userSettings } = useUserSettingsContext();

  return (
    <Dialog onClose={onClose} open={isOpened} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>

      <ClosePanelButton right onClick={onClose} />
      <DialogContent>
        <PanelLabel>General</PanelLabel>
        <List>
          <ListItem>
            <ListItemText>Show the weather widget</ListItemText>
            <Switch
              color="primary"
              edge="end"
              onChange={(e) => {
                setUserSetting('weather.enabled', e.target.checked);
              }}
              checked={userSettings['weather.enabled']}
            />
          </ListItem>
        </List>
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
          <ListItem>
            <ListItemText>Show grades in pictures</ListItemText>
            <Switch
              color="primary"
              edge="end"
              onChange={(e) => {
                setUserSetting(
                  'climbing.isGradesOnPhotosVisible',
                  e.target.checked,
                );
              }}
              checked={userSettings['climbing.isGradesOnPhotosVisible']}
            />
          </ListItem>

          <ListItem>
            <ListItemText>Default climbing style</ListItemText>
            <TickStyleSelect
              value={userSettings['climbing.defaultClimbingStyle']}
              onChange={(e) => {
                setUserSetting('climbing.defaultClimbingStyle', e.target.value);
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText>Select climbing routes by scrolling</ListItemText>
            <Switch
              color="primary"
              edge="end"
              onChange={(e) => {
                setUserSetting(
                  'climbing.selectRoutesByScrolling',
                  e.target.checked,
                );
              }}
              checked={userSettings['climbing.selectRoutesByScrolling']}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};
