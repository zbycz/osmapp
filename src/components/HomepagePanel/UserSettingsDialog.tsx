import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { PanelLabel } from '../FeaturePanel/Climbing/PanelLabel';
import { GradeSystemSelect } from '../FeaturePanel/Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { TickStyleSelect } from '../FeaturePanel/Climbing/Ticks/TickStyleSelect';
import { useHistoryContext } from '../SearchBox/options/historyContext';
import { t } from '../../services/intl';

export const UserSettingsDialog = ({ onClose, isOpened }) => {
  const { setUserSetting, userSettings } = useUserSettingsContext();
  const { clearOptions: clearSearchHistory, options } = useHistoryContext();

  return (
    <Dialog onClose={onClose} open={isOpened} maxWidth="sm" fullWidth>
      <DialogTitle>{t('user.user_settings')}</DialogTitle>

      <ClosePanelButton right onClick={onClose} />
      <DialogContent>
        <PanelLabel>{t('user_settings.general')}</PanelLabel>
        <Button
          variant="outlined"
          disabled={options.length === 0}
          onClick={clearSearchHistory}
          startIcon={<DeleteIcon />}
        >
          {t('user_settings.delete_search_history')}
        </Button>

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
