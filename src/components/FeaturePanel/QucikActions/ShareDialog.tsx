import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  MenuItem,
} from '@mui/material';
import React from 'react';
import { getFullOsmappLink, getShortLink } from '../../../services/helpers';
import { t } from '../../../services/intl';
import { useGetItems } from './useGetItems';
import { positionToDeg, positionToDM } from '../../../utils';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';
import { useFeatureContext } from '../../utils/FeatureContext';
import { PrimaryShareButtons } from './PrimaryShareButton';

const StyledMenuItem = styled(MenuItem)`
  svg {
    font-size: 12px;
    color: #bbb;
    margin: -7px 0 0 5px;
  }

  &:focus {
    text-decoration: none;
    svg {
      outline: 0;
    }
  }
` as any;

const CopyTextItem = ({ text }: { text: string | null }) =>
  text === null ? null : (
    <MenuItem onClick={() => navigator.clipboard.writeText(text)}>
      {t('coordinates.copy_value', {
        value: text.replace(/^https:\/\//, ''),
      })}
    </MenuItem>
  );

const LinkItem = ({ href, label }) => (
  <StyledMenuItem component="a" href={href} target="_blank">
    {label} <OpenInNewIcon />
  </StyledMenuItem>
);

type Props = {
  open: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

export const ShareDialog = ({ open, onClose }: Props) => {
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;
  const { primaryItems, items } = useGetItems(roundedCenter ?? center);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{t('featurepanel.share_button')}</DialogTitle>
      <DialogContent>
        <PrimaryShareButtons buttons={primaryItems} />
        <Divider />
        <List>
          {items.map(({ label, href }) => (
            <LinkItem key={label} href={href} label={label} />
          ))}
          <Divider />
          <CopyTextItem text={positionToDeg(roundedCenter ?? center)} />
          <CopyTextItem text={positionToDM(roundedCenter ?? center)} />
          <CopyTextItem text={getFullOsmappLink(feature)} />
          <CopyTextItem text={getShortLink(feature)} />
        </List>
      </DialogContent>
    </Dialog>
  );
};
