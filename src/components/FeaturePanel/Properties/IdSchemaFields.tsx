import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Field } from '../../../services/tagging/types/Fields';
import { useToggleState } from '../../helpers';
import { buildAddress } from '../../../services/helpers';
import { Feature } from '../../../services/types';
import { t } from '../../../services/intl';
import { TagsTableInner } from './TagsTableInner';
import { InlineEditButton } from '../helpers/InlineEditButton';
import { renderValue } from './renderValue';
import { Table } from './Table';
import { ShowMoreButton } from './helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Subheading } from '../helpers/Subheading';
import { UiField } from '../../../services/tagging/types/Presets';

const Spacer = styled.div`
  width: 100%;
  height: 50px;
`;

const render = (uiField: UiField, feature: Feature): string | ReactNode => {
  const { field, key: k, value: v, tagsForField, fieldTranslation } = uiField;

  if (field.type === 'address') {
    return buildAddress(feature.tags, feature.center);
  }

  if (field.fieldKey === 'wikidata') {
    return renderValue('wikidata', feature.tags.wikidata);
  }

  // combo with options
  if (fieldTranslation?.options?.[v]) {
    return renderValue(k, fieldTranslation.options[v]?.title);
  }

  // multicombo ?
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

  if (tagsForField?.length >= 1) {
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
  if (!unit) return value;
  if (unit[1] === 'm') return `${value} m`;
  return `${value} (${unit[1]})`;
};

const getTooltip = (field: Field, key: string) =>
  `field: ${field.fieldKey}${key === field.fieldKey ? '' : `, key: ${key}`} (${
    field.type
  })`;

const UiFields = ({ fields }: { fields: UiField[] }) => {
  const { feature } = useFeatureContext();

  return (
    <>
      {fields.map((uiField) => {
        const { key, label, field, tagsForField } = uiField;
        return (
          <tr key={key}>
            <th title={getTooltip(field, key)}>{removeUnits(label)}</th>
            <td>
              <InlineEditButton k={tagsForField?.[0]?.key ?? key} />
              {addUnits(label, render(uiField, feature))}
            </td>
          </tr>
        );
      })}
    </>
  );
};

const OtherTagsSection = () => {
  const [otherTagsShown, toggleOtherTagsShown] = useToggleState(false);
  const { feature } = useFeatureContext();
  const { schema } = feature;

  return (
    <>
      <tr>
        <td colSpan={2} style={{ textAlign: 'right' }}>
          <ShowMoreButton
            isShown={otherTagsShown}
            onClick={toggleOtherTagsShown}
          />
        </td>
      </tr>
      {otherTagsShown && (
        <>
          <UiFields fields={schema.tagsWithFields} />
          <TagsTableInner
            tags={schema.keysTodo.reduce(
              (acc, key) => ({ ...acc, [key]: feature.tags[key] }),
              {},
            )}
            center={feature.center}
          />
        </>
      )}
    </>
  );
};

export const IdSchemaFields = () => {
  const { feature } = useFeatureContext();
  const { schema } = feature;
  const { keysTodo, featuredTags, matchedFields, tagsWithFields } = schema;

  // TODO add link to osm key reference as Tooltip https://wiki.openstreetmap.org/w/api.php?action=wbgetentities&format=json&languagefallback=1&languages=en%7Ccs%7Cen-us%7Csk&origin=*&sites=wiki&titles=Locale%3Acs%7CLocale%3Aen-us%7CLocale%3Ask%7CKey%3Astart%20date%7CTag%3Astart%20date%3D1752
  // TODO preset translations https://github.com/zbycz/osmapp/issues/190

  const numberOfItems =
    featuredTags.length +
    matchedFields.length +
    tagsWithFields.length +
    keysTodo.length;

  if (!numberOfItems) {
    return <Spacer />;
  }

  const showDetailsHeading = !!(featuredTags.length && matchedFields.length);
  const showOtherTagsSection = !!(tagsWithFields.length || keysTodo.length);

  return (
    <>
      {showDetailsHeading && (
        <Subheading>{t('featurepanel.details_heading')}</Subheading>
      )}

      <Table>
        <tbody>
          <UiFields fields={schema.matchedFields} />
          {showOtherTagsSection && <OtherTagsSection />}
        </tbody>
      </Table>
    </>
  );
};
