import React from 'react';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import {
  Chip,
  IconButton,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { GRADE_SYSTEMS } from '../../../../services/tagging/climbing';
import TuneIcon from '@mui/icons-material/Tune';

type HeadProps = {
  columns: string[];
  setIsSettingVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isSettingVisible: boolean;
};

export const ClimbingGradesTableHead = ({
  columns,
  setIsSettingVisible,
  isSettingVisible,
}: HeadProps) => {
  const { userSettings } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'];

  return (
    <TableHead>
      <TableRow>
        {columns.map((key) => {
          const gs = GRADE_SYSTEMS.find((g) => g.key === key)!;
          return (
            <TableCell sx={{ whiteSpace: 'nowrap' }} key={`header-${key}`}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Tooltip
                  arrow
                  title={gs.description}
                  placement="right"
                  enterDelay={1000}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" fontWeight={900}>
                      {gs.name} {gs.flags}
                    </Typography>
                    {currentGradeSystem === key && (
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
            onClick={() => setIsSettingVisible((v) => !v)}
            aria-label="settings"
            color={isSettingVisible ? 'primary' : 'secondary'}
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};
