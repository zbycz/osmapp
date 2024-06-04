import styled from 'styled-components';
import Link from 'next/link';
import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getOsmappLink } from '../../services/helpers';
import { getLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';

const Comma = styled.span`
  color: ${({ theme }) => theme.palette.secondary.main};
  position: relative;
  left: -2px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconWrapper = styled.div`
  position: relative;
  top: 1px;
`;

const ClimbingParentItem = styled.div`
  margin: 12px 8px -4px 8px;

  a {
    color: ${({ theme }) => theme.palette.secondary.main};
    font-size: 13px;
    display: block;
    &:hover {
      text-decoration: none;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
    &:hover svg {
      fill: ${({ theme }) => theme.palette.text.secondary};
      transition: none;
    }
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

export const Arrow = ({ children }) => (
  <Row>
    <IconWrapper>
      <ArrowBackIcon fontSize="small" color="secondary" />
    </IconWrapper>
    {children}
  </Row>
);
export const ParentLinkContent = () => {
  const { feature } = useFeatureContext();

  const hasMoreParents = feature.parentFeatures?.length > 1;
  return (
    <>
      {hasMoreParents ? (
        <Arrow>
          {feature.parentFeatures?.map((parentFeature, i) => (
            <>
              <Link href={getOsmappLink(parentFeature)} color="secondary">
                {getLabel(parentFeature)}
              </Link>
              {feature.parentFeatures.length > i + 1 && <Comma>,</Comma>}
            </>
          ))}
        </Arrow>
      ) : (
        feature.parentFeatures?.map((parentFeature) => (
          <Link href={getOsmappLink(parentFeature)} color="secondary">
            <Arrow>{getLabel(parentFeature)}</Arrow>
          </Link>
        ))
      )}
    </>
  );
};

export const ParentLink = () => (
  <ParentItem>
    <ParentLinkContent />
  </ParentItem>
);

export const ClimbingParentLink = () => (
  <ClimbingParentItem>
    <ParentLinkContent />
  </ClimbingParentItem>
);
