import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import { fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { getGlobalMap } from '../../services/mapStorage';
import { Feature, LineString, Point } from '../../services/types';
import { getPoiClass } from '../../services/getPoiClass';
import { getCenter } from '../../services/getCenter';
import { OsmApiId } from '../../services/helpers';

const TopPanel = styled.div`
  position: absolute;
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.palette.background.searchBox};
  padding: 10px;
  box-sizing: border-box;

  z-index: 1200;

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;

  .MuiAutocomplete-root {
    flex: 1;
  }
`;

const SearchIconButton = styled(IconButton)`
  svg {
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: 'FlipH';
  }
`;

const getApiUrl = (inputValue, view) => {
  const [zoom, lat, lon] = view;
  const lvl = Math.max(0, Math.min(16, Math.round(zoom)));
  const q = encodeURIComponent(inputValue);
  return `https://photon.komoot.io/api/?q=${q}&lon=${lon}&lat=${lat}&zoom=${lvl}`;
};

const overpassQuery = (bbox) => `[out:json][timeout:25];
(
  node["sport"="climbing"](${bbox});
  way["sport"="climbing"](${bbox});
  relation["sport"="climbing"](${bbox});
  node["climbing"="route_bottom"](${bbox});
  way["climbing"="route_bottom"](${bbox});
  relation["climbing"="route_bottom"](${bbox});
);
out body;
>;
out skel qt;`;

const getOverpassUrl = ([a, b, c, d]) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    overpassQuery([d, a, b, c]),
  )}`;

const notNull = (x) => x != null;

const getGeometry = {
  node: ({ lat, lon }): Point => ({ type: 'Point', coordinates: [lon, lat] }),
  way: (foo): LineString => {
    const { geometry } = foo;
    return {
      type: 'LineString',
      coordinates: geometry?.filter(notNull)?.map(({ lat, lon }) => [lon, lat]),
    };
  },
  relation: ({ members }): LineString => ({
    type: 'LineString',
    coordinates: members[0]?.geometry
      ?.filter(notNull)
      ?.map(({ lat, lon }) => [lon, lat]),
  }),
};

export const overpassAroundToSkeletons = (response: any): Feature[] =>
  response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = getGeometry[type]?.(element);
    return {
      type: 'Feature',
      osmMeta: { type, id },
      tags,
      properties: { ...getPoiClass(tags), tags },
      geometry,
      center: getCenter(geometry) ?? undefined,
    };
  });

// maybe take inspiration from https://github.com/tyrasd/osmtogeojson/blob/gh-pages/index.js
const osmJsonToSkeletons = (response: any): Feature[] => {
  const nodesById = response.elements
    .filter((element) => element.type === 'node')
    .reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

  const getGeometry2 = {
    node: ({ lat, lon }): Point => ({ type: 'Point', coordinates: [lon, lat] }),
    way: (way): LineString => {
      const { nodes } = way;
      return {
        type: 'LineString',
        coordinates: nodes
          ?.map((nodeId) => nodesById[nodeId])
          .map(({ lat, lon }) => [lon, lat]),
      };
    },
    relation: ({ members }): LineString => ({
      type: 'LineString',
      coordinates: members[0]?.geometry
        ?.filter(notNull)
        ?.map(({ lat, lon }) => [lon, lat]),
    }),
  };

  return response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = getGeometry2[type]?.(element);
    return {
      type: 'Feature',
      osmMeta: { type, id },
      tags,
      properties: { ...getPoiClass(tags), ...tags },
      geometry,
      center: getCenter(geometry) ?? undefined,
    };
  });
};

export const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

// https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/

const fetchOptions = throttle(async (inputValue, view, setOptions, bbox) => {
  if (inputValue === 'cli') {
    const overpass = await fetchJson(getOverpassUrl(bbox));
    console.log(overpass);
    const map = getGlobalMap();
    // put overpass features on mapbox gl map
    const features = osmJsonToSkeletons(overpass)
      .filter(
        (feature) => feature.center && Object.keys(feature.tags).length > 0,
      )
      .map((feature) => ({
        ...feature,
        id: convertOsmIdToMapId(feature.osmMeta),
      }));
    console.log('overpass geojson', features);
    map.getSource('overpass')?.setData({ type: 'FeatureCollection', features });

    setTimeout(() => {
      const result = map.queryRenderedFeatures(undefined, {
        layers: ['overpass-line-text'],
      });
      console.log('overpass rendered', result);
    }, 3000);

    setOptions([]);
    return;
  }

  const searchResponse = await fetchJson(getApiUrl(inputValue, view));
  const options = searchResponse.features;
  setOptions(options || []);
}, 400);

const SearchBox = () => {
  const { featureShown, feature, setFeature, setPreview } = useFeatureContext();
  const { view, bbox } = useMapStateContext();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const autocompleteRef = useRef();
  const mobileMode = useMobileMode();

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }
    fetchOptions(inputValue, view, setOptions, bbox);
  }, [inputValue]);

  const closePanel = () => {
    setInputValue('');
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  };

  return (
    <TopPanel>
      <StyledPaper elevation={1} ref={autocompleteRef}>
        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={options}
          autocompleteRef={autocompleteRef}
        />

        {featureShown && <ClosePanelButton onClick={closePanel} />}
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
