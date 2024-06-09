import React, { useEffect } from 'react';

import { Button, TextField, Typography } from '@mui/material';

import { t } from '../../../services/intl';
import {
  getNewWikimediaCommonsIndex,
  getWikimediaCommonsKey,
  isWikimediaCommons,
} from '../Climbing/utils/photo';
import { useFeatureContext } from '../../utils/FeatureContext';

export const majorKeys = ['name', 'website', 'phone', 'opening_hours'];

const getPhotoOffset = (activeMajorKeys: Array<string>) =>
  activeMajorKeys.reduce((acc, tagKey) => {
    if (isWikimediaCommons(tagKey)) return acc + 1;
    return acc;
  }, 0);

const getData = (newIndex: number = 0, offset: number) => {
  const numberOfNewItems = offset + 1;
  const wikimediaCommonKeys = Array(numberOfNewItems)
    .fill('')
    .map((_, currentOffset) => getWikimediaCommonsKey(newIndex + currentOffset));

  const wikimediaCommonNames = Array(numberOfNewItems)
    .fill('')
    .reduce(
      (acc, _, currentOffset) => ({
        ...acc,
        [getWikimediaCommonsKey(newIndex + currentOffset)]: `Wikimedia commons photo (${
          currentOffset + newIndex
        })`,
      }),
      {},
    );

  return {
    keys: [...majorKeys, ...wikimediaCommonKeys],
    names: {
      name: t('tags.name'),
      website: t('tags.website'),
      phone: t('tags.phone'),
      opening_hours: t('tags.opening_hours'),
      ...wikimediaCommonNames,
    },
  };
};

export const MajorKeysEditor = ({ tags, setTag, focusTag }) => {
  const [photoOffset, setPhotoOffset] = React.useState(0);

  // TODO this code needs refactoring, probably will be nuked when implementing id presets fields
  const { feature } = useFeatureContext();
  const newPhotoIndex = getNewWikimediaCommonsIndex(feature);

  const data = getData(newPhotoIndex, photoOffset);

  const getInitialMajorKeys = (majorKeyTags) =>
    data.keys.filter((k) => !!majorKeyTags[k]);

  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(tags),
  );
  const inactiveMajorKeys = data.keys.filter(
    (k) =>
      !activeMajorKeys.includes(k) ||
      k === getWikimediaCommonsKey(newPhotoIndex + photoOffset),
  );

  useEffect(() => {
    setPhotoOffset(getPhotoOffset(activeMajorKeys));
  }, [activeMajorKeys]);

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
