import React from 'react';
import Image from 'next/image';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {
  PanelFooter,
  PanelWrapper,
  PanelScrollbars,
} from '../utils/PanelHelpers';
import { useBoolState } from '../helpers';
import LogoOsmapp from '../../assets/LogoOsmapp';
// import Link from 'next/link'

export const Content = styled.div`
  height: calc(100vh - 72px); // 100% - TopPanel - FeatureImage
  padding: 20px 2em 0 2em;
`;

const ClosePanelButton = ({ hide }) => (
  <IconButton
    aria-label="Zavřít panel"
    onClick={(e) => {
      e.preventDefault();
      hide();
    }}
    style={{ position: 'absolute', right: 0 }}
  >
    <CloseIcon />
  </IconButton>
);

const StyledLogoOsmapp = styled(LogoOsmapp)`
  width: 41%;
  height: auto;
  margin-top: 3em;
`;

const Center = styled.div`
  text-align: center;
  margin-bottom: 2em;
`;

const Spacer = styled.div`
  padding-bottom: 2em;
`;

export const HomepagePanel = () => {
  const [hidden, hide] = useBoolState(false);

  if (hidden) {
    return null;
  }

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ClosePanelButton hide={hide} />
        <Content>
          <div>
            <Center>
              <StyledLogoOsmapp width={130} height={130} className="" />
              <Typography variant="h4" component="h1" color="inherit">
                OsmAPP
              </Typography>
              <Typography
                variant="subtitle1"
                component="h2"
                color="textSecondary"
              >
                A universal OpenStreetMap app
              </Typography>
            </Center>

            <Typography variant="body1" paragraph>
              Start by typing your query into the searchbox. <br />
              Or click any item on the map.
            </Typography>

            <Typography variant="body2" paragraph>
              eg. <a href="/way/34633854">Empire State Building</a> •{' '}
              <a href="/way/119016167">Statues of Charles bridge</a>
            </Typography>

            <Center>
              <Image
                src="/osmapp-screenshot.png"
                alt="Screenshot of OsmAPP"
                width={300}
                height={300 * (1033 / 1371)}
              />
            </Center>

            <Spacer />

            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={4}>
                <Image
                  src="/logo-osm-opt.svg"
                  alt="Logo OpenStreetMap"
                  width={100}
                  height={100}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" paragraph>
                  All map data is from{' '}
                  <a href="https://osm.org">OpenStreetMap</a>, a map created by
                  milions of contributors — similar to Wikipedia. You can find{' '}
                  <em>Suggest Edit</em> button on each map feature.
                </Typography>
              </Grid>
            </Grid>

            <Spacer />

            <Typography variant="body2" paragraph>
              This application was created with the aim of providing best
              OpenStreetMap experience for everyone. Currently it is in beta
              stage, but more features are planned - like switching layers,
              vector outdoor map, driving directions, POI editing capabilites,
              favourite places, etc.
            </Typography>

            <Typography variant="body2" paragraph>
              You may suggest new features on{' '}
              <a href="https://github.com/zbycz/osmapp">Github</a>.
            </Typography>
            <Spacer />
            <Typography variant="body2" paragraph>
              Special thanks to:
            </Typography>
            <ul>
              <li>
                <a href="https://www.maptiler.com/">MapTiler</a> for vector map
                source
              </li>
              <li>
                <a href="https://www.mapillary.com/">Mapillary</a>,{' '}
                <a href="https://openstreetmap.cz/fody">Fody</a>,{' '}
                <a href="https://www.wikipedia.org/">Wikipedia</a> for images
              </li>
              <li>
                <a href="https://nominatim.openstreetmap.org/">Nominatim</a> for
                search box
              </li>
              <li>
                <a href="https://www.openstreetmap.org/">OpenStreetMap</a> for
                the best world map database
              </li>
            </ul>
          </div>
          <PanelFooter />
        </Content>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
