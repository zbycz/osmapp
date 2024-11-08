import styled from '@emotion/styled';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useUserThemeContext } from '../../../helpers/theme';
import { getImageSrc } from './img';

const Container = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  border-radius: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.palette.background.elevation};

  th {
    text-transform: capitalize;
  }

  p {
    margin: 4px 0;
  }
`;

const StyledHeading = styled.h3`
  text-transform: capitalize;
  margin-top: 0;
  margin-bottom: 9px;
`;

const addUnit = (key: string, value: string) => {
  if (!/^[\d.]+$/.test(value)) {
    return value;
  }

  switch (key) {
    case 'current':
      return `${value} A`;
    case 'output':
      return `${value} kW`;
    case 'voltage':
      return `${value} V`;
    default:
      return value;
  }
};

type Props = {
  type: string;
  details: Record<string, string>;
};

export const Socket = ({ type, details }: Props) => {
  const { currentTheme } = useUserThemeContext();
  // quantity exists always
  const { quantity } = details;
  const entries = Object.entries(details).filter(([key]) => key !== 'quantity');

  return (
    <Container>
      <Stack alignItems="center" spacing={1}>
        <img
          src={getImageSrc(type)}
          style={{
            width: 75,
            height: 75,
            objectFit: 'contain',
            filter: currentTheme === 'dark' ? 'invert(1)' : '',
          }}
        />
        {/^\d+$/.test(quantity) && <span>{quantity} times</span>}
      </Stack>
      <div>
        <StyledHeading>{type.replace(/_/, ' ')}</StyledHeading>
        {entries.length > 0 && (
          <TableContainer>
            <Table>
              <TableBody>
                {entries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell component="th">{key}</TableCell>
                    <TableCell>{addUnit(key, value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Container>
  );
};
