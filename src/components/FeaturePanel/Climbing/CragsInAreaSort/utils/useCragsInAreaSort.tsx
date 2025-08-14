import { useState } from 'react';
import { SortBy } from '../types';
import { getWikimediaCommonsPhotoTags } from '../../utils/photo';

export const useCragsInAreaSort = () => {
  const [sortBy, setSortBy] = useState<SortBy>('default');

  const sortByFn = (sortBy: SortBy) => {
    switch (sortBy) {
      case 'routes':
        return (item1, item2) =>
          (item2?.members?.length || 0) - (item1?.members?.length || 0);
      case 'photos':
        return (item1, item2) => {
          return (
            getWikimediaCommonsPhotoTags(item2.tags).length -
            getWikimediaCommonsPhotoTags(item1.tags).length
          );
        };
      case 'alphabetical':
        return (item1, item2) => {
          const name1 = item1.tags.name || '';
          const name2 = item2.tags.name || '';
          return name1.localeCompare(name2);
        };
      default:
        return () => 0;
    }
  };

  return { sortByFn, sortBy, setSortBy };
};
