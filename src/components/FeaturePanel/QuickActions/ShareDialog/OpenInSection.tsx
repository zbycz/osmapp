import { Typography } from '@mui/material';
import { useGetItems } from './useGetItems';
import OpenInNew from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';
import { t } from '../../../../services/intl';
import React from 'react';

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledLi = styled.li`
  line-height: 35px;
  padding-bottom: 5px;

  svg {
    font-size: 10px;
    color: #bbb;
    position: relative;
    top: -4px;
    left: 5px;
  }

  img {
    max-width: 35px;
    max-height: 35px;
    vertical-align: middle;
  }
`;

type LinkItemProps = {
  href: string;
  label: string;
  image?: string;
};

const ImageWrapper = styled.div`
  display: inline-block;
  margin-right: 11px;
  width: 35px;
  text-align: center;
  vertical-align: middle;
`;

const Image = ({ image, label }: { image: string; label: string }) => (
  <ImageWrapper>
    <img src={image} alt={`Logo of ${label}`} />
  </ImageWrapper>
);

const LinkItem = ({ href, label, image }: LinkItemProps) => (
  <StyledLi>
    <a href={href} target="_blank">
      {image && <Image image={image} label={label} />}
      {label}
      <OpenInNew />
    </a>
  </StyledLi>
);

export const OpenInSection = () => {
  const { items } = useGetItems();

  return (
    <section>
      <Typography variant="overline">{t('sharedialog.openin')}</Typography>
      <StyledUl>
        {items.map(({ label, href, image }) => (
          <LinkItem key={label} href={href} label={label} image={image} />
        ))}
      </StyledUl>
    </section>
  );
};
