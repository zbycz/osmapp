import React, { createContext, useContext } from 'react';
import { usePersistedState } from '../usePersistedState';
import {
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../../services/tagging/climbing/gradeSystems';
import { TickStyle } from '../../FeaturePanel/Climbing/types';
import { isMobileDevice } from '../../helpers';
import {
  ClimbingFilter,
  ClimbingFilterSettings,
  getClimbingFilter,
} from './getClimbingFilter';
import { Setter } from '../../../types';

type CragViewLayout = 'vertical' | 'horizontal' | 'auto';

export type UserSettingsType = Partial<{
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
  'climbing.filter': ClimbingFilterSettings;
}>;

export type UserSettingsContextType = {
  userSettings: UserSettingsType;
  setUserSettings: Setter<UserSettingsType>;
  setUserSetting: <T extends keyof UserSettingsType>(
    key: T,
    value: UserSettingsType[T],
  ) => void;
  climbingFilter: ClimbingFilter;
};

const initialUserSettings: UserSettingsType = {
  // TODO remove initial settings and handle it as default in the usage code
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
};

export const UserSettingsContext =
  createContext<UserSettingsContextType>(undefined);

export const UserSettingsProvider: React.FC = ({ children }) => {
  const [userSettings, setUserSettings] = usePersistedState<UserSettingsType>(
    'userSettings',
    initialUserSettings,
  );

  const setUserSetting = <T extends keyof UserSettingsType>(
    key: T,
    value: UserSettingsType[T],
  ) => {
    setUserSettings({ ...userSettings, [key]: value });
  };

  const climbingFilter = getClimbingFilter(userSettings, setUserSetting);

  const value: UserSettingsContextType = {
    userSettings,
    setUserSetting,
    setUserSettings,
    climbingFilter,
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
