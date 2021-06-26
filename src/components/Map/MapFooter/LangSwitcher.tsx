import getConfig from 'next/config';
import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useBoolState } from '../../helpers';
import { changeLang, intl, t } from '../../../services/intl';

export const LangSwitcher = () => {
  const {
    publicRuntimeConfig: { languages },
  } = getConfig();
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);

  const setLang = (k) => {
    changeLang(k);
    close();
  };

  // TODO make a link and allow google to index all langs
  return (
    <>
      <Menu
        id="language-switcher"
        keepMounted
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
      >
        {Object.entries(languages).map(([k, name]) => (
          <MenuItem key={k} onClick={() => setLang(k)}>
            {name}
          </MenuItem>
        ))}
      </Menu>
      <button
        type="button"
        className="linkLikeButton"
        aria-controls="language-switcher"
        aria-haspopup="true"
        onClick={open}
        ref={anchorRef}
        title={t('map.language_title')}
      >
        {languages[intl.lang]}
      </button>
    </>
  );
};
