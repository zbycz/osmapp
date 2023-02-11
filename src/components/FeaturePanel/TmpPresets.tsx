import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Field } from '../../services/tagging/types/Fields';
import { getUrlForTag } from './helpers/getUrlForTag';
import { slashToOptionalBr } from '../helpers';
import { buildAddress } from "../../services/helpers";

// taken from src/components/FeaturePanel/TagsTable.tsx
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


// taken from src/components/FeaturePanel/TagsTable.tsx
const renderValue = (k, v) => {
  const url = getUrlForTag(k, v);
  let humanUrl = v.replace(/^https?:\/\//, '').replace(/^([^/]+)\/$/, '$1');
  if (k === 'image') {
    humanUrl = humanUrl.replace(/^([^/]+.{0,5})(.*)$/, (full, p1, p2) => {
      const charsLeft = 30 - p1.length;
      return (
        p1 + (full.length > 40 ? `…${p2.substring(p2.length - charsLeft)}` : p2)
      );
    });
  }
  return url ? <a href={url}>{slashToOptionalBr(humanUrl)}</a> : v;
};

const render = (field: Field, tags, k, v) => {
  if (field.type === 'address') {
    return buildAddress(tags);
  }
  return renderValue(k, v)
}

const TrHeader = ({ title }) => (
  (
    <tr>
      <th colSpan={2}>
        <Typography
          variant="overline"
          display="block"
          color="textSecondary"
        >
          {title}
        </Typography>
      </th>
    </tr>
  )
);


const getTitle = (field: Field) => JSON.stringify(field, null, 2);

export const TmpPresets = ({ feature }) => {
  const { schema } = feature;
  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  return (
    <>
      <Table>
        <tbody>
          {!!schema.matchedFields.length && (<TrHeader title="Fields from preset"/>)}
          {schema.matchedFields.map(({ key, value, label, field }) => (
            <tr key={key}>
              <th title={getTitle(field)}>{label}</th>
              <td>{render(field, feature.tags, key, value)}</td>
            </tr>
          ))}
        </tbody>
        <tbody>
          {!!schema.tagsWithFields.length && (<TrHeader title="Tags matching Fields"/>)}
          {schema.tagsWithFields.map(({ key, value, label, field }) => (
            <tr key={key}>
              <th title={getTitle(field)}>{label}</th>
              <td>{render(field, feature.tags, key, value)}</td>
            </tr>
          ))}
        </tbody>
        <tbody>
          {!!schema.restKeys.length && (<TrHeader title="Tags without Fields"/>)}
          {schema.restKeys.map((key) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{renderValue(key, feature.tags[key])}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
