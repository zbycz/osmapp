import { Feature } from '../../../services/types';
import React from 'react';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getOsmappLink } from '../../../services/helpers';
import Router from 'next/router';
import { useMobileMode } from '../../helpers';
import { ClimbingRouteTableRow } from '../Climbing/RouteList/ClimbingRouteTableRow';

export const ClimbingItem = ({
  feature,
  index,
  cragFeature,
}: {
  feature: Feature;
  index: number;
  cragFeature: Feature;
}) => {
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();

  if (!feature) return null;

  const handleHover = () => feature.center && setPreview(feature);

  const handleClickItem = (event) => {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    const cragFeatureLink = getOsmappLink(cragFeature);
    Router.push(`${cragFeatureLink}/climbing/route/${index}`);
  };

  return (
    <ClimbingRouteTableRow
      feature={feature}
      index={index}
      onClick={handleClickItem}
      onMouseEnter={mobileMode ? undefined : handleHover}
      onMouseLeave={() => setPreview(null)}
      isHoverHighlighted
    />
  );
};
