import React from 'react';
import Head from 'next/head';
import { getUtfStrikethrough, join } from '../utils';
import { Feature } from '../services/types';
import { useFeatureContext } from '../components/utils/FeatureContext';
import { getFullOsmappLink, getShortId } from '../services/helpers';
import { getLabel, getParentLabel } from './featureLabel';
import {
  PROJECT_ID,
  PROJECT_NAME,
  PROJECT_OG_IMAGE,
  PROJECT_SERP_DESCRIPTION,
  PROJECT_URL,
} from '../services/project';
import { t } from '../services/intl';

const isOpenClimbing = PROJECT_ID === 'openclimbing';

const getCustomLabel = (feature: Feature) => {
  switch (feature.tags.climbing) {
    case 'area':
      return `${getLabel(feature)} - ${t('project.openclimbing.climbing_guide')}`;
    case 'crag':
    case 'route_bottom':
      const parentLabel = getParentLabel(feature);
      return `${getLabel(feature)}${parentLabel ? `, ${parentLabel}` : ''} - ${t('project.openclimbing.climbing_guide')}`;
    default:
      return join(getLabel(feature), ' – ', getParentLabel(feature));
  }
};

const getTitleLabel = (feature: Feature) => {
  const label = getCustomLabel(feature);

  return feature.deleted ? getUtfStrikethrough(label) : label;
};

export const TitleAndMetaTags = () => {
  const { feature } = useFeatureContext();

  if (feature) {
    const url = getFullOsmappLink(feature);
    const titleLabel = getTitleLabel(feature);
    const title = `${titleLabel} | ${PROJECT_NAME}`;
    const description = feature.tags.description || t(PROJECT_SERP_DESCRIPTION);

    const image = feature.imageDefs?.length
      ? `${PROJECT_URL}/api/og-image?id=${getShortId(feature.osmMeta)}`
      : PROJECT_OG_IMAGE;
    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={PROJECT_NAME} />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:description" content={description} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="twitter:url" content={url} />
        {image && <meta name="twitter:image" content={image} />}
      </Head>
    );
  }

  const title = PROJECT_NAME;
  const url = PROJECT_URL;
  const image = PROJECT_OG_IMAGE;
  const description = t(PROJECT_SERP_DESCRIPTION);

  return (
    <Head>
      <title>
        {PROJECT_NAME}
        {isOpenClimbing ? ` | ${t('project.openclimbing.climbing_guide')}` : ''}
      </title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={PROJECT_NAME} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:url" content={url} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
};
