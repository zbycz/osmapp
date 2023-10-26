import { Typography } from '@material-ui/core';
import React from 'react';
import { FeaturedTags } from '../FeaturedTags';
import { IdSchemeFields } from './IdSchemeFields';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { useFeatureContext } from '../../utils/FeatureContext';

export const TagsTable = ({ showTags }) => {
  const { feature } = useFeatureContext();
  const deleted = feature.error === 'deleted';

  return (
    <>
      {!showTags && (
        <>
          <FeaturedTags
            featuredTags={deleted ? [] : feature.schema?.featuredTags ?? []}
          />
          <IdSchemeFields
            featuredTags={deleted ? [] : feature.schema?.featuredTags ?? []}
            feature={feature}
          />
        </>
      )}
      {showTags && (
        <>
          <Typography variant="overline" display="block" color="textSecondary">
            {t('featurepanel.all_tags_heading')}
          </Typography>
          <TagsTableInner
            tags={feature.tags}
            center={feature.center}
            except={[]}
          />
        </>
      )}
    </>
  );
};
