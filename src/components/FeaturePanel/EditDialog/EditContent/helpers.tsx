import styled from '@emotion/styled';
import { Box, Stack } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { EditDataItem } from '../useEditItems';
import { useEditContext } from '../EditContext';
import { getApiId, getShortId } from '../../../../services/helpers';

import { getFullFeatureWithMemberFeatures } from '../../../../services/osm/getFullFeatureWithMemberFeatures';
import { fetchFreshItem } from '../itemsHelpers';

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

export const useGetHandleClick = ({
  setIsExpanded,
}: {
  setIsExpanded?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { addNewItem, items, setCurrent } = useEditContext();

  return async (e, shortId: string) => {
    const isCmdClicked = e.ctrlKey || e.metaKey;
    const switchToNewTab = !isCmdClicked;
    const apiId = getApiId(shortId);

    if (switchToNewTab) {
      setIsExpanded?.(false);
    }

    // TODO merge these two conditions:
    if (apiId.id < 0) {
      if (switchToNewTab) setCurrent(shortId);
      return;
    }
    if (isInItems(items, shortId)) {
      if (switchToNewTab) setCurrent(shortId);
      return;
    }

    const newItem = await fetchFreshItem(apiId);
    addNewItem(newItem);

    if (switchToNewTab) {
      setCurrent(newItem.shortId);
    }
  };
};
