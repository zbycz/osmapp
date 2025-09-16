import React, { useState } from 'react';
import { CharacterCount, getInputTypeForKey } from '../helpers';
import { Button, Stack, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { useLoadingState } from '../../../../utils/useLoadingState';
import { t } from '../../../../../services/intl';
import DownloadIcon from '@mui/icons-material/Download';

const MAX_INPUT_LENGTH = 255;
const InputContainer = styled.div`
  position: relative;
`;

type TextFieldProps = {
  k: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  error?: boolean;
  helperText?: string;
  errorText?: string;
};

export const TextFieldWithCharacterCount = ({
  k,
  error,
  helperText,
  errorText,
  label,
  autoFocus,
  onChange,
  value,
  placeholder,
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValidationReadyToCheck, setIsValidationReadyToCheck] =
    useState(false);
  const inputType = getInputTypeForKey(k);

  return (
    <InputContainer>
      <TextField
        error={isValidationReadyToCheck && error}
        label={label}
        type={inputType}
        multiline={inputType === 'text'}
        value={value}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        margin="normal"
        name={k}
        onChange={onChange}
        fullWidth
        autoFocus={autoFocus}
        placeholder={placeholder}
        inputProps={{ maxLength: MAX_INPUT_LENGTH }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsValidationReadyToCheck(true);
          setIsFocused(false);
        }}
        slotProps={{ formHelperText: { component: 'div' } }}
        helperText={
          <Stack direction="row" spacing={1}>
            {errorText
              ? isValidationReadyToCheck
                ? errorText
                : helperText
              : helperText}
            <CharacterCount
              count={value?.length}
              max={MAX_INPUT_LENGTH}
              isInputFocused={isFocused}
            />
          </Stack>
        }
      />
    </InputContainer>
  );
};

type OpenAllButtonProps = {
  onClick: (e: React.MouseEvent) => Promise<void>;
};
export const OpenAllButton = ({ onClick }: OpenAllButtonProps) => {
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleClick = (e: React.MouseEvent) => {
    startLoading();
    onClick(e).then(() => {
      stopLoading();
    });
  };

  return (
    <Button
      size="small"
      color="secondary"
      startIcon={<DownloadIcon />}
      loading={isLoading}
      onClick={handleClick}
    >
      {t('editdialog.open_all')}
    </Button>
  );
};
