import * as React from 'react';

interface AddLayerDialogType {
  opened: boolean;
  open: () => void;
  close: () => void;
}

const AddLayerDialogContext =
  React.createContext<AddLayerDialogType>(undefined);

type AddLayerDialogProviderProps = { children: React.ReactNode };

export const AddLayerDialogProvider = ({
  children,
}: AddLayerDialogProviderProps) => {
  const [opened, setOpened] = React.useState(false);

  const value = {
    opened,
    open: () => {
      setOpened(true);
    },
    save: () => {},
    close: () => setOpened(false),
  };

  return (
    <AddLayerDialogContext.Provider value={value}>
      {children}
    </AddLayerDialogContext.Provider>
  );
};

export const useAddLayerContext = () =>
  React.useContext<AddLayerDialogType>(AddLayerDialogContext);
