import React from 'react';
import { SimpleOpeningHours } from 'simple-opening-hours';
import styled from 'styled-components';
import AccessTime from '@material-ui/icons/AccessTime';
import { useToggleState } from '../../helpers';
import { ToggleButton } from '../helpers';

interface SimpleOpeningHoursTable {
  su: string[];
  mo: string[];
  tu: string[];
  we: string[];
  th: string[];
  fr: string[];
  sa: string[];
  ph: string[];
}

const Table = styled.table`
  margin: 1em;

  th {
    width: 100px;
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
  }
`;

// const weekDays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
const weekDays = [
  'neděle',
  'pondělí',
  'úterý',
  'středa',
  'čtvrtek',
  'pátek',
  'sobota',
];

const formatTimes = (times) =>
  times.length ? times.map((x) => x.replace(/:00/g, '')).join(', ') : '-';

const formatDescription = (isOpen: boolean, days: SimpleOpeningHoursTable) => {
  const timesByDay = Object.values(days);
  const day = new Date().getDay();
  const today = timesByDay[day];

  if (isOpen) {
    return `Otevřeno: ${formatTimes(today)}`;
  }

  const isOpenedToday = today.length;
  return isOpenedToday
    ? `Nyní zavřeno, dnes: ${formatTimes(today)}`
    : 'Dnes zavřeno';
};

const OpeningHoursRenderer = ({ v }) => {
  const [isExpanded, toggle] = useToggleState(false);

  const opening = new SimpleOpeningHours(v);
  const daysTable = opening.getTable() as SimpleOpeningHoursTable;
  const { ph, ...days } = daysTable;
  const timesByDay = Object.values(days).map((times, idx) => ({
    times,
    day: weekDays[idx],
  }));

  const currentDay = new Date().getDay();
  const daysStartingToday = [
    ...timesByDay.slice(currentDay),
    ...timesByDay.slice(0, currentDay),
  ];

  const isOpen = opening.isOpenNow();
  return (
    <>
      <AccessTime fontSize="small" />
      <div>
        {formatDescription(isOpen, daysTable)}
        <ToggleButton onClick={toggle} isShown={isExpanded} />
        {isExpanded && (
          <Table>
            <tbody>
              {daysStartingToday.map(({ day, times }) => (
                <tr key={day}>
                  <th>{day}</th>
                  <td>{formatTimes(times)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default OpeningHoursRenderer;
