import styled from '@emotion/styled';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useUserThemeContext } from '../../../helpers/theme';
import ShareIcon from '@mui/icons-material/Share';
import { Stack } from '@mui/material';

type ButtonProps = {
  label: string;
  image: string;
  onClick?: () => void;
  href?: string;
  invertImage?: {
    dark: boolean;
    light: boolean;
  };
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
`;

const ButtonInner = ({
  image,
  label,
  href,
  onClick,
  invertImage,
}: ButtonProps) => {
  const { currentTheme } = useUserThemeContext();

  return (
    <ButtonContainer>
      <img
        src={image}
        style={{
          maxWidth: '50px',
          maxHeight: '50px',
          ...(invertImage?.[currentTheme] ? { filter: 'invert(1)' } : {}),
        }}
      />
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {href && <OpenInNewIcon fontSize="small" />}
        {onClick && <ShareIcon fontSize="small" />}
        <span>{label}</span>
      </Stack>
    </ButtonContainer>
  );
};

const ShareButton = ({
  image,
  label,
  href,
  onClick,
  invertImage,
}: ButtonProps) => {
  const inner = (
    <ButtonInner
      image={image}
      label={label}
      href={href}
      onClick={onClick}
      invertImage={invertImage}
    />
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

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 0.5rem;
  width: 100%;
  box-sizing: content-box;
  margin-bottom: 0.5rem;
`;

export const PrimaryShareButtons = ({
  buttons,
}: {
  buttons: ButtonProps[];
}) => {
  return (
    <ButtonsWrapper>
      {buttons.map(({ label, href, image, invertImage, onClick }) => (
        <ShareButton
          key={label}
          label={label}
          href={href}
          image={image}
          onClick={onClick}
          invertImage={invertImage}
        />
      ))}
    </ButtonsWrapper>
  );
};
