import { DataItem, EditDataItem } from '../useEditItems';
import React from 'react';
import { useCurrentItem, useEditContext } from '../EditContext';
import { getApiId, getShortId } from '../../../../services/helpers';
import { fetchFreshItem } from '../itemsHelpers';
import { Setter } from '../../../../types';
import { Feature } from '../../../../services/types';

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

const addAllItems = async (
  shortIds: string[],
  addItem: (newItem: DataItem) => void,
  items: Array<EditDataItem>,
) => {
  const promises = shortIds
    .filter((shortId) => !isInItems(items, shortId))
    .map((shortId) => fetchFreshItem(getApiId(shortId)));

  const newItems = await Promise.all(promises);
  newItems.forEach((item) => addItem(item));
};

export const useHandleOpenAllParents = (parents: Feature[]) => {
  const { addItem, items } = useEditContext();
  const shortIds = parents.map((parent) => getShortId(parent.osmMeta));

  return (e: React.MouseEvent) => {
    e.stopPropagation();
    addAllItems(shortIds, addItem, items);
  };
};

export const useHandleOpenAllMembers = () => {
  const { members } = useCurrentItem();
  const { addItem, items } = useEditContext();
  const shortIds = members?.map(({ shortId }) => shortId);

  return (e: React.MouseEvent) => {
    e.stopPropagation();
    addAllItems(shortIds, addItem, items);
  };
};
