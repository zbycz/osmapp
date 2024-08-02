import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import { GradeSystem } from '../FeaturePanel/Climbing/utils/grades/gradeData';

type UserSettingsType = {
  'climbing.gradeSystem': GradeSystem;
};

type UserSettingsContextType = {
  userSettings: UserSettingsType;
  setUserSettings: (userSettings: UserSettingsType) => void;
  setUserSetting: (key: string, value: string) => void;
};

const initialUserSettings: UserSettingsType = {
  'climbing.gradeSystem': null,
};

export const UserSettingsContext =
  createContext<UserSettingsContextType>(undefined);

export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = usePersistedState<UserSettingsType>(
    'userSettings',
    initialUserSettings,
  );

  const setUserSetting = (key: string, value: string) => {
    setUserSettings({ ...userSettings, [key]: value });
  };

  const value = { userSettings, setUserSetting, setUserSettings };
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
