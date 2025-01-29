import {
  DialogContent,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { EditDialogActions } from './EditDialogActions';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { FeatureEditSection } from './FeatureEditSection/FeatureEditSection';
import { useEditContext } from '../EditContext';
import { TestApiWarning } from '../../helpers/TestApiWarning';
import { getOsmTypeFromShortId, NwrIcon } from '../../NwrIcon';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { useMatchTags, useOptions } from './FeatureEditSection/PresetSelect';

export const EditContent = () => {
  const { items, current, setCurrent } = useEditContext();
  const theme = useTheme();
  const options = useOptions();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const RenderTabLabel = ({ item: { shortId, tags } }) => {
    const [preset, setPreset] = useState('');
    const { feature } = useFeatureContext();

    useMatchTags(feature, tags, setPreset);
    const presetName = options.find((o) => o.presetKey === preset)?.name;

    return (
      <Stack direction="column" alignItems="flex-start">
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="button" whiteSpace="nowrap">
            {tags.name ?? shortId}
          </Typography>
          <NwrIcon osmType={getOsmTypeFromShortId(shortId)} />
        </Stack>
        <Typography
          variant="caption"
          textTransform="lowercase"
          whiteSpace="nowrap"
        >
          {presetName}
        </Typography>
      </Stack>
    );
  };

  return (
    <>
      <Stack
        direction={isSmallScreen ? 'column' : 'row'}
        gap={1}
        overflow="hidden"
        flex={1}
        sx={{ borderTop: `solid 1px ${theme.palette.divider}` }}
      >
        {items.length > 1 && (
          <Tabs
            orientation={isSmallScreen ? 'horizontal' : 'vertical'}
            variant={isSmallScreen ? 'scrollable' : 'standard'}
            value={current}
            onChange={(_event: React.SyntheticEvent, newShortId: string) => {
              setCurrent(newShortId);
            }}
            sx={{
              borderRight: isSmallScreen ? 0 : 1,
              borderBottom: isSmallScreen ? 1 : 0,
              borderColor: 'divider',
              '&& .MuiTab-root': {
                alignItems: isSmallScreen ? undefined : 'baseline',
                textAlign: isSmallScreen ? undefined : 'left',
              },
              ...(isSmallScreen
                ? {}
                : {
                    resize: 'horizontal',
                    minWidth: 120,
                    maxWidth: '50%',
                  }),
            }}
          >
            {items.map((item, idx) => (
              <Tab
                key={idx}
                label={<RenderTabLabel item={item} />}
                value={item.shortId}
                sx={{
                  maxWidth: '100%',
                  ...(isSmallScreen
                    ? {}
                    : { borderBottom: `solid 1px ${theme.palette.divider}` }),
                }}
              />
            ))}
          </Tabs>
        )}
        <DialogContent dividers sx={{ flex: 1, borderTop: 0 }}>
          <form
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            style={{ height: '100%' }}
          >
            <OsmUserLoggedOut />

            <Stack height="100%">
              <Stack flex={1}>
                <FeatureEditSection shortId={current} />
                <CommentField />
                <ContributionInfoBox />
              </Stack>
              <OsmUserLogged />
              <TestApiWarning />
            </Stack>
          </form>
        </DialogContent>
      </Stack>
      <EditDialogActions />
    </>
  );
};
