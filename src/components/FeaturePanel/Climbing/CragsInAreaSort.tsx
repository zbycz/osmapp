import {
  Badge,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { getWikimediaCommonsPhotoTags } from './utils/photo';
import { Feature } from '../../../services/types';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { t } from '../../../services/intl';
export type SortBy = 'default' | 'routes' | 'photos';

export const useCragsInAreaSort = () => {
  const [sortBy, setSortBy] = React.useState<SortBy>('default');

  const sortByFn = (sortBy: SortBy) => {
    switch (sortBy) {
      case 'routes':
        return (item1, item2) =>
          (item2?.members?.length || 0) - (item1?.members?.length || 0);
      case 'photos':
        return (item1, item2) => {
          return (
            getWikimediaCommonsPhotoTags(item2.tags).length -
            getWikimediaCommonsPhotoTags(item1.tags).length
          );
        };
      default:
        return () => 0;
    }
  };

  return { sortByFn, sortBy, setSortBy };
};

type CragsInAreaSortProps = {
  crags: Feature[];
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
};

export const CragsInAreaSort = ({
  crags,
  sortBy,
  setSortBy,
}: CragsInAreaSortProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (crags.length <= 1) return null;

  const handleSortClick = (sortBy: SortBy) => () => {
    setSortBy(sortBy);
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('crag_sort.title')}>
        <IconButton color="primary" edge="end" onClick={handleClick}>
          <Badge variant="dot" color="primary" invisible={sortBy === 'default'}>
            <SwapVertIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ListSubheader>{t('crag_sort.title')}</ListSubheader>
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
      </Menu>
    </>
  );
};
