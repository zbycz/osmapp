import React from 'react';
import { FeaturedTags } from '../FeaturedTags';
import { IdSchemeFields } from './IdSchemeFields';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Subheading } from '../helpers/Subheading';

export const Properties = ({ showTags }) => {
  const { feature } = useFeatureContext();

  return (
    <>
      {!showTags && (
        <>
          <FeaturedTags
            featuredTags={
              feature.deleted ? [] : feature.schema?.featuredTags ?? []
            }
          />
          <IdSchemeFields />
        </>
      )}
      {showTags && (
        <>
          <Subheading>{t('featurepanel.all_tags_heading')}</Subheading>
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
