import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { majorKeys } from './MajorKeysEditor';
import { isString } from '../../../helpers';
import { t, Translation } from '../../../../services/intl';
import { TagsEntries, useEditContext } from '../EditContext';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import DeleteIcon from '@mui/icons-material/Delete';

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

const useInputFocused = () => {
  const [valueFocused, setValueFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // blur event would fire before DeleteButton can be clicked
    const listener = ({ target }: Event) => {
      if (target !== inputRef.current && target !== deleteButtonRef.current) {
        setValueFocused(false);
      }
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, []);

  return { valueFocused, setValueFocused, inputRef, deleteButtonRef };
};

const ValueInput = ({ index }: { index: number }) => {
  const { focusTag } = useEditDialogContext();
  const {
    tags: { tagsEntries, setTagsEntries },
  } = useEditContext();

  const { valueFocused, setValueFocused, inputRef, deleteButtonRef } =
    useInputFocused();

  const handleDelete = () => {
    setTagsEntries((state) => state.toSpliced(index, 1));
  };

  const handleValueChange = (e) => {
    setTagsEntries((state) =>
      state.map(([key, value], idx) =>
        idx === index ? [key, e.target.value] : [key, value],
      ),
    );
  };

  const [k, v] = tagsEntries[index];

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        name={k}
        value={v}
        onChange={handleValueChange}
        fullWidth
        variant="outlined"
        size="small"
        slotProps={{
          htmlInput: {
            autoCapitalize: 'none',
            maxLength: 255,
            ref: inputRef,
          },
        }}
        autoFocus={focusTag === k}
        onFocus={() => setValueFocused(true)}
      />
      {valueFocused && (
        <IconButton size="small" onClick={handleDelete} ref={deleteButtonRef}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
};

const KeyValueRow = ({ index }) => {
  const { focusTag } = useEditDialogContext();
  const { tagsEntries, setTagsEntries } = useEditContext().tags;

  const [error, setError] = useState(false);
  const [tmpKey, setTmpKey] = useState(() => tagsEntries[index][0]);
  useEffect(() => {
    setTmpKey(tagsEntries[index][0]);
  }, [index, tagsEntries]);

  const handleBlur = () => {
    if (tmpKey === tagsEntries[index][0]) {
      return;
    }

    const isDuplicateKey = tagsEntries.some(
      ([key], idx) => key === tmpKey && index !== idx,
    );
    setError(isDuplicateKey);

    setTagsEntries((state) => {
      if (tmpKey === '' && index !== state.length - 1) {
        return state.toSpliced(index, 1);
      }
      return state.map(([key, value], idx) =>
        idx === index ? [tmpKey, value] : [key, value],
      );
    });
  };

  return (
    <tr>
      <th>
        <TextField
          name={'key'}
          value={tmpKey}
          onChange={({ target }) => setTmpKey(target.value)}
          onBlur={handleBlur}
          fullWidth
          variant="outlined"
          size="small"
          slotProps={{
            htmlInput: { autoCapitalize: 'none', maxLength: 255 },
          }}
          autoFocus={focusTag === tmpKey}
          error={error}
        />
      </th>
      <td>
        <ValueInput index={index} />
      </td>
    </tr>
  );
};

const showAddButton = (tagsEntries: TagsEntries) => {
  return tagsEntries.length === 0 || tagsEntries[tagsEntries.length - 1][0];
};

export const OtherTagsEditor = () => {
  const { focusTag } = useEditDialogContext();
  const {
    tags: { tagsEntries, setTag },
  } = useEditContext();

  const focusThisEditor =
    isString(focusTag) && !majorKeys.includes(focusTag as string);

  const [visible, setVisible] = useState(focusThisEditor);

  useEffect(() => {
    if (focusThisEditor) {
      setVisible(true);
    }
  }, [focusThisEditor]);

  return (
    <Box mb={4}>
      {!visible && <OtherTagsButton setVisible={setVisible} />}
      {visible && (
        <>
          <OtherTagsHeading />
          <Table>
            <tbody>
              {tagsEntries.map((_, idx) => (
                <KeyValueRow key={idx} index={idx} />
              ))}
              <tr>
                <td />
                <td>
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => setTag('', '')}
                    disabled={!showAddButton(tagsEntries)}
                  >
                    <AddIcon />
                  </Button>
                </td>
              </tr>
              <OtherTagsInfo />
            </tbody>
          </Table>
        </>
      )}
    </Box>
  );
};
