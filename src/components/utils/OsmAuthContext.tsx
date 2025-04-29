import React, { createContext, useContext, useState } from 'react';
import {
  loginAndfetchOsmUser,
  osmLogout,
  OsmUser,
} from '../../services/osm/auth/user';
import { useSnackbar } from './SnackbarContext';
import { OSM_USER_COOKIE } from '../../services/osm/consts';

type OsmAuthType = {
  loggedIn: boolean;
  osmUser: string;
  userImage: string;
  loading: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
};

const useOsmUserState = (cookies) => {
  const initialState = cookies[OSM_USER_COOKIE];
  return useState<OsmUser | undefined>(initialState);
};

export const OsmAuthContext = createContext<OsmAuthType>(undefined);

export const OsmAuthProvider = ({ children, cookies }) => {
  const [loading, setLoading] = useState(false);
  const [osmUser, setOsmUser] = useOsmUserState(cookies);

  const { showToast } = useSnackbar();

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
    showToast(`Logged in as ${user.name}`, 'success');
    setLoading(false);
  };

  const handleLogin = () => {
    setLoading(true);
    loginAndfetchOsmUser().then(successfulLogin);
  };
  const handleLogout = () => osmLogout().then(() => setOsmUser(undefined));

  const value: OsmAuthType = {
    loggedIn: !!osmUser,
    osmUser: osmUser?.name || '', // TODO rename
    userImage: osmUser?.imageUrl || '',
    loading,
    handleLogin,
    handleLogout,
  };

  return (
    <OsmAuthContext.Provider value={value}>{children}</OsmAuthContext.Provider>
  );
};

export const useOsmAuthContext = () => useContext(OsmAuthContext);
