import React from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { t } from '../../../../services/intl';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { SortBy } from './types';

export const CragsInAreaSortButton = ({
  onClick,
  open,
  sortBy,
}: {
  open: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  sortBy: SortBy;
}) => (
  <Tooltip title={t('crag_sort.title')}>
    <IconButton
      color={open ? 'primary' : 'secondary'}
      edge="end"
      onClick={onClick}
    >
      <Badge variant="dot" color="primary" invisible={sortBy === 'default'}>
        <SwapVertIcon fontSize="small" />
      </Badge>
    </IconButton>
  </Tooltip>
);
