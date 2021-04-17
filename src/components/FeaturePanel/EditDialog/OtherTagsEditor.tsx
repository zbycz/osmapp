import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { majorKeys } from './MajorKeysEditor';
import { isString } from '../../helpers';

const Table = styled.table`
  font-size: 80%;
  width: 100%;

  th {
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: center;
    padding-left: 0;
    font-size: 13px;
  }

  .MuiInputBase-root {
    font-size: 13px;
  }
`;

const NewTagRow = ({ setTag }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newKey && newValue) {
      setTag(newKey, newValue);
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <tr>
      <th>
        <TextField
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          variant="outlined"
          size="small"
          placeholder="new key"
        />
      </th>
      <td>
        <TextField
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          variant="outlined"
          size="small"
        />{' '}
        <Button variant="contained" disableElevation onClick={handleAdd}>
          Add
        </Button>
      </td>
    </tr>
  );
};

const KeyValueRow = ({ k, v, setTag, focusTag }) => (
  <tr key={k}>
    <th>{k}</th>
    <td>
      <TextField
        name={k}
        value={v}
        onChange={(e) => setTag(e.target.name, e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        autoFocus={focusTag === k}
        placeholder="will be deleted"
      />
    </td>
  </tr>
);

export const OtherTagsEditor = ({ tags, setTag, focusTag }) => {
  const focusThisSection =
    isString(focusTag) && !majorKeys.includes(focusTag as string);

  const [showTags, setShowTags] = useState(focusThisSection);

  useEffect(() => {
    if (focusThisSection) {
      setShowTags(true);
    }
  }, [focusThisSection]);

  const rows = Object.entries(tags)
    .filter(([k]) => !majorKeys.includes(k))
    .map(([k, v]) => (
      <KeyValueRow k={k} v={v} setTag={setTag} focusTag={focusTag} />
    ));

  return (
    <>
      {!showTags && (
        <Button
          variant="outlined"
          disableElevation
          onClick={() => setShowTags(!showTags)}
        >
          Další vlastnosti - tagy
          {showTags ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </Button>
      )}

      {showTags && (
        <>
          <Typography variant="overline" display="block" color="textSecondary">
            Další vlastnosti - tagy
          </Typography>
          <Table>
            <tbody>
              {rows}
              <NewTagRow setTag={setTag} />
            </tbody>
          </Table>
        </>
      )}
      <br />
    </>
  );
};
