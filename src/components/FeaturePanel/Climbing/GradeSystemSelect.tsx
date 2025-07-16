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
  Tooltip,
} from '@mui/material';
import {
  getGradeSystemName,
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../../services/tagging/climbing';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { t } from '../../../services/intl';
import { ClimbingGradesTable } from './ClimbingGradesTable/ClimbingGradesTable';
import { useVisibleGradeSystems } from './utils/useVisibleGradeSystems';

type Props = {
  selectedGradeSystem: GradeSystem;
  setGradeSystem: (GradeSystem: GradeSystem) => void;
  allowUnsetValue?: boolean;
  size?: 'small' | 'tiny';
  onGradeSystemChange?: (gradeSystem: GradeSystem) => void;
};

const GradeSystemItem = ({ showMinor, onClick, selectedGradeSystem }) => {
  const visibleGradeSystems = useVisibleGradeSystems();

  return (
    <>
      {GRADE_SYSTEMS.filter(({ key }) =>
        showMinor
          ? !visibleGradeSystems.includes(key)
          : visibleGradeSystems.includes(key),
      ).map(({ key, name, description, flags }) => (
        <Tooltip
          title={description}
          placement="right"
          enterDelay={1000}
          arrow
          key={key}
        >
          <MenuItem
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
        </Tooltip>
      ))}
    </>
  );
};

export const GradeSystemSelect = ({
  selectedGradeSystem,
  setGradeSystem,
  allowUnsetValue = true,
  size,
  onGradeSystemChange,
}: Props) => {
  const [isGradeTableOpen, setIsGradeTableOpen] =
    React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isMinorOpened, setIsMinorOpened] = React.useState(false);

  const handleChange = (gradeSystem) => {
    setGradeSystem(gradeSystem);
    onGradeSystemChange?.(gradeSystem);
    handleClose();
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          disableElevation
          onClick={handleClick}
          sx={{ maxWidth: 200, ...(size === 'tiny' ? { fontSize: 10 } : {}) }}
          endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          size="small"
          variant="text"
        >
          {getGradeSystemName(selectedGradeSystem) ??
            t('grade_system_select.convert_grade_short')}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ListSubheader>
            {t('grade_system_select.select_grade_system')}
          </ListSubheader>
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
            showMinor={false}
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
              showMinor
              onClick={handleChange}
              selectedGradeSystem={selectedGradeSystem}
            />
          )}

          <Divider />
          <MenuItem
            onClick={() => {
              setIsGradeTableOpen(true);
            }}
          >
            <ListItemIcon>
              <IconButton size="small">
                <ViewListIcon fontSize="small" />
              </IconButton>
            </ListItemIcon>
            {t('climbing_grade_table.title')}
          </MenuItem>
        </Menu>
      </Stack>
      {isGradeTableOpen && (
        <ClimbingGradesTable onClose={() => setIsGradeTableOpen(false)} />
      )}
    </>
  );
};
