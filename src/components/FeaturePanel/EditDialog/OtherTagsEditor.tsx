import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Button, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { majorKeys } from './MajorKeysEditor';
import { isString } from '../../helpers';
import { t, Translation } from '../../../services/intl';

const Table = styled.table`
  width: calc(100% - 20px);
  margin-left: 20px;

  th {
    color: ${({ theme }) => theme.palette.text.secondary};
    text-align: left;
    font-weight: normal;
    vertical-align: center;
    font-size: 13px;
    max-width: 25vw;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  td {
    padding-left: 20px;
  }

  .MuiInputBase-root {
    font-size: 13px;
  }
`;

const OtherTagsHeading = () => (
  <Typography
    variant="overline"
    component="h3"
    color="textSecondary"
    style={{ position: 'relative' }}
  >
    {t('editdialog.other_tags')}
  </Typography>
);

const OtherTagsButton = ({ setVisible }) => (
  <Button
    variant="outlined"
    disableElevation
    onClick={() => setVisible((currentState) => !currentState)}
  >
    {t('editdialog.other_tags')}
    <ExpandMoreIcon fontSize="small" />
  </Button>
);

const OtherTagsInfo = () => (
  <tr>
    <td colSpan={2}>
      <Typography color="textSecondary" style={{ paddingTop: '1em' }}>
        <Translation id="editdialog.other_tags.info" />
      </Typography>
    </td>
  </tr>
);

const NewTagRow = ({ setTag, setTmpNewTag }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newKey && newValue) {
      setTag(newKey, newValue);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleKeyChange = ({ target: { value } }) => {
    setNewKey(value);
    setTmpNewTag({ [value]: newValue });
  };
  const handleValueChange = ({ target: { value } }) => {
    setNewValue(value);
    setTmpNewTag({ [newKey]: value });
  };
  return (
    <>
      <tr>
        <th style={{ verticalAlign: 'baseline' }}>
          <TextField
            value={newKey}
            onChange={handleKeyChange}
            variant="outlined"
            size="small"
            placeholder={t('editdialog.other_tags.new_key')}
            inputProps={{ autocapitalize: 'none' }}
          />
        </th>
        <td>
          <TextField
            value={newValue}
            onChange={handleValueChange}
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ autocapitalize: 'none' }}
          />
        </td>
      </tr>
      <tr>
        <td />
        <td>
          <Button
            variant="contained"
            disableElevation
            onClick={handleAdd}
            disabled={!newKey || !newValue}
          >
            <AddIcon />
          </Button>
        </td>
      </tr>
    </>
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
        inputProps={{ autocapitalize: 'none' }}
        autoFocus={focusTag === k}
        placeholder={t('editdialog.other_tags.will_be_deleted')}
      />
    </td>
  </tr>
);

export const OtherTagsEditor = ({ tags, setTag, focusTag, setTmpNewTag }) => {
  const focusThisEditor =
    isString(focusTag) && !majorKeys.includes(focusTag as string);

  const [visible, setVisible] = useState(focusThisEditor);

  useEffect(() => {
    if (focusThisEditor) {
      setVisible(true);
    }
  }, [focusThisEditor]);

  const rows = Object.entries(tags).filter(([k]) => !majorKeys.includes(k));

  return (
    <Box mb={4}>
      {!visible && <OtherTagsButton setVisible={setVisible} />}
      {visible && (
        <>
          <OtherTagsHeading />
          <Table>
            <tbody>
              {rows.map(([k, v]) => (
                <KeyValueRow
                  key={k}
                  k={k}
                  v={v}
                  setTag={setTag}
                  focusTag={focusTag}
                />
              ))}
              <NewTagRow setTag={setTag} setTmpNewTag={setTmpNewTag} />
              <OtherTagsInfo />
            </tbody>
          </Table>
        </>
      )}
    </Box>
  );
};
