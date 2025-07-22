import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { t } from '../../../../../services/intl';
import {
  getNextWikimediaCommonsIndex,
  getWikimediaCommonsKey,
} from '../../../Climbing/utils/photo';
import { useEditDialogContext } from '../../../helpers/EditDialogContext';
import { OpeningHoursEditor } from './OpeningHoursEditor/OpeningHoursEditor';
import { isClimbingRoute } from '../../../../../utils';
import { useCurrentItem } from '../../EditContext';
import { extractClimbingGradeFromTagName } from '../../../Climbing/utils/grades/routeGrade';
import { TextFieldWithCharacterCount } from './helpers';
import { WikimediaCommonsEditor } from './WikimediaCommonsEditor';
import { GradeSelect } from './GradeSelect';

export const climbingRouteMajorKeys = [
  'author',
  'climbing:grade:uiaa',
  'climbing:grade:french',
  'climbing:boulder',
  'length',
];

export const majorKeys = [
  'name',
  'description',
  'website',
  'phone',
  'opening_hours',
];

const getData = (numberOfWikimediaItems: number, isClimbingRoute?: boolean) => {
  const wikimediaCommonTags = Array(numberOfWikimediaItems)
    .fill('')
    .reduce((acc, _, index) => {
      const key = getWikimediaCommonsKey(index);
      const value = `${t('tags.wikimedia_commons_photo')} (${index})`;
      return { ...acc, [key]: value };
    }, {});

  return {
    keys: [
      ...majorKeys,
      ...Object.keys(wikimediaCommonTags),
      ...(isClimbingRoute ? climbingRouteMajorKeys : []),
    ],
    names: {
      name: t('tags.name'),
      description: t('tags.description'),
      website: t('tags.website'),
      phone: t('tags.phone'),
      opening_hours: t('tags.opening_hours'),
      ...wikimediaCommonTags,
      ...(isClimbingRoute
        ? {
            author: t('tags.author'),
            'climbing:grade:uiaa': t('tags.climbing_grade_uiaa'),
            'climbing:grade:french': t('tags.climbing_grade_french'),
            'climbing:boulder': t('tags.climbing_boulder'),
            length: t('tags.length'),
          }
        : {}),
    },
  };
};

// eslint-disable-next-line max-lines-per-function
export const MajorKeysEditor = () => {
  const { focusTag } = useEditDialogContext();
  const { tags, setTag } = useCurrentItem();

  // TODO this code will be replaced when implementing id presets fields... probably not happening
  const nextWikimediaCommonsIndex = getNextWikimediaCommonsIndex(tags);
  const data = getData(nextWikimediaCommonsIndex + 1, isClimbingRoute(tags));
  const [activeMajorKeys, setActiveMajorKeys] = useState(() =>
    data.keys.filter((k) => !!tags[k]),
  );

  const inactiveMajorKeys = data.keys.filter(
    (k) =>
      !activeMajorKeys.includes(k) ||
      k === getWikimediaCommonsKey(nextWikimediaCommonsIndex + 1),
  );

  useEffect(() => {
    // name can be clicked even though it was built from preset name
    if (focusTag === 'name' && !activeMajorKeys.includes('name')) {
      setActiveMajorKeys((arr) => [...arr, 'name']);
    }
  }, [focusTag]); // eslint-disable-line react-hooks/exhaustive-deps

  const getInputElement = (k: string) => {
    if (!data.keys?.includes(k)) return null;

    if (k === 'opening_hours') {
      return <OpeningHoursEditor />;
    }

    const climbingGradeSystem = extractClimbingGradeFromTagName(k);
    if (climbingGradeSystem) {
      return (
        <GradeSelect
          data={data}
          k={k}
          climbingGradeSystem={climbingGradeSystem}
          tags={tags}
        />
      );
    }

    if (k.startsWith('wikimedia_commons')) {
      return <WikimediaCommonsEditor k={k} />;
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
      />
    );
  };

  return (
    <Box mb={3}>
      {activeMajorKeys.map((k) => (
        <div key={k}>{getInputElement(k)}</div>
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
    </Box>
  );
};
