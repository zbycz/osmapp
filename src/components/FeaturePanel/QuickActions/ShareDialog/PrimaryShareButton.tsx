import styled from '@emotion/styled';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ShareIcon, supportsSharing } from './helpers';
import { Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { Theme, useUserThemeContext } from '../../../../helpers/theme';

type ButtonProps = {
  label: string;
  image: string;
  shareUrl?: string;
  href?: string;
  invert?: Theme;
};

const ButtonContainer = styled.div<{ $invert: boolean }>`
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

  img {
    ${({ $invert }) => ($invert ? 'filter: invert(1);' : '')}
    max-width: 50px;
    max-height: 50px;
  }
`;

const ButtonInner = ({
  image,
  label,
  href,
  shareUrl,
  invert: invertableTheme,
}: ButtonProps) => {
  const { currentTheme } = useUserThemeContext();
  return (
    <ButtonContainer $invert={invertableTheme === currentTheme}>
      <img src={image} />
      <Stack direction="row" alignItems="center" spacing={0.3}>
        <span>{label}</span>
        {href && <OpenInNewIcon />}
        {shareUrl && supportsSharing() && <ShareIcon />}
        {shareUrl && !supportsSharing() && <ContentCopy />}
      </Stack>
    </ButtonContainer>
  );
};

const ShareButton = (props: ButtonProps) => {
  const { href, shareUrl } = props;
  const inner = <ButtonInner {...props} />;
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
    <button
      style={style}
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title: 'OsmAPP', url: shareUrl }).catch(() => {});
          return;
        }
        navigator.clipboard.writeText(shareUrl);
      }}
    >
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
        {buttons.map((props) => (
          <ShareButton key={props.label} {...props} />
        ))}
      </ButtonsWrapper>
    </ScrollWrapper>
  );
};
