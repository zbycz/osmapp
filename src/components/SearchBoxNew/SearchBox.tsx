import React, { useState, useEffect } from 'react';
import Router from 'next/router';
// headlessUI
import { Combobox } from '@headlessui/react';
// icons
import { XMarkIcon } from '@heroicons/react/24/outline';
// context
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
// helpers
import { t } from '../../services/intl';
import { useMobileMode } from '../helpers';
import { fetchChoices } from './searchBoxUtils';
import { onHighlightFactory, onSelectedFactory } from './onSelectedFactoryNew';
// components
import SearchChoice from './SearchChoice';

interface Choice {
  id: string;
  properties: {
    name: string;
  };
}

const SearchBox = () => {
  const { view } = useMapStateContext();
  const mobileMode = useMobileMode();
  const { featureShown, feature, setFeature, setPreview } = useFeatureContext();

  const [query, setQuery] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  // close feature panel button (clear selection basically)
  function closePanel() {
    setQuery('');
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  }

  // on query change
  useEffect(() => {
    // reset if query is empty
    if (query === '') {
      setChoices([]);
      setSelectedChoice(null);
      return;
    }
    // fetch choices
    fetchChoices(query, view, setChoices);
  }, [query]);

  // when selected changes
  useEffect(() => {
    if (selectedChoice === null) return;
    onSelectedFactory(setFeature, setPreview, mobileMode, selectedChoice);
  }, [selectedChoice]);

  return (
    <Combobox value={selectedChoice} onChange={setSelectedChoice}>
      {/* input container */}
      <div className="relative">
        {/* input */}
        <Combobox.Input
          className="bg-white dark:bg-zinc-800 shadow-md shadow-black/20 p-2 rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-800 dark:text-zinc-200 pl-12 w-full h-12 outline-0 transition truncate"
          // @ts-ignore
          placeholder={t('searchbox.placeholder')}
          displayValue={(choice: Choice | null) => {
            if (choice === null) return query;
            return choice.properties.name;
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            onHighlightFactory(setPreview, {});
          }}
          spellCheck="false"
        />

        {/* close button */}
        <div className="absolute top-0 bottom-0 right-4 flex items-center">
          {featureShown && (
            <button type="button" onClick={closePanel}>
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-400" />
            </button>
          )}
        </div>

        {/* search icon */}
        {/* magnifying glass icon */}
        <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      {/* Choices */}
      <Combobox.Options className="rounded-md overflow-y-auto shadow-md shadow-black/20 z-10">
        {choices.map((choice) => (
          <Combobox.Option key={choice.id} value={choice}>
            {/* TODO replace with a new component */}
            {({ active }) => (
              <li
                className={`flex justify-between p-2 transition duration-100
                ${
                  active
                    ? 'bg-zinc-200 dark:bg-zinc-700'
                    : 'bg-white dark:bg-zinc-800'
                }`}
              >
                <SearchChoice query={query} choice={choice} />
              </li>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default SearchBox;
