import React, { createContext, useContext, useState } from 'react';
import {
  fetchOsmUsername,
  getOsmUsername,
  osmLogout,
} from '../../services/osmApiAuth';

interface OsmAuthType {
  loggedIn: boolean;
  osmUser: string;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const OsmAuthContext = createContext<OsmAuthType>(undefined);

export const OsmAuthProvider = ({ children }) => {
  const [osmUser, setOsmUser] = useState<string>(getOsmUsername() ?? '');
  const handleLogin = () => fetchOsmUsername().then(setOsmUser);
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
