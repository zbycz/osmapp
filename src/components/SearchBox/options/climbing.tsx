import { GridLegacy } from '@mui/material';
import React from 'react';
import {
  getHumanDistance,
  highlightText,
  IconPart,
  useMapCenter,
} from '../utils';
import { fetchJson } from '../../../services/fetch';
import { ClimbingOption, Option } from '../types';
import { View } from '../../utils/MapStateContext';
import { PoiIcon } from '../../utils/icons/PoiIcon';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { Feature } from '../../../services/types';
import Router from 'next/router';
import { CLIMBING_TILES_HOST } from '../../../services/osm/consts';
import { PROJECT_ID } from '../../../services/project';
import { ClimbingSearchRecord } from '../../../types';
import { GeocoderAborted } from './geocoder';

const getApiUrl = (inputValue: string, view: View) => {
  const [_zoom, lat, lon] = view;
  const q = encodeURIComponent(inputValue);
  return `${CLIMBING_TILES_HOST}api/climbing-tiles/search?q=${q}&lon=${lon}&lat=${lat}`;
};

export const CLIMBING_SEARCH_ABORTABLE_QUEUE = 'climbing-search';

export const fetchClimbingSearchOptions = async (
  inputValue: string,
  view: View,
  abortQueue: string = CLIMBING_SEARCH_ABORTABLE_QUEUE,
): Promise<Option[]> => {
  if (PROJECT_ID !== 'openclimbing') {
    return [];
  }

  try {
    const records = await fetchJson<ClimbingSearchRecord[]>(
      getApiUrl(inputValue, view),
      { abortableQueueName: abortQueue },
    );

    const options = records || [];
    return options.map((record) => ({
      type: 'climbing' as const,
      climbing: record,
    }));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeocoderAborted();
    }
    throw e;
  }
};

type Props = {
  option: ClimbingOption;
  inputValue: string;
};

export const ClimbingRow = ({ option, inputValue }: Props) => {
  const mapCenter = useMapCenter();
  const { isImperial } = useUserSettingsContext().userSettings;
  const { name, type, lon, lat } = option.climbing;

  const distance = getHumanDistance(isImperial, mapCenter, [lon, lat]);

  return (
    <>
      <IconPart>
        <PoiIcon tags={{ climbing: 'area' }} size={20} />
        <div>{distance}</div>
      </IconPart>
      <GridLegacy item xs>
        {highlightText(name, inputValue)}
        {/*<Typography variant="body2" color="textSecondary">*/}
        {/*  {additionalText}*/}
        {/*</Typography>*/}
      </GridLegacy>
    </>
  );
};

type SetFeature = (feature: Feature | null) => void;

export const climbingOptionSelected = (
  option: ClimbingOption,
  setFeature: SetFeature,
) => {
  const { osmType, osmId } = option.climbing;

  // addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);
  //setFeature(skeleton);
  //fitBounds(option);
  Router.push(`/${osmType}/${osmId}`);
};
