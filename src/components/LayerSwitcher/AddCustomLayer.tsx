import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  Category as CategoryType,
  LayerIndex,
  loadLayer,
} from './helpers/loadLayers';
import { SuccessLayerInput } from './SuccessLayerInput';
import { t } from '../../services/intl';

const LoadingLayerInput = () => (
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

const ErrorLayerInput = () => (
  <div>
    <p>An error occured while fetching the layer index</p>
  </div>
);

type FetchingState = 'success' | 'loading' | 'error';

const LayerDataInput: React.FC<{ onSelect: (layer: any) => void }> = ({
  onSelect,
}) => {
  const [layerIndex, setLayerIndex] = React.useState([]);
  const [layerIndexState, setLayerIndexState] =
    React.useState<FetchingState>('loading');

  React.useEffect(() => {
    loadLayer()
      .then((result) => {
        setLayerIndex(result);
        setLayerIndexState('success');
      })
      .catch(() => {
        setLayerIndex([]);
        setLayerIndexState('error');
      });
  }, []);

  switch (layerIndexState) {
    case 'success':
      return <SuccessLayerInput index={layerIndex} onSelect={onSelect} />;
    case 'error':
      return <ErrorLayerInput />;
    case 'loading':
      return <LoadingLayerInput />;
    default:
      return <LoadingLayerInput />;
  }
};

const dynamicPartsRegex = /{((?!y|x|zoom)[a-zA-Z:,0-9]+)}/g;

interface Detailsprops {
  layer: LayerIndex;
  onChange: (values: Record<string, string>) => void;
  onValidation: (ok: boolean) => void;
}

const Category = ({ category }: { category: CategoryType }) => {
  const start = t('layerswitcher.category');

  const categoryMap: Partial<Record<CategoryType, string>> = {
    photo: t('layerswitcher.category_photo'),
    osmbasedmap: t('layerswitcher.category_osmbasedmap'),
  };
  const categoryType = categoryMap[category] || category;

  return (
    <p>
      {start}: {categoryType}
    </p>
  );
};

const Details: React.FC<Detailsprops> = ({ layer, onChange, onValidation }) => {
  const { url } = layer;

  const dynamicParts =
    url.match(dynamicPartsRegex)?.map((part) => {
      const [baseTitle, baseOptions] = part.split(':');
      const options = baseOptions
        ? baseOptions.split(',').map((o) => o.match(/[a-zA-Z0-9]+/)[0])
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
        {layer.icon && (
          <img alt={`${layer.name}s logo`} src={layer.icon} height={20} />
        )}
        <h3>{layer.name}</h3>
      </span>
      {layer.description && <p>{layer.description}</p>}
      {/*  TODO: show a pretty category name instead of the raw one Maybe even translated */}
      <Category category={layer.category} />
      <span
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {layer.license_url && (
          <a href={layer.license_url}>{t('layerswitcher.license')}</a>
        )}
        {layer.privacy_policy_url && (
          <a href={layer.privacy_policy_url}>
            {t('layerswitcher.privacy_policy')}
          </a>
        )}
        <p>{t('layerswitcher.not_all_work')}</p>
      </span>

      <hr
        style={{
          width: '100%',
        }}
      />

      {dynamicParts.map((part) => {
        const hasOptions = !!part.options;

        const prettyTitle =
          {
            switch: 'Tile server',
            apikey: 'API-Key',
          }[part.title] || part.title;

        if (hasOptions)
          return (
            <Autocomplete
              options={part.options}
              renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} label={prettyTitle} />
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
            label={prettyTitle}
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
  save: (layer: LayerIndex) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const AddCustomDialog: React.FC<AddDialogProps> = ({
  save,
  isOpen,
  onClose,
}) => {
  const [isSaveDisabled, setDisableSave] = React.useState(true);

  const [layer, setLayer] = React.useState<LayerIndex | null>(null);
  const [layerUrl, setLayerUrl] = React.useState<string | null>(null);

  const onReset = () => {
    onClose();
    setLayer(null);
    setDisableSave(true);
  };

  const onSave = () => {
    save({ ...layer, url: layerUrl });
    onReset();
  };

  return (
    <Dialog open={isOpen} maxWidth="md">
      <DialogTitle>
        <p>Add a layer</p>
      </DialogTitle>

      <DialogContent>
        <LayerDataInput
          onSelect={(newLayer) => {
            setLayer(newLayer);
            setDisableSave(!newLayer);
          }}
        />
        {layer && (
          <Details
            layer={layer}
            onChange={(vals) => {
              const baseUrl = Object.keys(vals).reduce((acc, key) => {
                const keyPattern = new RegExp(`{${key}(:[a-z,A-Z,0-9]+)?}`);
                return acc.replace(keyPattern, vals[key]);
              }, layer.url.replace('{zoom}', '{z}'));

              setLayerUrl(baseUrl);
            }}
            onValidation={(isOk) => {
              setDisableSave(!isOk);
            }}
          />
        )}

        <DialogActions>
          <Button onClick={onReset} color="secondary" variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onSave}
            color="primary"
            variant="contained"
            disabled={isSaveDisabled}
          >
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
