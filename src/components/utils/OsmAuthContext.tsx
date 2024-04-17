import React, { createContext, useContext, useState } from 'react';
import {
  fetchOsmUsername,
  getOsmUsername,
  osmLogout,
} from '../../services/osmApiAuth';
import { useMapStateContext } from './MapStateContext';

interface OsmAuthType {
  loggedIn: boolean;
  osmUser: string;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const OsmAuthContext = createContext<OsmAuthType>(undefined);

export const OsmAuthProvider = ({ children }) => {
  const mapStateContext = useMapStateContext();
  const [osmUser, setOsmUser] = useState<string>(getOsmUsername() ?? '');

  const successfulLogin = (username: string) => {
    setOsmUser(username);
    mapStateContext.showToast({
      content: `Logged in as ${username}`,
      type: 'success',
    });
  };

  const handleLogin = () => fetchOsmUsername().then(successfulLogin);
  const handleLogout = () => osmLogout().then(() => setOsmUser(''));

  const value = {
    loggedIn: !!osmUser,
    osmUser,
    handleLogin,
    handleLogout,
  };

  return (
    <OsmAuthContext.Provider value={value}>{children}</OsmAuthContext.Provider>
  );
};

export const useOsmAuthContext = () => useContext(OsmAuthContext);
