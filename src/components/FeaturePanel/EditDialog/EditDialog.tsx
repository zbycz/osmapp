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
import { Box } from '@material-ui/core';
import { useToggleState } from '../../helpers';
import { Feature } from '../../../services/types';
import { MajorKeysEditor } from './MajorKeysEditor';
import { OtherTagsEditor } from './OtherTagsEditor';

interface Props {
  feature: Feature;
  open: boolean;
  handleClose: () => void;
  focusTag: boolean | string;
}

const EditDialog = ({ feature, open, handleClose, focusTag }: Props) => {
  const { tags, properties } = feature;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [showLocation, toggleShowLocation] = useToggleState(false);
  const [placeCanceled, togglePlaceCanceled] = useToggleState(false);
  const [location, setLocation] = React.useState('');
  const [note, setNote] = React.useState('');
  const [values, setValues] = React.useState(tags);
  const setValue = (k, v) => setValues((state) => ({ ...state, [k]: v }));

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
    >
      <DialogTitle id="edit-dialog-title">
        Navrhnout úpravu: {tags.name || properties.subclass}
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText
          id="edit-dialog-description"
          tabIndex={-1}
          style={{ outline: 0 }}
        >
          <MajorKeysEditor
            values={values}
            setValue={setValue}
            focusTag={focusTag}
          />

          <br />
          <br />

          <Typography variant="overline" display="block" color="textSecondary">
            Další možnosti
          </Typography>

          <OtherTagsEditor
            values={values}
            setValue={setValue}
            focusTag={focusTag}
          />

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
