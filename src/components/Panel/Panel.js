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
import Coordinates from './Coordinates';
import { capitalize, useToggleState } from '../helpers';
import makiFiles from './makiFiles';
import TagsTable from './TagsTable';
import Maki from '../utils/Maki';
import { getShortLink } from '../../services/helpers';
import Head from 'next/head';
import Info from '@material-ui/icons/Info';

// custom scrollbar
// better: https://github.com/rommguy/react-custom-scroll
// maybe https://github.com/malte-wessel/react-custom-scrollbars (larger)
const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 72px; // TopPanel
  bottom: 0;
  width: 410px;
  background-color: #fafafa;
  overflow: hidden;
  z-index: 1100;

  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px - 238px); // 100% - TopPanel - FeatureImage
  padding: 20px 15px 0 15px;
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
  padding-bottom: 15px;
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
    color: #fff;
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

const featuredKeys = ['website', 'phone', 'opening_hours'];

export const Panel = ({ feature }) => {
  const [advanced, toggleAdvanced] = useToggleState(false);

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
  const ico = makiFiles.includes(properties.class)
    ? properties.class
    : 'information';
  const subclass = properties.subclass || (layer && layer.id) || '?';
  const featuredTags = featuredKeys.map(k => [k, tags[k]]).filter(x => x[1]);

  // TODO resolve all getPoiClass
  // TODO copy icons from @mapbox/maki

  return (
    <Wrapper>
      <Scrollbars universal autoHide style={{ height: '100%' }}>
        <FeatureImage feature={feature}>
          <PoiType>
            <Maki ico={ico} />
            {tags.name ? subclass : 'beze jména'}
          </PoiType>

          <StyledIconButton>
            <Share nativecolor="#fff" titleAccess="Sdílet" />
          </StyledIconButton>
          <StyledIconButton>
            <StarBorder nativecolor="#fff" titleAccess="Uložit" />
          </StyledIconButton>
          <StyledIconButton>
            <Directions nativecolor="#fff" titleAccess="Trasa" />
          </StyledIconButton>
        </FeatureImage>
        <Loading>{loading && <LinearProgress />}</Loading>
        <Content>
          <FeatureHeading title={tags.name || subclass} />

          {!advanced &&
            featuredTags.map(([k, v]) => <Property key={k} k={k} v={v} />)}

          <TagsTable
            tags={tags}
            except={advanced ? [] : ['name', 'layer', ...featuredKeys]}
            advanced={advanced}
          />

          <StyledEdit>
            <Button size="large" title="Upravit místo v živé databázi OSM">
              <LogoOsm width="24" height="24" style={{ marginRight: 10 }} />
              Upravit místo
            </Button>
          </StyledEdit>

          <Footer>
            {nonOsmObject
              ? `Mapový prvek ${osmMeta.type}`
              : `${capitalize(osmMeta.type)} v databázi OpenStreetMap`}
            <br />
            <Coordinates feature={feature} />
            <br />
            {!nonOsmObject && <a href={shortLink}>{shortLink}</a>}
            <br />
            <label>
              <input
                type="checkbox"
                onChange={toggleAdvanced}
                checked={advanced}
              />{' '}
              Zobrazit jen tagy
            </label>
          </Footer>
        </Content>
      </Scrollbars>
    </Wrapper>
  );
};

export default Panel;
