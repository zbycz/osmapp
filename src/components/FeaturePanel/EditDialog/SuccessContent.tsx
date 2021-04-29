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

export const SuccessContent = ({ successInfo, handleClose }) => {
  const texts = successInfo.noteUrl
    ? {
        heading: 'Děkujeme za Váš návrh!',
        subheading: 'Dobrovolnící z komunity OpenStreetMap ho časem zpracují.',
        par1: `Celý proces obvykle trvá několik dní. Ovšem v místech, kde není aktivní komunita, to může trvat i velmi dlouho.`,
        par2: `Doplnit informace či sledovat vývoj můžete zde:`,
        url: successInfo.noteUrl,
        textHeading: 'Text poznámky',
      }
    : {
        heading: 'Děkujeme za Vaši editaci!',
        subheading: 'Již nyní se začíná objevovat v mapách po celém světě.',
        par1: `Jak rychle bude má úprava vidět? Výchozí mapa OpenStreetMap Mapnik — několik minut až hodina. Zdejší výchozí vrstva, Maps.me, Mapy.cz (mimo ČR+SR) apod. — cca měsíc.`,
        par2: `
  Pokud by byla úprava sporná, místní komunita vás může oslovit pomocí komentáře. Přijde vám na mail a též jej naleznete zde:
  ...
  Pokud se jedná o omyl, můžete úpravu vzít zpět a napište o tom komentář k této úpravě:
  `,
        url: successInfo.changesetUrl,
        textHeading: 'Poznámka ke změně',
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
          {texts.par1}
        </Typography>

        <Typography variant="body2" paragraph>
          {texts.par2}
          <br />
          <a href={texts.url} rel="noopener nofollow">
            {texts.url}
          </a>
        </Typography>

        <GrayBox mt={6}>
          <Typography variant="overline" color="textSecondary">
            {texts.textHeading}
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
