import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Share from '@material-ui/icons/Share';
import StarBorder from '@material-ui/icons/StarBorder';
import Directions from '@material-ui/icons/Directions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Head from 'next/head';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import Property from './Property';
import FeatureHeading from './FeatureHeading';
import FeatureImage from './FeatureImage';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import { icons } from '../../assets/icons';
import TagsTable from './TagsTable';
import Maki from '../utils/Maki';
import { getOsmappLink, getShortId, getUrlOsmId } from '../../services/helpers';
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

const StyledEdit = styled.div`
  margin: 60px 0 20px 0;
  text-align: center;
`;

const Spacer = styled.div`
  padding-bottom: 10px;
`;

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

  const [advanced, toggleAdvanced] = useToggleState(false);
  const [dialogOpenedWith, setDialogOpenedWith] =
    useState<boolean | string>(false);

  const { nonOsmObject, tags, layer, osmMeta, properties, skeleton, error } =
    feature;

  const osmappLink = getOsmappLink(feature);
  const ico = icons.includes(properties.class)
    ? properties.class
    : 'information';
  const subclass = properties.subclass || (layer && layer.id) || '?';
  const featuredTags = featuredKeys
    .map((k) => [k, tags[k]])
    .filter((x) => x[1]);

  // TODO resolve all getPoiClass

  return (
    <PanelWrapper>
      {!nonOsmObject && (
        <Head>
          <title>{tags.name || subclass} · OsmAPP</title>
        </Head>
      )}
      <PanelScrollbars>
        <FeatureImage feature={feature} ico={ico}>
          <PoiType>
            <Maki ico={ico} invert />
            <span>
              {tags.name
                ? subclass.replace('_', ' ')
                : t('featurepanel.no_name')}
            </span>
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
            onEdit={setDialogOpenedWith}
          />

          {error === 'gone' && (
            <Alert variant="outlined" severity="warning">
              {t('featurepanel.error_gone')}{' '}
              <a
                href={`https://openstreetmap.org/${getUrlOsmId(
                  osmMeta,
                )}/history`}
                target="_blank"
                rel="noopener"
              >
                {t('featurepanel.history_button')}
              </a>
            </Alert>
          )}

          {!advanced && !!featuredTags.length && (
            <>
              {featuredTags.map(([k, v]) => (
                <Property key={k} k={k} v={v} onEdit={setDialogOpenedWith} />
              ))}
              <Spacer />

              <Typography
                variant="overline"
                display="block"
                color="textSecondary"
              >
                {t('featurepanel.other_info_heading')}
              </Typography>
            </>
          )}

          <TagsTable
            tags={tags}
            except={advanced ? [] : ['name', 'layer', ...featuredKeys]}
            onEdit={setDialogOpenedWith}
          />

          {!skeleton && (
            <StyledEdit>
              <Button
                size="large"
                title={t('featurepanel.edit_button_title')}
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary"
                onClick={() => setDialogOpenedWith(true)}
              >
                {t('featurepanel.edit_button')}
              </Button>
            </StyledEdit>
          )}

          <EditDialog
            open={!!dialogOpenedWith}
            handleClose={() => setDialogOpenedWith(false)}
            feature={feature}
            focusTag={dialogOpenedWith}
            key={getShortId(osmMeta) + (skeleton && 'skel')}
          />

          {SHOW_PROTOTYPE_UI && <ObjectsAround />}

          <PanelFooter>
            <FeatureDescription osmMeta={osmMeta} nonOsmObject={nonOsmObject} />
            <Coordinates feature={feature} />
            <br />
            {!nonOsmObject && <a href={osmappLink}>{osmappLink}</a>}
            <br />
            <label>
              <input
                type="checkbox"
                onChange={toggleAdvanced}
                checked={advanced}
              />{' '}
              {t('featurepanel.show_tags_only_button')}
            </label>
          </PanelFooter>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};

export default FeaturePanel;
