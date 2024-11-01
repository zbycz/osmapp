import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Tab,
} from '@mui/material';
import React, { useState } from 'react';
import { t } from '../../../../services/intl';
import { useGetItems } from './useGetItems';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { PrimaryShareButtons } from './PrimaryShareButton';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { ShareIcon, supportsSharing } from './helpers';
import { ImageAttribution } from './ImageAttribution';

const StyledMenuItem = styled(ListItem)`
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

  color: inherit;
` as any;

type ShareTextItemProps = {
  label: string | null;
  payload: string;
  isUrl?: boolean;
};

const ShareTextItem = ({ label, payload, isUrl }: ShareTextItemProps) => {
  return (
    <ListItem style={{ padding: 0 }}>
      <ListItemButton
        onClick={() => {
          if (supportsSharing()) {
            navigator
              .share({
                title: label,
                ...(isUrl ? { url: payload } : { text: payload }),
              })
              .catch(() => {});
            return;
          }
          navigator.clipboard.writeText(payload);
        }}
      >
        {label ?? payload}
      </ListItemButton>
    </ListItem>
  );
};

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
  const { primaryItems, items, shareItems } = useGetItems(
    roundedCenter ?? center,
  );
  const [focusedTab, setFocusedTab] = useState<'link' | 'share'>(
    supportsSharing() ? 'share' : 'link',
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{t('featurepanel.share_button')}</DialogTitle>
      <DialogContent>
        <PrimaryShareButtons buttons={primaryItems} />
        <Divider />

        <TabContext value={focusedTab}>
          <TabList
            onChange={(_, newValue) => setFocusedTab(newValue)}
            variant="fullWidth"
          >
            <Tab
              value="share"
              label={
                supportsSharing()
                  ? t('sharedialog.share_tab')
                  : t('sharedialog.copy_tab')
              }
              iconPosition="start"
              icon={supportsSharing() ? <ShareIcon /> : <ContentCopy />}
            />
            <Tab
              value="link"
              label={t('sharedialog.openin_tab')}
              icon={<OpenInNew />}
              iconPosition="start"
            />
          </TabList>
          <TabPanel value="link" style={{ padding: 0 }}>
            <List>
              {items.map(({ label, href }) => (
                <LinkItem key={label} href={href} label={label} />
              ))}
            </List>
          </TabPanel>
          <TabPanel value="share" style={{ padding: 0 }}>
            <List>
              {items.map(({ label, href }) => (
                <ShareTextItem key={label} isUrl label={label} payload={href} />
              ))}
              <Divider />
              {shareItems.map((payload) => (
                <ShareTextItem
                  key={payload}
                  label={payload.replace(/^https:\/\//, '')}
                  payload={payload}
                />
              ))}
            </List>
          </TabPanel>
        </TabContext>
        <Divider />
        <ImageAttribution />
      </DialogContent>
    </Dialog>
  );
};
