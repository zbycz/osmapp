import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useAddLayerContext } from './helpers/AddLayerContext';
import { Button, CircularProgress, Input, TextField } from '@material-ui/core';
import { loadLayers } from '@dlurak/editor-layer-index';
import { Autocomplete } from '@material-ui/lab';

type SuccessLayerDataInputProps = {
  index: any[];
  onSelect: (layer: any | undefined) => void;
};

const SuccessLayerInput: React.FC<SuccessLayerDataInputProps> = ({
  index,
  onSelect,
}) => {
  const [layer, setLayer] = React.useState<any | undefined>(undefined);

  return (
    <Autocomplete
      options={index.map((l) => l.name)}
      onChange={(_, val) => {
        const layer = index.find((l) => l.name === val);
        setLayer(layer);
        onSelect(layer);
      }}
      renderInput={(params) => <TextField {...params} label="Layer" />}
    />
  );
};

const LoadingLayerInput = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
      <p
        style={{
          fontSize: '1rem',
          color: 'gray',
        }}
      >
        Fetching the layer index...
      </p>
    </div>
  );
};

const ErrorLayerInput = () => {
  return (
    <div>
      <p>An error occured while fetching the layer index</p>
    </div>
  );
};

const LayerDataInput: React.FC<{ onSelect: (layer: any) => void }> = ({
  onSelect,
}) => {
  const [layerIndex, setLayerIndex] = React.useState([]);
  const [layerIndexState, setLayerIndexState] =
    React.useState<'success' | 'loading' | 'error'>('loading');

  React.useEffect(() => {
    loadLayers()
      .then((result) => {
        setLayerIndex(result);
        setLayerIndexState('success');
      })
      .catch(() => {
        setLayerIndex([]);
        setLayerIndexState('error');
      });
  }, []);

  if (layerIndexState === 'success')
    return <SuccessLayerInput index={layerIndex} onSelect={onSelect} />;
  if (layerIndexState === 'error') return <ErrorLayerInput />;
  if (layerIndexState === 'loading') return <LoadingLayerInput />;
};

const dynamicPartsRegex = /{((?!y|x|zoom)[a-zA-Z:,]+)}/g;

interface Detailsprops {
  layer: any;
  onChange: (values: Record<string, string>) => void;
  onValidation: (ok: boolean) => void;
}

const Details: React.FC<Detailsprops> = ({ layer, onChange, onValidation }) => {
  const url = layer.url as string;

  const dynamicParts =
    url.match(dynamicPartsRegex)?.map((part) => {
      const [baseTitle, baseOptions] = part.split(':');
      const options = baseOptions
        ? baseOptions.split(',').map((o) => o.match(/[a-z]+/)[0])
        : null;

      const title = baseTitle.match(/[a-z]+/)[0];

      return { title, options };
    }) || [];

  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    onChange(values);

    const valuesLength = Object.keys(values).length;
    const desiredLength = dynamicParts.length;
    onValidation(desiredLength === valuesLength);
  }, [values]);

  // description
  //
  return (
    <div
      style={{
        display: 'grid',
      }}
    >
      <span
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {layer.icon && <img src={layer.icon} height={20} />}
        <h3>{layer.name}</h3>
      </span>
      {layer.description && <p>{layer.description}</p>}
      <span
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {layer.license_url && <a href={layer.license_url}>License</a>}
        {layer.privacy_policy_url && (
          <a href={layer.privacy_policy_url}>Privacy policy</a>
        )}
      </span>

      <hr
        style={{
          width: '100%',
        }}
      />

      {dynamicParts.map((part) => {
        const hasOptions = !!part.options;

        if (hasOptions)
          return (
            <Autocomplete
              options={part.options}
              renderInput={(params) => (
                <TextField {...params} label={part.title} />
              )}
              onChange={(_, val) => {
                setValues((prev) => ({
                  ...prev,
                  [part.title]: val,
                }));
              }}
              key={part.title}
            />
          );

        return (
          <TextField
            label={part.title}
            key={part.title}
            onChange={(val) => {
              setValues((prev) => ({
                ...prev,
                [part.title]: val.target.value,
              }));
            }}
          />
        );
      })}
    </div>
  );
};

interface AddDialogProps {
  save: (layer: any) => void;
}

export const AddCustomDialog: React.FC<AddDialogProps> = ({ save }) => {
  const { opened, close } = useAddLayerContext();
  const [isSaveDisabled, setDisableSave] = React.useState(true);
  const [page, setPage] = React.useState(0);

  const [layer, setLayer] = React.useState<any | null>(null);
  const [layerUrl, setLayerUrl] = React.useState<string | null>(null);

  const onSave = () => {
    save(layer);
    close();
  };

  const onCancel = () => {
    close();
    setPage(0);
    setLayer(null);
  };

  return (
    <Dialog open={opened} maxWidth="sm" fullWidth>
      <DialogTitle>
        <p>Add a layer</p>
      </DialogTitle>

      <DialogContent>
        {page === 0 && (
          <LayerDataInput
            onSelect={(layer) => {
              setLayer(layer);
              setDisableSave(!layer);
            }}
          />
        )}
        {page === 1 && (
          <Details
            layer={layer}
            onChange={(vals) => {
              let baseUrl = layer.url.replace('{zoom}', '{z}');

              for (const key of Object.keys(vals)) {
                const keyPattern = new RegExp(`{${key}(:[a-z,]+)?}`);
                baseUrl = baseUrl.replace(keyPattern, vals[key]);
              }

              setLayerUrl(baseUrl);
            }}
            onValidation={(isOk) => {
              setDisableSave(!isOk);
            }}
          />
        )}

        <DialogActions>
          <Button onClick={onCancel} color="secondary" variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={() => {
              if (page === 0) {
                setPage((prev) => prev + 1);
                return;
              }

              save({ ...layer, url: layerUrl });
              close();
            }}
            color="primary"
            variant="contained"
            disabled={isSaveDisabled}
          >
            {page === 0 ? 'Next' : 'Save'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
