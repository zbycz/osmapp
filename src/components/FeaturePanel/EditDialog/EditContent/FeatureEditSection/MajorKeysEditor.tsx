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
import { extractClimbingGradeFromTagName } from '../../../../../services/tagging/climbing/routeGrade';
import { TextFieldWithCharacterCount } from './helpers';
import { WikimediaCommonsEditor } from './WikimediaCommonsEditor';
import { GradeSelect } from './GradeSelect';

export const majorKeys = [
  'name',
  'description',
  'website',
  'phone',
  'opening_hours',
];

const climbingRouteMajorKeys = [
  'author',
  'climbing:grade:uiaa',
  'climbing:grade:french',
  'climbing:boulder',
  'climbing:length',
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

export const MajorKeysEditor: React.FC = () => {
  const { focusTag } = useEditDialogContext();
  const { tags, setTag } = useCurrentItem();

  const nextWikimediaCommonsIndex = getNextWikimediaCommonsIndex(tags);
  const isRoute = isClimbingRoute(tags);
  const data = getData(nextWikimediaCommonsIndex + 1, isRoute);

  const [activeMajorKeys, setActiveMajorKeys] = useState(() =>
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
  }, [activeMajorKeys, focusTag]);

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
    <Box>
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
