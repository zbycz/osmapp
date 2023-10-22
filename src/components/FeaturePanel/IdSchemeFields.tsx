import React, { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { Field } from '../../services/tagging/types/Fields';
import { getUrlForTag } from './helpers/getUrlForTag';
import { slashToOptionalBr, useToggleState } from '../helpers';
import { buildAddress, getUrlOsmId } from '../../services/helpers';
import { Feature } from '../../services/types';
import { t } from '../../services/intl';
import { TagsTable } from './TagsTable';

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
): string | ReactNode => {
  if (field.type === 'address') {
    return buildAddress(feature.tags, feature.center);
  }

  if (field.type === 'wikipedia') {
    return (
      <>
        {renderValue('wikipedia', feature.tags.wikipedia)}
        {feature.tags.wikidata && (
          <sup>
            {' '}
            <a href={`https://www.wikidata.org/wiki/${feature.tags.wikidata}`}>
              wd
            </a>
          </sup>
        )}
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="1052.36" height="744.09" version="1.2"><path d="M119.42 543.017h29.163V43.052h-29.162v499.965zm60.273 0h89.43V43.052h-89.43v499.965zM298.291 43.052V543h89.43V43.052h-89.43zM838.98 543.052h29.168v-500H838.98v500zm60.278-500v500h29.163v-500h-29.163zm-481.404 500h29.163v-500h-29.163v500zm60.278-500v499.983h29.17V43.052h-29.17z" /><path d="M537.422 543.052h89.442v-500h-89.442v500zm118.599 0h31.103v-500h-31.103v500zm60.272-500v499.983h89.43V43.052h-89.43z"/></svg> */}
      </>
    );
  }

  if (tagsForField?.length >= 2) {
    return (
      <>
        {tagsForField.map(({ key, value: value2 }) => (
          <div>{value2}</div>
        ))}
      </>
    );
  }

  if (!k) {
    return renderValue(tagsForField[0].key, tagsForField[0].value);
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

const StyledToggleButton = styled(Button)`
  svg {
    font-size: 17px;
  }
`;

const TagsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1em;
  font-size: 1rem;
  width: 100%;

  color: #fff;

  li {
    display: block;
    padding: 0.13em 0;
  }

  strong {
    color: ${({ theme }) => theme.palette.text.secondary};
    font-weight: normal;
  }
`;

export const ToggleButton = ({ onClick, isShown, num }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    zbylé tagy ({num}) {/* {t('featurepanel.edit_in_osm')} */}
    {!isShown && <ChevronRight fontSize="small" />}
    {isShown && <ExpandMoreIcon fontSize="small" />}
  </StyledToggleButton>
);

export const IdSchemeFields = ({ feature, featuredTags }) => {
  const [restTagsShown, toggleRestTagsShown] = useToggleState(false);
  const { schema } = feature;
  if (!schema) return null;
  if (!Object.keys(schema).length) return null;

  return (
    <>
      {featuredTags.length &&
      (schema.matchedFields.length ||
        schema.tagsWithFields.length ||
        schema.keysTodo.length) ? (
        <Typography variant="overline" display="block" color="textSecondary">
          {t('featurepanel.other_info_heading')}
        </Typography>
      ) : null}

      <Table>
        <tbody>
          {schema.matchedFields.map(
            ({ key, value, label, field, tagsForField }) => (
              <tr key={key}>
                <th title={getTitle('from preset', field)}>
                  {removeUnits(label)}
                </th>
                <td>
                  {addUnits(
                    label,
                    render(field, feature, key, value, tagsForField),
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>

      {/* <TagsList> */}
      {/* {schema.matchedFields.map(({ key, value, label, field, tagsForField }) => ( */}
      {/*  <li key={key}  title={getTitle('from preset', field)}> */}
      {/*    <strong> */}
      {/*      {removeUnits(label)}: */}
      {/*    </strong>{key === 'wikimedia_commons' ? <br /> : " "} */}
      {/*    {addUnits(label, render(field, feature, key, value, tagsForField))} */}
      {/*  </li> */}
      {/* ))} */}
      {/* </TagsList> */}

      {!!(schema.keysTodo.length + schema.tagsWithFields.length) && (
        <>
          <Table>
            <tbody>
              {
                /* TODO TADY HERE QUI */ <tr>
                  <td colSpan={2} style={{ textAlign: 'right' }}>
                    <ToggleButton
                      num={
                        schema.keysTodo.length + schema.tagsWithFields.length
                      }
                      isShown={restTagsShown}
                      onClick={toggleRestTagsShown}
                    />
                  </td>
                </tr>
              }
              {restTagsShown &&
                schema.tagsWithFields.map(({ key, value, label, field }) => (
                  <tr key={key}>
                    <th title={getTitle('standalone field', field)}>
                      {removeUnits(label)}
                    </th>
                    <td style={{ color: 'gray' }}>
                      {render(field, feature, key, addUnits(label, value))}
                    </td>
                  </tr>
                ))}

              {/* {restTagsShown && */}
              {/*  schema.keysTodo.map((key) => ( */}
              {/*    <tr key={key}> */}
              {/*      <th>{key}</th> */}
              {/*      <td style={{color: 'gray'}}>{renderValue(key, feature.tags[key])}</td> */}
              {/*    </tr> */}
              {/*  ))} */}
            </tbody>
          </Table>

          {restTagsShown && (
            <>
            <TagsTable
              tags={schema.keysTodo.reduce(
                (acc, key) => ({ ...acc, [key]: feature.tags[key] }),
                {},
              )}
              center={feature.center}
              except={[]}
              onEdit={() => {
                // setDialogOpenedWith;
              }}
            />
              <p>OpenStreetMap každému objektu přiřazuje vlastnosti (tagy), které nemají striktní pravidla.
                Pokud ovšem dojde ke shodě, jak některou věc otagovat, benefitují z toho všichni (po celém světě lze využít stejný mapový styl).
                Nahoře jsou vypsány všechny tagy, které mají shodu. Zde jsou ty, které zatím shodu nemají, nebo jsou technického rázu.
              </p>
            </>
          )}
        </>
      )}
    </>
  );
};
