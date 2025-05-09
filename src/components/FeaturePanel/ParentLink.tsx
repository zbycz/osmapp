import styled from '@emotion/styled';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getReactKey, getOsmappLink } from '../../services/helpers';
import { getHumanPoiType, getLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';
import { Chip, Stack, Typography } from '@mui/material';
import Router from 'next/router';

const ParentItem = styled.div`
  margin: 12px 0 4px 0;

  a:hover {
    text-decoration: none;
  }
`;

export const ParentButton = ({
  children,
  title,
  parentFeature,
  hasArrow = true,
}) => {
  const handleLink = (e, parentFeature) => {
    Router.push(getOsmappLink(parentFeature));
    e.preventDefault();
  };

  return (
    <Typography component="h2" variant="subtitle2" color="primary">
      <Chip
        size="small"
        label={children}
        icon={
          hasArrow ? (
            <ArrowBackIcon fontSize="inherit" color="inherit" />
          ) : undefined
        }
        onClick={(e) => handleLink(e, parentFeature)}
        href={getOsmappLink(parentFeature)}
        component="a"
        title={title}
      />
    </Typography>
  );
};
export const ParentLinkContent = () => {
  const { feature } = useFeatureContext();

  const hasMoreParents = feature.parentFeatures?.length > 1;

  return (
    <>
      {hasMoreParents ? (
        <Stack direction="row" spacing={0.5}>
          {feature.parentFeatures?.map((parentFeature, i) => {
            const poiType = getHumanPoiType(parentFeature);
            const title = `${poiType} ${getLabel(parentFeature)}`;

            return (
              <ParentButton
                key={getReactKey(parentFeature)}
                title={title}
                parentFeature={parentFeature}
                hasArrow={false}
              >
                {getLabel(parentFeature)}
              </ParentButton>
            );
          })}
        </Stack>
      ) : (
        feature.parentFeatures?.map((parentFeature) => {
          const poiType = getHumanPoiType(parentFeature);
          const title = `${poiType} ${getLabel(parentFeature)}`;

          return (
            <ParentButton
              key={getReactKey(parentFeature)}
              title={title}
              parentFeature={parentFeature}
            >
              {getLabel(parentFeature)}
            </ParentButton>
          );
        })
      )}
    </>
  );
};

export const ParentLink = () => {
  const { feature } = useFeatureContext();
  const hasParentLink = feature.parentFeatures?.length;

  if (!hasParentLink) return null;

  return (
    <ParentItem>
      <ParentLinkContent />
    </ParentItem>
  );
};
