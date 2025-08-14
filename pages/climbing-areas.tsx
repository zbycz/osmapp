import { ClimbingAreasPanel } from '../src/components/ClimbingAreasPanel/ClimbingAreasPanel';
import { NextPage } from 'next';
import {
  ClimbingArea,
  getClimbingAreas,
} from '../src/services/climbing-areas/getClimbingAreas';

type Props = {
  climbingAreas: Array<ClimbingArea>;
};

const ClimbingAreasPage: NextPage<Props> = ({ climbingAreas }) => {
  return <ClimbingAreasPanel areas={climbingAreas} />;
};

ClimbingAreasPage.getInitialProps = async () => {
  const climbingAreas = await getClimbingAreas();

  return {
    climbingAreas,
  };
};

export default ClimbingAreasPage;
