import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import ChevronUp from '@mui/icons-material/KeyboardArrowUp';
import { ButtonBase, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import { renderLayerSwitcher } from './layerSwitcher';
import LayersIcon from '@mui/icons-material/Layers';
import SpeakerIcon from '@mui/icons-material/Speaker';
import { useTurnByTurnContext } from '../utils/TurnByTurnContext';
import { MaptilerLogo } from '../Map/MapFooter/MaptilerLogo';
import { MapFooter } from '../Map/MapFooter/MapFooter';
import { TOP_PANEL_HEIGHT } from './TopPanel';

const StyledBottomPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;

  min-height: 40px;
  max-height: calc(100dvh - ${TOP_PANEL_HEIGHT + 20}px);
  width: 100%;
  padding: 0.5rem 0.75rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  color: white;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(32px);

  border-radius: 0.75rem 0.75rem 0 0;
`;

const ExpandButton = styled(IconButton)<{ $expanded: boolean }>`
  color: ${({ theme }) => theme.palette.grey[300]};
  transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : '')};
  transition: transform 0.25s ease-in-out;
`;

const StyledStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:nth-of-type(2) {
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.grey[300]};
  }
`;

const Stat = ({ value, label }: { value: string; label: string }) => (
  <StyledStat>
    <span>{value}</span>
    <span>{label}</span>
  </StyledStat>
);

const EndButton = styled(ButtonBase)`
  background: #dc2626;
  font-weight: 700;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const GroupWrapper = styled.div`
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: #333333;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

type GroupProps = {
  items: {
    icon: React.FC;
    label: string;
    render: () => JSX.Element;
  }[];
};

const Group = ({ items }: GroupProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number>(null);
  return (
    <GroupWrapper>
      {items.map(({ label, icon: Icon, render }, index) => (
        <Stack key={index} spacing={1.5}>
          <ButtonBase
            onClick={() => {
              setExpandedIndex((prev) => (prev === index ? null : index));
            }}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: '4px',
              justifyContent: 'start',
              fontSize: '1rem',
              fontWeight: 'semibold',
              gap: '0.5rem',
            }}
          >
            <Icon />
            <span>{label}</span>
          </ButtonBase>
          {expandedIndex === index && <>{render()}</>}
        </Stack>
      ))}
    </GroupWrapper>
  );
};

const BottomRight = styled.div`
  position: absolute;
  right: 0;
  bottom: 100%;
  text-align: right;
  pointer-events: none;
  z-index: 1;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: end;
  padding: 0 4px 4px 4px;
`;

export const BottomPanel = () => {
  const [expanded, setExpanded] = useState(false);
  const { palette } = useTheme();
  const { end } = useTurnByTurnContext();

  return (
    <StyledBottomPanel>
      <BottomRight>
        <MaptilerLogo />
        {/* TODO: Show the weather in certain conditions*/}
        <MapFooter />
      </BottomRight>
      <Stack justifyContent="space-between" direction="row">
        <Stack
          direction="row"
          spacing={0.75}
          style={{
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          <Stat label="Arrival" value="07:42" />
          <Stat label="Arrival" value="07:42" />
          <Stat label="Arrival" value="07:42" />
        </Stack>
        <ExpandButton
          $expanded={expanded}
          onClick={() => {
            setExpanded((ex) => !ex);
          }}
        >
          <ChevronUp />
        </ExpandButton>
      </Stack>
      {expanded && (
        <>
          <hr style={{ width: '100%', borderColor: palette.grey[600] }} />
          <Stack
            spacing={1}
            style={{
              maxHeight: '100%',
              overflowY: 'scroll',
            }}
          >
            <Group
              items={[
                {
                  icon: LayersIcon,
                  label: 'Switch Layer',
                  render: renderLayerSwitcher,
                },
                {
                  icon: SpeakerIcon,
                  label: 'Audio settings',
                  render: () => <>Unsupported</>,
                },
              ]}
            />

            <EndButton onClick={end}>End</EndButton>
          </Stack>
        </>
      )}
    </StyledBottomPanel>
  );
};
