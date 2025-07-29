import React, { LegacyRef, useRef } from 'react';
import styled from '@emotion/styled';
import { Scrollbars } from 'react-custom-scrollbars';
import { useTheme } from '@mui/material';
import { isDesktop, isMobileMode, useMobileMode } from '../helpers';
import { useScrollShadow } from '../FeaturePanel/Climbing/utils/useScrollShadow';
import { SEARCH_BOX_HEIGHT } from '../SearchBox/consts';

// custom scrollbar
// better: https://github.com/rommguy/react-custom-scroll
// maybe https://github.com/malte-wessel/react-custom-scrollbars (larger)
const EffectiveHeight = styled.main`
  height: calc(100% - calc(${SEARCH_BOX_HEIGHT}px + var(--safe-top)));
  padding-left: var(--safe-left);
`;

const SearchBoxBackground = styled.div`
  height: calc(${SEARCH_BOX_HEIGHT}px + var(--safe-top));
  background-color: ${({ theme }) => theme.palette.background.searchBox};
  position: relative;
  z-index: 1;
`;
const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  overflow: hidden;
  z-index: 1100;

  width: 100%;
  @media ${isDesktop} {
    width: calc(410px + var(--safe-left));
  }

  & > div > div {
    // disable pulling panel around on mobile
    // second div due to implementation of react-custom-scrollbars
    overscroll-behavior: none;
    overscroll-behavior-y: auto;
  }
`;

export const PanelWrapper = ({ children }) => (
  <Container>
    <SearchBoxBackground />
    <EffectiveHeight>{children}</EffectiveHeight>
  </Container>
);

type PanelScrollbarsProps = {
  children: React.ReactNode;
  scrollRef?: LegacyRef<Scrollbars>;
};

const MobileScrollbars = styled.div`
  height: 100%;
  overflow: auto;
`;

export const PanelScrollbars = ({
  children,
  scrollRef,
}: PanelScrollbarsProps) => {
  const isMobileMode = useMobileMode();
  const newRef = useRef<Scrollbars>(null);
  const ref = scrollRef || newRef;
  const theme = useTheme();

  // @TODO refresh on panel height first update

  const {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowTop,
    ShadowBottom,
  } = useScrollShadow(undefined, ref);

  return (
    <ShadowContainer>
      <ShadowTop backgroundColor={theme.palette.background.paper} />
      {isMobileMode ? (
        <MobileScrollbars onScroll={onScroll} ref={scrollElementRef}>
          {children}
        </MobileScrollbars>
      ) : (
        <Scrollbars
          universal
          autoHide
          style={{ height: '100%' }}
          onScroll={onScroll}
          ref={scrollElementRef}
        >
          {children}
        </Scrollbars>
      )}

      <ShadowBottom backgroundColor={theme.palette.background.paper} />
    </ShadowContainer>
  );
};

export const PanelContent = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const PanelFooterWrapper = styled.footer`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-top: auto;
  font-size: 1rem;
  line-height: 1.5;
`;

export const PanelSidePadding = styled.div`
  padding: 0 16px;
`;
