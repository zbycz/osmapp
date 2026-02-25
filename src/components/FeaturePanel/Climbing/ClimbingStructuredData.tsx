import { useFeatureContext } from '../../utils/FeatureContext';
import { getWikimediaCommonsPhotoKeys } from './utils/photo';
import { getCommonsImageUrl } from '../../../services/images/getCommonsImageUrl';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import {
  findOrConvertRouteGrade,
  getDifficulties,
} from '../../../services/tagging/climbing/routeGrade';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';
import { getGradeSystemName } from '../../../services/tagging/climbing/gradeSystems';
import Head from 'next/head';

const generateScriptContent = (feature, userSettings) => {
  const isClimbingArea = feature.tags.climbing === 'area';
  const isClimbingCrag = feature.tags.climbing === 'crag';
  const isClimbingRoute = feature.tags.climbing === 'route_bottom';
  const poiType = getHumanPoiType(feature);

  if (isClimbingArea) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${feature.tags.name} - ${poiType}`,
      ...(feature.tags.description
        ? {
            description: feature.tags.description,
          }
        : {}),
      geo: {
        '@type': 'GeoCoordinates',
        latitude: feature.center?.[1],
        longitude: feature.center?.[0],
      },
    };
  }

  if (isClimbingCrag) {
    const photoPaths = getWikimediaCommonsPhotoKeys(feature.tags);
    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${feature.tags.name} - ${poiType}`,
      ...(photoPaths.length > 0
        ? {
            image: photoPaths.map((photoPath) =>
              getCommonsImageUrl(feature.tags[photoPath], 960),
            ),
          }
        : {}),
      ...(feature.tags.description
        ? { description: feature.tags.description }
        : {}),

      geo: {
        '@type': 'GeoCoordinates',
        latitude: feature.center?.[1],
        longitude: feature.center?.[0],
      },
    };
  }

  if (isClimbingRoute) {
    const photoPaths = getWikimediaCommonsPhotoKeys(feature.tags);
    const selectedRouteSystem = userSettings['climbing.gradeSystem'];
    const routeDifficulties = getDifficulties(feature.tags);
    const { routeDifficulty } = findOrConvertRouteGrade(
      routeDifficulties,
      selectedRouteSystem,
    );

    return {
      '@context': 'https://schema.org',
      '@type': 'Route',
      name: `${feature.tags.name} - ${poiType}`,
      ...(photoPaths.length > 0
        ? {
            image: photoPaths.map((photoPath) =>
              getCommonsImageUrl(feature.tags[photoPath], 960),
            ),
          }
        : {}),
      ...(feature.tags.description
        ? { description: feature.tags.description }
        : {}),
      difficulty: `${routeDifficulty.grade} (${getGradeSystemName(routeDifficulty.gradeSystem)})`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: feature.center?.[1],
        longitude: feature.center?.[0],
      },
    };
  }

  return null;
};

export const ClimbingStructuredData = () => {
  const { feature } = useFeatureContext();
  const { userSettings } = useUserSettingsContext();

  const structuredData = generateScriptContent(feature, userSettings);
  if (!structuredData) return null;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Head>
  );
};
