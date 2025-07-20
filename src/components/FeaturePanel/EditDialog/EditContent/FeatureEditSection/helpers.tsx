import React, { useState } from 'react';
import { CharacterCount, getInputTypeForKey } from '../helpers';
import { Stack, TextField } from '@mui/material';
import styled from '@emotion/styled';

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
};

export const TextFieldWithCharacterCount = ({
  k,
  error,
  helperText,
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
            {isValidationReadyToCheck && helperText}
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
