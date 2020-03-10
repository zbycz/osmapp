// @flow

import * as React from 'react';
import styled from 'styled-components';
import truncate from 'lodash/truncate';

import { useToggleState } from '../helpers';
import { getUrlForTag, ToggleButton } from './helpers';
import Info from '@material-ui/icons/Info';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';

const Wrapper = styled.div`
  position: relative;

  input {
    padding: 0;
  }
`;

const Table = styled.table`
  font-size: 1rem;
  width: 100%;
  border-spacing: 0;

  th,
  td {
    padding: 0.1em;
    overflow: hidden;
  }

  th {
    width: 140px;
    max-width: 140px;
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
    padding-left: 0;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    border-top: 1px solid transparent;
  }

  td {
    max-width: 195px;
    border-right: 1px solid transparent;
    border-top: 1px solid transparent;
  }

  tr:first-child {
    th {
      border-radius: 4px 0 0 0;
    }
    td {
      border-radius: 0 4px 0 0;
    }
  }
  tr:last-child {
    th {
      border-radius: 0 0 0 4px;
      border-bottom: 1px solid transparent;
    }
    td {
      border-radius: 0 0 4px 0;
      border-bottom: 1px solid transparent;
    }
  }

  ${({ isEditing }) =>
    isEditing &&
    `
      td, th {
        border-color: rgba(0, 0, 0, 0.23) !important;
      }
    `}

  // subtable eg. opening_hours
  table {
    padding-left: 1em;
    padding-bottom: 1em;
  }
`;

const TagsIcon = styled(Info)`
  margin: 0 10px -6px 2px;
  // margin-bottom: -41px;
  position: absolute;
  opacity: 0.4;
`;

const isAddr = k => k.match(/^addr:|uir_adr|:addr/);
const isName = k => k.match(/^([a-z]+_)?name(:|$)/);
const isBuilding = k => k.match(/building|roof|^min_level|^max_level|height$/);
const isNetwork = k => k.match(/network/);
const isBrand = k => k.match(/^brand/);

const TagsGroup = ({ tags, label, value, hideArrow }) => {
  const [isShown, toggle] = useToggleState(false);

  if (!tags.length) {
    return null;
  }

  return (
    <>
      <tr>
        <th>{label}</th>
        <td>
          {value || tags[0]}
          {!hideArrow && <ToggleButton onClick={toggle} isShown={isShown} />}
        </td>
      </tr>
      {isShown && (
        <tr>
          <td colSpan="2">
            <table>
              <tbody>
                {tags.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

const buildAddress = tagsArr => {
  const tags = tagsArr.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  const {
    'addr:street': str,
    'addr:housenumber': num,
    'addr:city': city,
  } = tags;

  return `${str || ''} ${num || ''}${city ? `, ${city}` : ''}`.trim();
};

const renderValue = (k, v) => {
  const url = getUrlForTag(k, v);
  return url ? <a href={url}>{v.replace(/^https?:\/\//, '')}</a> : v;
};

const TagsTable = props => {
  const tagsArr = Object.entries(props.tags);
  const tags = tagsArr.filter(([k]) => !props.except.includes(k));
  const { isEditing } = props;

  const addr = tags.filter(([k]) => isAddr(k));
  const name = tags.filter(([k]) => isName(k));
  const building = tags.filter(([k]) => isBuilding(k));
  const network = tags.filter(([k]) => isNetwork(k));
  const brand = tags.filter(([k]) => isBrand(k));
  const rest = tags.filter(
    ([k]) =>
      !isName(k) &&
      !isAddr(k) &&
      !isBuilding(k) &&
      !isNetwork(k) &&
      !isBrand(k),
  );

  return (
    <Wrapper>
      <Table isEditing={isEditing}>
        <tbody>
          <TagsGroup
            tags={name}
            label="name"
            value={
              props.tags.short_name || truncate(props.tags.name, { length: 25 })
            }
            hideArrow={name.length === 1}
          />
          <TagsGroup tags={addr} label="addr:*" value={buildAddress(addr)} />
          {rest.map(([k, v]) => (
            <tr key={k}>
              <th>{k}</th>
              <td>
                {isEditing ? (
                  <InputBase
                    placeholder=""
                    margin="none"
                    fullWidth
                    defaultValue={v}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  renderValue(k, v)
                )}
              </td>
            </tr>
          ))}
          <TagsGroup tags={brand} label="brand:*" value={props.tags.brand} />
          <TagsGroup
            tags={building}
            label="building:*"
            value={props.tags.building}
          />
          <TagsGroup
            tags={network}
            label="network:*"
            value={props.tags.network}
          />
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default TagsTable;
