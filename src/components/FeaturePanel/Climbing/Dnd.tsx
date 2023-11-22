import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RenderListRow } from './RouteListRow';

type Item = {
  id: number;
  content: React.ReactNode;
};

const DragControl = styled.div`
  width: 40px;
  cursor: move;
`;
const RowContent = styled.div``;

const DragAndDropList = ({ isReadOnly }) => {
  const {
    routes,
    moveRoute,
    setRouteSelectedIndex,
    routeSelectedIndex,
    updateRouteOnIndex,
  } = useClimbingContext();
  const [items, setItems] = useState([]);

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
    setRouteSelectedIndex(routeSelectedIndex === index ? null : index);
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

      console.log('____////', offsetY, targetRect.height);
      if (offsetY < targetRect.height / 2) {
        console.log('_____A');
        newIndex = index; // nahoru
      } else if (
        index === items.length - 1 &&
        offsetY > targetRect.height / 2
      ) {
        console.log('_____B');
        newIndex = items.length; // poslední
      } else {
        console.log('_____C');
        newIndex = index; // dolu
      }
    }

    if (newIndex !== draggedOverIndex) {
      console.log('_____D');
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
    <div>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <div
            style={{
              height: '4px',
              background: draggedOverIndex === index ? 'blue' : 'white',
            }}
          />
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              backgroundColor:
                index === draggedOverIndex ? '#f0f0f0' : 'transparent',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <DragControl
              draggable
              onDragStart={(e) => handleControlDragStart(e, item)}
              onDragEnd={handleControlDragEnd}
            >
              <DragIndicatorIcon />
            </DragControl>
            <RowContent>
              <RenderListRow
                isReadOnly={isReadOnly}
                route={item.route}
                onRowClick={onRowClick}
                onRouteChange={onRouteChange}
                onDeleteExistingRouteClick={() => null}
                index={index}
              />
            </RowContent>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default DragAndDropList;
