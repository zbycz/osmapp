import React from 'react';

import styled from 'styled-components';

import { Tooltip } from '@mui/material';
import { getFeatureImage, LOADING } from '../../../services/images';
import { Feature } from '../../../services/types';
import { InlineSpinner } from '../ImagePane/InlineSpinner';
import { t } from '../../../services/intl';
import { nl2br } from '../../utils/nl2br';
import { Photo } from './Photo';

const Wrapper = styled.div`
  position: relative;
  background: #ddd;
  height: 238px;
  min-height: 238px; /* otherwise it shrinks b/c of flex*/
`;

const IconWrapper = styled.div`
  padding-top: 40px;
  text-align: center;
  svg,
  img {
    width: 100px;
    height: 100px;
    color: #eee;
  }
  img {
    opacity: 0.15;
  }
`;

const AttributionLink = styled.a<{ $portrait: boolean }>`
  position: absolute;
  right: 1px;
  top: 1px;
  text-align: right;
  padding-right: 3px;
  font-size: 80%;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 1);
  color: #fff;
  text-decoration: none;
  opacity: ${({ $portrait }) => ($portrait ? 1 : 0.8)};

  &:hover {
    opacity: 1;
    text-shadow: 1px 1px 10px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1);
  }
`;

interface Props {
  feature: Feature;
  ico: string;
}

export const FeatureImage = ({ feature, ico }: Props) => {
  const [image, setImage] = React.useState(feature.ssrFeatureImage ?? LOADING);

  React.useEffect(() => {
    if (feature.ssrFeatureImage) return;

    setImage(LOADING);
    getFeatureImage(feature).then(
      (newImage) => {
        setImage(newImage); // TODO Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
      },
      (e) => {
        console.warn('getFeatureImage rejected: ', e); // eslint-disable-line no-console
        setImage(undefined);
      },
    );
  }, [feature]);

  const { source, link, username, portrait, isPano } = image ?? {};
  const uncertainImage = source === 'Mapillary' && !isPano;
  const uncertainTitle = uncertainImage
    ? `\n${t('featurepanel.uncertain_image')}`
    : '';
  const attribution = `${source}${username ? ` / ${username}` : ''}`;

  return (
    <Wrapper>
      {image && image !== LOADING && (
        <Photo image={image} isCertain={!uncertainImage} />
      )}
      {(image === undefined || image === LOADING) && (
        <IconWrapper>
          <img src={`/icons/${ico}_11.svg`} alt={ico} title={ico} />
        </IconWrapper>
      )}
      {source && (
        <Tooltip title={nl2br(`© ${attribution}${uncertainTitle}`)} arrow>
          <AttributionLink
            href={link}
            target="_blank"
            rel="noopener"
            $portrait={portrait}
          >
            {attribution}
          </AttributionLink>
        </Tooltip>
      )}
      {!feature.skeleton && image === LOADING && <InlineSpinner />}
    </Wrapper>
  );
};
