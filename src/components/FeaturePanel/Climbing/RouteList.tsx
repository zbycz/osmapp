import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GestureIcon from '@material-ui/icons/Gesture';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';
import { emptyRoute } from './utils/emptyRoute';
import { ClimbingRoute } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';

type Props = {
  onDeleteExistingRouteClick: (deletedExistingRouteIndex: number) => void;
  isReadOnly: boolean;
};
const Container = styled.div`
  flex: 1;
  overflow: auto;
  padding-top: 10px;
`;

const EmptyValue = styled.div`
  color: #666;
`;
// const Row = styled.div`
//   display: flex;
// `;
// const Number = styled.div``;
// const Name = styled.div``;
// const Difficulty = styled.div``;
// const Actions = styled.div``;

const RenderRow = ({
  route,
  isReadOnly,
  index,
  onRowClick,
  onRouteChange,
  onDeleteExistingRouteClick,
}) => {
  const { name, difficulty, path } = route;
  const getText = (field: keyof ClimbingRoute) =>
    route[field] !== '' ? route[field] : <EmptyValue>?</EmptyValue>;
  const [open, setOpen] = React.useState(false);

  const { isSelectedRouteEditable, useMachine, isRouteSelected } =
    useClimbingContext();
  const isSelected = isRouteSelected(index);
  const machine = useMachine();
  const onEditClick = () => {
    machine.execute('editRoute');
  };

  return (
    // <Row>
    //   <Number>{index}</Number>
    //   <Name>
    //     {isReadOnly ? (
    //       getText('name')
    //     ) : (
    //       <TextField
    //         size="small"
    //         value={name}
    //         placeholder="No name"
    //         onChange={(e) => onRouteChange(e, index, 'name')}
    //         fullWidth
    //         variant="outlined"
    //       />
    //     )}
    //   </Name>
    //   <Difficulty>
    //     {isReadOnly ? (
    //       getText('difficulty')
    //     ) : (
    //       <TextField
    //         size="small"
    //         value={difficulty}
    //         placeholder="6+"
    //         onChange={(e) => onRouteChange(e, index, 'difficulty')}
    //         variant="outlined"
    //       />
    //     )}
    //   </Difficulty>
    //   <Actions>
    //     {!isReadOnly && (
    //       <>
    //         {path.length === 0 && (
    //           <IconButton
    //             onClick={() => onCreateSchemaForExistingRouteClick(index)}
    //             color="primary"
    //             title="Draw route to schema"
    //           >
    //             <GestureIcon fontSize="small" />
    //           </IconButton>
    //         )}
    //         <IconButton
    //           onClick={() => onDeleteExistingRouteClick(index)}
    //           color="primary"
    //           title="Delete route"
    //         >
    //           <DeleteIcon fontSize="small" />
    //         </IconButton>
    //       </>
    //     )}
    //   </Actions>
    // </Row>
    <>
      <TableRow
        onClick={() => onRowClick(index)}
        selected={isSelected}
        style={{ cursor: 'pointer' }}
      >
        <TableCell width={50}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" width={70}>
          {index}
        </TableCell>
        <TableCell>
          {isReadOnly || !isSelectedRouteEditable || !isSelected ? (
            getText('name')
          ) : (
            <TextField
              size="small"
              value={name}
              placeholder="No name"
              onChange={(e) => onRouteChange(e, index, 'name')}
              fullWidth
              variant="outlined"
            />
          )}
        </TableCell>
        <TableCell width={50}>
          {isReadOnly || !isSelectedRouteEditable || !isSelected ? (
            getText('difficulty')
          ) : (
            <TextField
              size="small"
              value={difficulty}
              placeholder="6+"
              onChange={(e) => onRouteChange(e, index, 'difficulty')}
              variant="outlined"
            />
          )}
        </TableCell>

        {!isReadOnly && (
          <TableCell align="right" width={120}>
            <>
              {path.length === 0 && <GestureIcon fontSize="small" />}
              <IconButton
                onClick={() => onEditClick()}
                color="primary"
                size="small"
                title="Edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <IconButton
              onClick={() => onDeleteExistingRouteClick(index)}
              color="primary"
              size="small"
              title="Delete route"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const RouteList = ({
  onDeleteExistingRouteClick,
  isReadOnly = false,
}: Props) => {
  const {
    setRouteSelectedIndex,
    routes,
    setRoutes,
    routeSelectedIndex,
    updateRouteOnIndex,
  } = useClimbingContext();

  const onRouteChange = (e, index, updatedField) => {
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      [updatedField]: e.target.value,
    }));
  };

  const onNewRouteCreate = () => {
    setRoutes([...routes, emptyRoute]);
  };

  const onRowClick = (index: number) => {
    setRouteSelectedIndex(routeSelectedIndex === index ? null : index);
  };
  if (isReadOnly && routes.length === 0) return null;

  return (
    <Container>
      <TableContainer>
        <Table size="small">
          {!isReadOnly && (
            <caption>
              {' '}
              <Button
                onClick={onNewRouteCreate}
                color="primary"
                variant="text"
                size="small"
                startIcon={<AddIcon />}
              >
                Add new route
              </Button>
            </caption>
          )}
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>N°</TableCell>
              <TableCell>Route name</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              {!isReadOnly && <TableCell align="right">&nbsp;</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route, index) => (
              <RenderRow
                route={route}
                index={index}
                onRowClick={onRowClick}
                isReadOnly={isReadOnly}
                onRouteChange={onRouteChange}
                onDeleteExistingRouteClick={onDeleteExistingRouteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
