import { ReactNode, createContext, useContext, useState } from 'react';

interface AddLayerDialogType {
  opened: boolean;
  open: () => void;
  close: () => void;
}

const AddLayerDialogContext = createContext<AddLayerDialogType>(undefined);

export const AddLayerDialogProvider = (props: { children: ReactNode }) => {
  const [opened, setOpened] = useState(false);

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
      {props.children}
    </AddLayerDialogContext.Provider>
  );
};

export const useAddLayerContext = () =>
  useContext<AddLayerDialogType>(AddLayerDialogContext);
