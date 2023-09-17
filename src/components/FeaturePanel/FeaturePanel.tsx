import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
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
import { ClimbingPanel } from './Climbing/ClimbingPanel';
import { ClimbingEditorContextProvider } from './Climbing/contexts/climbingEditorContext';
import { ClimbingRoute } from './Climbing/types';

const featuredKeys = [
  'website',
  'contact:website',
  'phone',
  'contact:phone',
  'contact:mobile',
  'opening_hours',
  'description',
  'fhrs:id',
];
const EditRoutesContainer = styled.div`
  padding: 10px;
`;

const FeaturePanel = () => {
  const { feature } = useFeatureContext();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isSelectedRouteEditable, setIsSelectedRouteEditable] = useState(false);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);

  const [advanced, setAdvanced] = useState(false);
  const [showAround, toggleShowAround] = useToggleState(false);
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(true);
  const [dialogOpenedWith, setDialogOpenedWith] =
    useState<boolean | string>(false);

  const { point, tags, osmMeta, skeleton, error } = feature;
  const deleted = error === 'deleted';
  const editEnabled = !skeleton && (!error || deleted);

  const osmappLink = getFullOsmappLink(feature);
  const featuredTags = featuredKeys
    .map((k) => [k, tags[k]])
    .filter(([, v]) => v);
  const label = getLabel(feature);

  const onFullscreenDialogOpen = () => setIsFullscreenDialogOpened(true);
  const onFullscreenDialogClose = () => setIsFullscreenDialogOpened(false);

  if (tags.climbing === 'crag') {
    return (
      <ClimbingEditorContextProvider
        value={{
          imageSize,
          setImageSize,
          isSelectedRouteEditable,
          setIsSelectedRouteEditable,
          routes,
          setRoutes,
          routeSelectedIndex,
          setRouteSelectedIndex,
        }}
      >
        {isFullscreenDialogOpened ? (
          <Dialog
            fullScreen
            open={isFullscreenDialogOpened}
            onClose={onFullscreenDialogClose}
          >
            <ClimbingPanel
              isFullscreenDialogOpened={isFullscreenDialogOpened}
              setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
              isReadOnly={false}
            />
          </Dialog>
        ) : (
          <PanelWrapper>
            <PanelScrollbars>
              <ClimbingPanel
                isFullscreenDialogOpened={isFullscreenDialogOpened}
                setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
                isReadOnly
                onEditorClick={onFullscreenDialogOpen}
              />
              <EditRoutesContainer>
                <Button
                  onClick={onFullscreenDialogOpen}
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  variant="contained"
                >
                  Edit routes
                </Button>
              </EditRoutesContainer>
            </PanelScrollbars>
          </PanelWrapper>
        )}
      </ClimbingEditorContextProvider>
    );
  }
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
            featuredTags={deleted ? [] : featuredTags}
            setDialogOpenedWith={setDialogOpenedWith}
          />

          {advanced && (
            <IdSchemeFields
              featuredTags={deleted ? [] : featuredTags}
              feature={feature}
            />
          )}
          {!advanced && (
            <>
              {!!featuredTags.length && (
                <Typography
                  variant="overline"
                  display="block"
                  color="textSecondary"
                >
                  {t('featurepanel.other_info_heading')}
                </Typography>
              )}
              <TagsTable
                tags={tags}
                center={feature.center}
                except={
                  advanced || deleted ? [] : ['name', 'layer', ...featuredKeys]
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
