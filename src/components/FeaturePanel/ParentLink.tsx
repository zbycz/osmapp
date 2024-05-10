import styled from 'styled-components';
import Link from 'next/link';
import React from 'react';
import { getOsmappLink } from '../../services/helpers';
import { getLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';

const ClimbingParentItem = styled.div`
  margin: 12px 8px -4px 8px;

  a {
    color: ${({ theme }) => theme.palette.secondary.main};
    font-size: 13px;
    display: block;
  }
`;

const ParentItem = styled.div`
  margin: 12px 0 4px 0;

  a {
    color: ${({ theme }) => theme.palette.secondary.main};
    font-size: 13px;
    display: block;
  }
`;

export const ParentLink = () => {
  const { feature } = useFeatureContext();

  return (
    <ParentItem>
      {feature.parentFeatures?.map((parentFeature) => (
        <Link href={getOsmappLink(parentFeature)} color="secondary">
          {getLabel(parentFeature)}
        </Link>
      ))}
    </ParentItem>
  );
};

export const ClimbingParentLink = () => {
  const { feature } = useFeatureContext();

  return (
    <ClimbingParentItem>
      {feature.parentFeatures?.map((parentFeature) => (
        <Link href={getOsmappLink(parentFeature)} color="secondary">
          {getLabel(parentFeature)}
        </Link>
      ))}
    </ClimbingParentItem>
  );
};
