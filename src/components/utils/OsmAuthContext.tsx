import React, { createContext, useContext, useState } from 'react';
import {
  loginAndfetchOsmUser,
  osmLogout,
  OsmUser,
} from '../../services/osmApiAuth';
import { useSnackbar } from './SnackbarContext';

interface OsmAuthType {
  loggedIn: boolean;
  osmUser: string;
  userImage: string;
  handleLogin: () => void;
  handleLogout: () => void;
}

const useOsmUserState = (cookies) => {
  const initialState = cookies.osmUserForSSR;
  return useState<OsmUser | undefined>(initialState);
};

export const OsmAuthContext = createContext<OsmAuthType>(undefined);

export const OsmAuthProvider = ({ children, cookies }) => {
  const { showToast } = useSnackbar();

  const [osmUser, setOsmUser] = useOsmUserState(cookies);

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
    showToast(`Logged in as ${user.name}`, 'success');
  };

  const handleLogin = () => loginAndfetchOsmUser().then(successfulLogin);
  const handleLogout = () => osmLogout().then(() => setOsmUser(undefined));

  const value = {
    loggedIn: !!osmUser,
    osmUser: osmUser?.name || '', // TODO rename
    userImage: osmUser?.imageUrl || '',
    handleLogin,
    handleLogout,
  };

  return (
    <OsmAuthContext.Provider value={value}>{children}</OsmAuthContext.Provider>
  );
};

export const useOsmAuthContext = () => useContext(OsmAuthContext);
