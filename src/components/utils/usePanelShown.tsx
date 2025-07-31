import { useFeatureContext } from './FeatureContext';
import { useRouter } from 'next/router';

export const usePanelShown = () => {
  const { featureShown, homepageShown } = useFeatureContext();
  const router = useRouter();
  if (router.asPath.startsWith('/directions')) {
    return null;
  }

  const otherPageShown = router.pathname !== '/'; // TODO there was a bug in nextjs which sometimes gave some nonsense pathname like `?nxtPall` – CHECK!

  return router.pathname.match(/^\/(node|way|relation)\//)
    ? featureShown
    : // homepageShown => url '/'
      // featureShown => url '/xxx/123', but skeleton can be shown earlier
      // any other panel => url other than root
      homepageShown || featureShown || otherPageShown;
};
