import { createGlobalStyle } from 'styled-components';
import { isDesktop } from '../components/helpers';

export const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    margin: 0;
    padding: 0;
    height: 100%;
    border: 0;
    font-family: 'Roboto', sans-serif;
    background-color: ${({ theme }) => theme.palette.appBackground};
  }

  body {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  a, .linkLikeButton {
    color: ${({ theme }) => theme.palette.link};
    text-decoration: none;
    border: 0;
    padding: 0;
    font: inherit;
    background: transparent;
    outline: 0;
    cursor: pointer;

    &.colorInherit {
      color: inherit;
    }

    &:hover {
      text-decoration: underline;
    }

    &:focus {
      text-decoration: underline;
    }
  }

  ul {
    margin-top: 0;
  }

  .mapboxgl-ctrl-group {
    background: ${({ theme }) => theme.palette.background.default} !important;
    .mapboxgl-ctrl-icon {
      filter: ${({ theme }) => theme.palette.invertFilter};
    }
    button+button {
      border-top: 1px solid ${({ theme }) => theme.palette.divider};
    }
  }

  .mapboxgl-ctrl-top-right {
    top: ${83 + 72}px  !important;

    @media ${isDesktop} {
      top: 83px !important;
    }
  }

  .mapboxgl-canvas:not(:focus) {
    outline: 0;
  }

  @keyframes blink {
    50% {
      color: transparent
    }
  }

  .dotloader {
    animation: 1s blink infinite
  }

  .dotloader:nth-child(2) {
    animation-delay: 250ms
  }

  .dotloader:nth-child(3) {
    animation-delay: 500ms
  }

  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.2) !important;
  }
`;
