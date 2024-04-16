import React, { createContext, useContext, useState } from 'react';
import {
  loginAndGetOsmUser,
  getOsmUser,
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

export const OsmAuthContext = createContext<OsmAuthType>(undefined);

export const OsmAuthProvider = ({ children }) => {
  const mapStateContext = useMapStateContext();
  const [osmUser, setOsmUser] = useState<OsmUser | undefined>(getOsmUser());

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
    mapStateContext.showToast({
      content: `Logged in as ${user.name}`,
      type: 'success',
    });
  };

  const handleLogin = () => loginAndGetOsmUser().then(successfulLogin);
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
