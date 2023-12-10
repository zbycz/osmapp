import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { t } from '../../services/intl';
import { fetchJson } from '../../services/fetch';

const Spacer = styled.div`
  padding-bottom: 10px;
`;

const getData = async (center, osmId) => {
  if (center === undefined || !center.length) {
    return null;
  }
  const body = await fetchJson(
    `https://discover.openplaceguide.org/v2/discover?lat=${center[1]}&lon=${center[0]}&osmId=${osmId}`,
  );
  return body;
};

export const FeatureOpenPlaceGuideLink = ({ center, osmId }) => {
  const [instances, setInstances] = useState([]);

  useEffect(() => {
    getData(center, osmId).then(setInstances);
  }, [osmId]);

  if (instances.length === 0) {
    return null;
  }

  return (
    <>
      {instances.map((instance) => (
        <>
          <a href={instance.url}>
            {t('featurepanel.more_in_openplaceguide', {
              instanceName: instance.name,
            })}
          </a>
          <Spacer />
        </>
      ))}
    </>
  );
};
