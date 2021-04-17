import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { isString } from '../../helpers';
import { majorKeys } from './MajorKeysEditor';

const Table = styled.table`
  font-size: 80%;
  width: 100%;

  th {
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: center;
    padding-left: 0;
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
  const focusTagsSection =
    isString(focusTag) && !majorKeys.includes(focusTag as string);

  const [showTags, setShowTags] = useState(focusTagsSection);

  useEffect(() => {
    if (focusTagsSection) {
      setShowTags(true);
    }
  }, [focusTagsSection]);

  const rows = Object.entries(tags)
    .filter(([k]) => !majorKeys.includes(k))
    .map(([k, v]) => (
      <KeyValueRow k={k} v={v} setTag={setTag} focusTag={focusTag} />
    ));

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={showTags}
            onChange={() => setShowTags(!showTags)}
          />
        }
        label="Změnit další vlastnosti - tagy"
      />
      {showTags && (
        <Table>
          <tbody>
            {rows}
            <NewTagRow setTag={setTag} />
          </tbody>
        </Table>
      )}
      <br />
    </>
  );
};
