import { MenuItem, Typography } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { CragsInAreaSortIcon } from './CragsInAreaSortIcon';
import { SortBy } from './types';

type CragsInAreaSortProps = {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
};

export const CragsInAreaSort = ({
  sortBy,
  setSortBy,
}: CragsInAreaSortProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSortClick = (sortBy: SortBy) => () => {
    setSortBy(sortBy);
    handleClose();
  };

  return (
    <>
      <CragsInAreaSortIcon open={open} onClick={handleClick} sortBy={sortBy} />
      <PopperWithArrow
        title={t('crag_sort.title')}
        isOpen={open}
        anchorEl={anchorEl}
        placement="left-start"
        offset={[-10, 15]}
      >
        <MenuItem
          selected={sortBy === 'default'}
          onClick={handleSortClick('default')}
        >
          {t('crag_sort.option_default')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'routes'}
          onClick={handleSortClick('routes')}
        >
          {t('crag_sort.option_routes')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'photos'}
          onClick={handleSortClick('photos')}
        >
          {t('crag_sort.option_photos')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'alphabetical'}
          onClick={handleSortClick('alphabetical')}
        >
          {t('crag_sort.option_alphabetical')}
        </MenuItem>
      </PopperWithArrow>
    </>
  );
};
