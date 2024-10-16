import { IconButton, Stack } from '@mui/material';
import { Setter } from '../../types';
import { Option } from '../SearchBox/types';
import { DirectionsAutocomplete } from './DirectionsAutocomplete';
import { getAutocompletelabel } from './helpers';
import { AddLocation, Delete, Loop } from '@mui/icons-material';

const DirectionsActionInner = ({ isFirst, isLast }) => {
  if (isFirst) {
    return <Loop />;
  }
  if (isLast) {
    return <AddLocation />;
  }
  return <Delete />;
};

type Props = {
  points: Option[];
  setPoints: Setter<Option[]>;
};

export const StopList = ({ points, setPoints }: Props) => {
  return (
    <Stack spacing={1} mb={3}>
      {points.map((point, i) => {
        const isFirst = i === 0;
        const isLast = points.length === i + 1;
        return (
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            key={JSON.stringify(point)}
          >
            <DirectionsAutocomplete
              value={point}
              setValue={(point) => {
                setPoints((prev) => {
                  prev[i] = point;
                  return prev;
                });
              }}
              label={getAutocompletelabel(isFirst, isLast)}
            />
            <IconButton
              onClick={() => {
                if (isFirst) {
                  setPoints((prev) => prev.toReversed());
                  return;
                }
                if (isLast) {
                  setPoints((prev) => [
                    ...prev.slice(0, -1),
                    undefined,
                    ...prev.slice(-1),
                  ]);
                  return;
                }

                setPoints((prev) => [
                  ...prev.slice(0, i),
                  ...prev.slice(i + 1),
                ]);
              }}
            >
              <DirectionsActionInner isFirst={isFirst} isLast={isLast} />
            </IconButton>
          </Stack>
        );
      })}
    </Stack>
  );
};
