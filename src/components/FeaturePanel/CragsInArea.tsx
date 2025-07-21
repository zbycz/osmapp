import styled from '@emotion/styled';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import Router from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFeatureContext } from '../utils/FeatureContext';
import {
  getOsmappLink,
  getReactKey,
  getUrlOsmId,
} from '../../services/helpers';
import { Feature, isInstant } from '../../services/types';
import { useMobileMode } from '../helpers';
import { getHumanPoiType, getLabel } from '../../helpers/featureLabel';

import { Slider, Wrapper } from './FeatureImages/FeatureImages';
import { Image } from './FeatureImages/Image/Image';
import { getInstantImage } from '../../services/images/getImageDefs';
import { intl, t } from '../../services/intl';
import Link from 'next/link';
import { naturalSort } from './Climbing/utils/array';
import { PanelLabel } from './Climbing/PanelLabel';
import { PROJECT_ID } from '../../services/project';
import { getClickHandler } from './FeatureImages/Image/helpers';
import { MemberItem } from './MemberFeatures/MemberItem';
import { RouteDistribution } from './Climbing/RouteDistribution';
import {
  CragsInAreaSort,
  useCragsInAreaSort,
} from './Climbing/CragsInAreaSort';
import {
  CragsInAreaFilter,
  filterCrag,
  useCragsInAreaFilter,
} from './Climbing/CragsInAreaFilter';
import { useUserSettingsContext } from '../utils/UserSettingsContext';

const isOpenClimbing = PROJECT_ID === 'openclimbing';

const Ul = styled.ul`
  padding: 0;
  list-style: none;
`;

const ArrowIcon = styled(ArrowForwardIosIcon)`
  opacity: 0.2;
  margin-left: 12px;
`;

const Container = styled.div`
  margin: 0 0 20px 0;
`;

const InnerContainer = styled.div`
  overflow: auto;
  flex-direction: column;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;

const CragListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
`;

const CragName = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none !important;
  &:hover h3 {
    text-decoration: underline;
  }
