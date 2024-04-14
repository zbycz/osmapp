import { ReactNode, createContext, useContext, useState } from 'react';

interface AddLayerDialogType {
  opened: boolean;
  open: () => void;
  close: () => void;
  counter: number;
}

const AddLayerDialogContext = createContext<AddLayerDialogType>(undefined);

export const AddLayerDialogProvider = (props: { children: ReactNode }) => {
  const [opened, setOpened] = useState(false);
  const [counter, setCounter] = useState(0);

  const value = {
    opened,
    counter,
    open: ({ save }) => {
      setOpened(true);
      setCounter((prev) => prev + 1);
      return save
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
