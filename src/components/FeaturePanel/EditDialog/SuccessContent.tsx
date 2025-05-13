import React from 'react';
import styled from '@emotion/styled';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import { t, Translation } from '../../../services/intl';
import { nl2br } from '../../utils/nl2br';
import { SuccessInfo } from '../../../services/types';
import { useEditContext } from './EditContext';
import { useEditDialogContext } from '../helpers/EditDialogContext';

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

const getTexts = (successInfo: SuccessInfo) =>
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

export const SuccessContent = () => {
  const { close } = useEditDialogContext();
  const { successInfo } = useEditContext();
  const texts = getTexts(successInfo);

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
          <a href={successInfo.url} target="_blank">
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
        <Button onClick={close} color="primary">
          {t('editsuccess.close_button')}
        </Button>
      </DialogActions>
    </>
  );
};
