import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Tab,
} from '@mui/material';
import React, { useState } from 'react';
import { t } from '../../../services/intl';
import { useGetItems } from './useGetItems';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';
import { useFeatureContext } from '../../utils/FeatureContext';
import { PrimaryShareButtons } from './PrimaryShareButton';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const supportsSharing = () =>
  typeof navigator !== 'undefined' && !!navigator.share;

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

const ImageAttribution = () => {
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;
  const { imageAttributions } = useGetItems(roundedCenter ?? center);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <h4>Image attribution</h4>
        <IconButton onClick={() => setExpanded((x) => !x)} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>
      {expanded && (
        <ul>
          {imageAttributions.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

type Props = {
  open: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

export const ShareDialog = ({ open, onClose }: Props) => {
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;
  const { primaryItems, items, shareItems, imageAttributions } = useGetItems(
    roundedCenter ?? center,
  );
  const [focusedTab, setFocusedTab] = useState<'link' | 'share'>('link');

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
            <Tab value="link" label="Links" />
            <Tab value="share" label={supportsSharing() ? 'Share' : 'Copy'} />
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
