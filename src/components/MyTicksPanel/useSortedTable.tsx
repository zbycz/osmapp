import { useState } from 'react';
import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { TickRowType } from '../../services/my-ticks/getMyTicks';
import { t } from '../../services/intl';

function descendingComparator(
  a: TickRowType,
  b: TickRowType,
  orderBy: OrderKey,
) {
  return a[orderBy]?.localeCompare(b[orderBy]) ?? 0;
}

type Order = 'asc' | 'desc';

function getComparator(
  order: Order,
  orderBy: OrderKey,
): (a: TickRowType, b: TickRowType) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type OrderKey = 'name' | 'grade' | 'style' | 'date';

interface HeadCell {
  id: OrderKey;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: t('my_ticks.route_name'),
  },
  {
    id: 'grade',
    numeric: false,
    label: t('my_ticks.route_grade'),
  },
  {
    id: 'style',
    numeric: true,
    label: t('my_ticks.route_style'),
  },
  {
    id: 'date',
    numeric: true,
    label: t('my_ticks.route_date'),
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: OrderKey) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: OrderKey) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
}

export const useSortedTable = (tickRows: TickRowType[]) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderKey>('date');

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: OrderKey,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const visibleRows = React.useMemo(
    () => tickRows.sort(getComparator(order, orderBy)),
    [order, orderBy, tickRows],
  );

  const tableHeader = (
    <EnhancedTableHead
      order={order}
      orderBy={orderBy}
      onRequestSort={handleRequestSort}
    />
  );
  return { visibleRows, tableHeader };
};
