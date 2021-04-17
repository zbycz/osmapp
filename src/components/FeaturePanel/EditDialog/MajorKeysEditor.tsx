import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const majorKeysNames = {
  name: 'Název',
  website: 'Web',
  phone: 'Telefon',
  opening_hours: 'Otevírací doba',
};

export const majorKeys = ['name', 'website', 'phone', 'opening_hours'];

const getInitialMajorKeys = (tags) => majorKeys.filter((k) => !!tags[k]);

export const MajorKeysEditor = ({ tags, setTag, focusTag }) => {
  const [activeMajorKeys, setActiveMajorKeys] = React.useState(
    getInitialMajorKeys(tags),
  );
  const inactiveMajorKeys = majorKeys.filter(
    (k) => !activeMajorKeys.includes(k),
  );

  useEffect(() => {
    if (focusTag === 'name' && !activeMajorKeys.includes('name')) {
      setActiveMajorKeys((arr) => [...arr, 'name']);
    }
  }, [focusTag]);

  return (
    <>
      {activeMajorKeys.map((k) => (
        <div key={k}>
          <TextField
            label={majorKeysNames[k]}
            value={tags[k]}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            name={k}
            onChange={(e) => setTag(e.target.name, e.target.value)}
            fullWidth
            autoFocus={focusTag === k}
          />
        </div>
      ))}
      {!!inactiveMajorKeys.length && (
        <>
          <Typography variant="body1" component="span" color="textSecondary">
            Přidat:
          </Typography>
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
    </>
  );
};
