import styled from '@emotion/styled';
import { isDesktopResolution } from '../../helpers';

export const Table = styled.table`
  font-size: 1rem;
  width: 100%;

  th,
  td {
    padding: 0.1em;
    overflow: hidden;
    vertical-align: baseline;
    word-break: break-all;

    @media ${isDesktopResolution} {
      &:hover .show-on-hover {
        display: flex !important;
      }
    }
  }

  th {
    width: 140px;
    max-width: 140px;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
    padding-left: 0;
  }

  table {
    padding-left: 1em;
    padding-bottom: 1em;
  }
`;
