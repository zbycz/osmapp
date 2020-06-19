import * as React from 'react';
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
import { useToggleState } from '../helpers';
import TagsTable from './TagsTable';
// import Draggable from 'react-draggable';
// function PaperComponent(props) {
//   return (
//     <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper {...props} />
//     </Draggable>
//   );
// }
// <Dialog PaperComponent={PaperComponent}

const majorKeysNames = {
  name: 'Název',
  website: 'Web',
  phone: 'Telefon',
  opening_hours: 'Otevírací doba',
};
const majorKeys = ['name', 'website', 'phone', 'opening_hours'];
const getActiveMajorKeys = values => majorKeys.filter(k => !!values[k]);
const getInactiveMajorKeys = values => majorKeys.filter(k => !values[k]);

const EditDialog = ({ feature, open, handleClose }) => {
  const {
    loading,
    nonOsmObject,
    geometry,
    tags,
    layer,
    osmMeta,
    properties,
  } = feature;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showTags, toggleShowTags] = useToggleState(false);
  const [showLocation, toggleShowLocation] = useToggleState(false);
  const [values, setValues] = React.useState(tags);
  const setValue = (k, v) => setValues(state => ({ ...state, [k]: v }));
  const activeMajorKeys = getActiveMajorKeys(values);
  const inactiveMajorKeys = getInactiveMajorKeys(values);

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
      <DialogContent dividers={true}>
        <DialogContentText
          id="edit-dialog-description"
          // ref={descriptionElementRef}
          tabIndex={-1}
        >
          {activeMajorKeys.map(k => (
            <div>
              <TextField
                label={majorKeysNames[k]}
                value={values[k]}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
                name={k}
                onChange={e => setValue(e.target.name, e.target.value)}
              />
            </div>
          ))}
          <br />
          <br />
          Přidat:
          {inactiveMajorKeys.map(k => (
            <Button variant="outlined" onClick={() => setValue(k, 'x')}>
              {majorKeysNames[k]}
            </Button>
          ))}
          <br />
          <br />
          <FormControlLabel
            control={
              <Checkbox checked={showLocation} onChange={toggleShowLocation} />
            }
            label="Změnit polohu"
          />
          {showLocation && (
            <TextField
              label="Poznámka k úpravě"
              placeholder="odkaz na zdroj informace apod."
              InputLabelProps={{
                shrink: true,
              }}
              multiline
              fullWidth
              rows={2}
              variant="outlined"
            />
          )}
          <br />
          <FormControlLabel
            control={<Checkbox checked={showTags} onChange={toggleShowTags} />}
            label="Změnit další informace"
          />
          {showTags && (
            <TagsTable
              tags={tags}
              except={['name', 'website', 'phone', 'opening_hours']}
              isEditing
            />
          )}
          <p>
            Váš návrh budou zpracovávat dobrovolníci OpenStreetMap. Abyste jim
            pomohli ověřit informace, můžete přidat doplňující poznámku.
          </p>
          <TextField
            label="Poznámka k úpravě"
            placeholder="odkaz na zdroj informace, fotku apod."
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            fullWidth
            rows={2}
            variant="outlined"
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Zrušit
        </Button>
        <Button onClick={handleClose} color="primary" variant="contained">
          Uložit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
