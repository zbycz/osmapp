import styled from 'styled-components';
import { Box, useTheme } from '@mui/material';
import React from 'react';
import Router from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFeatureContext } from '../utils/FeatureContext';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import { Feature } from '../../services/types';
import { useMobileMode } from '../helpers';
import { getWikimediaCommonsKeys } from './Climbing/utils/photo';
import { useScrollShadow } from './Climbing/utils/useScrollShadow';
import { getLabel } from '../../helpers/featureLabel';
import { getCommonsImageUrl } from '../../services/images/getWikiImage';

const ArrowIcon = styled(ArrowForwardIosIcon)`
  opacity: 0.2;
  margin-left: 12px;
`;
const HeadingRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Container = styled.div`
  overflow: auto;
  flex-direction: column;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 8px;
  padding: 12px;
  background-color: ${({ theme }) => theme.palette.background.elevation};
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;
const CragList = styled.div`
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Anchor = styled.a`
  text-decoration: none !important;
`;
const Content = styled.div`
  flex: 1;
`;
const CragName = styled.div`
  padding: 0;
  font-weight: 900;
  font-size: 20px;
  color: ${({ theme }) => theme.palette.primary.main};
`;
const Attributes = styled.div`
  display: flex;
  gap: 8px;
`;
const NumberOfRoutes = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
const Gallery = styled.div`
  display: flex;
  gap: 8px;
  border-radius: 8px;
  overflow: auto;
  margin-top: 12px;
`;
const Image = styled.img`
  border-radius: 8px;
  height: 200px;
  flex: 1;
  object-fit: cover;
`;
const CragItem = ({ feature }: { feature: Feature }) => {
  const theme: any = useTheme();

  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { osmMeta } = feature;
  const handleClick = (e) => {
    e.preventDefault();
    setPreview(null);
    Router.push(`/${getUrlOsmId(osmMeta)}${window.location.hash}`);
  };
  const handleHover = () => feature.center && setPreview(feature);

  const cragPhotoKeys = getWikimediaCommonsKeys(feature.tags);

  const {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowLeft,
    ShadowRight,
  } = useScrollShadow();
  return (
    <Anchor
      href={`/${getUrlOsmId(osmMeta)}`}
      onClick={handleClick}
      onMouseEnter={mobileMode ? undefined : handleHover}
      onMouseLeave={() => setPreview(null)}
    >
      <Container>
        <HeadingRow>
          <Content>
            <CragName>{getLabel(feature)}</CragName>{' '}
            <Attributes>
              {feature.members?.length > 0 && (
                <NumberOfRoutes>
                  {feature.members.length} routes{' '}
                </NumberOfRoutes>
              )}
              {cragPhotoKeys.length > 0 && (
                <NumberOfRoutes>{cragPhotoKeys.length} photos </NumberOfRoutes>
              )}
            </Attributes>
          </Content>
          <ArrowIcon color="primary" />
        </HeadingRow>
        {cragPhotoKeys.length > 0 && (
          <ShadowContainer>
            <ShadowLeft
              backgroundColor={theme.palette.background.elevation}
              gradientPercentage={7}
              opacity={0.9}
            />
            <Gallery onScroll={onScroll} ref={scrollElementRef}>
              {cragPhotoKeys.map((cragPhotoTag) => {
                const photoPath = feature.tags[cragPhotoTag];
                const url = getCommonsImageUrl(photoPath, 410);
                return <Image src={url} key={cragPhotoTag} />;
              })}
            </Gallery>
            <ShadowRight
              backgroundColor={theme.palette.background.elevation}
              gradientPercentage={7}
              opacity={0.9}
            />
          </ShadowContainer>
        )}
      </Container>
    </Anchor>
  );
};
export const CragsInArea = () => {
  const {
    feature: { memberFeatures, tags },
  } = useFeatureContext();

  if (!memberFeatures?.length) {
    return null;
  }

  const isClimbingArea = tags.climbing === 'area';
  if (!isClimbingArea) {
    return null;
  }

  return (
    <Box mt={4}>
      <CragList>
        {memberFeatures.map((item) => (
          <CragItem key={getOsmappLink(item)} feature={item} />
        ))}
      </CragList>
    </Box>
  );
};
