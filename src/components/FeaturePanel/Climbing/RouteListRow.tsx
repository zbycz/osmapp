import React from 'react';
import styled from 'styled-components';
import {
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GestureIcon from '@material-ui/icons/Gesture';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ClimbingRoute } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';

const EmptyValue = styled.div`
  color: #666;
`;

export const RenderListRow = ({
  route,
  isReadOnly = true,
  index,
  onRowClick,
  onRouteChange,
  onDeleteExistingRouteClick,
}) => {
  const { name, difficulty, path } = route;
  const getText = (field: keyof ClimbingRoute) =>
    route[field] !== '' ? route[field] : <EmptyValue>?</EmptyValue>;
  const [open, setOpen] = React.useState(false);

  const { useMachine, isRouteSelected } = useClimbingContext();
  const isSelected = isRouteSelected(index);
  const machine = useMachine();
  const onEditClick = () => {
    machine.execute('editRoute');
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  return (
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
          {isReadOnly ||
          (machine.currentStateName !== 'editRoute' &&
            machine.currentStateName !== 'extendRoute') ||
          !isSelected ? (
            getText('name')
          ) : (
            <TextField
              size="small"
              value={name}
              placeholder="No name"
              onChange={(e) => onRouteChange(e, index, 'name')}
              onClick={stopPropagation}
              fullWidth
              variant="outlined"
            />
          )}
        </TableCell>
        <TableCell width={50}>
          {isReadOnly ||
          (machine.currentStateName !== 'editRoute' &&
            machine.currentStateName !== 'extendRoute') ||
          !isSelected ? (
            getText('difficulty')
          ) : (
            <TextField
              size="small"
              value={difficulty}
              placeholder="6+"
              onChange={(e) => onRouteChange(e, index, 'difficulty')}
              onClick={stopPropagation}
              variant="outlined"
            />
          )}
        </TableCell>

        {!isReadOnly && (
          <TableCell align="right" width={120}>
            <>
              {path.length === 0 && <GestureIcon fontSize="small" />}
              <IconButton
                onClick={onEditClick}
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
