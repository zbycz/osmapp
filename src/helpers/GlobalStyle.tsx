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

    // disable pulling the page around on mobile
    overscroll-behavior: none;
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

  .maplibregl-ctrl-group {
    background: ${({ theme }) => theme.palette.background.default} !important;
    .maplibregl-ctrl-icon {
      filter: ${({ theme }) => theme.palette.invertFilter};
    }
    button+button {
      border-top: 1px solid ${({ theme }) => theme.palette.divider};
    }
  }

  .maplibregl-ctrl-top-right {
    top: ${83 + 72}px  !important;

    @media ${isDesktop} {
      top: 83px !important;
    }
  }

  .maplibregl-canvas:not(:focus) {
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
  .Resizer.horizontal {
    height: 15px;
    margin: -7px 0;
    z-index: 100000;
    cursor: row-resize;
    display: flex;
    justify-content: center;
    &::before {
      position: absolute;
      content:'...';
      border-radius: 6px;
      width: 40px;
      height: 12px;
      background:${({ theme }) => theme.backgroundPrimarySubtleOnElevation0};
      margin-top: 1px;
      z-index: 1;
      transition: all 0.1s ease;
      border: solid 1px ${({ theme }) => theme.borderOnElevation0};
      text-align: center;
      line-height: 0px;
      font-size:20px;
      color: ${({ theme }) => theme.textPrimaryDefault};
      letter-spacing: 1px;
    }

    &:hover {
      &::before {
        background-color: ${({ theme }) => theme.borderSecondary};
        border: solid 1px ${({ theme }) => theme.borderSecondary};
        color: ${({ theme }) => theme.textOnPrimary};
      }
      &::after {
      border-color: ${({ theme }) => theme.borderSecondary};
      transition: all 0.5s ease-out;
      border-width: 1px;
      margin-top: 6px;

    }
    }
    &::after {
      position: absolute;
      content:'';

      width: 100%;
      height: 1px;
      margin-top: 7px;
      border-top: solid 1px #222;
      transition: all 0.1s ease;

    }
  }
  .Pane.horizontal.Pane2  {
    margin-top: 0;
    overflow: auto
  }
  .Pane2 {
    overflow: auto;

    /* TODO cover for light mode wrong Cover color */
    background:
      /* Shadow Cover TOP */ radial-gradient(
        farthest-side at 50% 0,
        ${({ theme }) => theme.palette.panelBackground},
        ${({ theme }) => theme.palette.panelBackground}
      )
      center top,
      /* Shadow Cover BOTTOM */ radial-gradient(
        farthest-side at 50% 100%,
        ${({ theme }) => theme.palette.panelBackground},
        ${({ theme }) => theme.palette.panelBackground}
      )
      center bottom,
      /* Shadow TOP */ radial-gradient(
        farthest-side at 50% 0,
        ${({ theme }) => theme.palette.panelScrollCover},
        transparent
      )
      center top,
      /* Shadow BOTTOM */ radial-gradient(
        farthest-side at 50% 100%,
        ${({ theme }) => theme.palette.panelScrollCover},
        transparent
      )
      center bottom;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
    background-attachment: local, local, scroll, scroll;

    background-color: ${({ theme }) => theme.palette.panelBackground};
  }
`;
