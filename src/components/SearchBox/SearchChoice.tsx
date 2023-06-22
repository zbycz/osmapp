import React from 'react';
// import { useUserThemeContext } from '../../helpers/theme';

import { getPoiClass } from '../../services/getPoiClass';
import { highlightText } from './highlightText';
// import { getDistance, useMapCenter, getAdditionalText, buildPhotonAddress } from './searchBoxUtils'
import { getAdditionalText, buildPhotonAddress } from './searchBoxUtils';

const SearchChoice = ({ query, choice }) => {
  // const theme = useUserThemeContext()
  // const mapCenter = useMapCenter()
  const { properties } = choice;
  // const { properties, geometry } = choice
  const { name, osm_key: tagKey, osm_value: tagValue } = properties;
  // const { lat, lon } = geometry
  // const distance = getDistance(mapCenter, { lat, lon }) / 1000;
  // const distanceKm = distance < 10 ? Math.round(distance * 10) / 10 : Math.round(distance); // TODO save imperial to mapState and multiply 0.621371192
  const text = name || buildPhotonAddress(properties);
  const additionalText = getAdditionalText(properties);
  const poiClass = getPoiClass({ [tagKey]: tagValue });

  return (
    <div className="w-full flex gap-4 items-center px-2 py-1">
      <div className="flex flex-col justify-center items-center min-w-fit">
        {/* icon */}
        <img
          src={`/icons/${poiClass.class}_11.svg`}
          className="w-6 h-6 opacity-50 dark:invert"
          alt={poiClass.class}
          title={`${tagKey}=${tagValue}`}
        />
        {/* TODO getting NaN from distanceKm, just put 123 as placeholder */}
        <div className="text-zinc-400">123 km</div>
      </div>

      {/* text */}
      <div className="cursor-pointer w-full">
        <div className="flex gap-4">
          <h3 className="text-zinc-800 dark:text-zinc-200">
            {highlightText(text, query)}
          </h3>
        </div>
        <p className="text-zinc-400 line-clamp-1">{additionalText}</p>
      </div>
    </div>
  );
};

export default SearchChoice;
