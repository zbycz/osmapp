import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import { useToggleState } from '../../helpers';

export const DialogHeading = ({ children }) => (
  <Typography variant="overline" display="block" color="textSecondary">
    {children}
  </Typography>
);

export const ChangeLocationEditor = ({ location, setLocation }) => {
  const [showLocation, toggleShowLocation] = useToggleState(false);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox checked={showLocation} onChange={toggleShowLocation} />
        }
        label="Zadat novou polohu"
      />
      {showLocation && (
        <div style={{ marginLeft: 30 }}>
          <TextField
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="např. naproti přes ulici"
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            fullWidth
            rows={2}
            variant="outlined"
          />
        </div>
      )}
    </>
  );
};

export const PlaceCancelledToggle = ({ cancelled, toggle }) => (
  <>
    <FormControlLabel
      control={<Checkbox checked={cancelled} onChange={toggle} />}
      label="Místo zrušeno či trvale zavřeno"
    />
    <br />
  </>
);

export const ContributionInfoBox = ({ loggedIn }) =>
  loggedIn ? (
    <Box mt={4} mb={4}>
      <Typography variant="body1" color="textSecondary" paragraph>
        Vaše úprava bude ihned uložena do databáze OpenStreetMap. Prosíme,
        vkládejte pouze informace z vlastních nebo věřejných zdrojů. Je zakázano
        kopírovat z Google Map a jiných map krytých autorským zákonem.
      </Typography>
    </Box>
  ) : (
    <Box mt={4} mb={4}>
      <Typography variant="body1" color="textSecondary" paragraph>
        Váš návrh budou zpracovávat dobrovolníci OpenStreetMap. Zde pro ně
        můžete přidat doplňující poznámku, nebo popsat např. úpravu polohy.
        Vhodné je též podložit váš příspěvek odkazem na zdroj informace (web,
        foto atd.).
      </Typography>
    </Box>
  );

export const NoteField = ({ note, setNote }) => (
  <>
    <TextField
      label="Poznámka (nepovinné)"
      placeholder="odkaz na zdroj informace apod."
      InputLabelProps={{
        shrink: true,
      }}
      multiline
      fullWidth
      rows={2}
      variant="outlined"
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
    <br />
    <br />
    <br />
  </>
);
