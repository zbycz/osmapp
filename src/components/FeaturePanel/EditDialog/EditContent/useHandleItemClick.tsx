import { EditDataItem } from '../useEditItems';
import React, { Dispatch, SetStateAction } from 'react';
import { useEditContext } from '../EditContext';
import { getApiId } from '../../../../services/helpers';
import { fetchFreshItem } from '../itemsHelpers';
import { Setter } from '../../../../types';

const isInItems = (items: Array<EditDataItem>, shortId: string) =>
  items.find((item) => item.shortId === shortId);

export const useHandleItemClick = (setIsExpanded: Setter<boolean>) => {
  const { addItem, items, setCurrent } = useEditContext();

  return async (e: React.MouseEvent, shortId: string) => {
    const isCmdClicked = e.ctrlKey || e.metaKey;
    const switchToNewTab = !isCmdClicked;
    const apiId = getApiId(shortId);

    if (!isInItems(items, shortId)) {
      const newItem = await fetchFreshItem(apiId);
      addItem(newItem);

      if (switchToNewTab) {
        setIsExpanded(false);
        setCurrent(newItem.shortId);
      }
    } else {
      if (switchToNewTab) {
        setCurrent(shortId);
      }
    }
  };
};
