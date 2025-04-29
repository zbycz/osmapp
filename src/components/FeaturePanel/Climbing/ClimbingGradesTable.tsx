import React from 'react';
import {
  Alert,
  AppBar,
  Chip,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
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

export const ClimbingGradesTable = ({ onClose }: { onClose?: () => void }) => {
  const [clickedItem, setClickedItem] = React.useState<{
    row: number | undefined;
    column: number | undefined;
  }>({ row: undefined, column: undefined });

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
      ? convertHexToRgba(theme.palette.primary.main, 0.1)
      : 'transparent';
  };

  const getCellColors = (columnIndex, rowIndex) => {
    if (clickedItem.row === rowIndex && clickedItem.column === columnIndex) {
      return {
        backgroundColor: convertHexToRgba(theme.palette.primary.main, 0.5),
        color: theme.palette.getContrastText(theme.palette.primary.main),
        fontWeight: 'bold',
      };
    }
    if (clickedItem.column === columnIndex) {
      return {
        backgroundColor: convertHexToRgba(theme.palette.primary.main, 0.1),
      };
    }
    return { backgroundColor: 'transparent' };
  };

  const columns = Object.keys(visibleGradeSystems).filter(
    (gradeSystemKey) => visibleGradeSystems[gradeSystemKey],
  );

  const hiddenGradeSystems = GRADE_SYSTEMS.filter(
    (gradeSystem) => !visibleGradeSystems[gradeSystem.key],
  );

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

      <TableContainer component={Paper} sx={{ maxHeight: '100vh' }}>
        <Table stickyHeader size="small">
          <TableHead>
            {hiddenGradeSystems.length > 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Stack direction="row" spacing={1}>
                    <Typography
                      variant="caption"
                      sx={{ mr: 2, mt: 1, alignSelf: 'center' }}
                    >
                      {t('climbing_grade_table.show')}
                    </Typography>
                    {hiddenGradeSystems.map((gradeSystem) => {
                      return (
                        <Chip
                          key={`chip-${gradeSystem.key}`}
                          size="small"
                          label={gradeSystem.name}
                          variant="outlined"
                          onClick={() => {
                            setUserSetting('climbing.visibleGradeSystems', {
                              ...visibleGradeSystems,
                              [gradeSystem.key]: true,
                            });
                          }}
                        />
                      );
                    })}
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              {columns.map((gradeSystemKey) => {
                const grade = GRADE_SYSTEMS.find(
                  (item) => item.key === gradeSystemKey,
                );
                return (
                  <TableCell
                    sx={{ cursor: 'help' }}
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
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() =>
                          setUserSetting('climbing.visibleGradeSystems', {
                            ...visibleGradeSystems,
                            [grade.key]: false,
                          })
                        }
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                );
              })}
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
                        fontFamily: 'Courier, monospace',
                        '&:hover': {
                          cursor: 'pointer',
                          backgroundColor: isMobileDevice()
                            ? undefined
                            : convertHexToRgba(theme.palette.primary.main, 0.3),
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
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ padding: 1 }}>
                <Alert severity="warning">
                  Please be aware that conversions are approximate. If you spot
                  any inaccuracies, please report them to us on{' '}
                  <a
                    href="https://github.com/zbycz/osmapp/issues"
                    target="_blank"
                  >
                    Github
                  </a>
                  .
                </Alert>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Dialog>
  );
};
