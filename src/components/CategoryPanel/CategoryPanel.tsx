import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {
  PanelFooter,
  PanelScrollbars,
  PanelWrapper,
} from '../utils/PanelHelpers';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { presets } from '../../services/tagging/data';
import { getPresetTranslation } from '../../services/tagging/translations';

export const Content = styled.div`
  padding: 20px 2em 0 2em;

  a.maptiler {
    display: block;
    color: inherit;
    text-align: center;
    margin: 1em 0;

    strong {
      color: ${({ theme }) => theme.palette.link};
      font-weight: normal;
    }

    &:hover {
      text-decoration: none;

      & strong {
        text-decoration: underline;
      }
    }
  }
`;

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  return <ListItem button component="a" {...props} />; // eslint-disable-line react/jsx-props-no-spreading
}

export const CategoryPanel = () => {
  const router = useRouter();
  const { key } = router.query;
  const preset = presets[Array.isArray(key) ? key.join('/') : key];
  if (!preset) {
    return null;
  }

  const { presetKey, name } = preset;
  const heading = getPresetTranslation(presetKey) ?? name ?? presetKey;

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ClosePanelButton right onClick={() => {}} />
        <Content>
          <Typography variant="h5" gutterBottom>
            Hledání: {heading}
          </Typography>
        </Content>

        <List component="nav" aria-label="main mailbox folders">
          <ListItemLink href="/asdf">
            <ListItemIcon>AA</ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemLink>
        </List>

        <PanelFooter />
      </PanelScrollbars>
    </PanelWrapper>
  );
};
