import * as React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../utils/MapStateContext';
import GithubIcon from '../../assets/GithubIcon';
import packageJson from '../../../package.json';

const Box = styled.div`
  margin-top: 10px;
  padding: 2px;
  font-size: 12px;
  line-height: normal;
  color: #000;
  background-color: #f8f4f0; /* same as osm-bright */

  svg {
    vertical-align: -2px;
    margin-right: 4px;
  }
`;

const OsmappLink = () => (
  <>
    <GithubIcon width="12" height="12" />
    <a href="https://github.com/zbycz/osmapp">osmapp</a> {packageJson.version}
  </>
);

const EditLink = () => {
  const { view } = useMapStateContext();
  return (
    <a
      href={`https://www.openstreetmap.org/edit#map=${view.join('/')}`}
      title="v editoru iD"
      target="_blank"
      rel="noopener"
    >
      editovat
    </a>
  );
};

const MapDataLink = () => (
  <>
    {'© '}
    <button
      type="button"
      className="linkLikeButton"
      // eslint-disable-next-line no-alert
      onClick={() => alert('(c) OpenStreetMap.org contributors')}
    >
      mapová data
    </button>
  </>
);

export const MapFooter = () => (
  <Box>
    <OsmappLink />
    {' | '}
    <MapDataLink />
    {' | '}
    <EditLink />
  </Box>
);
