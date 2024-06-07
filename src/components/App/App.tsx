import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import styled from 'styled-components';
import nextCookies from 'next-cookies';
import Router, { useRouter } from 'next/router';
import {
  // useMediaQuery,
  SwipeableDrawer,
  useTheme,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { FeaturePanel } from '../FeaturePanel/FeaturePanel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapView, getInitialFeature } from './helpers';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';
import { FeatureProvider, useFeatureContext } from '../utils/FeatureContext';
import { OsmAuthProvider } from '../utils/OsmAuthContext';
// import { FeaturePreview } from '../FeaturePreview/FeaturePreview';
import { TitleAndMetaTags } from '../../helpers/TitleAndMetaTags';
import { InstallDialog } from '../HomepagePanel/InstallDialog';
import { setIntlForSSR } from '../../services/intl';
import { EditDialogProvider } from '../FeaturePanel/helpers/EditDialogContext';
import { ClimbingDialog } from '../FeaturePanel/Climbing/ClimbingDialog';
import { ClimbingContextProvider } from '../FeaturePanel/Climbing/contexts/ClimbingContext';
import { StarsProvider } from '../utils/StarsContext';
import { SnackbarProvider } from '../utils/SnackbarContext';
// import { isDesktop } from '../helpers';
// import { PanelWrapper } from '../utils/PanelHelpers';
// import { ClosePanelButton } from '../utils/ClosePanelButton';
import { getOsmappLink } from '../../services/helpers';

// const drawerBleeding = 72;
const Puller = styled.div`
  width: 30px;
  height: 6px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light' ? grey[300] : grey[900]};
  border-radius: 3px;
  position: absolute;
  top: 8px;
  left: calc(50% - 15px);
`;

const ListContainer = styled('div')(() => ({
  maxHeight: '90vh',
  overflow: 'auto',
}));

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/'), { expires: 7, path: '/' }); // TODO find optimal expiration
  }, [view]);
};

export const getMapViewFromHash = () => {
  const view = global.window?.location.hash
    .substr(1)
    .split('/')
    .map(parseFloat)
    .map((num) => num.toString());
  return view?.length === 3 ? view : undefined;
};

const useUpdateViewFromFeature = () => {
  const { feature } = useFeatureContext();
  const { setView } = useMapStateContext();

  React.useEffect(() => {
    if (feature?.center && !getMapViewFromHash()) {
      const [lon, lat] = feature.center.map((deg) => deg.toFixed(4));
      setView(['17.00', lat, lon]);
    }
  }, [feature]);
};

const useUpdateViewFromHash = () => {
  const { setView } = useMapStateContext();
  useEffect(() => {
    Router.beforePopState(() => {
      const mapViewFromHash = getMapViewFromHash();
      if (mapViewFromHash) {
        setView(mapViewFromHash);
      }
      return true; // let nextjs handle the route change as well
    });
  }, []);
};

