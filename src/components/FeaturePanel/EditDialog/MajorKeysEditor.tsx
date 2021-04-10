import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const majorKeysNames = {
  name: 'Název',
  website: 'Web',
  phone: 'Telefon',
  opening_hours: 'Otevírací doba',
};

export const majorKeys = ['name', 'website', 'phone', 'opening_hours'];

const getInitialMajorKeys = (tags) => majorKeys.filter((k) => !!tags[k]);

export const MajorKeysEditor = ({ values, setValue, focusTag }) => {
  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(values),
  );
  const inactiveMajorKeys = majorKeys.filter(
    (k) => !activeMajorKeys.includes(k),
  );

  return (
    <>
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
            autoFocus={focusTag === k}
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
    </>
  );
};
