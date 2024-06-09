import React from "react";
import styled from "styled-components";
import { Box, useTheme } from "@mui/material";
import Router from "next/router";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getOsmappLink, getUrlOsmId } from "../../services/helpers";
import { useFeatureContext } from "../utils/FeatureContext";
import { Feature } from "../../services/types";
import { getLabel } from "../../helpers/featureLabel";
import { useUserThemeContext } from "../../helpers/theme";
import { useMobileMode } from "../helpers";
import Maki from "../utils/Maki";
import { PanelLabel } from "./Climbing/PanelLabel";
import { getCommonsImageUrl } from "../../services/images/getWikiImage";
import { useScrollShadow } from "./Climbing/utils/useScrollShadow";
import { getWikimediaCommonsKeys } from "./Climbing/utils/photo";

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

const Item = ({ feature }: { feature: Feature }) => {
  const { currentTheme } = useUserThemeContext();
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { properties, tags, osmMeta } = feature;
  const handleClick = (e) => {
    e.preventDefault();
    setPreview(null);
    Router.push(`/${getUrlOsmId(osmMeta)}${window.location.hash}`);
  };
  const handleHover = () =>
    feature.center && setPreview({ ...feature, noPreviewButton: true });

  return (
    <li>
      <a
        href={`/${getUrlOsmId(osmMeta)}`}
        onClick={handleClick}
        onMouseEnter={mobileMode ? undefined : handleHover}
        onMouseLeave={() => setPreview(null)}
      >
        <Maki
          ico={properties.class}
          title={`${Object.keys(tags).length} keys / ${
            properties.class ?? ''
          } / ${properties.subclass}`}
          invert={currentTheme === 'dark'}
        />
        {getLabel(feature)}
      </a>
    </li>
  );
};

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
  const handleHover = () =>
    feature.center && setPreview({ ...feature, noPreviewButton: true });

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
                const url = getCommonsImageUrl(photoPath, 400);
                return <Image src={url} />;
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

export const MemberFeatures = () => {
  const {
    feature: { memberFeatures, tags },
  } = useFeatureContext();

  if (!memberFeatures?.length) {
    return null;
  }

  const isClimbingCrag = tags.climbing === 'crag';
  const isClimbingArea = tags.climbing === 'area';

  const heading = isClimbingCrag
    ? 'Routes'
    : isClimbingArea
    ? 'Crags in this area'
    : 'Subitems';

  return (
    <Box mt={4}>
      <PanelLabel>{heading}</PanelLabel>
      {isClimbingArea ? (
        <CragList>
          {memberFeatures.map((item) => (
            <CragItem key={getOsmappLink(item)} feature={item} />
          ))}
        </CragList>
      ) : (
        <ul>
          {memberFeatures.map((item) => (
            <Item key={getOsmappLink(item)} feature={item} />
          ))}
        </ul>
      )}
    </Box>
  );
};
