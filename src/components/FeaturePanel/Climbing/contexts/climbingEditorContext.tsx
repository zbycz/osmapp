import { createContext } from 'react';

type ImageSize = {
  width: number;
  height: number;
};
type ClimbingEditorContextType = {
  imageSize: ImageSize;
  setImageSize: (ImageSize) => void;
};

export const ClimbingEditorContext = createContext<ClimbingEditorContextType>({
  imageSize: {
    width: 0,
    height: 0,
  },
  setImageSize: () => null,
});

export const ClimbingEditorContextProvider = ClimbingEditorContext.Provider;
