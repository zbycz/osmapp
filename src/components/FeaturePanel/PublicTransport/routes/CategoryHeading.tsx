import { useState } from 'react';
import React from 'react';
import { t } from '../../../../services/intl';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  MoreHoriz,
  Search,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const fmtCategory = (category: string) => {
  return (
    {
      tourism: t('publictransport.tourism'),
      night: t('publictransport.night'),
      car_shuttle: t('publictransport.car_shuttle'),
      car: t('publictransport.car'),
      commuter: t('publictransport.commuter'),
      regional: t('publictransport.regional'),
      long_distance: t('publictransport.long_distance'),
      high_speed: t('publictransport.high_speed'),
      bus: t('publictransport.bus'),
      subway: t('publictransport.subway'),
      trolleybus: t('publictransport.trolleybus'),
      tram: t('publictransport.tram'),
      funicular: t('publictransport.funicular'),
      unknown: t('publictransport.unknown'),
    }[category] || category
  );
};

const ToggleCategory = ({
  shown,
  onClick,
}: {
  shown: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}) => (
  <MenuItem onClick={onClick}>
    <ListItemIcon>
      {shown && <VisibilityOff fontSize="small" />}
      {!shown && <Visibility fontSize="small" />}
    </ListItemIcon>
    <ListItemText>
      {shown
        ? t('publictransport.hide_this_category')
        : t('publictransport.show_this_category')}
    </ListItemText>
  </MenuItem>
);

type Props = {
  category: string;
  shownCategories: string[];
  onChange: (categories: string[]) => void;
};

export const CategoryHeading = ({
  category,
  shownCategories,
  onChange,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const isShownOnMap = shownCategories.includes(category);

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <h4>{fmtCategory(category)}</h4>
        <IconButton
          onClick={({ currentTarget }) => {
            setAnchorEl(currentTarget);
          }}
        >
          <MoreHoriz />
        </IconButton>
      </Stack>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        <ToggleCategory
          shown={isShownOnMap}
          onClick={() => {
            const newCategories = isShownOnMap
              ? shownCategories.filter((cat) => cat !== category)
              : shownCategories.concat(category);
            onChange(newCategories);
            setAnchorEl(null);
          }}
        />
        <MenuItem
          onClick={() => {
            onChange([category]);
            setAnchorEl(null);
          }}
          disabled={isShownOnMap && shownCategories.length === 1}
        >
          <ListItemIcon>
            <Search fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('publictransport.only_this_category')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
