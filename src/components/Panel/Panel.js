// @flow

import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Share from '@material-ui/icons/Share';
import StarBorder from '@material-ui/icons/StarBorder';
import Directions from '@material-ui/icons/Directions';

import MakiIcon from '../../assets/MakiIcon';
import Property from './Property';
import LogoOsm from '../../assets/LogoOsm';
import FeatureHeading from './FeatureHeading';
import FeatureImage from './FeatureImage';
import SearchBox from '../SearchBox/SearchBox';
import Coordinates from './Coordinates';
import { capitalize, useToggleState } from '../helpers';
import IconButton from '@material-ui/core/IconButton';
import maki from './maki';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #fafafa;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  margin: 20px 15px;
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
const TagsTable = styled.table`
  margin-top: 1em;
  font-size: 1rem;

  th {
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
  }
`;

const Loading = styled.div`
  height: 0;
`;

const featuredKeys = ['phone', 'website', 'opening_hours'];
const getShortLink = apiId => `https://osmap.cz/${apiId.type}/${apiId.id}`;

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

const Maki = styled.span`
  display: inline-block;
  width: ${({ ico }) => ico.width}px;
  height: ${({ ico }) => ico.height}px;
  background: url('https://openmaptiles.github.io/osm-bright-gl-style/sprite.png')
    ${({ ico }) => `-${ico.x}px -${ico.y}px`};
`;

export const Panel = ({ feature }) => {
  const [tagsShown, toggleTags] = useToggleState(false);

  const {
    loading,
    nonOsmSkeleton,
    geometry,
    tags,
    osmMeta,
    properties,
  } = feature;
  const shortLink = getShortLink(osmMeta);
  const featuredProperties = featuredKeys.map(k => [k, tags[k]]);
  const ico = maki[properties.class + '_11'];

  return (
    <Wrapper>
      <TopPanel>
        <SearchBox />
      </TopPanel>
      <FeatureImage link="http://upload.zby.cz/golden-gate-bridge.jpg">
        <PoiType>
          {ico ? <Maki ico={ico} /> : <MakiIcon color="#fff" />}
          {properties.subclass}
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
        <FeatureHeading title={tags.name} />

        {tagsShown && (
          <TagsTable>
            <tbody>
              {Object.entries(tags).map(([k, v]) => (
                <tr key={k}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </TagsTable>
        )}

        {!tagsShown &&
          featuredProperties.map(([k, v]) => <Property key={k} k={k} v={v} />)}

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
          {!nonOsmSkeleton && <a href={shortLink}>{shortLink}</a>}
          <br />
          <label>
            <input type="checkbox" onChange={toggleTags} checked={tagsShown} />{' '}
            Zobrazit tagy
          </label>
        </Footer>
      </Content>
    </Wrapper>
  );
};

export default Panel;
