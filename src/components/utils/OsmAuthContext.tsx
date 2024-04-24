import React, { createContext, useContext, useState } from 'react';
import {
  loginAndfetchOsmUser,
  osmLogout,
  OsmUser,
} from '../../services/osmApiAuth';
import { useMapStateContext } from './MapStateContext';

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
  const mapStateContext = useMapStateContext();
  const [osmUser, setOsmUser] = useOsmUserState(cookies);

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
    mapStateContext.showToast({
      content: `Logged in as ${user.name}`,
      type: 'success',
    });
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
