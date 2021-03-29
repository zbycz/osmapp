import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
  PanelContent,
  PanelFooter,
  PanelWrapper,
  PanelScrollbars,
} from '../utils/PanelHelpers';
import { useBoolState } from '../helpers';
// import Link from 'next/link'

const ClosePanelButton = ({ hide }) => (
  <IconButton
    aria-label="Zavřít panel"
    onClick={(e) => {
      e.preventDefault();
      hide();
    }}
    style={{ float: 'right' }}
  >
    <CloseIcon />
  </IconButton>
);

export const HomepagePanel = () => {
  const [hidden, hide] = useBoolState(false);

  if (hidden) {
    return null;
  }

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ClosePanelButton hide={hide} />
        <PanelContent>
          <h1>OsmAPP.org</h1>
          <h2>Universal OpenStreetMap browser</h2>
          <p>Type in the searchbox, or click any map item.</p>
          <p>
            All data is from <a href="https://osm.org">OpenStreetMap</a>, a map
            everyone can edit &mdash; similar to Wikipedia.
          </p>

          <p>Examples:</p>
          <ul>
            <li>
              <a href="/way/34633854">Empire State Building</a>
            </li>
            <li>
              <a href="/way/119016167">Statues of Charles bridge</a>
            </li>
            <li>
              <a href="/node/107775">London</a>
            </li>
          </ul>

          <p>Special thanks to:</p>
          <ul>
            <li>OpenMapTiles for vector map source</li>
            <li>Mapillary, Fody, Wikipedia for images</li>
            <li>Nominatim for search box</li>
            <li>OpenStreetMap.org for the greatest world map database</li>
          </ul>

          <PanelFooter />
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
