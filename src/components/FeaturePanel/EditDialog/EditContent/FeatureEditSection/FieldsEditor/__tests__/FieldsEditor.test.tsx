import React from 'react';
import { render } from '@testing-library/react';
import translations from '@openstreetmap/id-tagging-schema/dist/translations/en.json';
import { intl } from '../../../../../../../services/intl';
import { mockSchemaTranslations } from '../../../../../../../services/tagging/translations';
import { allFields } from '../../../../../../../services/tagging/data';
import { getFieldTranslation } from '../../../../../../../services/tagging/translations';
import { Field } from '../../../../../../../services/tagging/types/Fields';
import { FieldInput } from '../FieldInput';
import { getFieldOptions } from '../helpers';
import { FIELD_TYPE_EXAMPLES } from '../fieldTypeExamples';

intl.lang = 'en';

beforeEach(() => {
  mockSchemaTranslations(translations);
});

const renderField = (field: Field, tags: Record<string, string>) => {
  const fieldTranslation = getFieldTranslation(field);
  const label = fieldTranslation?.label ?? `[${field.fieldKey}]`;
  const options = getFieldOptions(field, fieldTranslation);
  const setTag = jest.fn();
  return render(
    <FieldInput
      field={field}
      tags={tags}
      setTag={setTag}
      label={label}
      options={options}
    />,
  );
};

describe('FieldsEditor field type coverage', () => {
  it('has ~30 example OSM elements', () => {
    expect(FIELD_TYPE_EXAMPLES.length).toBeGreaterThanOrEqual(29);
  });

  it('every example references an existing field', () => {
    FIELD_TYPE_EXAMPLES.forEach(({ demonstrates }) => {
      expect(allFields[demonstrates]).toBeDefined();
    });
  });

  it('examples together cover every field type used in the schema', () => {
    const allTypesInSchema = new Set(
      Object.values(allFields)
        .map((field) => field.type)
        .filter(Boolean),
    );
    const typesCoveredByExamples = new Set(
      FIELD_TYPE_EXAMPLES.map(
        ({ demonstrates }) => allFields[demonstrates].type,
      ),
    );

    const missing = [...allTypesInSchema].filter(
      (type) => !typesCoveredByExamples.has(type),
    );
    expect(missing).toEqual([]);
  });

  it.each(FIELD_TYPE_EXAMPLES)(
    'renders an input for $shortId (field $demonstrates)',
    ({ tags, demonstrates }) => {
      const field = allFields[demonstrates];
      const { container } = renderField(field, tags);
      // renders without crashing and produces DOM output
      expect(container.firstChild).not.toBeNull();

      // all field types render an interactive control, except `restrictions`
      // which is an intentional read-only placeholder (edited on the map)
      if (field.type !== 'restrictions') {
        expect(
          container.querySelector('input, textarea, button'),
        ).not.toBeNull();
      }
    },
  );
});
