import { Setter } from '../../../../../../types';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase, ListSubheader } from '@mui/material';
import { t } from '../../../../../../services/intl';
import React from 'react';
import styled from '@emotion/styled';

const StyledListSubheader = styled(ListSubheader)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 6px 13px;
  & > svg:first-of-type {
    margin-right: 8px;
  }
`;

type Props = {
  searchText: string;
  setSearchText: Setter<string>;
};

// regarding focus in Menu: https://stackoverflow.com/a/70918883/671880

export const SearchRow = ({ searchText, setSearchText }: Props) => (
  <StyledListSubheader>
    <SearchIcon fontSize="small" />
    <InputBase
      size="small"
      autoFocus
      placeholder={t('editdialog.preset_select.search_placeholder')}
      fullWidth
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') {
          e.stopPropagation();
        }
      }}
    />
  </StyledListSubheader>
);
