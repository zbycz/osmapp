import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import { GradeSystem } from '../FeaturePanel/Climbing/utils/grades/gradeData';
import { TickStyle } from '../FeaturePanel/Climbing/types';
import { isMobileDevice } from '../helpers';

type UserSettingsType = {
  isImperial: boolean;
  'weather.enabled': boolean;
  'climbing.gradeSystem': GradeSystem;
  'climbing.isGradesOnPhotosVisible': boolean;
  'climbing.defaultClimbingStyle': TickStyle;
  'climbing.selectRoutesByScrolling': boolean;
};

type UserSettingsContextType = {
  userSettings: UserSettingsType;
  setUserSettings: (userSettings: UserSettingsType) => void;
  // TODO: Real generic typesafety
  setUserSetting: (key: string, value: string | number | boolean) => void;
};

const initialUserSettings: UserSettingsType = {
  isImperial: false,
  'weather.enabled': true,
  'climbing.gradeSystem': null,
  'climbing.isGradesOnPhotosVisible': true,
  'climbing.defaultClimbingStyle': 'OS',
  'climbing.selectRoutesByScrolling': isMobileDevice(),
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
