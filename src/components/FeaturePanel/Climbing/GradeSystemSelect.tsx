import React, { useState } from 'react';
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
} from '../../../services/tagging/climbing/gradeSystems';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { t } from '../../../services/intl';
import { ClimbingGradesTable } from './ClimbingGradesTable/ClimbingGradesTable';
import { useVisibleGradeSystems } from './utils/useVisibleGradeSystems';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';

const GradeSystemItem = ({ showMinor, onClick, selectedGradeSystem }) => {
  const visibleGradeSystems = useVisibleGradeSystems();

  const filteredGradeSystems = GRADE_SYSTEMS.filter(({ key }) =>
    showMinor
      ? !visibleGradeSystems.includes(key)
      : visibleGradeSystems.includes(key),
  );
  return (
    <>
      {filteredGradeSystems.map(({ key, name, description, flags }) => (
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

type Props = {
  allowUnsetValue?: boolean;
  size?: 'small' | 'tiny';
  onGradeSystemChange?: (gradeSystem: GradeSystem) => void;
};

export const GradeSystemSelect = ({
  allowUnsetValue = true,
  size,
  onGradeSystemChange,
}: Props) => {
  const { userSettings, setUserSetting } = useUserSettingsContext();
  const [isGradeTableOpen, setIsGradeTableOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const selectedGradeSystem = userSettings['climbing.gradeSystem'];

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showMore, setShowMore] = useState(false);

  const changeGradeSystem = (gradeSystem: GradeSystem) => {
    setUserSetting('climbing.gradeSystem', gradeSystem);
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
          onClick={handleButtonClick}
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
          slotProps={{
            paper: {
              elevation: 4,
            },
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ListSubheader sx={{ background: 'transparent' }}>
            {t('grade_system_select.select_grade_system')}
          </ListSubheader>
          {allowUnsetValue && (
            <MenuItem
              value={null}
              sx={{ paddingLeft: 4 }}
              onClick={() => {
                changeGradeSystem(undefined);
              }}
              selected={selectedGradeSystem === null}
            >
              {t('grade_system_select.default_grade_system')}
            </MenuItem>
          )}

          <GradeSystemItem
            showMinor={false}
            onClick={changeGradeSystem}
            selectedGradeSystem={selectedGradeSystem}
          />
          {!showMore && (
            <MenuItem
              sx={{ paddingLeft: 4, marginTop: 1 }}
              onClick={(e) => {
                setShowMore(!showMore);
                e.stopPropagation();
                e.preventDefault();
                return false;
              }}
            >
              {t('grade_system_select.show_more')}
            </MenuItem>
          )}

          {showMore && (
            <GradeSystemItem
              showMinor
              onClick={changeGradeSystem}
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
