import React, { useState, useEffect } from 'react'
import Router from 'next/router';
// contexts
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { useUserThemeContext } from '../../helpers/theme';
// helpers
import { t } from '../../services/intl';
import { useMobileMode } from '../helpers';

import { Combobox } from '@headlessui/react'
import { fetchChoices } from './SearchBoxNewUtils'
import { onHighlightFactory, onSelectedFactory } from './onSelectedFactoryNew';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import SearchChoice from './SearchChoice';

const SearchBoxNew = () => {
  const { view } = useMapStateContext();
  const { featureShown, feature, setFeature, setPreview } = useFeatureContext();
  const { currentTheme } = useUserThemeContext();
  const mobileMode = useMobileMode();
  // states
  const [query, setQuery] = useState(''); // the query string
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const closePanel = () => {
    setQuery('');
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  };

  useEffect(() => {
    // reset if query is empty
    if (query === '') {
      setChoices([]);
      setSelectedChoice(null);
      return;
    }
    // fetch choices
    fetchChoices(query, view, setChoices)
  }, [query])

  // when selected changes
  useEffect(() => {
    if (selectedChoice === null) return;
    console.log('selectedChoice', selectedChoice)
    onSelectedFactory(setFeature, setPreview, mobileMode, selectedChoice)
  }, [selectedChoice])
  
  return (
    <Combobox value={selectedChoice} onChange={setSelectedChoice}>
      {/* input container */}
      <div className="relative">
        <Combobox.Input className="bg-zinc-800 shadow-md shadow-black/30 p-2 rounded-md placeholder-zinc-400 text-zinc-200 pl-12 w-full h-12 border-2 border-zinc-600 outline-0 hover:brightness-125 transition"
          placeholder={t('searchbox.placeholder')}
          displayValue={(choice) => {
            // TODO this is kinda broken... sorta... (it works just not how I wanted it to)
            if (choice === null) return query;
            return choice.properties.name
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            onHighlightFactory(setPreview)
          }}
          spellCheck="false"
        />

        {/* close button */}
        <div className="absolute top-0 bottom-0 right-4 flex items-center">
          {featureShown && <ClosePanelButton onClick={closePanel} />}
        </div>

        {/* magnifying glass icon */}
        <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      {/* choices */}
      <Combobox.Options className="bg-zinc-800 rounded-md overflow-y-auto shadow-md shadow-black/30 ">
        {choices.map((choice, index) => (
          <Combobox.Option key={index} value={choice} className="bg-zinc-800">
            {/* TODO replace with a new component */}
            {({ active, selected }) => (
              <li
                className={`flex justify-between p-2 transition duration-100
                ${
                  active ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <SearchChoice query={query} choice={choice} />
              </li>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
      
    </Combobox>
  )
}

export default SearchBoxNew