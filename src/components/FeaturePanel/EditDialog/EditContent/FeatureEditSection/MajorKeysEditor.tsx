import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { t } from '../../../../../services/intl';
import { useEditDialogContext } from '../../../helpers/EditDialogContext';
import { OpeningHoursEditor } from './OpeningHoursEditor/OpeningHoursEditor';
import {
  isClimbingCragOrArea as isClimbingCragOrAreaFn,
  isClimbingRoute as isClimbingRouteFn,
} from '../../../../../utils';
import { useCurrentItem } from '../../context/EditContext';
import { TextFieldWithCharacterCount } from './helpers';
import { FeatureTags } from '../../../../../services/types';

const basicMajorKeys = ['name', 'description', 'website'];
const nonClimbingMajorKeys = ['phone', 'opening_hours'];
const climbingRouteMajorKeys = ['author', 'climbing:length'];
export const majorKeys = [...basicMajorKeys, ...nonClimbingMajorKeys];

const getData = (tags: FeatureTags) => {
  const isClimbingCragOrArea = isClimbingCragOrAreaFn(tags);
  const isClimbingRoute = isClimbingRouteFn(tags);
  const isClimbing = isClimbingCragOrArea || isClimbingRoute;

  return {
    keys: [
      ...basicMajorKeys,
      ...(isClimbing ? [] : nonClimbingMajorKeys),
      ...(isClimbingRoute ? climbingRouteMajorKeys : []),
    ],
    names: {
      name: t('tags.name'),
      description: t('tags.description'),
      website: t('tags.website'),
      ...(isClimbing
        ? {}
        : {
            phone: t('tags.phone'),
            opening_hours: t('tags.opening_hours'),
          }),
      ...(isClimbingRoute
        ? {
            author: t('tags.author'),
            'climbing:length': t('tags.climbing_length'),
          }
        : {}),
    },
  };
};

export const MajorKeysEditor: React.FC = () => {
  const { focusTag } = useEditDialogContext();
  const { tags, setTag } = useCurrentItem();

  const data = getData(tags);

  const [activeMajorKeys, setActiveMajorKeys] = useState(() =>
    data.keys.filter((k) => !!tags[k]),
  );

  const inactiveMajorKeys = data.keys.filter(
    (k) => !activeMajorKeys.includes(k),
  );

  useEffect(() => {
    if (focusTag === 'name' && !activeMajorKeys.includes('name')) {
      setActiveMajorKeys((arr) => [...arr, 'name']);
    }
  }, [activeMajorKeys, focusTag]);

  const getHelperText = (k: string) => {
    if (k === 'description') {
      return t('editdialog.description_helper_text');
    }
    return undefined;
  };

  const getInputElement = (k: string) => {
    if (!data.keys?.includes(k)) return null;

    if (k === 'opening_hours') {
      return <OpeningHoursEditor />;
    }

    return (
      <TextFieldWithCharacterCount
        label={data.names[k]}
        k={k}
        autoFocus={focusTag === k}
        onChange={(e) => {
          setTag(e.target.name, e.target.value);
        }}
        value={tags[k] ?? ''}
        helperText={getHelperText(k)}
      />
    );
  };

  return (
    <Box mb={3}>
      {activeMajorKeys.map((k) => (
        <Box key={k} mb={2}>
          {getInputElement(k)}
        </Box>
      ))}

      {!!inactiveMajorKeys.length && (
        <>
          <Typography variant="body1" component="span" color="textSecondary">
            {t('editdialog.add_major_tag')}:
          </Typography>
          {inactiveMajorKeys.map((k) => (
            <Button
              key={k}
              size="small"
              onClick={() => setActiveMajorKeys((arr) => [...arr, k])}
            >
              {data.names[k]}
            </Button>
          ))}
        </>
      )}
    </Box>
  );
};
