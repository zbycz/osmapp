import React from 'react';
import {
  Alert,
  AppBar,
  Box,
  Chip,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import { GRADE_TABLE } from './utils/grades/gradeData';
import CloseIcon from '@mui/icons-material/Close';
import zip from 'lodash/zip';
import { useTheme } from '@emotion/react';
import { convertHexToRgba } from '../../utils/colorUtils';
import { useFeatureContext } from '../../utils/FeatureContext';
import Router from 'next/router';
import { getUrlOsmId } from '../../../services/helpers';
import { t } from '../../../services/intl';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { isMobileDevice } from '../../helpers';
import { GRADE_SYSTEMS } from '../../../services/tagging/climbing';
import { RouteDifficultyBadge } from './RouteDifficultyBadge';
import TuneIcon from '@mui/icons-material/Tune';

export const ClimbingGradesTable = ({ onClose }: { onClose?: () => void }) => {
  const [clickedItem, setClickedItem] = React.useState<{
    row: number | undefined;
    column: number | undefined;
  }>({ row: undefined, column: undefined });

  const [isSettingVisible, setIsSettingVisible] = React.useState(false);

  const { userSettings, setUserSetting } = useUserSettingsContext();
  const visibleGradeSystems =
    userSettings['climbing.visibleGradeSystems'] ??
    GRADE_SYSTEMS.reduce((acc, { key }) => ({ ...acc, [key]: true }), {});
  const { feature } = useFeatureContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'];
  const theme = useTheme();
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      Router.push(
        `/${feature?.osmMeta ? getUrlOsmId(feature.osmMeta) : ''}${window.location.hash}`,
      );
    }
  };

  const transposedTable = zip(...Object.values(GRADE_TABLE));

  const getRowBackgroundColor = (rowIndex) => {
    return clickedItem.row === rowIndex
      ? convertHexToRgba(theme.palette.secondary.main, 0.5)
      : 'transparent';
  };

  const getCellColors = (columnIndex, rowIndex) => {
    if (clickedItem.row === rowIndex && clickedItem.column === columnIndex) {
      return {
        backgroundColor: convertHexToRgba(theme.palette.secondary.main, 0.8),
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        fontWeight: 'bold',
      };
    }
    if (clickedItem.column === columnIndex) {
      return {
        backgroundColor: convertHexToRgba(theme.palette.secondary.main, 0.3),
      };
    }
    return { backgroundColor: 'transparent' };
  };

  const columns = Object.keys(visibleGradeSystems).filter(
    (gradeSystemKey) => visibleGradeSystems[gradeSystemKey],
  );

  const isGradeSystemVisible = (gradeSystemKey) =>
    visibleGradeSystems[gradeSystemKey];

  return (
    <Dialog maxWidth="xl" open onClose={handleClose} fullScreen>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            width="100%"
          >
            <Typography noWrap variant="h6" component="div">
              {t('climbing_grade_table.title')}
            </Typography>
            <IconButton color="primary" edge="end" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {isSettingVisible && (
        <Box m={1}>
          <Alert severity="warning">
            {t('climbing_grade_table.warning')}{' '}
            <a href="https://github.com/zbycz/osmapp/issues" target="_blank">
              Github
            </a>
            .
          </Alert>

          <Typography variant="body2" mt={3} ml={1}>
            {t('climbing_grade_table.show')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.6} mt={1}>
            {GRADE_SYSTEMS.map((gradeSystem) => {
              const isVisible = isGradeSystemVisible(gradeSystem.key);
              return (
                <Chip
                  key={`chip-${gradeSystem.key}`}
                  label={`${gradeSystem.name} ${gradeSystem.flags ?? ''}`}
                  variant={isVisible ? 'filled' : 'outlined'}
                  onClick={() => {
                    setUserSetting('climbing.visibleGradeSystems', {
                      ...visibleGradeSystems,
                      [gradeSystem.key]: !isVisible,
                    });
                  }}
                />
              );
            })}
          </Stack>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: '100vh' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((gradeSystemKey) => {
                const grade = GRADE_SYSTEMS.find(
                  (item) => item.key === gradeSystemKey,
                );
                return (
                  <TableCell
                    sx={{ whiteSpace: 'nowrap' }}
                    key={`header-cell-${gradeSystemKey}`}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Tooltip
                        arrow
                        title={grade.description}
                        placement="right"
                        enterDelay={1000}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" fontWeight={900}>
                            {grade.name} {grade.flags}
                          </Typography>
                          {currentGradeSystem === gradeSystemKey && (
                            <Chip size="small" label="selected" />
                          )}
                        </Stack>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                );
              })}
              <TableCell sx={{ width: '100%', textAlign: 'right' }}>
                <IconButton
                  size="small"
                  onClick={() => setIsSettingVisible(!isSettingVisible)}
                  aria-label="close"
                  color={isSettingVisible ? 'primary' : 'secondary'}
                >
                  <TuneIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transposedTable.map((grades, rowIndex) => (
              <TableRow
                key={`row-${rowIndex}`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: getRowBackgroundColor(rowIndex),
                }}
              >
                {grades
                  .filter((_, columnIndex) => {
                    return Object.values(visibleGradeSystems)[columnIndex];
                  })
                  .map((grade, columnIndex) => (
                    <TableCell
                      key={`cell-${rowIndex}-${columnIndex}-${grade}`}
                      onClick={() => {
                        setClickedItem({
                          column: columnIndex,
                          row: rowIndex,
                        });
                      }}
                      sx={{
                        ...getCellColors(columnIndex, rowIndex),
                        borderRight: `1px solid ${theme.palette.divider} !important`,
                        '&:hover': {
                          cursor: 'pointer',
                          backgroundColor: isMobileDevice()
                            ? undefined
                            : convertHexToRgba(
                                theme.palette.secondary.main,
                                0.2,
                              ),
                        },
                      }}
                    >
                      <RouteDifficultyBadge
                        routeDifficulty={{
                          grade,
                          gradeSystem: GRADE_SYSTEMS[columnIndex].key,
                        }}
                      />
                    </TableCell>
                  ))}
                <TableCell sx={{ width: '100%' }} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};
