import React, { useState } from 'react';
import styled from 'styled-components';
import Share from '@material-ui/icons/Share';
import StarBorder from '@material-ui/icons/StarBorder';
import Directions from '@material-ui/icons/Directions';
import IconButton from '@material-ui/core/IconButton';
import Head from 'next/head';
import FeatureHeading from './FeatureHeading';
import FeatureImage from './FeatureImage';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import TagsTable from './TagsTable';
import Maki from '../utils/Maki';
import { getOsmappLink, getShortId } from '../../services/helpers';
import { EditDialog } from './EditDialog/EditDialog';
import { SHOW_PROTOTYPE_UI } from '../../config';
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
import { FeatureEditButton } from './FeatureEditButton';
import { FeaturedTags } from './FeaturedTags';

const StyledIconButton = styled(IconButton)`
  svg {
    width: 20px;
    height: 20px;
    color: #fff;
  }
`;

const PoiType = styled.div`
  color: #fff;
  margin: 0 auto 0 15px;
  font-size: 13px;
  position: relative;
  width: 100%;
  svg {
    vertical-align: bottom;
  }
  span {
    position: absolute;
    left: 20px;
  }
`;

const featuredKeys = ['website', 'phone', 'opening_hours', 'description'];

const FeaturePanel = () => {
  const { feature } = useFeatureContext();

  const [advanced, setAdvanced] = useState(false);
  const [showAround, toggleShowAround] = useToggleState(false);
  const [dialogOpenedWith, setDialogOpenedWith] =
    useState<boolean | string>(false);

  const { point, tags, layer, osmMeta, properties, skeleton, members } =
    feature;

  const osmappLink = getOsmappLink(feature);
  const subclass =
    properties.subclass?.replace(/_/g, ' ') ||
    (layer && layer.id) ||
    osmMeta.type;
  const featuredTags = featuredKeys
    .map((k) => [k, tags[k]])
    .filter((x) => x[1]);

  // TODO resolve all getPoiClass

  return (
    <PanelWrapper>
      <Head>
        <title>{tags.name || subclass} · OsmAPP</title>
      </Head>
      <PanelScrollbars>
        <FeatureImage feature={feature} ico={properties.class}>
          <PoiType>
            <Maki ico={properties.class} invert />
            <span>{tags.name ? subclass : t('featurepanel.no_name')}</span>
          </PoiType>

          {SHOW_PROTOTYPE_UI && (
            <>
              <StyledIconButton>
                <Share
                  htmlColor="#fff"
                  titleAccess={t('featurepanel.share_button')}
                />
              </StyledIconButton>
              <StyledIconButton>
                <StarBorder
                  htmlColor="#fff"
                  titleAccess={t('featurepanel.save_button')}
                />
              </StyledIconButton>
              <StyledIconButton>
                <Directions
                  htmlColor="#fff"
                  titleAccess={t('featurepanel.directions_button')}
                />
              </StyledIconButton>
            </>
          )}
        </FeatureImage>
        <PanelContent>
          <FeatureHeading
            title={tags.name || subclass}
            onEdit={!point && setDialogOpenedWith}
          />

          <OsmError />

          {point && <ObjectsAround advanced={advanced} />}

          <FeaturedTags
            featuredTags={featuredTags}
            setDialogOpenedWith={setDialogOpenedWith}
          />

          <TagsTable
            tags={tags}
            except={advanced ? [] : ['name', 'layer', ...featuredKeys]}
            onEdit={setDialogOpenedWith}
          />

          {advanced && <Members members={members} />}

          {!point && (
            <FeatureEditButton
              add={point}
              setDialogOpenedWith={setDialogOpenedWith}
            />
          )}

          <EditDialog
            open={!!dialogOpenedWith}
            handleClose={() => setDialogOpenedWith(false)}
            feature={feature}
            focusTag={dialogOpenedWith}
            key={getShortId(osmMeta) + (skeleton && 'skel')}
          />

          <PanelFooter>
            <FeatureDescription setAdvanced={setAdvanced} />
            <Coordinates feature={feature} />
            <br />
            <a href={osmappLink}>https://osmapp.org{osmappLink}</a>
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
