import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    margin: 0;
    padding: 0;
    height: 100%;
    border: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f8f4f0;
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
  }

  ul {
    margin-top: 0;
  }

  .mapboxgl-ctrl-top-right {
    top: 83px !important;
  }

  .mapboxgl-canvas {
    outline: 0;
  }

  @keyframes blink {50% { color: transparent }}
  .dotloader { animation: 1s blink infinite }
  .dotloader:nth-child(2) { animation-delay: 250ms }
  .dotloader:nth-child(3) { animation-delay: 500ms }
`;
export default GlobalStyle;
