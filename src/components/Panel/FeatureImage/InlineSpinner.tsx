import styled from 'styled-components';

export const InlineSpinner = styled.div`
  position: absolute;
  right: 28px;
  top: 2px;

  &,
  &:before,
  &:after {
    border-radius: 50%;
    width: 8px;
    height: 8px;
    animation-fill-mode: both;
    animation: inline-spinner 1.8s infinite ease-in-out;
  }
  & {
    color: #eee;
    font-size: 8px;
    margin: 0px auto;
    text-indent: -9999em;
    transform: translateZ(0);
    animation-delay: -0.16s;
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
  }
  &:before {
    left: -17px;
    animation-delay: -0.32s;
  }
  &:after {
    left: 17px;
  }
  @-webkit-keyframes inline-spinner {
    0%,
    80%,
    100% {
      box-shadow: 0 8px 0 -1.3em;
    }
    40% {
      box-shadow: 0 8px 0 0;
    }
  }
  @keyframes inline-spinner {
    0%,
    80%,
    100% {
      box-shadow: 0 8px 0 -1.3em;
    }
    40% {
      box-shadow: 0 8px 0 0;
    }
  }
`;
