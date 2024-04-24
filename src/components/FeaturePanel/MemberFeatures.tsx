import React from 'react';
import styled from 'styled-components';
import { Box, Tooltip } from '@material-ui/core';
import Router from 'next/router';
import PhotoIcon from '@material-ui/icons/Photo';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature } from '../../services/types';
import { getLabel } from '../../helpers/featureLabel';
import { useUserThemeContext } from '../../helpers/theme';
import { useMobileMode } from '../helpers';
import Maki from '../utils/Maki';
import { PanelLabel } from './Climbing/PanelLabel';

const ArrowIcon = styled(ArrowForwardIosIcon)`
  opacity: 0.2;
  margin-left: 12px;
`;

const Container = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  padding: 12px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;

const CragList = styled.div`
  margin: 12px 0;
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
  font-size: 18px;
  color: ${({ theme }) => theme.palette.primary.main};
`;
const NumberOfRoutes = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.secondary.main};
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

  const cragPhotos = Object.keys(feature.tags).filter((k) =>
    k.startsWith('wikimedia_commons'),
  );

  return (
    <Anchor
      href={`/${getUrlOsmId(osmMeta)}`}
      onClick={handleClick}
      onMouseEnter={mobileMode ? undefined : handleHover}
      onMouseLeave={() => setPreview(null)}
    >
      <Container>
        <Content>
          <CragName>{getLabel(feature)}</CragName>{' '}
          {feature.members?.length > 0 && (
            <NumberOfRoutes>{feature.members.length} routes </NumberOfRoutes>
          )}
        </Content>
        {cragPhotos.length === 1 && (
          <Tooltip title="This crag has photo">
            <PhotoIcon color="secondary" />
          </Tooltip>
        )}
        {cragPhotos.length > 1 && (
          <Tooltip title={`This crag has ${cragPhotos.length} photos`}>
            <PhotoLibraryIcon color="secondary" />
          </Tooltip>
        )}
        <ArrowIcon color="primary" />
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
