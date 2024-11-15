import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState, useMemo } from 'react';

type Severity = 'success' | 'info' | 'warning' | 'error' | undefined;
export type ShowToast = (message: string, severity?: Severity) => void;
export type SnackbarContextType = {
  showToast: ShowToast;
};

const SnackbarContext = createContext<SnackbarContextType>({
  showToast: () => undefined,
});

export const useSnackbar = () => useContext(SnackbarContext);

type Props = {
  initialToast?: { message: string; severity?: Severity };
};

// TODO maybe allow more messages ?
// TODO maybe similar code is already in Mui?  but useSnackbar is configuration only
export const SnackbarProvider: React.FC<Props> = ({
  children,
  initialToast,
}) => {
  const [open, setOpen] = useState(!!initialToast);
  const [message, setMessage] = useState<string>(initialToast?.message ?? '');
  const [severity, setSeverity] = useState<Severity>(initialToast?.severity);

  const handleClose = (_event: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const value: SnackbarContextType = useMemo(
    () => ({
      showToast: (message: string, severity?: Severity) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
      },
    }),
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
