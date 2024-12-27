import styled from '@emotion/styled';

const WarningSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#ff0000' width="20"><path d='M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z'/></svg>`;
const WarningSvgDataUrl = `url("data:image/svg+xml,${encodeURIComponent(WarningSvg)}")`;

/**
 * This is replacement for MUI's TextField,
 * it was rendering 4 seconds for 200 tags.
 * (eg  node/1601837931)
 */
export const FastInput = styled.input<{ error?: boolean }>`
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  height: 32px;
  padding: 0 8px;
  font-size: 13px;

  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) => theme.palette.background.paper};

  border: 1px solid ${({ theme }) => theme.palette.action.disabled};
  ${({ theme, error }) => error && `border-color: ${theme.palette.error.main};`}
  border-radius: 4px;

  ${({ error }) =>
    error &&
    `background: ${WarningSvgDataUrl} no-repeat right 8px center; padding-right: 35px;`}

  &:hover {
    border-color: ${({ theme }) => theme.palette.secondary.main};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.primary.main};
    border-width: 2px;
  }

  transition: border-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  -webkit-animation-name: mui-auto-fill-cancel;
  animation-name: mui-auto-fill-cancel;
  -webkit-animation-duration: 10ms;
  animation-duration: 10ms;
`;
