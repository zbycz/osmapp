import { createGlobalStyle } from 'styled-components';
import { isDesktop } from '../components/helpers';

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    margin: 0;
    padding: 0;
    height: 100%;
    border: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f8f4f0;
  }

  body {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  a, .linkLikeButton {
    color: #0078a8;
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
      //svg {
      //  outline: -webkit-focus-ring-color auto 1px;
      //}
    }
  }

  ul {
    margin-top: 0;
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
export default GlobalStyle;
