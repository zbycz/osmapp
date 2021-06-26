import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import styled from 'styled-components';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { getIdEditorLink } from '../../../utils';

const StyledChevronRightIcon = styled(ChevronRightIcon)`
  margin: -2px 0px -2px -1px !important;
  font-size: 15px !important;
`;

const PencilIcon = styled(CreateIcon)`
  color: #555;
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const HomeIcon = styled(HelpIcon)`
  color: #555;
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const useIsBrowser = () => {
  // fixes hydration error - server and browser have different view (cookies and window.hash)
  // throwed "Warning: Prop `href` did not match."
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(true);
  }, []);
  return browser;
};

const EditLink = ({ closeMenu }) => {
  const browser = useIsBrowser();
  const { view } = useMapStateContext();
  const { feature } = useFeatureContext();
  const href = getIdEditorLink(feature, browser ? view : []);
  return (
    <MenuItem
      component="a"
      href={href}
      target="_blank"
      rel="noopener"
      onClick={closeMenu}
    >
      <PencilIcon />
      {t('map.edit_link')}
    </MenuItem>
  );
};

const AboutLink = ({ closeMenu }) => {
  const { persistShowHomepage, homepageShown } = useFeatureContext();
  const handleClick = () => {
    persistShowHomepage();
    closeMenu();
  };
  return (
    <MenuItem disabled={homepageShown} onClick={handleClick}>
      <HomeIcon />
      {t('map.about_link')}
    </MenuItem>
  );
};

// TODO maybe
//            <ListItemIcon>
//             <InboxIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText primary="Inbox" />

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const MoreMenu = () => {
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <Menu
        id="more-menu"
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
      >
        <EditLink closeMenu={close} />
        <AboutLink closeMenu={close} />
      </Menu>
      <button
        type="button"
        className="linkLikeButton"
        aria-controls="more-menu"
        aria-haspopup="true"
        onClick={open}
        ref={anchorRef}
        title={t('map.more_button_title')}
      >
        {t('map.more_button')}
        <StyledChevronRightIcon />
      </button>
    </>
  );
};
