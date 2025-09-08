import { DataItem, EditDataItem, isInItems } from '../context/useEditItems';
import React from 'react';
import { useCurrentItem, useEditContext } from '../context/EditContext';
import { getApiId, getShortId } from '../../../../services/helpers';
import { fetchFreshItem } from '../context/itemsHelpers';
import { Setter } from '../../../../types';
import { Feature } from '../../../../services/types';

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

  return async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addAllItems(shortIds, addItem, items);
  };
};

export const useHandleOpenAllMembers = () => {
  const { members } = useCurrentItem();
  const { addItem, items } = useEditContext();
  const shortIds = members?.map(({ shortId }) => shortId);

  if (!members || members.length < 2) {
    return undefined;
  }

  if (members.every((member) => isInItems(items, member.shortId))) {
    return undefined;
  }

  return async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addAllItems(shortIds, addItem, items);
  };
};
