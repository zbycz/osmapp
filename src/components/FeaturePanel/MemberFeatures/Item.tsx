import { Feature } from '../../../services/types';
import { useUserThemeContext } from '../../../helpers/theme';
import { useMobileMode } from '../../helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import Router from 'next/router';
import { getUrlOsmId } from '../../../services/helpers';
import Maki from '../../utils/Maki';
import { getLabel } from '../../../helpers/featureLabel';
import React from 'react';
import styled from '@emotion/styled';
import { PoiIcon } from '../../utils/PoiIcon';

const Li = styled.li`
  margin-left: 10px;
`;

export const Item = ({ feature }: { feature: Feature }) => {
  const { currentTheme } = useUserThemeContext();
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { properties, tags, osmMeta } = feature;
  const handleClick = (e) => {
    e.preventDefault();
    setPreview(null);
    Router.push(`/${getUrlOsmId(osmMeta)}${window.location.hash}`);
  };
  const handleHover = () => feature.center && setPreview(feature);

  return (
    <Li>
      <a
        href={`/${getUrlOsmId(osmMeta)}`}
        onClick={handleClick}
        onMouseEnter={mobileMode ? undefined : handleHover}
        onMouseLeave={() => setPreview(null)}
      >
        <PoiIcon
          tags={tags}
          ico={properties.class}
          title={`${Object.keys(tags).length} keys / ${
            properties.class ?? ''
          } / ${properties.subclass}`}
        />
        {getLabel(feature)}
      </a>
    </Li>
  );
};
