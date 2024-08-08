import React from 'react';
import truncate from 'lodash/truncate';

import { useToggleState } from '../../helpers';
import { InlineEditButton } from '../helpers/InlineEditButton';
import { buildAddress } from '../../../services/helpers';
import { ToggleButton } from '../helpers/ToggleButton';
import { renderValue } from './renderValue';

const isAddr = (k) => k.match(/^addr:|uir_adr|:addr/);
const isName = (k) => k.match(/^name(:|$)/);
const isShortName = (k) => k.match(/^short_name(:|$)/);
const isAltName = (k) => k.match(/^alt_name(:|$)/);
const isOfficialName = (k) => k.match(/^official_name(:|$)/);
const isOldName = (k) => k.match(/^old_name(:|$)/);
const isBuilding = (k) =>
  k.match(/building|roof|^min_level|^max_level|height$/);
const isNetwork = (k) => k.match(/network/);
const isBrand = (k) => k.match(/^brand/);
const isOperator = (k) => k.match(/^operator/);
const isPayment = (k) => k.match(/^payment/);

const TagsGroup = ({ tags, label, value, hideArrow = false }) => {
  const [isShown, toggle] = useToggleState(false);

  if (!tags.length) {
    return null;
  }

  return (
    <>
      <tr>
        <th>{label}</th>
        <td>
          <InlineEditButton k={tags[0][0]} />
          {value || tags[0]?.[1]}
          {!hideArrow && <ToggleButton onClick={toggle} isShown={isShown} />}
        </td>
      </tr>
      {isShown && (
        <tr>
          <td colSpan={2}>
            <table>
              <tbody>
                {tags.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{renderValue(k, v)}</td>
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

// TODO make it dynamic - count how many "first parts before :" are there, and group all >= 2

export const TagsTableInner = ({ tags, center, except = [] }) => {
  const tagsEntries = Object.entries(tags).filter(([k]) => !except.includes(k));

  const addrs = tagsEntries.filter(([k]) => isAddr(k));
  const names = tagsEntries.filter(([k]) => isName(k));
  const shortNames = tagsEntries.filter(([k]) => isShortName(k));
  const altNames = tagsEntries.filter(([k]) => isAltName(k));
  const officialNames = tagsEntries.filter(([k]) => isOfficialName(k));
  const oldNames = tagsEntries.filter(([k]) => isOldName(k));
  const buildings = tagsEntries.filter(([k]) => isBuilding(k));
  const networks = tagsEntries.filter(([k]) => isNetwork(k));
  const brands = tagsEntries.filter(([k]) => isBrand(k));
  const operator = tagsEntries.filter(([k]) => isOperator(k));
  const payments = tagsEntries.filter(([k]) => isPayment(k));
  const rest = tagsEntries.filter(
    ([k]) =>
      !isName(k) &&
      !isShortName(k) &&
      !isAltName(k) &&
      !isOfficialName(k) &&
      !isOldName(k) &&
      !isAddr(k) &&
      !isBuilding(k) &&
      !isNetwork(k) &&
      !isOperator(k) &&
      !isPayment(k) &&
      !isBrand(k),
  );

  return (
    <>
      <TagsGroup
        tags={names}
        label={names.length === 1 ? names[0][0] : 'name:*'}
        value={truncate(tags.name, { length: 25 })}
        hideArrow={names.length === 1}
      />
      <TagsGroup
        tags={shortNames}
        label={shortNames.length === 1 ? shortNames[0][0] : 'short_name:*'}
        value={shortNames[0]?.[1]}
        hideArrow={shortNames.length === 1}
      />
      <TagsGroup
        tags={altNames}
        label={altNames.length === 1 ? altNames[0][0] : 'alt_name:*'}
        value={altNames[0]?.[1]}
        hideArrow={altNames.length === 1}
      />
      <TagsGroup
        tags={officialNames}
        label={
          officialNames.length === 1 ? officialNames[0][0] : 'official_name:*'
        }
        value={officialNames[0]?.[1]}
        hideArrow={officialNames.length === 1}
      />
      <TagsGroup
        tags={oldNames}
        label={oldNames.length === 1 ? oldNames[0][0] : 'old_name:*'}
        value={oldNames[0]?.[1]}
        hideArrow={oldNames.length === 1}
      />
      <TagsGroup
        tags={addrs}
        label="addr:*"
        value={buildAddress(Object.fromEntries(addrs) as any, center)}
      />
      {rest.map(([k, v]) => (
        <tr key={k}>
          <th>{k}</th>
          <td>
            <InlineEditButton k={k} />
            {renderValue(k, v)}
          </td>
        </tr>
      ))}
      <TagsGroup tags={brands} label="brand:*" value={tags.brand} />
      <TagsGroup tags={buildings} label="building:*" value={tags.building} />
      <TagsGroup tags={networks} label="network:*" value={tags.network} />
      <TagsGroup tags={operator} label="operator:*" value={tags.operator} />
      <TagsGroup tags={payments} label="payment:*" value={tags.payment} />
    </>
  );
};
