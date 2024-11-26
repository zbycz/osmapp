import { Button, Dialog, Stack } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

type Confirmation =
  | string
  | {
      description?: string;
      cancel?: string | false;
      confirm?: string;
      callback: (action: 'confirm' | 'cancel') => void;
    };

type ConfirmationContext = {
  confirmation: Confirmation | null;
  confirm: (props: Partial<Confirmation>) => Promise<boolean>;
};

const getConfirmationAttributes = (confirmation: Partial<Confirmation>) => {
  // TODO: translations
  const {
    description = 'Are you sure?',
    confirm = 'Ok',
    cancel = 'Cancel',
    callback = () => {},
  } = typeof confirmation === 'string'
    ? { description: confirmation }
    : confirmation;

  return { description, confirm, cancel, callback };
};

const InnerConfirmation = ({
  confirmation,
}: {
  confirmation: Confirmation;
}) => {
  if (!confirmation) {
    return null;
  }

  const { description, confirm, cancel, callback } =
    getConfirmationAttributes(confirmation);

  return (
    <Stack spacing={1.5} style={{ padding: '20px' }}>
      <p>{description}</p>
      <Stack direction="row" justifyContent="end" spacing={1}>
        {cancel && <Button onClick={() => callback('cancel')}>{cancel}</Button>}
        <Button
          onClick={() => callback('confirm')}
          variant="contained"
          color="primary"
        >
          {confirm}
        </Button>
      </Stack>
    </Stack>
  );
};

const Confirmation = ({ confirmation }: { confirmation: Confirmation }) => {
  return (
    <Dialog open={!!confirmation}>
      <InnerConfirmation confirmation={confirmation} />
    </Dialog>
  );
};

const ConfirmationContext = createContext<ConfirmationContext>(null);

export const ConfirmationProvider: React.FC = ({ children }) => {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const value: ConfirmationContext = {
    confirmation,
    confirm: (props) => {
      const { description, confirm, cancel, callback } =
        getConfirmationAttributes(props);

      return new Promise<boolean>((resolve) => {
        setConfirmation({
          description,
          confirm,
          cancel,
          callback: (action) => {
            resolve(action === 'confirm');
            callback(action);
            setConfirmation(null);
          },
        });
      });
    },
  };

  return (
    <ConfirmationContext.Provider value={value}>
      <Confirmation confirmation={confirmation} />
      {children}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmationContext = () => useContext(ConfirmationContext);
