import React from 'react';
import styled from 'styled-components';

import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteListDndContent } from './RouteListDndContent';

const Container = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  margin-bottom: 65px;
`;
// type Item = {
//   id: number;
//   content: React.ReactNode;
// };

// type Props = {
//   onDeleteExistingRouteClick: (deletedExistingRouteIndex: number) => void;
// };

// onDeleteExistingRouteClick,
export const RouteList = () => {
  const { routes, isEditMode, setRouteSelectedIndex, routeSelectedIndex } =
    useClimbingContext();

  React.useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'ArrowDown') {
        const nextRoute = routes[routeSelectedIndex + 1];
        if (nextRoute) {
          setRouteSelectedIndex(routeSelectedIndex + 1);
        }
      }
      if (e.key === 'ArrowUp') {
        const prevRoute = routes[routeSelectedIndex - 1];
        if (prevRoute) {
          setRouteSelectedIndex(routeSelectedIndex - 1);
        }
      }

      e.preventDefault();
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [routeSelectedIndex, routes]);

  if (!isEditMode && routes.length === 0) return null;

  return (
    <Container>
      <RouteListDndContent />
      {/* <Button
        onClick={onNewRouteCreate}
        color="primary"
        variant="text"
        size="small"
        startIcon={<AddIcon />}
      >
        Add new route
      </Button> */}
    </Container>
  );

  // return (
  //   <Container>
  //     <TableContainer>
  //       <Table size="small">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell />
  //             <TableCell>N°</TableCell>
  //             <TableCell>Route name</TableCell>
  //             <TableCell align="right">Difficulty</TableCell>
  //             {isEditMode && <TableCell align="right">&nbsp;</TableCell>}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           <RouteListDndContent />
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </Container>
  // );
};
