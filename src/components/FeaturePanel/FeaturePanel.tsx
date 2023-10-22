import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { FeatureHeading } from './FeatureHeading';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import { getFullOsmappLink, getUrlOsmId } from '../../services/helpers';
import { EditDialog } from './EditDialog/EditDialog';
import {
  PanelContent,
  PanelFooter,
  PanelScrollbars,
  PanelWrapper,
} from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { FeatureDescription } from './FeatureDescription';
import { ObjectsAround } from './ObjectsAround';
import { OsmError } from './OsmError';
import { Members } from './Members';
import { EditButton } from './EditButton';
import { FeaturedTags } from './FeaturedTags';
import { getLabel } from '../../helpers/featureLabel';
import { ImageSection } from './ImageSection/ImageSection';
import { IdSchemeFields } from './IdSchemeFields';
import { TagsTable } from './TagsTable';
import { PublicTransport } from './PublicTransport/PublicTransport';

const FeaturePanel = () => {
  const { feature } = useFeatureContext();

  const [advanced, setAdvanced] = useState(false);
  const [showAround, toggleShowAround] = useToggleState(false);
  const [showTags, toggleShowTags] = useToggleState(false);
  const [dialogOpenedWith, setDialogOpenedWith] =
    useState<boolean | string>(false);

  const { point, tags, osmMeta, skeleton, error } = feature;
  const deleted = error === 'deleted';
  const editEnabled = !skeleton && (!error || deleted);

  const osmappLink = getFullOsmappLink(feature);

  const label = getLabel(feature);

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ImageSection />
        <PanelContent>
          <FeatureHeading
            deleted={deleted}
            title={label}
            editEnabled={editEnabled && !point}
            onEdit={setDialogOpenedWith}
          />

          <OsmError />

          <FeaturedTags
            featuredTags={deleted ? [] : feature.schema?.featuredTags ?? []}
            setDialogOpenedWith={setDialogOpenedWith}
          />

          {!showTags && (
            <IdSchemeFields
              featuredTags={deleted ? [] : feature.schema?.featuredTags ?? []}
              feature={feature}
              key={getUrlOsmId(osmMeta) + (deleted && 'del')}
            />
          )}
          {showTags && (
            <>
              {!!feature.schema.featuredTags.length && (
                <Typography
                  variant="overline"
                  display="block"
                  color="textSecondary"
                >
                  Další OSM tagy
                  {/* {t('featurepanel.other_info_heading')} */}
                </Typography>
              )}
              <TagsTable
                tags={tags}
                center={feature.center}
                except={
                  advanced || deleted
                    ? []
                    : [
                        'name',
                        'layer',
                        ...Object.keys(feature.schema.featuredTags),
                      ]
                }
                onEdit={setDialogOpenedWith}
                key={
                  getUrlOsmId(osmMeta) // we need to refresh inner state
                }
              />
            </>
          )}

          {advanced && <Members />}

          <PublicTransport tags={tags} />

          {editEnabled && (
            <>
              <EditButton
                isAddPlace={point}
                isUndelete={deleted}
                setDialogOpenedWith={setDialogOpenedWith}
              />

              <EditDialog
                open={!!dialogOpenedWith}
                handleClose={() => setDialogOpenedWith(false)}
                feature={feature}
                isAddPlace={point}
                isUndelete={deleted}
                focusTag={dialogOpenedWith}
                key={
                  getUrlOsmId(osmMeta) + (deleted && 'del') // we need to refresh inner state
                }
              />
            </>
          )}

          {point && <ObjectsAround advanced={advanced} />}

          <PanelFooter>
            <FeatureDescription setAdvanced={setAdvanced} />
            <Coordinates />
            <br />
            <a href={osmappLink}>{osmappLink}</a>
            <br />
            <label>
              <input
                type="checkbox"
                onChange={toggleShowTags}
                checked={showTags}
                disabled={point}
              />{' '}
              Zobrazit tagy{/* {t('featurepanel.show_objects_around')} */}
            </label>{' '}
            <label>
              <input
                type="checkbox"
                onChange={toggleShowAround}
                checked={point || showAround}
                disabled={point}
              />{' '}
              {t('featurepanel.show_objects_around')}
            </label>
            {!point && showAround && <ObjectsAround advanced={advanced} />}
          </PanelFooter>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};

export default FeaturePanel;
