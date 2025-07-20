import {
  Badge,
  Fade,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { getWikimediaCommonsPhotoTags } from './utils/photo';
import { Feature } from '../../../services/types';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { t } from '../../../services/intl';
export type SortBy = 'default' | 'routes' | 'photos' | 'alphabetical';

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
      case 'alphabetical':
        return (item1, item2) => {
          const name1 = item1.tags.name || '';
          const name2 = item2.tags.name || '';
          return name1.localeCompare(name2);
        };
      default:
        return () => 0;
    }
  };

  return { sortByFn, sortBy, setSortBy };
};

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
      <Tooltip title={t('crag_sort.title')}>
        <IconButton
          color={open ? 'primary' : 'secondary'}
          edge="end"
          onClick={handleClick}
        >
          <Badge variant="dot" color="primary" invisible={sortBy === 'default'}>
            <SwapVertIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        placement="left-start"
        sx={{ zIndex: 10000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div>
              <Paper elevation={2}>
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
                <MenuItem
                  selected={sortBy === 'alphabetical'}
                  onClick={handleSortClick('alphabetical')}
                >
                  {t('crag_sort.option_alphabetical')}
                </MenuItem>
              </Paper>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
};
