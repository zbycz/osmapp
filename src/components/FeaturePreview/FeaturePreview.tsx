import React from 'react';
// import styled from 'styled-components';
// import { Button } from '@material-ui/core';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
// import { ClosePanelButton } from '../utils/ClosePanelButton';
import { getOsmappLink } from '../../services/helpers';
// import Maki from '../utils/Maki';
import { getLabel } from '../../helpers/featureLabel';

// const Wrapper = styled.div`
//   position: absolute;
//   z-index: 1200; // 1300 is mui-dialog
//   bottom: 40px;
//   left: 45%;
//   max-width: 45vw;

//   .MuiButtonBase-root {
//     text-transform: none;
//   }
// `;

export const FeaturePreview = () => {
  const { preview, setPreview, setFeature } = useFeatureContext();

  if (!preview || preview.noPreviewButton) {
    return null;
  }

  const handleClick = () => {
    setPreview(null);
    setFeature({ ...preview, skeleton: true }); // skeleton needed so map doesnt move (Router will create new coordsFeature)
    Router.push(`${getOsmappLink(preview)}${window.location.hash}`); // this will create brand new coordsFeature()
  };

  const onClose = () => {
    setPreview(null);
  };

  return (
    <div className="z-10 flex absolute bottom-10 left-1/2 transform -translate-x-1/2">
      <button
        // TODO make this the correct colors
        type="button"
        className="flex items-center justify-center gap-1 min-w-fit bg-blue-500 text-white font-medium py-2 px-4 rounded-l-md hover:brightness-110 shadow-md"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
            clipRule="evenodd"
          />
        </svg>

        <p className="pt-[1px]">{getLabel(preview)}</p>
      </button>
      {/* TODO I don't really like how this looks */}
      <button
        type="button"
        className="flex items-center justify-center min-w-fit bg-zinc-600 text-zinc-400 px-3 rounded-r-md hover:brightness-110"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
};
