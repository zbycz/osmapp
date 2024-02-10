import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { GradeSystem, RouteDifficulty } from './types';
import { GradeSystemSelect } from './GradeSystemSelect';
import { useClimbingContext } from './contexts/ClimbingContext';
import { convertGrade } from './utils/routeGrade';

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
  // const [grade, setGrade] = useState<string>(null);
  const [tempGrade, setTempGrade] = useState<string>(null);
  const [tempGradeSystem, setTempGradeSystem] = useState<GradeSystem>(null);

  const { updateRouteOnIndex, gradeTable } = useClimbingContext();

  // const [selectedRouteSystem, setSelectedRouteSystem] =
  //   useState<GradeSystem>(null);
  // const options: Array<{ label: string }> =
  //   selectedRouteSystem && gradeTable[selectedRouteSystem]
  //     ? gradeTable[selectedRouteSystem].map((grade) => ({ label: grade }))
  //     : [];

  useEffect(() => {
    if (difficulty && (!tempGrade || !tempGradeSystem)) {
      setTempGrade(difficulty.grade);
      setTempGradeSystem(difficulty.gradeSystem);
    }
  }, [difficulty]);

  useEffect(() => {
    if (tempGrade && tempGradeSystem) {
      const newGrade = convertGrade(
        gradeTable,
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

  // const selectedValue = React.useMemo(
  //   () => options.find((v) => v.label === difficulty.grade),
  //   [options],
  // );
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
        gradeSystem={tempGradeSystem}
        onClick={onClick}
      />

      {/* <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label.toString()}
        disableClearable
        renderInput={(params) => (
          <TextField {...params} size="small" label="Grade" />
        )}
        onClick={onClick}
        value={grade ? { label: grade } : undefined}
        onChange={() => {}}
      /> */}
    </Flex>
  );
};
