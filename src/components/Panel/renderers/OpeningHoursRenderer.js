import React from 'react';
import { SimpleOpeningHours } from 'simple-opening-hours';
import styled from 'styled-components';
import { useToggleState } from '../../helpers';
import { ToggleButton } from '../helpers';
import AccessTime from '@material-ui/icons/AccessTime';

const Table = styled.table`
  margin: 1em;

  th {
    width: 100px;
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
  }
`;

const Faded = styled.span`
  color: rgba(0, 0, 0, 0.54);
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

const formatTimes = times =>
  times.length ? times.map(x => x.replace(/:00/g, '')).join(', ') : '-';

const OpeningState = ({ isOpen, days }) => {
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
  const { ph, ...days } = opening.getTable();
  const timesByDay = Object.values(days).map((times, idx) => ({
    times,
    day: weekDays[idx],
  }));

  const day = new Date().getDay();
  const daysStartingToday = [
    ...timesByDay.slice(day),
    ...timesByDay.slice(0, day),
  ];

  const isOpen = opening.isOpenNow();
  return (
    <>
      <AccessTime />
      <OpeningState isOpen={isOpen} days={days} />
      <ToggleButton onClick={toggle} isShown={isExpanded} />
      {isExpanded && (
        <Table>
          {daysStartingToday.map(({ day, times }) => (
            <tr key={day}>
              <th>{day}</th>
              <td>{formatTimes(times)}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
};

export default OpeningHoursRenderer;