const IndexWithProviders = () => {
  const { feature, featureShown, preview } = useFeatureContext();
  const router = useRouter();
  useUpdateViewFromFeature();
  usePersistMapView();
  useUpdateViewFromHash();

  // TODO add correct error boundaries

  const isClimbingDialogShown = router.query.all?.[2] === 'climbing';
  const photo = router.query.all?.[3];
  // const panelFromLeft = useMediaQuery(isDesktop);
  const [open, setOpen] = React.useState(false);
  const { setFeature } = useFeatureContext();
  const theme = useTheme();
  // const container =
  //   window !== undefined ? () => window.document.body : undefined;

  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen);
  // };

  useEffect(() => {
    if (preview) {
      Router.push(`${getOsmappLink(preview)}${window.location.hash}`);
      setFeature({ ...preview, skeleton: true }); // skeleton needed so map doesnt move (Router will create new coordsFeature)
    }
  }, [preview]);

  // console.log('____featureShown', featureShown);
  return (
    <div style={{ height: '100%' }}>
      <SearchBox />
      <Loading />
      {/* <SwipeableDrawer
        // container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div
          style={{
            position: 'relative',
            marginTop: `${-drawerBleeding}px`,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <ListContainer>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32. Contrary to popular
            belief, Lorem Ipsum is not simply random text. It has roots in a
            piece of classical Latin literature from 45 BC, making it over 2000
            years old. Richard McClintock, a Latin professor at Hampden-Sydney
            College in Virginia, looked up one of the more obscure Latin words,
            consectetur, from a Lorem Ipsum passage, and going through the cites
            of the word in classical literature, discovered the undoubtable
            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
            Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
            Cicero, written in 45 BC. This book is a treatise on the theory of
            ethics, very popular during the Renaissance. The first line of Lorem
            Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
            1.10.32. Contrary to popular belief, Lorem Ipsum is not simply
            random text. It has roots in a piece of classical Latin literature
            from 45 BC, making it over 2000 years old. Richard McClintock, a
            Latin professor at Hampden-Sydney College in Virginia, looked up one
            of the more obscure Latin words, consectetur, from a Lorem Ipsum
            passage, and going through the cites of the word in classical
            literature, discovered the undoubtable source. Lorem Ipsum comes
            from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
            (The Extremes of Good and Evil) by Cicero, written in 45 BC. This
            book is a treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32. Contrary to popular
            belief, Lorem Ipsum is not simply random text. It has roots in a
            piece of classical Latin literature from 45 BC, making it over 2000
            years old. Richard McClintock, a Latin professor at Hampden-Sydney
            College in Virginia, looked up one of the more obscure Latin words,
            consectetur, from a Lorem Ipsum passage, and going through the cites
            of the word in classical literature, discovered the undoubtable
            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
            Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
            Cicero, written in 45 BC. This book is a treatise on the theory of
            ethics, very popular during the Renaissance. The first line of Lorem
            Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
            1.10.32. Contrary to popular belief, Lorem Ipsum is not simply
            random text. It has roots in a piece of classical Latin literature
            from 45 BC, making it over 2000 years old. Richard McClintock, a
            Latin professor at Hampden-Sydney College in Virginia, looked up one
            of the more obscure Latin words, consectetur, from a Lorem Ipsum
            passage, and going through the cites of the word in classical
            literature, discovered the undoubtable source. Lorem Ipsum comes
            from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
            (The Extremes of Good and Evil) by Cicero, written in 45 BC. This
            book is a treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32.
          </ListContainer>
        </div>
      </SwipeableDrawer> */}

      {featureShown && (
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => {
            console.log('____TU2');
            // Router.push(`${getOsmappLink(preview)}${window.location.hash}`);
            setOpen(true);
          }}
          swipeAreaWidth={72}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div
            style={{
              position: 'relative',
              background: theme.palette.background.paper,
              marginTop: `-72px`,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            <ListContainer>{preview && <FeaturePanel />}</ListContainer>
          </div>
        </SwipeableDrawer>
      )}
      {/* {featureShown && (
        <SwipeableDrawer
          anchor={panelFromLeft ? 'left' : 'bottom'}
          open={open}
          onClose={toggleDrawer}
          onOpen={() => {}}
          variant="persistent"
          // disableBackdropTransition
          // BackdropProps={{ invisible: true, open: false }}
          // disableSwipeToOpen
          // hideBackdrop
          ModalProps={{
            keepMounted: true,
          }}
          swipeAreaWidth={53}
          disableSwipeToOpen={false}
          // ModalProps={{
          //   hideBackdrop: true,
          // }}
        >
          <div
            data-testid="ASDFG"
            style={{
              position: 'absolute',
              background: 'red',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
              height: 200,
              bottom: 0,
              top: -100,
              zIndex: 10000,
            }}
          >
            <PanelWrapper fromLeft={panelFromLeft}>
              {featureShown && <FeaturePanel />}
              <ClosePanelButton right onClick={toggleDrawer} />
            </PanelWrapper>
          </div>
        </SwipeableDrawer>
      )} */}

      {isClimbingDialogShown && (
        <ClimbingContextProvider feature={feature}>
          <ClimbingDialog photo={photo} />
        </ClimbingContextProvider>
      )}

      <HomepagePanel />
      {router.pathname === '/install' && <InstallDialog />}
      <Map />
      {/* {preview && <FeaturePreview />} */}
      <TitleAndMetaTags />
    </div>
  );
};

const App = ({ featureFromRouter, initialMapView, cookies }) => {
  const mapView = getMapViewFromHash() || initialMapView;
  return (
    <SnackbarProvider>
      <FeatureProvider featureFromRouter={featureFromRouter} cookies={cookies}>
        <MapStateProvider initialMapView={mapView}>
          <OsmAuthProvider cookies={cookies}>
            <StarsProvider>
              <EditDialogProvider /* TODO supply router.query */>
                <IndexWithProviders />
              </EditDialogProvider>
            </StarsProvider>
          </OsmAuthProvider>
        </MapStateProvider>
      </FeatureProvider>
    </SnackbarProvider>
  );
};
App.getInitialProps = async (ctx) => {
  await setIntlForSSR(ctx); // needed for lang urls like /es/node/123

  const cookies = nextCookies(ctx);
  const featureFromRouter = await getInitialFeature(ctx);
  const initialMapView = await getInitialMapView(ctx);
  return { featureFromRouter, initialMapView, cookies };
};

export default App;
