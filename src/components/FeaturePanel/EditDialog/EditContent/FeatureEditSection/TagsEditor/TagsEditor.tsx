import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import AppsIcon from '@mui/icons-material/Apps';
import { majorKeys } from '../MajorKeysEditor';
import { isString } from '../../../../../helpers';
import { t, Translation } from '../../../../../../services/intl';
import { useEditDialogContext } from '../../../../helpers/EditDialogContext';
import { KeyInput } from './KeyInput';
import { ValueInput } from './ValueInput';
import { OptionsEditor } from '../OptionsEditor';
import { useCurrentItem } from '../../../EditContext';

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

const TagsEditorInfo = () => (
  <tr>
    <td colSpan={2}>
      <Typography variant="body2" color="textSecondary" mt={2}>
        <Translation id="editdialog.tags_editor_info" />
      </Typography>
    </td>
  </tr>
);

const AddButton = () => {
  const { tagsEntries, setTagsEntries } = useCurrentItem();
  return (
    <tr>
      <td colSpan={2}>
        <Button
          variant="text"
          color="primary"
          disableElevation
          onClick={() => setTagsEntries((state) => [...state, ['', '']])}
          startIcon={<AddIcon />}
        >
          {t('editdialog.add_tag')}
        </Button>
      </td>
    </tr>
  );
};

const TagsEditorInner = () => {
  const { tagsEntries } = useCurrentItem();
  return (
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
  );
};

const TagsCount = () => {
  const { tagsEntries } = useCurrentItem();
  if (!tagsEntries.length) {
    return null;
  }
  return (
    // This is intentionaly Typography, not a Chip. Because the number is not the same importancy level as number of Members/Parents.
    <Typography variant="caption" color="secondary">
      {' '}
      ({tagsEntries.length})
    </Typography>
  );
};

export const TagsEditor = () => {
  const { focusTag } = useEditDialogContext();
  const focusThisEditor = isString(focusTag) && !majorKeys.includes(focusTag);
  const [expanded, setExpanded] = useState(focusThisEditor);

  useEffect(() => {
    if (focusThisEditor) {
      setExpanded(true);
    }
  }, [focusThisEditor]);

  return (
    <>
      <Divider />
      <Accordion
        disableGutters
        elevation={0}
        square
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          '&.MuiAccordion-root:before': {
            opacity: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AppsIcon />
            <Typography variant="button">
              {t('editdialog.tags_editor')}
              <TagsCount />
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <TagsEditorInner />

          <OptionsEditor />
        </AccordionDetails>
      </Accordion>
    </>
  );
};
