import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { Field } from '../../../services/tagging/types/Fields';
import { useToggleState } from '../../helpers';
import { buildAddress } from '../../../services/helpers';
import { Feature } from '../../../services/types';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { EditIconButton } from '../helpers/EditIconButton';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { renderValue } from './renderValue';

// taken from src/components/FeaturePanel/TagsTable.tsx
const Table = styled.table`
  font-size: 1rem;
  width: 100%;

  th,
  td {
    padding: 0.1em;
    overflow: hidden;
    vertical-align: baseline;

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
    padding-left: 0;
  }

  table {
    padding-left: 1em;
    padding-bottom: 1em;
  }
`;

const Spacer = styled.div`
  width: 100%;
  height: 50px;
`;

const render = (
  field: Field,
  feature: Feature,
  k,
  v,
  tagsForField,
  fieldTranslation,
): string | ReactNode => {
  if (field.type === 'address') {
    return buildAddress(feature.tags, feature.center);
  }

  if (field.fieldKey === 'wikidata') {
    return renderValue('wikidata', feature.tags.wikidata);
  }

  if (fieldTranslation?.types && fieldTranslation?.options) {
    return tagsForField.map(({ key, value: value2 }) => (
      <div key={key}>
        {fieldTranslation.types[key]}:{' '}
        {renderValue(key, fieldTranslation.options[value2]?.title)}
      </div>
    ));
  }

  if (field?.type === 'manyCombo') {
    return tagsForField.map(({ key, value: value2 }) => (
      <div key={key}>
        {fieldTranslation.options[key]}:{' '}
        {renderValue(key, fieldTranslation.options[value2]?.title ?? value2)}
      </div>
    ));
  }

  if (tagsForField?.length >= 2) {
    return (
      <>
        {tagsForField.map(({ key, value: value2 }) => (
          <div key={key}>{renderValue(key, value2)}</div>
        ))}
      </>
    );
  }

  if (!k) {
    return renderValue(tagsForField[0].key, tagsForField[0].value);
  }

  return renderValue(k, v);
};

// TODO some fields eg. oneway/bicycle doesnt have units in brackets
const unitRegExp = / \((.+)\)$/i;
const removeUnits = (label) => label.replace(unitRegExp, '');
const addUnits = (label, value: string | ReactNode) => {
  if (typeof value !== 'string') return value;
  const unit = label.match(unitRegExp);
  return `${value}${unit ? ` (${unit[1]})` : ''}`;
};

const StyledToggleButton = styled(Button)`
  svg {
    font-size: 17px;
  }
`;

export const ToggleButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && (
      <>
        {t('show_more')} <ChevronRight fontSize="small" />
      </>
    )}
    {isShown && (
      <>
        {t('show_less')} <ExpandLessIcon fontSize="small" />
      </>
    )}
  </StyledToggleButton>
);

const getTooltip = (field: Field, key: string, value: string) =>
  `field: ${field.fieldKey}${key === field.fieldKey ? '' : `, key: ${key}`}`;

export const IdSchemeFields = ({ feature, featuredTags }) => {
  const { openWithTag } = useEditDialogContext();
  const [otherTagsShown, toggleOtherTagsShown] = useToggleState(false);
  const { schema } = feature;
  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  // TODO add link to osm key reference as Tooltip https://wiki.openstreetmap.org/w/api.php?action=wbgetentities&format=json&languagefallback=1&languages=en%7Ccs%7Cen-us%7Csk&origin=*&sites=wiki&titles=Locale%3Acs%7CLocale%3Aen-us%7CLocale%3Ask%7CKey%3Astart%20date%7CTag%3Astart%20date%3D1752
  // TODO preset translations https://github.com/zbycz/osmapp/issues/190

  const numberOfItems =
    featuredTags.length +
    schema.matchedFields.length +
    schema.tagsWithFields.length +
    schema.keysTodo.length;

  if (!numberOfItems) {
    return <Spacer />;
  }

  return (
    <>
      {featuredTags.length && schema.matchedFields.length ? (
        <Typography variant="overline" display="block" color="textSecondary">
          {t('featurepanel.details_heading')}
        </Typography>
      ) : null}

      <Table>
        <tbody>
          {schema.matchedFields.map(
            ({ key, value, label, field, fieldTranslation, tagsForField }) => (
              <tr key={key}>
                <th title={getTooltip(field, key, value)}>
                  {removeUnits(label)}
                </th>
                <td>
                  <EditIconButton
                    onClick={() => openWithTag(tagsForField?.[0]?.key ?? key)}
                  />
                  {addUnits(
                    label,
                    render(
                      field,
                      feature,
                      key,
                      value,
                      tagsForField,
                      fieldTranslation,
                    ),
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>

      {!!(schema.keysTodo.length + schema.tagsWithFields.length) && (
        <>
          <Table>
            <tbody>
              <tr>
                <td colSpan={2} style={{ textAlign: 'right' }}>
                  <ToggleButton
                    isShown={otherTagsShown}
                    onClick={toggleOtherTagsShown}
                  />
                </td>
              </tr>
              {otherTagsShown &&
                schema.tagsWithFields.map(
                  ({
                    key,
                    value,
                    label,
                    field,
                    fieldTranslation,
                    tagsForField,
                  }) => (
                    <tr key={key}>
                      <th>{removeUnits(label)}</th>
                      <td>
                        <EditIconButton
                          onClick={() =>
                            openWithTag(tagsForField?.[0]?.key ?? key)
                          }
                        />
                        {render(
                          field,
                          feature,
                          key,
                          addUnits(label, value),
                          tagsForField,
                          fieldTranslation,
                        )}
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </Table>

          {otherTagsShown && (
            <>
              <TagsTableInner
                tags={schema.keysTodo.reduce(
                  (acc, key) => ({ ...acc, [key]: feature.tags[key] }),
                  {},
                )}
                center={feature.center}
                except={[]}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
