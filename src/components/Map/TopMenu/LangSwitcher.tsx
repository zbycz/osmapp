import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import LanguageIcon from '@mui/icons-material/Language';
import styled from '@emotion/styled';
import { useBoolState } from '../../helpers';
import { changeLang, intl, t } from '../../../services/intl';
import { LANGUAGES } from '../../../config';

const StyledLanguageIcon = styled(LanguageIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

export const LangSwitcher = () => {
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
        {Object.entries(LANGUAGES).map(([lang, name]) => (
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
        {LANGUAGES[intl.lang]}
      </MenuItem>
    </>
  );
};
