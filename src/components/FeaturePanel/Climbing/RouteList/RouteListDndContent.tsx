import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RenderListRow } from './RouteListRow';

type Item = {
  id: number;
  content: React.ReactNode;
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const MaxWidthContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
`;

const RowWithDragHandler = styled.div<{
  isDraggedOver: boolean;
  isSelected: boolean;
}>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
  /* background-color: ${({ isSelected }) =>
    isSelected ? '#ccc' : 'transparent'}; */
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.palette.action.selected : 'transparent'};
  position: relative;
  font-size: 16px;
  border-top: dotted 1px ${({ theme }) => theme.palette.divider};
  z-index: ${({ isSelected }) => (isSelected ? '2' : 'auto')};
`;
const DragHandler = styled.div`
  width: 30px;
  padding-top: 7px;
  cursor: move;
  align-items: center;
  display: flex;
  color: #888;
`;
const RowContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;
const HighlightedDropzone = styled.div<{ $isActive: boolean }>`
  position: absolute;
  width: 100%;
  margin-top: -2px;
  height: 4px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.palette.climbing.active : 'transparent'};
  z-index: 1000000;
`;
const TableHeader = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.text.hint};
  font-size: 11px;
  padding-top: 12px;
  padding-bottom: 4px;
`;
const NameHeader = styled.div`
  flex: 1;
  padding-left: 40px;
`;
const DifficultyHeader = styled.div`
  width: 115px;
`;

export const RouteListDndContent = ({ isEditable }) => {
  const {
    routes,
    moveRoute,
    setRouteSelectedIndex,
    routeSelectedIndex,
    updateRouteOnIndex,
    isRouteSelected,
    isEditMode,
    getMachine,
  } = useClimbingContext();
  const [items, setItems] = useState([]);
  const machine = getMachine();
  useEffect(() => {
    const content = routes.map((route, index) => ({
      id: index,
      route,
    }));
    setItems(content);
  }, [routes]);

  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const onRouteChange = (e, index, updatedField) => {
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      [updatedField]: e.target.value,
    }));
  };

  const onRowClick = (index: number) => {
    const routeNumber = routeSelectedIndex === index ? null : index;
    if (isEditMode) {
      machine.execute('editRoute', { routeNumber });
    } else {
      machine.execute('routeSelect', { routeNumber });
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    dragged: Item,
  ) => {
    e.stopPropagation();
    e.preventDefault();
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

      if (offsetY < targetRect.height / 2) {
        newIndex = index; // up
      } else if (
        index === items.length - 1 &&
        offsetY > targetRect.height / 2
      ) {
        newIndex = items.length; // last
      } else {
        newIndex = index; // down
      }
    }

    if (newIndex !== draggedOverIndex) {
      setDraggedOverIndex(newIndex);
    }
  };

  const handleDragEnd = () => {
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
      moveRoute(oldIndex, newIndex);
      if (routeSelectedIndex === oldIndex) setRouteSelectedIndex(newIndex);
      if (routeSelectedIndex === newIndex) setRouteSelectedIndex(oldIndex);
    }
    setDraggedItem(null);
    setDraggedOverIndex(null);
  };

  const handleControlDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    dragged: Item,
  ) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', JSON.stringify(dragged));
    setDraggedItem(dragged);
  };

  const handleControlDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverIndex(null);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <Container>
      <TableHeader>
        <MaxWidthContainer>
          <NameHeader>Name</NameHeader>
          <DifficultyHeader>Difficulty</DifficultyHeader>
        </MaxWidthContainer>
      </TableHeader>
      {items.map((item, index) => {
        const isSelected = isRouteSelected(index);
        return (
          <React.Fragment key={item.id}>
            {draggedItem?.id > index && (
              <HighlightedDropzone $isActive={draggedOverIndex === index} />
            )}
            <RowWithDragHandler
              isDraggedOver={index === draggedOverIndex}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              isSelected={isSelected}
              onClick={() => {
                onRowClick(index);
              }}
            >
              <MaxWidthContainer>
                {isEditMode && isEditable && (
                  <DragHandler
                    draggable
                    onDragStart={(e) => handleControlDragStart(e, item)}
                    onDragEnd={handleControlDragEnd}
                  >
                    <DragIndicatorIcon />
                  </DragHandler>
                )}
                <RowContent>
                  <RenderListRow
                    route={item.route}
                    onRouteChange={onRouteChange}
                    index={index}
                    stopPropagation={stopPropagation}
                  />
                </RowContent>
              </MaxWidthContainer>
            </RowWithDragHandler>
            {draggedItem?.id <= index && (
              <HighlightedDropzone $isActive={draggedOverIndex === index} />
            )}
          </React.Fragment>
        );
      })}
    </Container>
  );
};
