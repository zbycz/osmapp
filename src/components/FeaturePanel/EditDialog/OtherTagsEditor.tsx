import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isString } from '../../helpers';
import { majorKeys } from './MajorKeysEditor';

const Table = styled.table`
  font-size: 80%;

  th {
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: center;
    padding-left: 0;
  }
`;

export const OtherTagsEditor = ({ values, setValue, focusTag }) => {
  const focusTags =
    isString(focusTag) && !majorKeys.includes(focusTag as string);

  const [showTags, setShowTags] = useState(focusTags);

  useEffect(() => {
    if (focusTags) {
      setShowTags(true);
    }
  }, [focusTags]);

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
            {Object.entries(values)
              .filter(([k]) => !majorKeys.includes(k))
              .map(([k, v]) => (
                <tr key={k}>
                  <th>{k}</th>
                  <td>
                    <TextField
                      value={v}
                      variant="outlined"
                      size="small"
                      name={k}
                      onChange={(e) => setValue(e.target.name, e.target.value)}
                      fullWidth
                      autoFocus={focusTag === k}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <br />
    </>
  );
};
