import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

export const HighlightedDropzoneVertical = styled.div<{ $isActive: boolean }>`
  position: absolute;
  height: 100%;
  margin-left: -2px;
  width: 4px;
  top: 0;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.palette.climbing.active : 'transparent'};
  z-index: 1000000;
`;

export const HighlightedDropzoneHorizontal = styled.div<{ $isActive: boolean }>`
  position: absolute;
  width: 100%;
  margin-top: -2px;
  height: 4px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.palette.climbing.active : 'transparent'};
  z-index: 1000000;
`;

const ItemContainer = styled.div`
  position: relative;
`;

type Item<T> = {
  id: number;
  content: T;
};

type UseDragItemsProps<T> = {
  initialItems: T[];
  moveItems: (oldIndex: number, newIndex: number) => void;
  direction?: 'horizontal' | 'vertical';
};

// TODO refactor this - extract member functions
// eslint-disable-next-line max-lines-per-function
export const useDragItems = <T,>({
  initialItems,
  moveItems,
  direction = 'horizontal',
}: UseDragItemsProps<T>) => {
  const [items, setItems] = useState<Item<T>[]>([]);
  const [draggedItem, setDraggedItem] = useState<Item<T> | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const content = (initialItems ?? []).map((item, index) => ({
      id: index,
      content: item,
    }));
    setItems(content);
  }, [initialItems]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    dragged: Item<T>,
  ) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', JSON.stringify(dragged));
    setDraggedItem(dragged);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    let newIndex = index;

    if (draggedItem) {
      const target = e.target as HTMLDivElement;
      const targetRect = target.getBoundingClientRect();
      const offsetY = e.clientY - targetRect.top;

      if (offsetY < targetRect.width / 2) {
        newIndex = index; // up
      } else if (index === items.length - 1 && offsetY > targetRect.width / 2) {
        newIndex = items.length; // last
      } else {
        newIndex = index; // down
      }
    }

    if (newIndex !== draggedOverIndex) {
      setDraggedOverIndex(newIndex);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (draggedOverIndex !== null && draggedItem) {
      const newItems = [...items];
      const oldIndex = items.findIndex((item) => item.id === draggedItem.id);
      newItems.splice(oldIndex, 1);

      let newIndex = draggedOverIndex;
      if (
        draggedOverIndex === items.length ||
        draggedOverIndex === items.length - 1
      ) {
        newIndex = items.length;
      }

      newItems.splice(newIndex, 0, draggedItem);
      setItems(newItems);
      moveItems(oldIndex, newIndex);
    }
    setDraggedItem(null);
    setDraggedOverIndex(null);
  };

  const HighlightedDropzone = ({ index }: { index: number }) => {
    if (direction === 'horizontal')
      return (
        <HighlightedDropzoneHorizontal $isActive={draggedOverIndex === index} />
      );
    return (
      <HighlightedDropzoneVertical $isActive={draggedOverIndex === index} />
    );
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    HighlightedDropzone,
    ItemContainer,
    setDraggedItem,
    setDraggedOverIndex,
    draggedItem,
    draggedOverIndex,
  };
};
