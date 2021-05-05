import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { majorKeys } from './MajorKeysEditor';
import { isString } from '../../helpers';
import { t } from '../../../services/intl';

const Table = styled.table`
  width: calc(100% - 20px);
  margin-left: 20px;

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
      <th style={{ verticalAlign: 'baseline' }}>
        <TextField
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          variant="outlined"
          size="small"
          placeholder={t('editdialog.other_tags.new_key')}
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
          {t('editdialog.other_tags.add')}
        </Button>
      </td>
    </tr>
  );
};

const KeyValueRow = ({ k, v, setTag, focusTag }) => (
  <tr>
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
        placeholder={t('editdialog.other_tags.will_be_deleted')}
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
      <KeyValueRow key={k} k={k} v={v} setTag={setTag} focusTag={focusTag} />
    ));

  return (
    <div>
      {!showTags && (
        <Button
          variant="outlined"
          disableElevation
          onClick={() => setShowTags(!showTags)}
        >
          {t('editdialog.other_tags')}
          <ExpandMoreIcon fontSize="small" />
        </Button>
      )}

      {showTags && (
        <>
          <Typography
            variant="overline"
            component="h3"
            color="textSecondary"
            style={{ position: 'relative' }}
          >
            {t('editdialog.other_tags')}
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
      <br />
      <br />
    </div>
  );
};
