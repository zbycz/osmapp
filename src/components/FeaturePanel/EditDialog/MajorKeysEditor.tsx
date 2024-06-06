import React, { useEffect } from 'react';

import { Button, TextField, Typography } from '@mui/material';

import { t } from '../../../services/intl';

const majorKeysNames = {
  name: t('tags.name'),
  website: t('tags.website'),
  phone: t('tags.phone'),
  opening_hours: t('tags.opening_hours'),
};

export const majorKeys = ['name', 'website', 'phone', 'opening_hours'];

const getInitialMajorKeys = (tags) => majorKeys.filter((k) => !!tags[k]);

export const MajorKeysEditor = ({ tags, setTag, focusTag }) => {
  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(tags),
  );
  const inactiveMajorKeys = majorKeys.filter(
    (k) => !activeMajorKeys.includes(k),
  );

  useEffect(() => {
    if (focusTag === 'name' && !activeMajorKeys.includes('name')) {
      setActiveMajorKeys((arr) => [...arr, 'name']);
    }
  }, [focusTag]);

  return (
    <>
      {activeMajorKeys.map((k) => (
        <div key={k}>
          <TextField
            label={majorKeysNames[k]}
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
                {majorKeysNames[k]}
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
