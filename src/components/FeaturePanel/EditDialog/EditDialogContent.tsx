import { useEditContext } from './EditContext';
import { EditDialogTitle } from './EditDialogTitle';
import { SuccessContent } from './SuccessContent';
import { EditContent } from './EditContent/EditContent';
import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useBoolState } from '../../helpers';

const useDelayedSpinner = () => {
  const [showSpinner, start] = useBoolState(false);
  useEffect(() => {
    const timeout = setTimeout(start, 300);
    return () => clearTimeout(timeout);
  }, [start]);
  return { showSpinner };
};

export const EditDialogLoadingSkeleton = () => {
  const { showSpinner } = useDelayedSpinner();

  return (
    <>
      <EditDialogTitle />
      <div style={{ minWidth: 900, padding: '2rem' }}>
        {showSpinner && <CircularProgress />}
      </div>
    </>
  );
};

export const EditDialogContent = () => {
  const { successInfo } = useEditContext();

  return (
    <>
      <EditDialogTitle />
      {successInfo ? <SuccessContent /> : <EditContent />}
    </>
  );
};