`;

const Header = ({
  label,
  routesCount,
}: {
  label: string;
  routesCount: number;
}) => (
  <Box ml={2} mr={2}>
    <CragName>
      <Typography
        component="h3"
        overflow="hidden"
        textOverflow="ellipsis"
        fontFamily={isOpenClimbing ? "'Piazzolla', sans-serif" : undefined}
        fontWeight={900}
        fontSize={32}
        lineHeight={1.2}
        color="primary"
      >
        {label}
      </Typography>
      {routesCount && (
        <Chip
          size="small"
          variant="outlined"
          label={
            <>
              <strong>{routesCount}</strong> {t('featurepanel.routes')}
            </>
          }
          sx={{ position: 'relative', top: 2, fontWeight: 'normal' }}
        />
      )}
    </CragName>{' '}
  </Box>
);

const AreaInfo = ({ crags, numberOfRoutes, feature }) => {
  return (
    <PanelLabel
      addition={
        <Chip
          size="small"
          variant="outlined"
          label={
            <>
              <strong>{crags.length}</strong> {t('featurepanel.sectors')},{' '}
              <strong>{numberOfRoutes}</strong> {t('featurepanel.routes')}
            </>
          }
          sx={{ position: 'relative', top: 2, fontWeight: 'normal' }}
        />
      }
    >
      {t('featurepanel.climbing_sectors')}{' '}
      {feature.tags.name
        ? `${t('featurepanel.climbing_sectors_in')} ${feature.tags.name}`
        : ''}
    </PanelLabel>
  );
};

const Gallery = ({ images, feature }) => {
  const poiType = getHumanPoiType(feature);
  const alt = `${poiType} ${getLabel(feature)}`;

  return (
    <Wrapper>
      <Slider>
        {naturalSort(images, (item) => item.def.k).map((item, index) => (
          <Image
            key={item.image.imageUrl}
            def={item.def}
            image={item.image}
            alt={`${alt} ${index + 1}`}
            onClick={getClickHandler(feature, item.def)}
          />
        ))}
      </Slider>
    </Wrapper>
  );
};

const CragList = ({ crags, other }) => {
  return (
    <Box mt={2} mb={4}>
      <CragListContainer>
        {crags.map((item) => (
          <CragItem key={getOsmappLink(item)} feature={item} />
        ))}
      </CragListContainer>

      {other.length > 0 && (
        <Ul>
          {other.map((item) => (
            <MemberItem key={getReactKey(item)} feature={item} />
          ))}
        </Ul>
      )}
    </Box>
  );
};
const CragItem = ({ feature }: { feature: Feature }) => {
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const handleHover = () => feature.center && setPreview(feature);

  const images =
    feature?.imageDefs?.filter(isInstant)?.map((def) => ({
      def,
      image: getInstantImage(def),
    })) ?? [];

  const getOnClickWithHash = (e) => {
    e.preventDefault();
    Router.push(`/${getUrlOsmId(feature.osmMeta)}${window.location.hash}`);
  };

  return (
    <Container>
      <StyledLink
        href={`/${getUrlOsmId(feature.osmMeta)}`}
        locale={intl.lang}
        onClick={getOnClickWithHash}
        onMouseEnter={mobileMode ? undefined : handleHover}
        onMouseLeave={() => setPreview(null)}
        title={`${t('featurepanel.sector')} ${getLabel(feature)}`}
      >
        <InnerContainer>
          <Header
            label={getLabel(feature)}
            routesCount={feature.members?.length}
          />
          {images.length ? <Gallery feature={feature} images={images} /> : null}
        </InnerContainer>
      </StyledLink>
      {feature.memberFeatures.length > 0 && (
        <Box mb={2}>
          <RouteDistribution features={feature.memberFeatures} />
        </Box>
      )}
    </Container>
  );
};

export const CragsInArea = () => {
  const { feature } = useFeatureContext();
  const { sortByFn, sortBy, setSortBy } = useCragsInAreaSort();
  const {
    gradeInterval,
    setGradeInterval,
    minimumRoutesInInterval,
    setMinimumRoutesInInterval,
    uniqueValues,
    setIsTouched,
    isTouched,
  } = useCragsInAreaFilter();
  const isMobileMode = useMobileMode();
  const [isPopperOpen, setIsPopperOpen] = React.useState(false);
  const { userSettings } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  if (!feature.memberFeatures?.length || feature.tags.climbing !== 'area') {
    return null;
  }

  const crags = feature.memberFeatures
    .filter(({ tags }) => tags.climbing)
    .filter(
      filterCrag({
        gradeInterval,
        currentGradeSystem,
        uniqueValues,
        minimumRoutesInInterval,
        isTouched,
      }),
    )
    .sort((item1, item2) => sortByFn(sortBy)(item1, item2));

  const other = feature.memberFeatures.filter(({ tags }) => !tags.climbing);

  const numberOfRoutes = crags.reduce((acc, { members }) => {
    return acc + (members?.length ?? 0);
  }, 0);

  const allCragRoutes = crags.reduce((acc, crag) => {
    return [...acc, ...crag.memberFeatures];
  }, []);

  return (
    <>
      <Paper
        elevation={0}
        square
        sx={{
          position: isMobileMode ? 'static' : 'sticky',
          top: 0,
          zIndex: 1,
          opacity: 0.9,
        }}
      >
        <Stack direction="row" spacing={0.5} justifyContent="flex-end" m={1}>
          <CragsInAreaSort setSortBy={setSortBy} sortBy={sortBy} />
          <CragsInAreaFilter
            uniqueValues={uniqueValues}
            gradeInterval={gradeInterval}
            setGradeInterval={setGradeInterval}
            minimumRoutesInInterval={minimumRoutesInInterval}
            setMinimumRoutesInInterval={setMinimumRoutesInInterval}
            setIsTouched={setIsTouched}
            isTouched={isTouched}
          />
        </Stack>
      </Paper>
      {crags.length > 1 && <RouteDistribution features={allCragRoutes} />}

      <AreaInfo
        crags={crags}
        numberOfRoutes={numberOfRoutes}
        feature={feature}
      />

      <CragList crags={crags} other={other} />
    </>
  );
};
