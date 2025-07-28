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
import { useUserSettingsContext } from '../utils/userSettings/UserSettingsContext';
import { TickStyleSelect } from '../FeaturePanel/Climbing/Ticks/TickStyleSelect';
import { t } from '../../services/intl';

type Props = {
  onClose: (event: unknown) => void;
  isOpened: boolean;
};

// TODO refactor this - extract member functions
// eslint-disable-next-line max-lines-per-function
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
          <ListItem>
            <ListItemText>{t('user_settings.is_imperial')}</ListItemText>
            <Switch
              color="primary"
              edge="end"
              onChange={(e) => {
                setUserSetting('isImperial', e.target.checked);
              }}
              checked={userSettings.isImperial}
            />
          </ListItem>
        </List>
        <PanelLabel>{t('user_settings.climbing')}</PanelLabel>
        <List>
          <ListItem>
            <ListItemText>
              {t('user_settings.default_grade_system')}
            </ListItemText>
            <GradeSystemSelect />
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

          {userSettings['climbing.selectRoutesByScrolling'] && (
            <ListItem sx={{ paddingLeft: 4 }}>
              <ListItemText>
                {t('user_settings.switch_climbing_photos_by_scrolling')}
              </ListItemText>
              <Switch
                color="primary"
                edge="end"
                onChange={(e) => {
                  setUserSetting(
                    'climbing.switchPhotosByScrolling',
                    e.target.checked,
                  );
                }}
                checked={userSettings['climbing.switchPhotosByScrolling']}
              />
            </ListItem>
          )}

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
