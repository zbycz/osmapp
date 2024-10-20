import { useEditDialogContext } from '../../../helpers/EditDialogContext';
import { useEditContext } from '../../EditContext';
import React, { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const useUpdatedState = (currentKey: string) => {
  const [tmpKey, setTmpKey] = useState(currentKey);
  useEffect(() => {
    setTmpKey(currentKey);
  }, [currentKey]);

  return { tmpKey, setTmpKey };
};

const useTmpState = (index: number) => {
  const { tagsEntries, setTagsEntries } = useEditContext().tags;
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
  const { tagsEntries } = useEditContext().tags;
  const [currentKey, currentValue] = tagsEntries[index];

  const isDuplicateKey = tagsEntries.some(
    ([key], idx) => key && key === currentKey && index !== idx,
  );
  const isLastIndex = index === tagsEntries.length - 1;
  const emptyKeyCondition = isLastIndex
    ? !currentKey && !!currentValue
    : !currentKey;

  return emptyKeyCondition || isDuplicateKey;
};

export const KeyInput = ({ index }: { index: number }) => {
  const { focusTag } = useEditDialogContext();
  const { tmpKey, setTmpKey, handleBlur } = useTmpState(index);
  const isError = useIsError(index);

  return (
    <TextField
      value={tmpKey}
      onChange={({ target }) => setTmpKey(target.value)}
      onBlur={handleBlur}
      autoFocus={focusTag === tmpKey}
      fullWidth
      variant="outlined"
      size="small"
      error={isError}
      slotProps={{
        htmlInput: { autoCapitalize: 'none', maxLength: 255 },
        input: {
          endAdornment: isError ? (
            <InputAdornment position="end">
              <WarningIcon color="error" />
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};
