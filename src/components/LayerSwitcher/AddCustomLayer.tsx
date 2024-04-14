import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useAddLayerContext } from './helpers/AddLayerContext';
import { Button, TextField } from '@material-ui/core';

const TMS_EXAMPLES = {
  'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png': 'French osm tiles',
};

const getTileName = (url: string) =>
  TMS_EXAMPLES[url] || url.replace(/^https?:\/\/([^/]+).*$/, '$1');

interface LayerDataInputProps {
  onName?: (name: string) => void;
  onUrl?: (url: string) => void;
  onDefault: (url: string, name: string) => void;
  counter: number;
}

/**
 * Starts with https?://
 * Includes each of those exactly one time:
 * {x} {y} {z}
 */
const mapLayerRegex = /^https?:\/\/(?=.*\{x})(?=.*\{y})(?=.*\{z}).*$/

const LayerDataInput: React.FC<LayerDataInputProps> = ({
  onName,
  onUrl,
  onDefault,
  counter,
}) => {
  const TMS_EXAMPLE =
    Object.entries(TMS_EXAMPLES)[counter % Object.keys(TMS_EXAMPLES).length];

  const [urlValue, setUrlValue] = React.useState(TMS_EXAMPLE[0]);
  const [nameValue, setNameValue] = React.useState(TMS_EXAMPLE[1]);

  onDefault(urlValue, nameValue)

  const [isDefaultName, setIsDefaultName] = React.useState(true);

  const [nameHelperText, setNameHelperText] = React.useState("")
  const [urlHelperText, setUrlHelperText] = React.useState("")

  const onNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setIsDefaultName(false);
    setNameValue(value);
    if (onName) onName(value);
  };

  const onUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setUrlValue(newValue);
    if (isDefaultName) setNameValue(getTileName(newValue));

    if (onUrl) onUrl(newValue);
  };

  React.useEffect(() => {
    if (!nameValue.trim()) setNameHelperText("Name must not be empty")
    else setNameHelperText("")
  }, [nameValue])

  React.useEffect(() => {
    if (!mapLayerRegex.test(urlValue)) setUrlHelperText("URL must contain exactly one of those {x}, {z}, {y} and {s}")
    else setUrlHelperText("")
  }, [urlValue])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <TextField
        label="Name"
        variant="outlined"
        onChange={onNameInput}
        value={nameValue}
        fullWidth
        error={!!nameHelperText}
        helperText={nameHelperText}
      />
      <TextField
        label="URL"
        variant="outlined"
        onChange={onUrlInput}
        value={urlValue}
        fullWidth
        error={!!urlHelperText}
        helperText={urlHelperText}
      />
    </div>
  );
};

interface AddDialogProps {
  save: (url: string, name: string) => void
}

export const AddCustomDialog: React.FC<AddDialogProps> = ({ save }) => {
  const { opened, close, counter } = useAddLayerContext();
  const [isSaveDisabled, setDisableSave] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [name, setName] = React.useState('');

  const onSave = () => {
    save(url, name);
    close();
  };

  return (
    <Dialog open={opened} maxWidth="sm" fullWidth>
      <DialogTitle>
        <p>Add a layer</p>
      </DialogTitle>

      <DialogContent dividers>
        <LayerDataInput
          onDefault={(url, name) => {
            setUrl(url)
            setName(name)
          }}
          onUrl={(url) => {
            setDisableSave(!url);
            setUrl(url)
          }}
          onName={setName}
          counter={counter}
        />

        <DialogActions>
          <Button onClick={close} color="secondary" variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onSave}
            color="primary"
            variant="contained"
            disabled={isSaveDisabled}
          >
            Add layer
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
