import React from 'react';
import Router from 'next/router';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { intl, t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import {
  PanelContent,
  PanelScrollbars,
  PanelSidePadding,
} from '../utils/PanelHelpers';
import { MobilePageDrawer } from '../utils/MobilePageDrawer';
import { ClimbingArea } from '../../services/climbing-areas/getClimbingAreas';
import Link from 'next/link';
import { TooltipButton } from '../utils/TooltipButton';

type ClimbingAreasPanelProps = {
  areas: ClimbingArea[];
};

export const ClimbingAreasPanel = ({ areas }: ClimbingAreasPanelProps) => {
  const handleClose = () => {
    Router.push(`/`);
  };

  return (
    <MobilePageDrawer className="climbing-areas-drawer">
      <PanelContent>
        <PanelScrollbars>
          <ClosePanelButton right onClick={handleClose} />
          <PanelSidePadding>
            <h1>{t('climbingareas.title')}</h1>

            <Typography variant="body2">
              {t('climbing.guideinfo.title')}{' '}
              <TooltipButton tooltip={t('climbing.guideinfo.description')} />
            </Typography>
          </PanelSidePadding>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t('climbingareas.area')}</TableCell>
                  <TableCell>{t('climbingareas.num_of_crags')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {areas.map((climbingArea, index) => (
                  <TableRow key={`climbing-area-${climbingArea.id}`}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>
                      <Link
                        href={`/relation/${climbingArea.id}`}
                        locale={intl.lang}
                      >
                        {climbingArea.tags.name ||
                          `N/A – relation/${climbingArea.id}`}
                      </Link>
                    </TableCell>
                    <TableCell>{climbingArea.members.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </PanelScrollbars>
      </PanelContent>
    </MobilePageDrawer>
  );
};
