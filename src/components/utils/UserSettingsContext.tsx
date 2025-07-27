import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import {
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../services/tagging/climbing/gradeSystems';
import { TickStyle } from '../FeaturePanel/Climbing/types';
import { isMobileDevice } from '../helpers';
import { number } from 'prop-types';

type CragViewLayout = 'vertical' | 'horizontal' | 'auto';

type ClimbingFilter = {
  gradeInterval: [number, number] | null;
  minimumRoutesInInterval: number;
  isTouched: boolean;
};

type UserSettingsType = {
  isImperial: boolean;
  'weather.enabled': boolean;
  'climbing.gradeSystem': GradeSystem;
  'climbing.isGradesOnPhotosVisible': boolean;
  'climbing.defaultClimbingStyle': TickStyle;
  'climbing.selectRoutesByScrolling': boolean;
  'climbing.switchPhotosByScrolling': boolean;
  'climbing.visibleGradeSystems': Record<string, boolean>;
  'climbing.cragViewLayout': CragViewLayout;
  'climbing.splitPaneSize': null | number;
  'climbing.filter': ClimbingFilter;
};

type UserSettingsContextType = {
  userSettings: UserSettingsType;
  setUserSettings: (userSettings: UserSettingsType) => void;
  // TODO: Real generic typesafety
  setUserSetting: (key: string, value: any) => void;
};

const initialUserSettings: UserSettingsType = {
  isImperial: false,
  'weather.enabled': true,
  'climbing.gradeSystem': null,
  'climbing.isGradesOnPhotosVisible': true,
  'climbing.defaultClimbingStyle': 'OS',
  'climbing.selectRoutesByScrolling': isMobileDevice(),
  'climbing.switchPhotosByScrolling': true,
  'climbing.visibleGradeSystems': GRADE_SYSTEMS.filter(
    ({ minor }) => !minor,
  ).reduce((acc, { key }) => ({ ...acc, [key]: true }), {}),
  'climbing.cragViewLayout': 'auto',
  'climbing.splitPaneSize': null,
  'climbing.filter': {
    gradeInterval: null,
    minimumRoutesInInterval: 1,
    isTouched: false,
  },
};

export const UserSettingsContext =
  createContext<UserSettingsContextType>(undefined);

export const UserSettingsProvider: React.FC = ({ children }) => {
  const [userSettings, setUserSettings] = usePersistedState<UserSettingsType>(
    'userSettings',
    initialUserSettings,
  );

  const setUserSetting = (key: string, value: string) => {
    setUserSettings({ ...userSettings, [key]: value });
  };

  const value: UserSettingsContextType = {
    userSettings,
    setUserSetting,
    setUserSettings,
  };
  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettingsContext = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      'useUserSettingsContext must be used within a UserSettingsProvider',
    );
  }
  return context;
};
