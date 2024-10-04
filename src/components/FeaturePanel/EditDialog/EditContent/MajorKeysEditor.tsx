import React, { useEffect, useState } from 'react';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { t } from '../../../../services/intl';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from '../../Climbing/utils/photo';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import { useEditContext } from '../EditContext';
import { OpeningHoursEditor } from './OpeningHoursEditor/OpeningHoursEditor';
import styled from '@emotion/styled';

export const majorKeys = [
  'name',
  'description',
  'website',
  'phone',
  'opening_hours',
];

const MAX_INPUT_LENGTH = 255;

const getData = (numberOfWikimediaItems) => {
  const wikimediaCommonTags = Array(numberOfWikimediaItems)
    .fill('')
    .reduce((acc, _, index) => {
      const key = getWikimediaCommonsKey(index);
      const value = `Wikimedia commons photo (${index})`;
      return { ...acc, [key]: value };
    }, {});

  return {
    keys: [...majorKeys, ...Object.keys(wikimediaCommonTags)],
    names: {
      name: t('tags.name'),
      description: t('tags.description'),
      website: t('tags.website'),
      phone: t('tags.phone'),
      opening_hours: t('tags.opening_hours'),
      ...wikimediaCommonTags,
    },
  };
};

const InputContainer = styled.div`
  position: relative;
`;
const CharacterCountContainer = styled.div`
  position: absolute;
  right: 0;
`;

const CharacterCount = ({
  count = 0,
  max,
  isVisible,
}: {
  count?: number;
  max: number;
  isVisible: boolean;
}) => (
  <CharacterCountContainer>
    {isVisible && (
      <Stack direction="row" justifyContent={'flex-end'} whiteSpace="nowrap">
        <Box color={count >= max ? 'error.main' : undefined}>
          {count} / {max}
        </Box>
      </Stack>
    )}
  </CharacterCountContainer>
);

const TextFieldWithCharacterCount = ({
  k,
  label,
  autoFocus,
  onChange,
  value,
}) => {
  const [isCharacterCountVisible, setIsCharacterCountVisible] = useState(false);
  return (
    <InputContainer>
      <TextField
        label={label}
        value={value}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        margin="normal"
        name={k}
        onChange={onChange}
        fullWidth
        autoFocus={autoFocus}
        inputProps={{ maxLength: MAX_INPUT_LENGTH }}
        onFocus={() => setIsCharacterCountVisible(true)}
        onBlur={() => setIsCharacterCountVisible(false)}
        helperText={
          <CharacterCount
            count={value?.length}
            max={MAX_INPUT_LENGTH}
            isVisible={isCharacterCountVisible}
          />
        }
      />
    </InputContainer>
  );
};

export const MajorKeysEditor = () => {
  const { focusTag } = useEditDialogContext();
  const {
    tags: { tags, setTag },
  } = useEditContext();

  // TODO this code will be replaced when implementing id presets fields
  const nextWikimediaCommonsIndex = getNextWikimediaCommonsIndex(tags);
  const data = getData(nextWikimediaCommonsIndex + 1);

  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    data.keys.filter((k) => !!tags[k]),
  );

  const inactiveMajorKeys = data.keys.filter(
    (k) =>
      !activeMajorKeys.includes(k) ||
      k === getWikimediaCommonsKey(nextWikimediaCommonsIndex + 1),
  );

  useEffect(() => {
    if (focusTag === 'name' && !activeMajorKeys.includes('name')) {
      setActiveMajorKeys((arr) => [...arr, 'name']);
    }
  }, [focusTag]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {activeMajorKeys.map((k) => (
        <div key={k}>
          {k === 'opening_hours' ? (
            <OpeningHoursEditor />
          ) : (
            <TextFieldWithCharacterCount
              label={data.names[k]}
              k={k}
              autoFocus={focusTag === k}
              onChange={(e) => {
                setTag(e.target.name, e.target.value);
              }}
              value={tags[k]}
            />
          )}
        </div>
      ))}
      {!!inactiveMajorKeys.length && (
        <>
          <Typography variant="body1" component="span" color="textSecondary">
            {t('editdialog.add_major_tag')}:
          </Typography>
          {inactiveMajorKeys.map((k) => (
            <React.Fragment key={k}>
              {' '}
              <Button
                size="small"
                onClick={() => setActiveMajorKeys((arr) => [...arr, k])}
              >
                {data.names[k]}
              </Button>
            </React.Fragment>
          ))}
        </>
      )}
      <br />
      <br />
    </>
  );
};
