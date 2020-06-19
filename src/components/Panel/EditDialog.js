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
import Divider from '@material-ui/core/Divider';
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
const getInitialMajorKeys = tags => majorKeys.filter(k => !!tags[k]);

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

  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(tags),
  );
  const inactiveMajorKeys = majorKeys.filter(k => !activeMajorKeys.includes(k));

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
            <div key={k}>
              <TextField
                label={majorKeysNames[k]}
                value={values[k]}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
                name={k}
                onChange={e => setValue(e.target.name, e.target.value)}
                fullWidth
              />
            </div>
          ))}
          {!!inactiveMajorKeys.length && (
            <>
              Přidat:
              {inactiveMajorKeys.map(k => (
                <React.Fragment key={k}>
                  {' '}
                  <Button
                    size="small"
                    onClick={() => setActiveMajorKeys(arr => [...arr, k])}
                  >
                    {majorKeysNames[k]}
                  </Button>
                </React.Fragment>
              ))}
            </>
          )}

          <br />
          <br />

          <FormControlLabel
            control={<Checkbox checked={showTags} onChange={toggleShowTags} />}
            label="Změnit další informace"
          />
          {showTags && (
            <table>
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
                          onChange={e =>
                            setValue(e.target.name, e.target.value)
                          }
                          fullWidth
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          <br />

          <FormControlLabel
            control={
              <Checkbox checked={showLocation} onChange={toggleShowLocation} />
            }
            label="Změnit polohu"
          />
          {showLocation && (
            <div style={{ marginLeft: 15 }}>
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
            </div>
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
