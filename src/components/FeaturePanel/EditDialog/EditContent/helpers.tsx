import styled from '@emotion/styled';
import { Box, Stack } from '@mui/material';
import React from 'react';
import { EditDataItem } from '../useEditItems';
import { useEditContext } from '../EditContext';
import { getApiId, getShortId } from '../../../../services/helpers';
import { getFullFeatureWithMemberFeatures } from '../../../../services/osm/osmApi';

const CharacterCountContainer = styled.div`
  position: absolute;
  right: 0;
`;

type CharacterCountProps = {
  count?: number;
  max: number;
  isInputFocused: boolean;
};

export const CharacterCount = ({
  count = 0,
  max,
  isInputFocused,
}: CharacterCountProps) =>
  isInputFocused && count > 150 ? (
    <CharacterCountContainer>
      <Stack direction="row" justifyContent={'flex-end'} whiteSpace="nowrap">
        <Box color={count >= max ? 'error.main' : undefined}>
          {count} / {max}
        </Box>
      </Stack>
    </CharacterCountContainer>
  ) : null;

export const getInputTypeForKey = (key: string) => {
  switch (key) {
    case 'fax':
    case 'phone':
    case 'mobile':
    case 'contact:phone':
    case 'contact:whatsapp':
    case 'contact:mobile':
    case 'contact:tty':
    case 'contact:sms':
    case 'contact:fax':
      return 'tel';
    case 'contact:website':
    case 'website':
      return 'url';
    case 'contact:email':
    case 'email':
      return 'email';
  }
  return 'text';
};

const isInItems = (items: Array<EditDataItem>, shortId: string) =>
  items.find((item) => item.shortId === shortId);

export const useGetHandleClick = () => {
  const { addFeature, items, setCurrent } = useEditContext();

  return async (shortId: string) => {
    const apiId = getApiId(shortId);
    if (apiId.id < 0) {
      setCurrent(shortId);
      return;
    }

    if (isInItems(items, shortId)) {
      setCurrent(shortId);
      return;
    }

    const feature = await getFullFeatureWithMemberFeatures(apiId);
    addFeature(feature);
    setCurrent(getShortId(feature.osmMeta));
  };
};
