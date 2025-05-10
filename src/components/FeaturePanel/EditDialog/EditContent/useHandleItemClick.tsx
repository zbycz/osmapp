import { EditDataItem } from '../useEditItems';
import { Dispatch, SetStateAction } from 'react';
import { useEditContext } from '../EditContext';
import { getApiId } from '../../../../services/helpers';
import { fetchFreshItem } from '../itemsHelpers';
import { Setter } from '../../../../types';

const isInItems = (items: Array<EditDataItem>, shortId: string) =>
  items.find((item) => item.shortId === shortId);

export const useHandleItemClick = (setIsExpanded: Setter<boolean>) => {
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
