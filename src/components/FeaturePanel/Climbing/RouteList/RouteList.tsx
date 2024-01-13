import React from 'react';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteListDndContent } from './RouteListDndContent';
import { addElementToArray, deleteFromArray } from '../utils/array';

const Container = styled.div`
  padding-bottom: 65px;
  background-color: ${({ theme }) => theme.backgroundSurfaceElevationNegative};
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
