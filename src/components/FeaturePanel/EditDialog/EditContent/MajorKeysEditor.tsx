import React, { useEffect } from 'react';

import { Button, TextField, Typography } from '@mui/material';

import { t } from '../../../../services/intl';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from '../../Climbing/utils/photo';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import { useEditContext } from '../EditContext';

export const majorKeys = ['name', 'website', 'phone', 'opening_hours'];

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
      website: t('tags.website'),
      phone: t('tags.phone'),
      opening_hours: t('tags.opening_hours'),
      ...wikimediaCommonTags,
    },
  };
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
          <TextField
            label={data.names[k]}
            value={tags[k]}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            name={k}
            onChange={(e) => setTag(e.target.name, e.target.value)}
            fullWidth
            autoFocus={focusTag === k}
          />
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
