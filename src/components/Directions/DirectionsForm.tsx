import { Option } from '../SearchBox/types';
import { RoutingResult } from './routing/types';
import { CloseButton } from './helpers';
import React, { useEffect, useMemo, useState } from 'react';
import { StyledPaper } from './Result';
import { Box, Stack } from '@mui/material';
import { ModeToggler } from './ModeToggler';
import { DirectionsAutocomplete } from './DirectionsAutocomplete';
import { t } from '../../services/intl';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { getCoordsOption } from '../SearchBox/options/coords';
import { useMapStateContext } from '../utils/MapStateContext';
import { useDirectionsContext } from './DirectionsContext';
import {
  useGetOnSubmitFactory,
  useReactToUrl,
  useUpdatePoint,
} from './useGetOnSubmit';
import { moveElementToIndex } from '../FeaturePanel/Climbing/utils/array';
import { useDragItems } from '../utils/useDragItems';
import { DragHandler } from '../utils/DragHandler';

type Props = {
  setResult: (result: RoutingResult) => void;
  hideForm: boolean;
};

const useGlobalMapClickOverride = (
  points: Array<Option>,
  setPoints: (points: Array<Option>) => void,
) => {
  const { setResult, setLoading, mode } = useDirectionsContext();
  const submitFactory = useGetOnSubmitFactory(setResult, setLoading);
  const updatePoint = useUpdatePoint();

  const { mapClickOverrideRef } = useMapStateContext();
  useEffect(() => {
    mapClickOverrideRef.current = (coords, label) => {
      if (points) {
        const coordinates = getCoordsOption(coords, label);
        if (!points[0]) {
          const newPoints = updatePoint(0, coordinates);
          submitFactory(newPoints, mode);
        } else {
          const newPoints = updatePoint(1, coordinates);
          submitFactory(newPoints, mode);
        }
      }
    };

    return () => {
      mapClickOverrideRef.current = undefined;
    };
  }, [
    mapClickOverrideRef,
    mode,
    points,
    setPoints,
    submitFactory,
    updatePoint,
  ]);
};

type InputItem = {
  value: Option;
  pointIndex: number;
  label: string;
};

export const DirectionsForm = ({ setResult, hideForm }: Props) => {
  const defaultFrom = {
    value: null,
    pointIndex: 0,
    label: t('directions.form.start_or_click'),
  };

  const defaultTo = useMemo(
    () => ({
      value: null,
      pointIndex: 1,
      label: t('directions.form.destination'),
    }),
    [],
  );

  const { loading, setLoading, mode, setMode, points, setPoints } =
    useDirectionsContext();

  const [inputs, setInputs] = useState<Array<InputItem>>([
    defaultFrom,
    defaultTo,
  ]);

  const {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    HighlightedDropzone,
    ItemContainer,
    draggedItem,
    draggedOverIndex,
  } = useDragItems<InputItem>({
    initialItems: inputs,
    moveItems: () => {},
    direction: 'horizontal',
  });

  useEffect(() => {
    const newPoints =
      points?.map((point, index) => ({
        value: point,
        pointIndex: index,
        label: t(
          index === 0
            ? 'directions.form.start_or_click'
            : 'directions.form.destination',
        ),
      })) ?? [];

    if (points?.length === 1) {
      setInputs([...newPoints, defaultTo]);
    }
    if (points?.length >= 2) {
      setInputs(newPoints);
    }
  }, [defaultTo, points]);

  useGlobalMapClickOverride(points, setPoints);
  useReactToUrl(setMode, setPoints, setResult);

  const onSubmitFactory = useGetOnSubmitFactory(setResult, setLoading);

  if (hideForm) {
    return null;
  }

  return (
    <StyledPaper elevation={3}>
      <Stack
        direction="row"
        spacing={1}
        mb={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <ModeToggler
          value={mode}
          setMode={setMode}
          onChange={(newMode) => onSubmitFactory(points, newMode)}
        />
        <CloseButton />
      </Stack>

      <Stack spacing={1} mb={3}>
        {inputs.map((item, index) => {
          const { value, label, pointIndex } = item;
          return (
            <Box sx={{ position: 'relative' }} key={`input-${pointIndex}`}>
              <Stack direction="row" alignItems="center">
                <DragHandler
                  onDragStart={(e) => {
                    handleDragStart(e, {
                      id: index,
                      content: item,
                    });
                  }}
                  onDragOver={(e) => {
                    handleDragOver(e, index);
                  }}
                  onDragEnd={(e) => {
                    handleDragEnd(e);

                    const newArray = moveElementToIndex(
                      inputs,
                      draggedItem.id,
                      draggedOverIndex,
                    );

                    setInputs(newArray);
                  }}
                />
                <DirectionsAutocomplete
                  value={value}
                  label={label}
                  pointIndex={index}
                />
              </Stack>
              <HighlightedDropzone index={index} />
            </Box>
          );
        })}
      </Stack>

      <LoadingButton
        loading={loading}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<SearchIcon />}
        onClick={() => onSubmitFactory(points, mode)}
      >
        {t('directions.get_directions')}
      </LoadingButton>
    </StyledPaper>
  );
};
