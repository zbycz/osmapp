// @flow

import * as React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Share from '@material-ui/icons/Share';
import StarBorder from '@material-ui/icons/StarBorder';
import Directions from '@material-ui/icons/Directions';
import IconButton from '@material-ui/core/IconButton';
import Property from './Property';
import LogoOsm from '../../assets/LogoOsm';
import FeatureHeading from './FeatureHeading';
import FeatureImage from './FeatureImage';
import SearchBox from '../SearchBox/SearchBox';
import Coordinates from './Coordinates';
import { capitalize, useToggleState } from '../helpers';
import makiFiles from './makiFiles';
import TagsTable from './TagsTable';
import Maki from '../utils/Maki';
import { getShortLink } from '../../services/helpers';

// custom scrollbar
// better: https://github.com/rommguy/react-custom-scroll
// maybe https://github.com/malte-wessel/react-custom-scrollbars (larger)
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 410px;
  background-color: #fafafa;

  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px - 238px); // 100% - TopPanel - FeatureImage
  padding: 20px 15px;
`;

const TopPanel = styled.div`
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 12px;
  box-sizing: border-box;
`;

const StyledEdit = styled.div`
  margin: 40px 0 20px 0;
  text-align: center;
`;

const Footer = styled.div`
  color: rgba(0, 0, 0, 0.54);
  margin-top: auto;
  font-size: 1rem;
  line-height: 1.5;
`;

const Loading = styled.div`
  height: 0;
`;

const StyledIconButton = styled(IconButton)`
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PoiType = styled.div`
  color: #fff;
  margin: 0 auto 0 15px;
  font-size: 13px;

  svg {
    vertical-align: bottom;
    margin-right: 5px;
  }
`;

export const Panel = ({ feature }) => {
  const [tagsShown, toggleTags] = useToggleState(!false);

  const {
    loading,
    nonOsmObject,
    geometry,
    tags,
    layer,
    osmMeta,
    properties,
  } = feature;
  const shortLink = getShortLink(osmMeta);
  const featuredKeys = ['phone', 'website', 'opening_hours'];
  const featuredProperties = featuredKeys.map(k => [k, tags[k]]);
  const ico = makiFiles.includes(properties.class)
    ? properties.class
    : 'information';
  const subclass = properties.subclass || (layer && layer.id) || '?';

  // TODO resolve all getPoiClass
  // TODO copy icons from @mapbox/maki

  return (
    <Wrapper>
      <TopPanel>
        <SearchBox />
      </TopPanel>
      <Scrollbars universal autoHide style={{ height: '100%' }}>
        <FeatureImage link="http://upload.zby.cz/golden-gate-bridge.jpg">
          <PoiType>
            <Maki ico={ico} />
            {tags.name ? subclass : 'beze jména'}
          </PoiType>

          <StyledIconButton>
            <Share nativeColor="#fff" titleAccess="Sdílet" />
          </StyledIconButton>
          <StyledIconButton>
            <StarBorder nativeColor="#fff" titleAccess="Uložit" />
          </StyledIconButton>
          <StyledIconButton>
            <Directions nativeColor="#fff" titleAccess="Trasa" />
          </StyledIconButton>
        </FeatureImage>
        <Loading>{loading && <LinearProgress />}</Loading>
        <Content>
          <FeatureHeading title={tags.name || subclass} />

          {tagsShown && <TagsTable tags={tags} />}

          {!tagsShown &&
            featuredProperties.map(([k, v]) => (
              <Property key={k} k={k} v={v} />
            ))}

          <StyledEdit>
            <Button size="large" title="Upravit místo v živé databázi OSM">
              <LogoOsm width="24" height="24" style={{ marginRight: 10 }} />
              Upravit místo
            </Button>
          </StyledEdit>
          <Footer>
            {capitalize(osmMeta.type)} v databázi OpenStreetMap
            <br />
            <Coordinates feature={feature} />
            <br />
            {!nonOsmObject && <a href={shortLink}>{shortLink}</a>}
            <br />
            <label>
              <input
                type="checkbox"
                onChange={toggleTags}
                checked={tagsShown}
              />{' '}
              Zobrazit tagy
            </label>
          </Footer>
        </Content>
      </Scrollbars>
    </Wrapper>
  );
};

export default Panel;
