import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { Field } from '../../services/tagging/types/Fields';
import { getUrlForTag } from './helpers/getUrlForTag';
import { slashToOptionalBr, useToggleState } from '../helpers';
import { buildAddress } from '../../services/helpers';
import { Feature } from '../../services/types';
import { t } from '../../services/intl';
import { TagsTable } from './TagsTable';
import { EditIconButton } from './helpers/EditIconButton';
import { useEditDialogContext } from './helpers/EditDialogContext';

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

const getTitle = (type: string, field) =>
  `${type}: ${JSON.stringify(field, null, 2)}`;

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

export const ToggleButton = ({ onClick, isShown, num }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {t('featurepanel.other_properties')} ({num}){' '}
    {/* {t('featurepanel.edit_in_osm')} */}
    {!isShown && <ChevronRight fontSize="small" />}
    {isShown && <ExpandMoreIcon fontSize="small" />}
  </StyledToggleButton>
);

export const IdSchemeFields = ({ feature, featuredTags }) => {
  const { openWithTag } = useEditDialogContext();
  const [otherTagsShown, toggleOtherTagsShown] = useToggleState(false);
  const { schema } = feature;
  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  // TODO add link to reference as Tooltip https://wiki.openstreetmap.org/w/api.php?action=wbgetentities&format=json&languagefallback=1&languages=en%7Ccs%7Cen-us%7Csk&origin=*&sites=wiki&titles=Locale%3Acs%7CLocale%3Aen-us%7CLocale%3Ask%7CKey%3Astart%20date%7CTag%3Astart%20date%3D1752
  // TODO preset translations https://github.com/zbycz/osmapp/issues/190

  const numberOfItems =
    featuredTags.length +
    schema.matchedFields.length +
    schema.tagsWithFields.length +
    schema.keysTodo.length;

  if (!numberOfItems) {
    return <div style={{ width: '100%', height: '50px' }} />;
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
                <th
                  title={getTitle('from preset', {
                    field,
                    value,
                    tagsForField,
                  })}
                >
                  {removeUnits(label)}
                </th>
                <td>
                  <EditIconButton
                    onClick={() => openWithTag(key ?? tagsForField?.[0]?.k)}
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
                    num={schema.keysTodo.length + schema.tagsWithFields.length}
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
                      <th title={getTitle('standalone field', field)}>
                        {removeUnits(label)}
                      </th>
                      <td>
                        <EditIconButton
                          onClick={() =>
                            openWithTag(key ?? tagsForField?.[0]?.k)
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
              <TagsTable
                tags={schema.keysTodo.reduce(
                  (acc, key) => ({ ...acc, [key]: feature.tags[key] }),
                  {},
                )}
                center={feature.center}
                except={[]}
              />
              {/* <p> */}
              {/*  OpenStreetMap každému objektu přiřazuje vlastnosti (tagy). Můžou */}
              {/*  být standardizované (Adresa, Telefon) nebo zcela volné */}
              {/*  (identifikátory do jiných databází). Sami zde můžete chybějící */}
              {/*  vlastnosti přidat. */}
              {/* </p> */}
            </>
          )}
        </>
      )}
    </>
  );
};
