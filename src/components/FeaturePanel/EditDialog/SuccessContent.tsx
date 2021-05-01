import DialogContent from '@material-ui/core/DialogContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DialogActions from '@material-ui/core/DialogActions';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Box, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

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
      {idx > 0 && <br />}
      {line}
    </Fragment>
  ));

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
    <Tooltip arrow interactive title={nl2br(title)} placement="bottom-end">
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
          heading: 'Děkujeme za Váš návrh!',
          subheading:
            'Dobrovolnící z komunity OpenStreetMap ho časem zpracují.',
          body: `Celý proces obvykle trvá několik dní. Ovšem v místech, kde není aktivní komunita, to může trvat i velmi dlouho.`,
          urlLabel: `Doplnit informace či sledovat vývoj můžete zde:`,
          textLabel: 'Text poznámky',
        }
      : {
          heading: 'Děkujeme za Vaši editaci!',
          subheading: 'Již nyní se začíná objevovat v mapách po celém světě.',
          body: `V databázi OSM již je uložena. V řádu několika minut ji uvidíte na mapě "OSM Mapnik". Zdejší mapa a různé jiné aplikace se obnovují cca 1x za měsíc.

          Pokud se jedná o omyl, můžete hodnoty ručně vrátit zpět a znovu je uložit.`,
          urlLabel: `Vaše změny:`,
          textLabel: 'Poznámka ke změně',
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
          {nl2br(texts.body)}
        </Typography>

        <Typography variant="body2" paragraph>
          {nl2br(texts.urlLabel)}
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
            {nl2br(successInfo.text)}
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
};
