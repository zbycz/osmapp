import DialogContent from '@material-ui/core/DialogContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

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
  background: #eee;
  padding: 1em;
`;

const nl2br = (text) =>
  text.split('\n').map((line, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={idx}>
      {line}
      <br />
    </Fragment>
  ));

export const SuccessContent = ({ insertedNote, handleClose }) => (
  <>
    <DialogContent dividers>
      <StyledCheckCircleIcon />

      <CenterText>
        <Typography variant="h5">Děkujeme za Váš návrh!</Typography>
        <Typography variant="body1" color="textSecondary">
          Dobrovolnící z komunity OpenStreetMap ho časem zpracují.
        </Typography>
      </CenterText>

      <Typography variant="body2" paragraph>
        Celý proces obvykle trvá několik dní. Ovšem v místech, kde není aktivní komunita, to může trvat i velmi dlouho.
      </Typography>

      <Typography variant="body2" paragraph>
        Doplnit informace či sledovat vývoj můžete zde:
        <br />
        <a href={insertedNote.url} rel="noopener nofollow">
          {insertedNote.url}
        </a>
      </Typography>

      <GrayBox mt={6}>
        <Typography variant="overline" color="textSecondary">
          Text poznámky
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {nl2br(insertedNote.text)}
        </Typography>
      </GrayBox>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Zavřít
      </Button>
    </DialogActions>
  </>
);
