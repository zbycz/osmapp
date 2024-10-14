import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { majorKeys } from '../MajorKeysEditor';
import { isString } from '../../../../helpers';
import { t, Translation } from '../../../../../services/intl';
import { useEditContext } from '../../EditContext';
import { useEditDialogContext } from '../../../helpers/EditDialogContext';
import { KeyInput } from './KeyInput';
import { ValueInput } from './ValueInput';

const Table = styled.table`
  width: calc(100% - 8px);
  margin-left: 8px;

  th {
    color: ${({ theme }) => theme.palette.text.secondary};
    text-align: left;
    font-weight: normal;
    vertical-align: center;
    font-size: 13px;
    width: 38.2%; // golden ratio
    max-width: 38.2%;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  td {
    padding-left: 2px;
  }

  .MuiInputBase-root {
    font-size: 13px;
  }
`;

const TagsEditorHeading = () => (
  <Typography
    variant="overline"
    component="h3"
    color="textSecondary"
    style={{ position: 'relative' }}
  >
    {t('editdialog.tags_editor')}
  </Typography>
);

const TagsEditorButton = ({ setVisible }) => (
  <Button
    variant="outlined"
    disableElevation
    onClick={() => setVisible((currentState) => !currentState)}
  >
    {t('editdialog.tags_editor')}
    <ExpandMoreIcon fontSize="small" />
  </Button>
);

const TagsEditorInfo = () => (
  <tr>
    <td colSpan={2}>
      <Typography color="textSecondary" style={{ paddingTop: '1em' }}>
        <Translation id="editdialog.tags_editor_info" />
      </Typography>
    </td>
  </tr>
);

const AddButton = () => {
  const { tagsEntries, setTagsEntries } = useEditContext().tags;
  const [lastKey, lastValue] = tagsEntries[tagsEntries.length - 1];
  const active = tagsEntries.length === 0 || (lastKey && lastValue);

  return (
    <tr>
      <td />
      <td>
        <Button
          variant="contained"
          disableElevation
          onClick={() => setTagsEntries((state) => [...state, ['', '']])}
          disabled={!active}
        >
          <AddIcon />
        </Button>
      </td>
    </tr>
  );
};

const TagsEditorInner = () => {
  const { tagsEntries } = useEditContext().tags;
  return (
    <>
      <TagsEditorHeading />
      <Table>
        <tbody>
          {tagsEntries.map((_, index) => (
            <tr key={index}>
              <th>
                <KeyInput index={index} />
              </th>
              <td>
                <ValueInput index={index} />
              </td>
            </tr>
          ))}
          <AddButton />
          <TagsEditorInfo />
        </tbody>
      </Table>
    </>
  );
};

export const TagsEditor = () => {
  const { focusTag } = useEditDialogContext();
  const focusThisEditor = isString(focusTag) && !majorKeys.includes(focusTag);
  const [visible, setVisible] = useState(focusThisEditor);

  useEffect(() => {
    if (focusThisEditor) {
      setVisible(true);
    }
  }, [focusThisEditor]);

  return (
    <Box mb={4}>
      {visible ? (
        <TagsEditorInner />
      ) : (
        <TagsEditorButton setVisible={setVisible} />
      )}
    </Box>
  );
};
