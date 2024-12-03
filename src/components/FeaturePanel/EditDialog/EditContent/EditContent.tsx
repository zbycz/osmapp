import { DialogContent } from '@mui/material';
import React from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { FeatureEditSection } from './FeatureEditSection/FeatureEditSection';
import { useEditDialogFeature } from '../utils';
import { useEditContext } from '../EditContext';
import { getShortId } from '../../../../services/helpers';
import { fetchSchemaTranslations } from '../../../../services/tagging/translations';

export const EditContent = () => {
  const { feature } = useEditDialogFeature();
  const { items, addFeature } = useEditContext();
  const [current, setCurrent] = React.useState(getShortId(feature.osmMeta));

  return (
    <>
      <DialogContent dividers>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <OsmUserLoggedOut />
          {items.map(({ shortId }, idx) => (
            <button key={idx} onClick={() => setCurrent(shortId)}>
              {shortId}
            </button>
          ))}
          <br />
          <button
            onClick={async () => {
              await fetchSchemaTranslations();
              const osmApiTestItems = await import(
                '../../../../services/osmApiTestItems'
              );
              addFeature(osmApiTestItems.TEST_CRAG);
            }}
          >
            Add test crag
          </button>
          <button
            onClick={async () => {
              await fetchSchemaTranslations();
              const osmApiTestItems = await import(
                '../../../../services/osmApiTestItems'
              );
              addFeature(osmApiTestItems.TEST_NODE);
            }}
          >
            Add test node
          </button>
          <br />
          <br />
          <FeatureEditSection shortId={current} />
          <ContributionInfoBox />
          <CommentField />
          <OsmUserLogged />
        </form>
      </DialogContent>
      <EditDialogActions />
    </>
  );
};
