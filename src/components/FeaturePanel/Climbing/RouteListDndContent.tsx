import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RenderListRow } from './RouteListRow';

type Item = {
  id: number;
  content: React.ReactNode;
};

const Container = styled.div`
  width: 100%;
`;
const RowWithDragHandler = styled.div<{ isDraggedOver: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? '#ccc' : 'transparent'};
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.backgroundSurfaceElevation1 : 'transparent'};
  /* &:nth-child(2n) {
    ${({ isSelected }) => !isSelected && `background-color: #f5f5f5`};
  } */
  border-bottom: solid 1px ${({ theme }) => theme.borderOnElevation0};
  /* background-color: ${({ isDraggedOver }) =>
    isDraggedOver ? '#f0f0f0' : 'transparent'}; */
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-size: 16px;
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
const HighlightedDropzone = styled.div<{ isActive: boolean }>`
  position: absolute;
  width: 100%;
  margin-top: -2px;
  height: 4px;
  background: ${({ isActive, theme }) =>
    isActive ? theme.borderSecondary : 'transparent'};
  z-index: 1000000;
`;
const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: ${({ theme }) => theme.textSubdued};
  font-size: 11px;
  padding-top: 12px;
  padding-bottom: 4px;
  border-bottom: solid 1px ${({ theme }) => theme.borderOnElevation1};
  background-color: ${({ theme }) => theme.backgroundSurfaceElevation1};
`;
const NameHeader = styled.div`
  padding-left: 40px;
`;
const DifficultyHeader = styled.div`
  width: 95px;
`;

export const RouteListDndContent = () => {
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

      // console.log('____////', offsetY, targetRect.height);
      if (offsetY < targetRect.height / 2) {
        // console.log('_____A');
        newIndex = index; // nahoru
      } else if (
        index === items.length - 1 &&
        offsetY > targetRect.height / 2
      ) {
        // console.log('_____B');
        newIndex = items.length; // poslední
      } else {
        // console.log('_____C');
        newIndex = index; // dolu
      }
    }

    if (newIndex !== draggedOverIndex) {
      // console.log('_____D');
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
      // console.log('____///', items);
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

  return (
    <Container>
      <TableHeader>
        <NameHeader>Name</NameHeader>
        <DifficultyHeader>Difficulty</DifficultyHeader>
      </TableHeader>
      {items.map((item, index) => {
        // console.log('___', draggedItem?.id, index);
        const isSelected = isRouteSelected(index);

        return (
          <React.Fragment key={item.id}>
            {draggedItem?.id > index && (
              <HighlightedDropzone isActive={draggedOverIndex === index} />
            )}
            <RowWithDragHandler
              isDraggedOver={index === draggedOverIndex}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              isSelected={isSelected}
            >
              {isEditMode && (
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
                  onRowClick={onRowClick}
                  onRouteChange={onRouteChange}
                  index={index}
                />
              </RowContent>
            </RowWithDragHandler>
            {draggedItem?.id <= index && (
              <HighlightedDropzone isActive={draggedOverIndex === index} />
            )}
          </React.Fragment>
        );
      })}
    </Container>
  );
};
