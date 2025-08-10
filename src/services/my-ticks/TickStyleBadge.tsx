import { Tooltip } from '@mui/material';
import { TickStyle } from '../../components/FeaturePanel/Climbing/types';
import { tickStyles } from './ticks';
import styled from '@emotion/styled';

type TickStyleBadgeProps = {
  style: TickStyle;
};

const Container = styled.div<{ $color: string }>`
  color: ${({ $color }) => $color};
  display: inline-block;
  cursor: help;
  font-weight: 900;
  font-size: 12px;
`;

export const TickStyleBadge = ({ style }: TickStyleBadgeProps) => {
  const styleConfig = tickStyles.find((s) => s.key === style);
  return (
    <Tooltip
      arrow
      enterDelay={1000}
      title={
        <>
          <strong>{styleConfig.name}</strong>
          <p>{styleConfig.description}</p>
        </>
      }
    >
      <Container $color={styleConfig.color}>{style}</Container>
    </Tooltip>
  );
};
