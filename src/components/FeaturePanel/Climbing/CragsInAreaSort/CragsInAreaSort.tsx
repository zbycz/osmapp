import { useState } from 'react';
import { MenuItem } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { CragsInAreaSortButton } from './CragsInAreaSortButton';
import { SortBy } from './types';
import { Setter } from '../../../../types';

type CragsInAreaSortProps = {
  sortBy: SortBy;
  setSortBy: Setter<SortBy>;
};

export const CragsInAreaSort = ({
  sortBy,
  setSortBy,
}: CragsInAreaSortProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

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
      <CragsInAreaSortButton
        open={open}
        onClick={handleClick}
        sortBy={sortBy}
      />
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
