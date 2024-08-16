import { Alert, Snackbar } from '@mui/material';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

type Severity = 'success' | 'info' | 'warning' | 'error' | undefined;
type SnackbarContextType = {
  showToast: (message: string, severity?: Severity) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  showToast: () => undefined,
});

export const useSnackbar = () => useContext(SnackbarContext);

// TODO maybe allow more messages ?
// TODO maybe similar code is already in Mui?  but useSnackbar is configuration only
export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>();

  const handleClose = (_event: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const value = useMemo(
    () =>
      ({
        showToast: (message: string, severity?: Severity) => {
          setMessage(message);
          setSeverity(severity);
          setOpen(true);
        },
      }) as SnackbarContextType,
    [],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
