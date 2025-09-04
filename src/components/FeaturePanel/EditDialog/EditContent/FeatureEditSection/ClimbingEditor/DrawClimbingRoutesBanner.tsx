import { useCurrentItem, useEditContext } from '../../../EditContext';
import { useGetHandleSave } from '../../../useGetHandleSave';
import { useEditDialogContext } from '../../../../helpers/EditDialogContext';
import { useGetParents } from '../useGetParents';
import {
  filterCrags,
  getUrlToParentCrag,
} from '../../../../FeatureImages/Image/helpers';
import Router from 'next/router';
import { getApiId, getUrlOsmId } from '../../../../../../services/helpers';
import { hasWikimediaCommons } from '../../../../Climbing/utils/photo';
import { Alert, Button } from '@mui/material';
import DrawIcon from '@mui/icons-material/Draw';
import { t } from '../../../../../../services/intl';

export const DrawClimbingRoutesBanner = () => {
  const { tags, modified } = useCurrentItem();
  const handleSave = useGetHandleSave();
  const { close } = useEditDialogContext();
  const { current } = useEditContext();
  const parents = useGetParents();
  const parentCrags = filterCrags(parents);

  const onDraw = () => {
    if (
      modified &&
      window.confirm(t('editdialog.draw_climbing_routes_save_confirm'))
    ) {
      handleSave();
    }
    close();
    if (tags.climbing === 'route_bottom') {
      const cragUrl = getUrlToParentCrag(parents);
      if (cragUrl) {
        Router.push(cragUrl);
      }
    } else if (tags.climbing === 'crag') {
      Router.push(`/${getUrlOsmId(getApiId(current))}/climbing/edit`);
    }
  };

  const cragHasPhotos = tags.climbing === 'crag' && hasWikimediaCommons(tags);
  const routeHasPhotos =
    tags.climbing === 'route_bottom' && hasWikimediaCommons(tags);
  const routeParentHasPhotos =
    tags.climbing === 'route_bottom' &&
    parentCrags.length > 0 &&
    hasWikimediaCommons(parentCrags[0]?.tags);

  if (!cragHasPhotos && !routeHasPhotos && !routeParentHasPhotos) return null;

  return tags.climbing === 'crag' || tags.climbing === 'route_bottom' ? (
    <Alert
      severity="info"
      sx={{ mb: 2 }}
      icon={<DrawIcon fontSize="inherit" />}
      action={
        <Button color="inherit" size="small" onClick={onDraw}>
          {t('editdialog.draw_climbing_routes_button')}
        </Button>
      }
    >
      {t('editdialog.draw_climbing_routes_title')}
    </Alert>
  ) : null;
};
