import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Share from '@material-ui/icons/Share';
import StarBorder from '@material-ui/icons/StarBorder';
import Directions from '@material-ui/icons/Directions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Head from 'next/head';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import Property from './Property';
import FeatureHeading from './FeatureHeading';
import FeatureImage from './FeatureImage';
import Coordinates from './Coordinates';
import { capitalize, useBoolState, useToggleState } from '../helpers';
import { icons } from '../../assets/icons';
import TagsTable from './TagsTable';
import Maki from '../utils/Maki';
import { getShortId, getShortLink, getUrlOsmId } from '../../services/helpers';
import EditDialog from './EditDialog';
import { SHOW_PROTOTYPE_UI } from '../../config';
import {
  PanelContent,
  PanelFooter,
  PanelWrapper,
  PanelScrollbars,
} from '../utils/PanelHelpers';
import { Feature } from '../../services/types';

const StyledEdit = styled.div`
  margin: 60px 0 20px 0;
  text-align: center;
`;

const Spacer = styled.div`
  padding-bottom: 10px;
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
  position: relative;
  width: 100%;
  svg {
    vertical-align: bottom;
  }
  span {
    position: absolute;
    left: 20px;
  }
`;

const featuredKeys = ['website', 'phone', 'opening_hours'];

const FeaturePanel = ({ feature }: { feature: Feature }) => {
  const [advanced, toggleAdvanced] = useToggleState(false);
  const [open, handleOpen, handleClose] = useBoolState(false);

  const {
    nonOsmObject,
    tags,
    layer,
    osmMeta,
    properties,
    skeleton,
    error,
  } = feature;

  const shortLink = getShortLink(osmMeta);
  const ico = icons.includes(properties.class)
    ? properties.class
    : 'information';
  const subclass = properties.subclass || (layer && layer.id) || '?';
  const featuredTags = featuredKeys
    .map((k) => [k, tags[k]])
    .filter((x) => x[1]);

  // TODO resolve all getPoiClass

  return (
    <PanelWrapper>
      {!nonOsmObject && (
        <Head>
          <title>{tags.name || subclass} · OsmAPP</title>
        </Head>
      )}
      <PanelScrollbars>
        <FeatureImage feature={feature} ico={ico}>
          <PoiType>
            <Maki ico={ico} />
            <span>{tags.name ? subclass : 'beze jména'}</span>
          </PoiType>

          {SHOW_PROTOTYPE_UI && (
            <>
              <StyledIconButton>
                <Share htmlColor="#fff" titleAccess="Sdílet" />
              </StyledIconButton>
              <StyledIconButton>
                <StarBorder htmlColor="#fff" titleAccess="Uložit" />
              </StyledIconButton>
              <StyledIconButton>
                <Directions htmlColor="#fff" titleAccess="Trasa" />
              </StyledIconButton>
            </>
          )}
        </FeatureImage>
        <PanelContent>
          <FeatureHeading title={tags.name || subclass} />

          {error === 'gone' && (
            <Alert variant="outlined" severity="warning">
              Tento prvek byl v mezičase smazán z OpenStreetMap.{' '}
              <a
                href={`https://osm.org/${getUrlOsmId(feature.osmMeta)}/history`}
              >
                Historie &raquo;
              </a>
            </Alert>
          )}

          {!advanced && !!featuredTags.length && (
            <>
              {featuredTags.map(([k, v]) => (
                <Property key={k} k={k} v={v} />
              ))}
              <Spacer />

              <Typography
                variant="overline"
                display="block"
                color="textSecondary"
              >
                Další informace
              </Typography>
            </>
          )}

          <TagsTable
            tags={tags}
            except={advanced ? [] : ['name', 'layer', ...featuredKeys]}
          />

          {!skeleton && (
            <StyledEdit>
              <Button
                size="large"
                title="Upravit místo v živé databázi OSM"
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary"
                onClick={handleOpen}
              >
                Upravit místo
              </Button>
            </StyledEdit>
          )}

          <EditDialog
            open={open}
            handleClose={handleClose}
            feature={feature}
            key={getShortId(feature.osmMeta) + (skeleton && 'skel')}
          />

          <PanelFooter>
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
          </PanelFooter>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};

export default FeaturePanel;
