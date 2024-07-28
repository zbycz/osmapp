import React from 'react';
import Head from 'next/head';
import { getUtfStrikethrough, join } from '../utils';
import { Feature } from '../services/types';
import { useFeatureContext } from '../components/utils/FeatureContext';
import { getFullOsmappLink, getShortId } from '../services/helpers';
import { getLabel, getParentLabel } from './featureLabel';
import {
  PROJECT_DECRIPTION,
  PROJECT_NAME,
  PROJECT_OG_IMAGE,
  PROJECT_SERP_DESCRIPTION,
  PROJECT_URL,
} from '../services/project';
import { t } from '../services/intl';

const OpenGraphTags = ({ title, url, ogImage }) => (
  <>
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="og:description" content={t(PROJECT_DECRIPTION)} />
    <meta property="description" content={t(PROJECT_SERP_DESCRIPTION)} />
  </>
);

const getTitleLabel = (feature: Feature) => {
  const label = join(getLabel(feature), ' – ', getParentLabel(feature));

  return feature.deleted ? getUtfStrikethrough(label) : label;
};

export const TitleAndMetaTags = () => {
  const { feature } = useFeatureContext();

  if (!feature) {
    return (
      <Head>
        <title>{PROJECT_NAME}</title>
        <OpenGraphTags
          title={PROJECT_NAME}
          url={PROJECT_URL}
          ogImage={PROJECT_OG_IMAGE}
        />
      </Head>
    );
  }

  const osmappLink = getFullOsmappLink(feature);
  const titleLabel = getTitleLabel(feature);
  const title = `${titleLabel} · ${PROJECT_NAME}`;

  const ogImage = feature.imageDefs?.length
    ? `/api/og-image?id=${getShortId(feature.osmMeta)}`
    : undefined;
  return (
    <Head>
      <title>{title}</title>
      <OpenGraphTags title={title} url={osmappLink} ogImage={ogImage} />
    </Head>
  );
};
