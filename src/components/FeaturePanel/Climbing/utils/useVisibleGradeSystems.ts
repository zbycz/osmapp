import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import { GRADE_SYSTEMS } from '../../../../services/tagging/climbing';

export const useGradeSystemsStatus = () => {
  const { userSettings } = useUserSettingsContext();
  return (
    userSettings['climbing.visibleGradeSystems'] ??
    GRADE_SYSTEMS.reduce(
      (acc, { key }) => ({ ...acc, [key]: true }),
      {} as Record<string, boolean>,
    )
  );
};

export const useVisibleGradeSystems = () => {
  const gradeSystemsStatus = useGradeSystemsStatus();

  return Object.keys(gradeSystemsStatus).filter(
    (key) =>
      gradeSystemsStatus[key] && GRADE_SYSTEMS.some((gs) => gs.key === key),
  );
};
