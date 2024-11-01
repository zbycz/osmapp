import styled from '@emotion/styled';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ShareIcon, supportsSharing } from './helpers';
import { Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

type ButtonProps = {
  label: string;
  image: string;
  onClick?: () => void;
  href?: string;
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem;
  width: 5rem;
  border-radius: 0.25rem;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.palette.background.default};
  }

  svg {
    font-size: 12px;
    color: #bbb;
  }
`;

const ButtonInner = ({ image, label, href, onClick }: ButtonProps) => (
  <ButtonContainer>
    <img
      src={image}
      style={{
        maxWidth: '50px',
        maxHeight: '50px',
      }}
    />
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <span>{label}</span>
      {href && <OpenInNewIcon />}
      {onClick && supportsSharing() && <ShareIcon />}
      {onClick && !supportsSharing() && <ContentCopy />}
    </Stack>
  </ButtonContainer>
);

const ShareButton = ({ image, label, href, onClick }: ButtonProps) => {
  const inner = (
    <ButtonInner image={image} label={label} href={href} onClick={onClick} />
  );
  const style: React.CSSProperties = {
    color: 'inherit',
    textDecoration: 'inherit',
    background: 'transparent',
    border: 'none',
    padding: 0,
  };

  if (href) {
    return (
      <a href={href} target="_blank" style={style}>
        {inner}
      </a>
    );
  }

  return (
    <button style={style} onClick={onClick}>
      {inner}
    </button>
  );
};

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 0.5rem;
  box-sizing: content-box;
  margin-bottom: 0.5rem;
`;

export const PrimaryShareButtons = ({
  buttons,
}: {
  buttons: ButtonProps[];
}) => {
  return (
    <ScrollWrapper>
      <ButtonsWrapper>
        {buttons.map(({ label, href, image, onClick }) => (
          <ShareButton
            key={label}
            label={label}
            href={href}
            image={image}
            onClick={onClick}
          />
        ))}
      </ButtonsWrapper>
    </ScrollWrapper>
  );
};
