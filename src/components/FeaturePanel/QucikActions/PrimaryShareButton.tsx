import styled from '@emotion/styled';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useUserThemeContext } from '../../../helpers/theme';
import ShareIcon from '@mui/icons-material/Share';
import { Stack } from '@mui/material';

type PrimaryShareButtonProps = {
  label: string;
  image: string;
  onClick?: () => void;
  href?: string;
  invertImage?: {
    dark: boolean;
    light: boolean;
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.palette.background.default};
  }
`;

const PrimaryShareButtonInner = ({
  image,
  label,
  href,
  onClick,
  invertImage,
}: PrimaryShareButtonProps) => {
  const { currentTheme } = useUserThemeContext();

  return (
    <Container>
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
    </Container>
  );
};

const PrimaryShareButton = ({
  image,
  label,
  href,
  onClick,
  invertImage,
}: PrimaryShareButtonProps) => {
  const inner = (
    <PrimaryShareButtonInner
      image={image}
      label={label}
      href={href}
      onClick={onClick}
      invertImage={invertImage}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      style={{
        background: 'transparent',
        color: 'inherit',
        border: 'none',
      }}
      onClick={onClick}
    >
      {inner}
    </button>
  );
};

const PrimaryButtonsWrapper = styled.div`
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
  buttons: PrimaryShareButtonProps[];
}) => {
  return (
    <PrimaryButtonsWrapper>
      {buttons.map(({ label, href, image, invertImage, onClick }) => (
        <PrimaryShareButton
          key={label}
          label={label}
          href={href}
          image={image}
          onClick={onClick}
          invertImage={invertImage}
        />
      ))}
    </PrimaryButtonsWrapper>
  );
};
