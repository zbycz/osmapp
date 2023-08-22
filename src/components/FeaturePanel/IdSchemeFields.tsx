import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Field } from '../../services/tagging/types/Fields';
import { getUrlForTag } from './helpers/getUrlForTag';
import { slashToOptionalBr } from '../helpers';
import { buildAddress } from '../../services/helpers';
import { Feature } from '../../services/types';
import { t } from '../../services/intl';

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
    color: ${({ theme }) => theme.palette.text.secondary};
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

// TODO move to helpers
const getEllipsisHumanUrl = (humanUrl) => {
  const MAX_LENGTH = 40;
  return humanUrl.replace(/^([^/]+.{0,5})(.*)$/, (full, hostname, rest) => {
    const charsLeft = MAX_LENGTH - 10 - hostname.length;
    return (
      hostname +
      (full.length > MAX_LENGTH
        ? `…${rest.substring(rest.length - charsLeft)}`
        : rest)
    );
  });
};

// taken from src/components/FeaturePanel/TagsTable.tsx
const renderValue = (k, v): string | ReactNode => {
  const url = getUrlForTag(k, v);
  if (url) {
    let humanUrl = v.replace(/^https?:\/\//, '').replace(/^([^/]+)\/$/, '$1');
    if (k === 'image') {
      humanUrl = getEllipsisHumanUrl(humanUrl);
    }
    return <a href={url}>{slashToOptionalBr(humanUrl)}</a>;
  }
  return v;
};

const render = (field: Field, feature: Feature, k, v): string | ReactNode => {
  if (field.type === 'address') {
    return buildAddress(feature.tags, feature.center);
  }
  return renderValue(k, v);
};

const getTitle = (type: string, field: Field) =>
  `${type}: ${JSON.stringify(field, null, 2)}`;

// TODO some fields eg. oneway/bicycle doesnt have units in brackets
const unitRegExp = / \((.+)\)$/i;
const removeUnits = (label) => label.replace(unitRegExp, '');
const addUnits = (label, value: string | ReactNode) => {
  if (typeof value !== 'string') return value;
  const unit = label.match(unitRegExp);
  return `${value}${unit ? ` (${unit[1]})` : ''}`;
};

export const IdSchemeFields = ({ feature, featuredTags }) => {
  const { schema } = feature;
  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  return (
    <>
      {featuredTags.length &&
      (schema.matchedFields.length ||
        schema.tagsWithFields.length ||
        schema.restKeys.length) ? (
        <Typography variant="overline" display="block" color="textSecondary">
          {t('featurepanel.other_info_heading')}
        </Typography>
      ) : null}

      <Table>
        <tbody>
          {schema.matchedFields.map(({ key, value, label, field }) => (
            <tr key={key}>
              <th title={getTitle('from preset', field)}>
                {removeUnits(label)}
              </th>
              <td>{addUnits(label, render(field, feature, key, value))}</td>
            </tr>
          ))}
        </tbody>
        <tbody>
          {schema.tagsWithFields.map(({ key, value, label, field }) => (
            <tr key={key}>
              <th title={getTitle('standalone field', field)}>
                {removeUnits(label)}
              </th>
              <td>{render(field, feature, key, addUnits(label, value))}</td>
            </tr>
          ))}
        </tbody>
        <tbody>
          {schema.keysTodo.map((key) => (
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
