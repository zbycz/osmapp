import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { RouteDifficulty } from './types';
import { GradeSystemSelect } from './GradeSystemSelect';
import { useClimbingContext } from './contexts/ClimbingContext';
import { convertGrade } from './utils/grades/routeGrade';
import { GradeSystem } from './utils/grades/gradeData';

const Flex = styled.div`
  display: flex;
`;

type Props = {
  difficulty: RouteDifficulty;
  onClick: (e: any) => void;
  onDifficultyChanged: (difficulty: RouteDifficulty) => void;
  routeNumber: number;
};

export const RouteDifficultySelect = ({
  difficulty,
  onClick,
  onDifficultyChanged,
  routeNumber,
}: Props) => {
  const [tempGrade, setTempGrade] = useState<string>(null);
  const [tempGradeSystem, setTempGradeSystem] = useState<GradeSystem>(null);

  const { updateRouteOnIndex } = useClimbingContext();

  useEffect(() => {
    if (difficulty && (!tempGrade || !tempGradeSystem)) {
      setTempGrade(difficulty.grade);
      setTempGradeSystem(difficulty.gradeSystem);
    }
  }, [difficulty]);

  useEffect(() => {
    if (tempGrade && tempGradeSystem) {
      const newGrade = convertGrade(
        difficulty.gradeSystem,
        tempGradeSystem,
        tempGrade,
      );
      setTempGrade(newGrade);

      onDifficultyChanged({ grade: tempGrade, gradeSystem: tempGradeSystem });
    }
  }, [tempGradeSystem]);

  const handleGradeChange = (e: any) => {
    const newGrade = e.target.value;
    setTempGrade(newGrade);

    updateRouteOnIndex(routeNumber, (route) => ({
      ...route,
      difficulty: {
        grade: newGrade,
        gradeSystem: tempGradeSystem,
      },
    }));
  };

  return (
    <Flex>
      <TextField
        value={tempGrade}
        size="small"
        label="Grade"
        onChange={handleGradeChange}
      />
      <GradeSystemSelect
        setGradeSystem={setTempGradeSystem}
        selectedGradeSystem={tempGradeSystem}
        onClick={onClick}
        allowUnsetValue={false}
      />
    </Flex>
  );
};
