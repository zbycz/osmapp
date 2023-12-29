import getConfig from 'next/config';
import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useBoolState } from '../../helpers';
import { changeLang, intl, t } from '../../../services/intl';

export const LangSwitcher = () => {
  const {
    publicRuntimeConfig: { languages },
  } = getConfig();
  const { asPath } = useRouter();
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);

  const getLangSetter = (lang) => (e) => {
    e.preventDefault();
    changeLang(lang);
    close();
  };

  return (
    <>
      <Menu
        id="language-switcher"
        keepMounted
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
      >
        {Object.entries(languages).map(([lang, name]) => (
          <MenuItem
            key={lang}
            component="a"
            href={`/${lang}${asPath}`}
            onClick={getLangSetter(lang)}
          >
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
