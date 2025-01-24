import { useEditDialogContext } from '../../../../helpers/EditDialogContext';
import React, { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useFeatureEditData } from '../SingleFeatureEditContext';
import { FastInput } from './helpers';

const useUpdatedState = (currentKey: string) => {
  const [tmpKey, setTmpKey] = useState(currentKey);
  useEffect(() => {
    setTmpKey(currentKey);
  }, [currentKey]);

  return { tmpKey, setTmpKey };
};

const useTmpState = (index: number) => {
  const { tagsEntries, setTagsEntries } = useFeatureEditData();
  const currentKey = tagsEntries[index][0];
  const { tmpKey, setTmpKey } = useUpdatedState(currentKey);

  const handleBlur = () => {
    if (tmpKey === currentKey) {
      return;
    }
    setTagsEntries((state) =>
      state.map(([key, value], idx) =>
        idx === index ? [tmpKey, value] : [key, value],
      ),
    );
  };

  return { tmpKey, setTmpKey, handleBlur };
};

const useIsError = (index: number) => {
  const { tagsEntries } = useFeatureEditData();
  const [currentKey, currentValue] = tagsEntries[index];

  const isEmptyKey = !!currentValue && !currentKey;
  const isDuplicateKey = tagsEntries.some(
    ([key], idx) => key && key === currentKey && index !== idx,
  );

  return isEmptyKey || isDuplicateKey;
};

export const KeyInput = ({ index }: { index: number }) => {
  const { focusTag } = useEditDialogContext();
  const { tmpKey, setTmpKey, handleBlur } = useTmpState(index);
  const isError = useIsError(index);

  return (
    <FastInput
      value={tmpKey}
      onChange={({ target }) => setTmpKey(target.value)}
      onBlur={handleBlur}
      autoFocus={focusTag === tmpKey}
      autoCapitalize="none"
      maxLength={255}
      error={isError}
    />
  );
};
