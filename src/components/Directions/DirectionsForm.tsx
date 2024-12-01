import { Option } from '../SearchBox/types';
import { RoutingResult } from './routing/types';
import { CloseButton } from './helpers';
import React, { Fragment, useEffect, useState } from 'react';
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
import { useDragItems } from '../utils/useDragItems';
import { DragHandler } from '../utils/DragHandler';
import { moveElementToIndex } from '../FeaturePanel/Climbing/utils/array';

type Props = {
  setResult: (result: RoutingResult) => void;
  hideForm: boolean;
};

const useGlobalMapClickOverride = () => {
  const { setResult, setLoading, mode, points } = useDirectionsContext();
  const submitFactory = useGetOnSubmitFactory(setResult, setLoading);
  const updatePoint = useUpdatePoint();

  const { mapClickOverrideRef } = useMapStateContext();
  useEffect(() => {
    mapClickOverrideRef.current = (coords, label) => {
      const coordinates = getCoordsOption(coords, label);

      if (!points[0]) {
        const newPoints = updatePoint(0, coordinates);
        submitFactory(newPoints, mode);
      } else {
        const newPoints = updatePoint(1, coordinates);
        submitFactory(newPoints, mode);
      }
    };

    return () => {
      mapClickOverrideRef.current = undefined;
    };
  }, [mapClickOverrideRef, mode, points, submitFactory, updatePoint]);
};

export const DirectionsForm = ({ setResult, hideForm }: Props) => {
  const { loading, setLoading, mode, setMode, points } = useDirectionsContext();

  useGlobalMapClickOverride();
  useReactToUrl(setMode, setResult);

  type InputItem = {
    value: Option;
    pointIndex: number;
    label: string;
  };
  const [inputs, setInputs] = useState<Array<InputItem>>([
    {
      value: points?.[0],
      pointIndex: 0,
      label: t('directions.form.start_or_click'),
    },
    {
      value: points?.[1],
      pointIndex: 1,
      label: t('directions.form.destination'),
    },
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

  const onSubmitFactory = useGetOnSubmitFactory(setResult, setLoading);

  if (hideForm) {
    return null;
  }

  return (
    <StyledPaper elevation={3}>
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <ModeToggler
          value={mode}
          setMode={setMode}
          onChange={(newMode) => onSubmitFactory(points, newMode)}
        />
        <div style={{ flex: 1 }} />
        <div>
          <CloseButton />
        </div>
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
