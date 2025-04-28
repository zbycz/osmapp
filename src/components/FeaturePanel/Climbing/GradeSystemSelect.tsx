import React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  MenuItem,
  IconButton,
  Stack,
  ListSubheader,
  Divider,
  ListItemIcon,
  Button,
  Menu,
} from '@mui/material';
import {
  getGradeSystemName,
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../../services/tagging/climbing';
import Router from 'next/router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { t } from '../../../services/intl';

type Props = {
  selectedGradeSystem: GradeSystem;
  setGradeSystem: (GradeSystem: GradeSystem) => void;
  onClick?: (e: any) => void;
  allowUnsetValue?: boolean;
};

const GradeSystemItem = ({ isMinor, onClick, selectedGradeSystem }) => (
  <>
    {GRADE_SYSTEMS.filter(({ minor }) => minor === isMinor).map(
      ({ key, name, description, flags }) => (
        <MenuItem
          key={key}
          value={key}
          sx={{ paddingLeft: 4 }}
          onClick={() => onClick(key)}
          selected={selectedGradeSystem === key}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            width="100%"
          >
            <div>{name}</div>
            <div>{flags}</div>
          </Stack>
        </MenuItem>
      ),
    )}
  </>
);

export const GradeSystemSelect = ({
  selectedGradeSystem,
  setGradeSystem,
  onClick,
  allowUnsetValue = true,
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isMinorOpened, setIsMinorOpened] = React.useState(false);
  const openConversionTable = () => {
    Router.push('/climbing-grades');
  };

  const handleChange = (gradeSystem) => {
    setGradeSystem(gradeSystem);
    handleClose();
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
        sx={{ maxWidth: 200 }}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        size="small"
        variant="text"
      >
        {getGradeSystemName(selectedGradeSystem) ??
          t('grade_system_select.convert_grade')}
      </Button>
      <Menu
        id="demo-customized-menu"
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
        <ListSubheader>Select grade system</ListSubheader>
        {allowUnsetValue && (
          <MenuItem
            value={null}
            sx={{ paddingLeft: 4 }}
            onClick={() => {
              setGradeSystem(null);
              handleClose();
            }}
            selected={selectedGradeSystem === null}
          >
            {t('grade_system_select.default_grade_system')}
          </MenuItem>
        )}

        <GradeSystemItem
          isMinor={false}
          onClick={handleChange}
          selectedGradeSystem={selectedGradeSystem}
        />
        {!isMinorOpened && (
          <MenuItem
            sx={{ paddingLeft: 4, marginTop: 1 }}
            onClick={(e) => {
              setIsMinorOpened(!isMinorOpened);
              e.stopPropagation();
              e.preventDefault();
              return false;
            }}
          >
            {t('grade_system_select.show_more')}
          </MenuItem>
        )}

        {isMinorOpened && (
          <GradeSystemItem
            isMinor
            onClick={handleChange}
            selectedGradeSystem={selectedGradeSystem}
          />
        )}

        <Divider />
        <MenuItem onClick={openConversionTable}>
          <ListItemIcon>
            <IconButton size="small">
              <ViewListIcon fontSize="small" />
            </IconButton>
          </ListItemIcon>
          {t('climbing_grade_table.title')}
        </MenuItem>
      </Menu>
    </Stack>
  );
};
