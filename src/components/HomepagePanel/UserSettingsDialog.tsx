import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import React from 'react';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { PanelLabel } from '../FeaturePanel/Climbing/PanelLabel';
import { GradeSystemSelect } from '../FeaturePanel/Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { TickStyleSelect } from '../FeaturePanel/Climbing/Ticks/TickStyleSelect';
import { t } from '../../services/intl';

type Props = {
  onClose: (event: unknown) => void;
  isOpened: boolean;
};

export const UserSettingsDialog = ({ onClose, isOpened }: Props) => {
  const { setUserSetting, userSettings } = useUserSettingsContext();

  return (
    <Dialog onClose={onClose} open={isOpened} maxWidth="sm" fullWidth>
      <DialogTitle>{t('user.user_settings')}</DialogTitle>

      <ClosePanelButton right onClick={onClose} />
      <DialogContent>
        <PanelLabel>{t('user_settings.general')}</PanelLabel>
        <List>
          <ListItem>
            <ListItemText>
              {t('user_settings.show_weather_widget')}
            </ListItemText>
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
        <PanelLabel>{t('user_settings.climbing')}</PanelLabel>
        <List>
          <ListItem>
            <ListItemText>
              {t('user_settings.default_grade_system')}
            </ListItemText>
            <GradeSystemSelect
              setGradeSystem={(gradeSystem) => {
                setUserSetting('climbing.gradeSystem', gradeSystem);
              }}
              selectedGradeSystem={userSettings['climbing.gradeSystem']}
            />
          </ListItem>
          <ListItem>
            <ListItemText>
              {t('user_settings.show_grades_in_pictures')}
            </ListItemText>
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
            <ListItemText>
              {t('user_settings.default_climbing_style')}
            </ListItemText>
            <TickStyleSelect
              value={userSettings['climbing.defaultClimbingStyle']}
              onChange={(e) => {
                setUserSetting('climbing.defaultClimbingStyle', e.target.value);
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemText>
              {t('user_settings.select_climbing_routes_by_scrolling')}
            </ListItemText>
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
          <ListItem>
            <ListItemText>{t('user_settings.crag_view_layout')}</ListItemText>
            <Select
              value={userSettings['climbing.cragViewLayout']}
              onChange={(event: any) => {
                setUserSetting('climbing.cragViewLayout', event.target.value);
              }}
              size="small"
            >
              <MenuItem value="vertical">
                {t('user_settings.crag_view_layout_vertical')}
              </MenuItem>
              <MenuItem value="horizontal">
                {t('user_settings.crag_view_layout_horizontal')}
              </MenuItem>
              <MenuItem value="auto">
                {t('user_settings.crag_view_layout_auto')}
              </MenuItem>
            </Select>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};
