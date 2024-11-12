import React from 'react';
import styled from '@emotion/styled';
import { Button, Tooltip, IconButton } from '@mui/material';
import { ShareIcon, supportsSharing } from './helpers';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { t } from '../../../../services/intl';

const StyledButton = styled(Button)`
  color: inherit;
  padding: 0 8px;
`;

type Props = {
  payload: string;
  type: 'url' | 'text';
};

export const ActionButtons = ({ payload, type }: Props) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2_000);
  };

  const handleShare = () => {
    navigator
      .share({
        [type]: payload,
      })
      .catch(() => {});
  };
  return (
    <div>
      <StyledButton
        startIcon={<ContentCopy fontSize="small" />}
        onClick={handleCopy}
      >
        {copied ? t('sharedialog.copied') : t('sharedialog.copy')}
      </StyledButton>
      {supportsSharing() && (
        <Tooltip title={t('sharedialog.share')}>
          <IconButton onClick={handleShare} size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};
