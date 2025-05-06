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

type OpenGraphTagsProps = {
  title: string;
  url: string;
  ogImage?: string;
  description?: string;
};

const OpenGraphTags = ({
  title,
  url,
  ogImage,
  description,
}: OpenGraphTagsProps) => (
  <>
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:site_name" content={PROJECT_NAME} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="twitter:card" content="summary_large_image" />
    <meta
      property="og:description"
      content={description || t(PROJECT_DECRIPTION)}
    />
    <meta
      property="description"
      content={description || t(PROJECT_SERP_DESCRIPTION)}
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta
      name="twitter:description"
      content={description || t(PROJECT_DECRIPTION)}
    />
    {ogImage && <meta name="twitter:image" content={ogImage} />}
  </>
);

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
  const title = `${titleLabel} | ${PROJECT_NAME}`;

  const ogImage = feature.imageDefs?.length
    ? `${PROJECT_URL}/api/og-image?id=${getShortId(feature.osmMeta)}`
    : undefined;
  return (
    <Head>
      <title>{title}</title>
      <OpenGraphTags
        title={title}
        description={feature.tags.description}
        url={osmappLink}
        ogImage={ogImage}
      />
    </Head>
  );
};
