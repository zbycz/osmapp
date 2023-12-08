import React from 'react';
import styled from 'styled-components';
import { IconButton, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ClimbingRoute } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';

const Cell = styled.div<{ width: number; align: 'center' | 'left' | 'right' }>`
  width: ${({ width }) => width}px;
  text-align: ${({ align }) => align};
`;
const NameCell = styled(Cell)`
  flex: 1;
`;
const RouteNumberCell = styled(Cell)`
  color: #999;
  margin-left: 8px;
`;
const NoSchemaCell = styled(Cell)`
  color: #999;
  font-size: 12px;
  margin-right: 8px;
`;
const Row = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
`;
const EmptyValue = styled.div`
  color: #666;
`;

export const RenderListRow = ({
  route,
  index,
  onRowClick,
  onRouteChange,
  // onDeleteExistingRouteClick,
}) => {
  const { name, difficulty, path } = route;
  const getText = (field: keyof ClimbingRoute) =>
    route[field] !== '' ? route[field] : <EmptyValue>?</EmptyValue>;
  // const [open, setOpen] = React.useState(false);

  const { getMachine, isRouteSelected, isEditMode } = useClimbingContext();
  const isSelected = isRouteSelected(index);
  const machine = getMachine();
  const onEditClick = (e, editIndex: number) => {
    machine.execute('editRoute', { routeNumber: editIndex });
    e.stopPropagation();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      <Row
        onClick={() => onRowClick(index)}
        selected={isSelected}
        style={{ cursor: 'pointer' }}
      >
        {/* <Cell width={50}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Cell> */}
        <RouteNumberCell component="th" scope="row" width={30}>
          {index}
        </RouteNumberCell>
        <NameCell>
          {!isEditMode ||
          (machine.currentStateName !== 'editRoute' &&
            machine.currentStateName !== 'extendRoute') ||
          !isSelected ? (
            getText('name')
          ) : (
            <TextField
              size="small"
              value={name}
              placeholder="No name"
              onChange={(e) => {
                onRouteChange(e, index, 'name');
              }}
              onClick={stopPropagation}
              fullWidth
            />
          )}
        </NameCell>
        {path.length === 0 && (
          <NoSchemaCell align="right">no schema</NoSchemaCell>
        )}
        <Cell width={50}>
          {!isEditMode ||
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
              style={{ paddingTop: 0 }}
            />
          )}
        </Cell>

        {isEditMode && (
          <Cell align="right">
            <>
              <IconButton
                onClick={(e) => onEditClick(e, index)}
                color="primary"
                size="small"
                title="Edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          </Cell>
        )}
      </Row>
      {/* <Row>
        <Cell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
        </Cell>
      </Row> */}
    </>
  );
};
