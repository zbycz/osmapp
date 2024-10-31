import { Divider, Menu, MenuItem } from '@mui/material';
import { QuickActionButton } from './QuickActionButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import React from 'react';
import { getFullOsmappLink, getShortLink } from '../../../services/helpers';
import { useBoolState } from '../../helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { t } from '../../../services/intl';
import styled from '@emotion/styled';
import { useGetItems } from './useGetItems';
import { positionToDeg, positionToDM } from '../../../utils';

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
` as unknown as any; // <Menu> expects "li", but it as "a"

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

export const ShareButton = () => {
  const [opened, open, close] = useBoolState(false);
  const anchorRef = React.useRef<HTMLButtonElement>();
  const { feature } = useFeatureContext();
  const { center, roundedCenter = undefined } = feature;

  const items = useGetItems(roundedCenter ?? center);

  return (
    <>
      <QuickActionButton
        label={t('featurepanel.share_button')}
        icon={ShareIcon}
        onClick={open}
        ref={anchorRef}
      />
      <Menu
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
        disableAutoFocusItem
      >
        {items.map(({ label, href }) => (
          <LinkItem key={label} href={href} label={label} />
        ))}
        <Divider />
        <CopyTextItem text={positionToDeg(roundedCenter ?? center)} />
        <CopyTextItem text={positionToDM(roundedCenter ?? center)} />
        <CopyTextItem text={getFullOsmappLink(feature)} />
        <CopyTextItem text={getShortLink(feature)} />
      </Menu>
    </>
  );
};
