import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import { useToggleState } from '../helpers';
import { Feature } from '../../services/types';

const Table = styled.table`
  font-size: 80%;
  th {
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: center;
    padding-left: 0;
  }
`;

const majorKeysNames = {
  name: 'Název',
  website: 'Web',
  phone: 'Telefon',
  opening_hours: 'Otevírací doba',
};
const majorKeys = ['name', 'website', 'phone', 'opening_hours'];
const getInitialMajorKeys = (tags) => majorKeys.filter((k) => !!tags[k]);

interface Props {
  feature: Feature;
  open: boolean;
  handleClose: () => void;
}

const EditDialog = ({ feature, open, handleClose }: Props) => {
  const { tags, properties } = feature;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showTags, toggleShowTags] = useToggleState(false);
  const [showLocation, toggleShowLocation] = useToggleState(false);
  const [placeCanceled, togglePlaceCanceled] = useToggleState(false);
  const [location, setLocation] = React.useState('');
  const [note, setNote] = React.useState('');
  const [values, setValues] = React.useState(tags);
  const setValue = (k, v) => setValues((state) => ({ ...state, [k]: v }));

  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(tags),
  );
  const inactiveMajorKeys = majorKeys.filter(
    (k) => !activeMajorKeys.includes(k),
  );

  const saveDialog = () => {
    // eslint-disable-next-line no-alert
    alert('TODO');
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
    >
      <DialogTitle id="edit-dialog-title">
        Navrhnout úpravu: {tags.name || properties.subclass}
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText
          id="edit-dialog-description"
          // ref={descriptionElementRef}
          tabIndex={-1}
          style={{ outline: 0 }}
        >
          {activeMajorKeys.map((k) => (
            <div key={k}>
              <TextField
                label={majorKeysNames[k]}
                value={values[k]}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
                name={k}
                onChange={(e) => setValue(e.target.name, e.target.value)}
                fullWidth
              />
            </div>
          ))}
          {!!inactiveMajorKeys.length && (
            <>
              Přidat:
              {inactiveMajorKeys.map((k) => (
                <React.Fragment key={k}>
                  {' '}
                  <Button
                    size="small"
                    onClick={() => setActiveMajorKeys((arr) => [...arr, k])}
                  >
                    {majorKeysNames[k]}
                  </Button>
                </React.Fragment>
              ))}
            </>
          )}

          <br />
          <br />

          <Typography variant="overline" display="block" color="textSecondary">
            Další možnosti
          </Typography>

          <FormControlLabel
            control={<Checkbox checked={showTags} onChange={toggleShowTags} />}
            label="Změnit další vlastnosti (tagy)"
          />
          {showTags && (
            <Table>
              <tbody>
                {Object.entries(values)
                  .filter(([k]) => !majorKeys.includes(k))
                  .map(([k, v]) => (
                    <tr key={k}>
                      <th>{k}</th>
                      <td>
                        <TextField
                          value={v}
                          variant="outlined"
                          size="small"
                          name={k}
                          onChange={(e) =>
                            setValue(e.target.name, e.target.value)
                          }
                          fullWidth
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}

          <br />

          <FormControlLabel
            control={
              <Checkbox
                checked={placeCanceled}
                onChange={togglePlaceCanceled}
              />
            }
            label="Místo zrušeno či zavřeno"
          />

          <br />

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

          <Box mt={4} mb={4}>
            Váš návrh budou zpracovávat dobrovolníci OpenStreetMap. Zde pro ně
            můžete přidat doplňující poznámku, nebo popsat jinou úpravu. Vhodné
            je též podložit váš příspěvek odkazem na zdroj informace (web, foto
            atd.).
          </Box>

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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Zrušit
        </Button>
        <Button onClick={saveDialog} color="primary" variant="contained">
          Uložit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
