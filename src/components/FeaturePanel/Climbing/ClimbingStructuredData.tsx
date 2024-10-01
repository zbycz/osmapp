import Script from 'next/script';
import { useFeatureContext } from '../../utils/FeatureContext';
import {
  getWikimediaCommonsKeys,
  getWikimediaCommonsPhotoKeys,
} from './utils/photo';
import { getCommonsImageUrl } from '../../../services/images/getCommonsImageUrl';
import { getHumanPoiType } from '../../../helpers/featureLabel';
import {
  findOrConvertRouteGrade,
  getDifficulties,
  getGradeSystemName,
} from './utils/grades/routeGrade';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';

export const ClimbingStructuredData = () => {
  const { feature } = useFeatureContext();
  const isClimbingArea = feature.tags.climbing === 'area';
  const isClimbingCrag = feature.tags.climbing === 'crag';
  const isClimbingRoute = feature.tags.climbing === 'route_bottom';
  const poiType = getHumanPoiType(feature);
  const { userSettings } = useUserSettingsContext();

  if (isClimbingArea) {
    return (
      <Script
        id="structured-data-climbing-area"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
      "@context": "https://schema.org",
      "@type": "Place",
      "name": "${feature.tags.name} - ${poiType}",
      ${feature.tags.description ? `"description": "${feature.tags.description}"` : ''},
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "${feature.center[1]}",
        "longitude": "${feature.center[0]}"
      }
    }`,
        }}
      />
    );
  }

  if (isClimbingCrag) {
    const photoPaths = getWikimediaCommonsPhotoKeys(feature.tags);

    return (
      <Script
        id="structured-data-climbing-crag"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
      "@context": "https://schema.org",
      "@type": "Place",
      "name": "${feature.tags.name} - ${poiType}",
      ${
        photoPaths.length > 0
          ? `"image": [
        ${photoPaths.map((photoPath) => `"${getCommonsImageUrl(feature.tags[photoPath], 800)}"`).join(', ')}
      ],`
          : ''
      }
      ${feature.tags.description ? `"description": "${feature.tags.description}"` : ''},
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "${feature.center[1]}",
        "longitude": "${feature.center[0]}"
      }
    }`,
        }}
      />
    );
  }

  if (isClimbingRoute) {
    const photoPaths = getWikimediaCommonsPhotoKeys(feature.tags);
    const selectedRouteSystem = userSettings['climbing.gradeSystem'];
    const routeDifficulties = getDifficulties(feature.tags);

    const { routeDifficulty } = findOrConvertRouteGrade(
      routeDifficulties,
      selectedRouteSystem,
    );

    return (
      <Script
        id="structured-data-climbing-route"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
      "@context": "https://schema.org",
      "@type": "Route",
      "name": "${feature.tags.name} - ${poiType}",
      ${
        photoPaths.length > 0
          ? `"image": [
        ${photoPaths.map((photoPath) => `"${getCommonsImageUrl(feature.tags[photoPath], 800)}"`).join(', ')}
      ],`
          : ''
      }
      ${feature.tags.description ? `"description": "${feature.tags.description}"` : ''},
      "difficulty": "${routeDifficulty.grade} (${getGradeSystemName(routeDifficulty.gradeSystem)})",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "${feature.center[1]}",
        "longitude": "${feature.center[0]}"
      }
    }`,
        }}
      />
    );
  }

  return null;
};
