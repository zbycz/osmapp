import {
  Badge,
  Button,
  IconButton,
  ListSubheader,
  Menu,
  Slider,
  Stack,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { t } from '../../../services/intl';
import { GRADE_TABLE } from './utils/grades/gradeData';
import {
  convertGrade,
  getDifficulty,
  isInGradeInterval,
} from './utils/grades/routeGrade';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { RouteDifficultyBadge } from './RouteDifficultyBadge';
import { GradeSystemSelect } from './GradeSystemSelect';

export const useCragsInAreaFilter = () => {
  const [gradeInterval, setGradeInterval] = React.useState<number[] | null>(
    null,
  );
  const [minimumRoutesInInterval, setMinimumRoutesInInterval] =
    React.useState<number>(1);
  const [isTouched, setIsTouched] = React.useState<boolean>(false);
  const { userSettings } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const values = GRADE_TABLE[currentGradeSystem];
  const uniqueValues = useMemo(() => [...new Set(values)], [values]);

  return {
    uniqueValues,
    gradeInterval,
    setGradeInterval,
    minimumRoutesInInterval,
    setMinimumRoutesInInterval,
    setIsTouched,
    isTouched,
  };
};

export const filterCrag =
  ({
    gradeInterval,
    currentGradeSystem,
    uniqueValues,
    minimumRoutesInInterval,
  }) =>
  (crag) => {
    if (!gradeInterval) return true;

    const numberOfFilteredRoutes = crag.memberFeatures.reduce((acc, route) => {
      const difficulty = getDifficulty(route.tags);
      if (!difficulty) return acc;
      const convertedGrade = convertGrade(
        difficulty.gradeSystem,
        currentGradeSystem,
        difficulty.grade,
      );
      if (
        isInGradeInterval({
          gradeMin: uniqueValues[gradeInterval[0]],
          gradeMax: uniqueValues[gradeInterval[1]],
          grade: convertedGrade,
          currentGradeSystem,
        })
      )
        return acc + 1;
      return acc;
    }, 0);
    return numberOfFilteredRoutes > minimumRoutesInInterval;
  };

export const CragsInAreaFilter = ({
  gradeInterval,
  setGradeInterval,
  minimumRoutesInInterval,
  setMinimumRoutesInInterval,
  uniqueValues,
  setIsTouched,
  isTouched,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const { userSettings, setUserSetting } = useUserSettingsContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIfTouched = ({
    gradeInterval,
    minimumRoutesInInterval,
  }: {
    gradeInterval?: number[];
    minimumRoutesInInterval?: number;
  }) => {
    if (
      gradeInterval &&
      (gradeInterval[0] !== 0 || gradeInterval[1] !== uniqueValues.length - 1)
    )
      setIsTouched(true);
    else if (minimumRoutesInInterval && minimumRoutesInInterval !== 1)
      setIsTouched(true);
    else {
      setIsTouched(false);
    }
  };

  const handleChangeGradeFilter = (
    _event: Event,
    newValue: number | number[],
  ) => {
    if (Array.isArray(newValue)) {
      handleIfTouched({ gradeInterval: newValue });
      setGradeInterval(newValue);
    }
  };
  const handleChangeMinimumRoutesInInterval = (
    _event: Event,
    newValue: number,
  ) => {
    handleIfTouched({ minimumRoutesInInterval: newValue });
    setMinimumRoutesInInterval(newValue);
  };

  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';

  useEffect(() => {
    if (gradeInterval === null) setGradeInterval([0, uniqueValues.length - 1]);
  }, [uniqueValues, gradeInterval, currentGradeSystem, setGradeInterval]);

  if (gradeInterval === null) {
    return null;
  }
  const handleReset = () => {
    setGradeInterval([0, uniqueValues.length - 1]);
    setMinimumRoutesInInterval(1);
    setIsTouched(false);
  };

  return (
    <>
      <Tooltip title={t('crag_filter.title')}>
        <IconButton color="primary" edge="end" onClick={handleClick}>
          <Badge variant="dot" color="primary" invisible={!isTouched}>
            <FilterListAltIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
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
          <Stack direction="row" justifyContent="space-between">
            {t('crag_filter.title')}
            <Button onClick={handleReset} size="small" color="secondary">
              {t('crag_filter.reset')}
            </Button>
          </Stack>
        </ListSubheader>
        <ListSubheader>{t('crag_filter.grade')}</ListSubheader>

        <Stack gap={1} sx={{ minWidth: 350 }} m={2}>
          <Slider
            value={gradeInterval}
            onChange={handleChangeGradeFilter}
            min={0}
            max={uniqueValues.length - 1}
          />
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <div>
              {t('crag_filter.grade_from')}{' '}
              <RouteDifficultyBadge
                routeDifficulty={{
                  gradeSystem: currentGradeSystem,
                  grade: uniqueValues[gradeInterval[0]],
                }}
              />{' '}
              {t('crag_filter.grade_to')}{' '}
              <RouteDifficultyBadge
                routeDifficulty={{
                  gradeSystem: currentGradeSystem,
                  grade: uniqueValues[gradeInterval[1]],
                }}
              />
            </div>
            <GradeSystemSelect
              setGradeSystem={(system) => {
                setUserSetting('climbing.gradeSystem', system);
              }}
              selectedGradeSystem={userSettings['climbing.gradeSystem']}
            />
          </Stack>
          <Slider
            value={minimumRoutesInInterval}
            onChange={handleChangeMinimumRoutesInInterval}
            min={1}
            max={80}
          />
          <div>
            {t('crag_filter.show_at_least')}{' '}
            <strong>{minimumRoutesInInterval}</strong> {t('crag_filter.routes')}
          </div>
        </Stack>
      </Menu>
    </>
  );
};
