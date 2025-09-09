import { useCurrentItem } from '../../../context/EditContext';
import React, { useEffect, useRef, useState } from 'react';
import { LonLat } from '../../../../../../services/types';
import { Stack, TextField } from '@mui/material';
import { t } from '../../../../../../services/intl';

const isNumeric = (val: string) => {
  const str = val
    .replace(/(\.\d*?)0*$/, '$1')
    .replace(/\.$/, '')
    .replace(/^0*(\d)/, '$1');
  const num = `${parseFloat(val)}`;
  return str === num;
};

const LonInput = (props: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lonError: boolean;
}) => (
  <TextField
    label={t('editdialog.location_longitude')}
    variant="outlined"
    value={props.value}
    onChange={props.onChange}
    size="small"
    error={props.value && props.lonError}
  />
);

const LatInput = (props: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  latError: boolean;
}) => (
  <TextField
    label={t('editdialog.location_latitude')}
    variant="outlined"
    value={props.value}
    onChange={props.onChange}
    size="small"
    error={props.value && props.latError}
  />
);

export const LocationInputs = () => {
  const { nodeLonLat, setNodeLonLat } = useCurrentItem();
  const [latError, setLatError] = useState(false);
  const [lat, setLat] = useState<string>(`${nodeLonLat?.[0] || ''}`);
  const [lonError, setLonError] = useState(false);
  const [lon, setLon] = useState<string>(`${nodeLonLat?.[1] || ''}`);

  const updatedFromHere = useRef<LonLat>();

  useEffect(() => {
    if (nodeLonLat && updatedFromHere.current !== nodeLonLat) {
      setLat(`${nodeLonLat[1] || ''}`);
      setLon(`${nodeLonLat[0] || ''}`);
    }
  }, [nodeLonLat]);

  const onChange = (lon: string, lat: string) => {
    const pos = [lon, lat];

    if (pos.every(isNumeric)) {
      const toBeSet = pos.map(parseFloat);
      setNodeLonLat(toBeSet);
      updatedFromHere.current = toBeSet;
      setLonError(false);
      setLatError(false);
    } else {
      if (!isNumeric(lon)) setLonError(true);
      if (!isNumeric(lat)) setLatError(true);
    }
  };

  const changeLon = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLon(e.target.value);
    onChange(e.target.value, lat);
  };
  const changeLat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLat(e.target.value);
    onChange(lon, e.target.value);
  };

  return (
    <Stack direction="row" mt={2} gap={1}>
      <LatInput value={lat} onChange={changeLat} latError={latError} />
      <LonInput value={lon} onChange={changeLon} lonError={lonError} />
    </Stack>
  );
};
