import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Field } from '../../services/tagging/types/Fields';
import { nl2br } from "../utils/nl2br";

const Table = styled.table`
  font-size: 1rem;
  width: 100%;

  th,
  td {
    padding: 0.1em;
    overflow: hidden;

    &:hover .show-on-hover {
      display: block !important;
    }
  }

  th {
    width: 140px;
    max-width: 140px;
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
    padding-left: 0;
  }

  table {
    padding-left: 1em;
    padding-bottom: 1em;
  }
`;

const getTitle = (field: Field) => JSON.stringify(field, null, 2);

export const TmpPresets = ({ feature }) => {
  const { schema } = feature;
  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  return (
    <>
      <Table>
        <tbody>
        {schema.matchedFields.map(({ key, value, label, field }) => (
          <tr key={key}>
            <th title={getTitle(field)}>{label}</th>
            <td>{(value)}</td>
          </tr>
        ))}
        </tbody>
      </Table>
      <Typography variant="overline" display="block" color="textSecondary">
        Rest
      </Typography>

      <Table>
        <tbody>
        {schema.tagsWithFields.map(({ key, value, label, field }) => (
          <tr key={key}>
            <th title={getTitle(field)}>{label}</th>
            <td>{value}</td>
          </tr>
        ))}
        </tbody>
      </Table>

      <Table>
        <tbody>
        {schema.restKeys.map((key) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{feature.tags[key]}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
};
