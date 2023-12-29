import React from 'react';
import styled from 'styled-components';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Tooltip,
  IconButton,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import { t, Translation } from '../../../services/intl';
import { nl2br } from '../../utils/nl2br';

const StyledCheckCircleIcon = styled(CheckCircleIcon)`
  color: #4b912e;
  font-size: 94px !important;
  display: block !important;
  margin: 0 auto;
  margin-top: 50px;
`;

const CenterText = styled.div`
  text-align: center;
  margin: 2em;
  margin-bottom: 3em;
`;

const GrayBox = styled(Box)`
  background: ${({ theme }) => theme.palette.action.hover};
  padding: 1em;
`;

const Wrapper = styled.span`
  display: inline-block;
  margin: -15px -15px -15px -8px;
  vertical-align: text-top;

  svg {
    font-size: 16px;
    color: #ccc;
  }
`;

export const InfoButton = ({ title }) => (
  <Wrapper>
    <Tooltip arrow title={nl2br(title)} placement="bottom-end">
      <IconButton>
        <InfoIcon />
      </IconButton>
    </Tooltip>
  </Wrapper>
);

export const SuccessContent = ({ successInfo, handleClose }) => {
  const texts =
    successInfo.type === 'note'
      ? {
          heading: t('editsuccess.note.heading'),
          subheading: t('editsuccess.note.subheading'),
          body: <Translation id="editsuccess.note.body" />,
          urlLabel: t('editsuccess.note.urlLabel'),
          textLabel: t('editsuccess.note.textLabel'),
        }
      : {
          heading: t('editsuccess.edit.heading'),
          subheading: t('editsuccess.edit.subheading'),
          body: <Translation id="editsuccess.edit.body" />,
          urlLabel: t('editsuccess.edit.urlLabel'),
          textLabel: t('editsuccess.edit.textLabel'),
        };

  return (
    <>
      <DialogContent dividers>
        <StyledCheckCircleIcon />

        <CenterText>
          <Typography variant="h5">{texts.heading}</Typography>
          <Typography variant="body1" color="textSecondary">
            {texts.subheading}
          </Typography>
        </CenterText>

        <Typography variant="body2" paragraph>
          {texts.body}
        </Typography>

        <Typography variant="body2" paragraph>
          {texts.urlLabel}
          <br />
          <a href={successInfo.url} rel="noopener nofollow">
            {successInfo.url}
          </a>
        </Typography>

        <GrayBox mt={6}>
          <Typography variant="overline" color="textSecondary">
            {texts.textLabel}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {nl2br(successInfo.text || '–')}
          </Typography>
        </GrayBox>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('editsuccess.close_button')}
        </Button>
      </DialogActions>
    </>
  );
};
