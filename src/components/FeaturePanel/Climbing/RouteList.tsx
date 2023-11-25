import React from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { emptyRoute } from './utils/emptyRoute';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteListDndContent } from './RouteListDndContent';

// type Item = {
//   id: number;
//   content: React.ReactNode;
// };

// type Props = {
//   onDeleteExistingRouteClick: (deletedExistingRouteIndex: number) => void;
// };

// onDeleteExistingRouteClick,
export const RouteList = () => {
  const {
    routes,
    setRoutes,
    isEditMode,
    setRouteSelectedIndex,
    routeSelectedIndex,
  } = useClimbingContext();

  const onNewRouteCreate = () => {
    setRoutes([...routes, emptyRoute]);
  };

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
    <>
      <RouteListDndContent />
      <Button
        onClick={onNewRouteCreate}
        color="primary"
        variant="text"
        size="small"
        startIcon={<AddIcon />}
      >
        Add new route
      </Button>
    </>
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
