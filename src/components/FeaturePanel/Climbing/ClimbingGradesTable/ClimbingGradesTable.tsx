import { useState } from 'react';
import React from 'react';
import {
  AppBar,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Table,
  TableContainer,
  Toolbar,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { useFeatureContext } from '../../../utils/FeatureContext';
import Router from 'next/router';
import { getUrlOsmId } from '../../../../services/helpers';
import { t } from '../../../../services/intl';
import { ClimbingGradesTableBody } from './ClimbingGradesTableBody';
import { ClimbingGradesTableHead } from './ClimbingGradesTableHead';
import { ClimbingGradesTableSettings } from './ClimbingGradesTableSettings';
import { useVisibleGradeSystems } from '../utils/useVisibleGradeSystems';

type ClimbingGradesTableProps = {
  onClose?: () => void;
};

export const ClimbingGradesTable = ({ onClose }: ClimbingGradesTableProps) => {
  const { feature } = useFeatureContext();

  const [isSettingVisible, setIsSettingVisible] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      Router.push(
        `/${feature?.osmMeta ? getUrlOsmId(feature.osmMeta) : ''}${window.location.hash}`,
      );
    }
  };

  const columns = useVisibleGradeSystems();

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

      <ClimbingGradesTableSettings isSettingVisible={isSettingVisible} />

      <TableContainer component={Paper} sx={{ maxHeight: '100vh' }}>
        <Table stickyHeader size="small">
          <ClimbingGradesTableHead
            setIsSettingVisible={setIsSettingVisible}
            columns={columns}
            isSettingVisible={isSettingVisible}
          />
          <ClimbingGradesTableBody columns={columns} />
        </Table>
      </TableContainer>
    </Dialog>
  );
};
