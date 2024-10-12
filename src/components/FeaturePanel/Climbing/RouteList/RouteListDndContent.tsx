import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RenderListRow } from './RouteListRow';
import { useDragItems } from '../../../utils/useDragItems';

type Item = {
  id: number;
  content: React.ReactNode;
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;
const Row = styled.div`
  &:hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.1);
  }
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
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.palette.action.selected : 'transparent'};
  position: relative;
  font-size: 16px;
  border-top: dotted 1px ${({ theme }) => theme.palette.divider};
  z-index: ${({ isSelected }) => (isSelected ? '2' : 'auto')};
`;
const DragHandler = styled.div`
  width: 30px;
  padding-top: 16px;
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

const TableHeader = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.text.secondary};
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
    isRouteSelected,
    isEditMode,
    getMachine,
    showDebugMenu,
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
  const parentRef = React.useRef<HTMLDivElement>(null);

  const onRowClick = (index: number) => {
    const routeNumber = routeSelectedIndex === index ? null : index;
    if (isEditMode) {
      machine.execute('editRoute', { routeNumber });
    } else {
      machine.execute('routeSelect', { routeNumber });
    }
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

  const {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    HighlightedDropzone,
    setDraggedItem,
    setDraggedOverIndex,
    draggedItem,
    draggedOverIndex,
  } = useDragItems<React.ReactNode>({
    initialItems: routes,
    moveItems: (oldIndex, newIndex) => {
      moveRoute(oldIndex, newIndex);

      // maybe move to moveRoute?
      if (routeSelectedIndex === oldIndex) setRouteSelectedIndex(newIndex);
      if (routeSelectedIndex === newIndex) setRouteSelectedIndex(oldIndex);
    },
    direction: 'vertical',
  });

  return (
    <Container ref={parentRef}>
      <TableHeader>
        <MaxWidthContainer>
          <NameHeader>Name</NameHeader>
          <DifficultyHeader>Difficulty</DifficultyHeader>
        </MaxWidthContainer>
      </TableHeader>
      {items.map((item, index) => {
        const isSelected = isRouteSelected(index);
        return (
          <Row key={item.id}>
            {draggedItem?.id > index && <HighlightedDropzone index={index} />}
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
                {showDebugMenu && isEditMode && isEditable && (
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
                    key={item.route.id}
                    routeId={item.route.id}
                    stopPropagation={stopPropagation}
                    parentRef={parentRef}
                    feature={item.route.feature}
                  />
                </RowContent>
              </MaxWidthContainer>
            </RowWithDragHandler>
            {draggedItem?.id <= index && <HighlightedDropzone index={index} />}
          </Row>
        );
      })}
    </Container>
  );
};
