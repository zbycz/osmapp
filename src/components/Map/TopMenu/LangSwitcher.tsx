import getConfig from 'next/config';
import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useRouter } from 'next/router';
import LanguageIcon from '@material-ui/icons/Language';
import styled from 'styled-components';
import { useBoolState } from '../../helpers';
import { changeLang, intl, t } from '../../../services/intl';

const StyledLanguageIcon = styled(LanguageIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

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
      <MenuItem
        aria-controls="language-switcher"
        aria-haspopup="true"
        onClick={open}
        ref={anchorRef}
        title={t('map.language_title')}
      >
        <StyledLanguageIcon />
        {languages[intl.lang]}
      </MenuItem>
    </>
  );
};
