import React from 'react';
// import styled from 'styled-components';
// import LayersIcon from './LayersIcon';
import { t } from '../../services/intl';
// import { isDesktop } from '../helpers';

// const TopRight = styled.div`
//   position: absolute;
//   z-index: 1000;
//   padding: 10px;
//   right: 0;
//   top: 72px;

//   @media ${isDesktop} {
//     top: 0;
//   }
// `;

// const StyledLayerSwitcher = styled.button`
//   margin: 0;
//   padding: 0;
//   width: 52px;
//   height: 69px;
//   border-radius: 5px;
//   border: 0;
//   box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
//   background-color: ${({ theme }) => theme.palette.background.default};
//   font-size: 12px;
//   color: ${({ theme }) => theme.palette.text.primary};
//   outline: 0;
//   cursor: pointer;

//   &:hover,
//   &:focus {
//     background-color: ${({ theme }) => theme.palette.background.hover};
//   }

//   svg {
//     margin: 4px auto 4px auto;
//   }
// `;

export const LayerSwitcherButton = ({ onClick }: { onClick?: any }) => (
  <div className="absolute p-2 top-20 sm:top-0 right-0">
    <button
      type="button"
      className="z-10 flex h-16 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-600 bg-zinc-800 text-zinc-300 p-2 shadow-md hover:brightness-125"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
        <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
        <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
      </svg>

      <p>{t('layerswitcher.button')}</p>
    </button>
  </div>
);
