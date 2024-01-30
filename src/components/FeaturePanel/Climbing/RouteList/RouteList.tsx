import React from 'react';
import styled from 'styled-components';

import { Button, ButtonGroup } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteListDndContent } from './RouteListDndContent';
import { addElementToArray, deleteFromArray } from '../utils/array';

const Container = styled.div`
  padding-bottom: 65px;
  background: ${({ theme }) => theme.palette.panelBackground};
  position: relative; // mobile safari fix
`;
const ButtonContainer = styled.div`
  margin-top: 16px;
  margin-left: 40px;
`;
// type Item = {
//   id: number;
//   content: React.ReactNode;
// };

// type Props = {
//   onDeleteExistingRouteClick: (deletedExistingRouteIndex: number) => void;
// };

// onDeleteExistingRouteClick,
export const RouteList = ({ isEditable }: { isEditable?: boolean }) => {
  const {
    routes,
    isEditMode,
    setRouteSelectedIndex,
    routeSelectedIndex,
    setIsEditMode,
    routesExpanded,
    setRoutesExpanded,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setRoutes,
    showDebugMenu,
  } = useClimbingContext();

  React.useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'ArrowDown') {
        const nextRoute = routes[routeSelectedIndex + 1];
        if (nextRoute) {
          setRouteSelectedIndex(routeSelectedIndex + 1);
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowUp') {
        const prevRoute = routes[routeSelectedIndex - 1];
        if (prevRoute) {
          setRouteSelectedIndex(routeSelectedIndex - 1);
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowLeft') {
        const index = routesExpanded.indexOf(routeSelectedIndex);
        if (index > -1) {
          setRoutesExpanded(deleteFromArray(routesExpanded, index));
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowRight') {
        if (routesExpanded.indexOf(routeSelectedIndex) === -1) {
          setRoutesExpanded(
            addElementToArray(routesExpanded, routeSelectedIndex),
          );
          // @TODO: scroll to expanded container:
          // ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [routeSelectedIndex, routes, routesExpanded]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const getRoutesJson = () => {
    console.log(`____EXPORT JSON`, JSON.stringify(routes));
  };

  const getRoutesCsv = () => {
    const boltCodeMap = {
      bolt: 'B',
      anchor: 'A',
      piton: 'P',
      sling: 'S',
    };

    const getPathString = (path) =>
      path
        ?.map(({ x, y, type }) => `${x},${y}${type ? boltCodeMap[type] : ''}`)
        .join('|');

    const getImage = (o) =>
      o && o.length > 1 ? `${o?.[0]}#${getPathString(o?.[1])}` : '';

    const csv = routes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map((r, _idx) =>
        [
          r.name,
          getImage(Object.entries(r.paths)?.[0]),
          getImage(Object.entries(r.paths)?.[1]),
          getImage(Object.entries(r.paths)?.[2]),
          // JSON.stringify(r.difficulty),
          // idx,
        ].join(';'),
      )
      .join(`\n`);
    console.log(
      `____EXPORT CSV
`,
      csv,
    );
  };

  const mockRoutes = () => {
    // setRoutes();
  };

  // @TODO scroll to end

  //   const divRef = useRef(null);

  //   useEffect(() => {
  //     divRef.current.scrollIntoView({ behavior: 'smooth' });
  //   });

  //   return <div ref={divRef} />;

  return (
    <Container>
      {routes.length !== 0 && <RouteListDndContent isEditable={isEditable} />}
      {!isEditMode && isEditable && (
        <ButtonContainer>
          <Button
            onClick={handleEdit}
            color="primary"
            variant="outlined"
            endIcon={<EditIcon />}
          >
            Edit routes
          </Button>
        </ButtonContainer>
      )}
      {showDebugMenu && (
        <>
          <br />
          <ButtonGroup variant="contained" size="small" color="primary">
            <Button size="small" onClick={getRoutesCsv}>
              routes CSV
            </Button>
            <Button size="small" onClick={getRoutesJson}>
              routes JSON
            </Button>
            <Button size="small" onClick={mockRoutes}>
              Mock
            </Button>
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};
