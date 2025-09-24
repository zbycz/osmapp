import {
  DEFAULT_GRADE_SYSTEM,
  GRADE_SYSTEMS,
  GradeSystem,
} from '../../../services/tagging/climbing/gradeSystems';
import { UserSettingsType } from './UserSettingsContext';

export const getGradeSystem = (userSettings: UserSettingsType): GradeSystem => {
  const user = userSettings['climbing.gradeSystem'];
  if (GRADE_SYSTEMS.some((system) => system.key === user)) {
    return user;
  }
  return DEFAULT_GRADE_SYSTEM;
};
