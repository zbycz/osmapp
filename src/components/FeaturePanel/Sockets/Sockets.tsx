import { Stack } from '@mui/material';
import { useSocketTags } from './useSocketTags';
import { Socket } from './Socket';

export const Sockets = () => {
  const socketTags = useSocketTags();

  return (
    <Stack spacing={1}>
      {Object.entries(socketTags).map(([type, details]) => (
        <Socket key={type} type={type} details={details} />
      ))}
    </Stack>
  );
};
