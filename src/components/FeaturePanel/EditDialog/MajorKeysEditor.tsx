import React, { useEffect } from 'react';

import { Button, TextField, Typography } from '@mui/material';

import { t } from '../../../services/intl';
import {
  getNewPhotoIndex,
  getPhotoKey,
  getPhotoKeysFromTags,
  isPhotoTag,
} from '../Climbing/utils/photo';
import { useFeatureContext } from '../../utils/FeatureContext';

export const majorKeys = ['name', 'website', 'phone', 'opening_hours'];

const getPhotoOffset = (activeMajorKeys: Array<string>) =>
  activeMajorKeys.reduce((acc, tagKey) => {
    if (isPhotoTag(tagKey)) return acc + 1;
    return acc;
  }, 0);

export const MajorKeysEditor = ({ tags, setTag, focusTag }) => {
  const getMajorKeysNames = (newPhotoIndex: number = 0, offset: number) => {
    const numberOfNewItems = offset + 1;
    const wikimediaCommonKeys = Array(numberOfNewItems)
      .fill('')
      .map((_, currentOffset) => getPhotoKey(newPhotoIndex, currentOffset));

    const wikimediaCommonNames = Array(numberOfNewItems)
      .fill('')
      .reduce(
        (acc, _, currentOffset) => ({
          ...acc,
          [getPhotoKey(
            newPhotoIndex,
            currentOffset,
          )]: `Wikimedia commons photo (${currentOffset + newPhotoIndex})`,
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
  const [photoOffset, setPhotoOffset] = React.useState(0);

  const { feature } = useFeatureContext();
  const photoKeys = getPhotoKeysFromTags(feature.tags);
  const newPhotoIndex = getNewPhotoIndex(photoKeys);

  const major = getMajorKeysNames(newPhotoIndex, photoOffset);

  const getInitialMajorKeys = (majorKeyTags) =>
    major.keys.filter((k) => !!majorKeyTags[k]);

  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(tags),
  );
  const inactiveMajorKeys = major.keys.filter(
    (k) =>
      !activeMajorKeys.includes(k) ||
      k === getPhotoKey(newPhotoIndex, photoOffset),
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
            label={major.names[k]}
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
                {major.names[k]}
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
