import React, { useState } from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { isTicked, onTickAdd } from '../../../../services/my-ticks/ticks';
import { useSnackbar } from '../../../utils/SnackbarContext';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { EditTickModal } from '../EditTickModal';

export const useAddTick = () => {
  const [tick, setTick] = useState(undefined);
  const { showToast } = useSnackbar();
  const { userSettings } = useUserSettingsContext();
  const [showEditTickModal, setShowEditTickModal] = useState(false);

  const onNewTickAdd = (shortOsmId) => {
    const newTick = onTickAdd({
      osmId: shortOsmId,
      style: userSettings['climbing.defaultClimbingStyle'],
    });
    setTick(newTick);
    showToast(
      'Tick added!',
      'success',
      <Button
        color="inherit"
        size="small"
        onClick={() => {
          setShowEditTickModal(true);
        }}
      >
        Edit tick
      </Button>,
    );
  };
  const EditModal = () => (
    <EditTickModal
      tick={tick}
      isOpen={showEditTickModal}
      onClose={() => {
        setShowEditTickModal(false);
      }}
    />
  );

  return {
    onTickAdd: onNewTickAdd,
    EditTickModal: EditModal,
  };
};

export const AddTickButton = ({ shortOsmId }) => {
  const ticked = isTicked(shortOsmId);

  const { onTickAdd, EditTickModal } = useAddTick();

  return (
    <>
      <Button
        onClick={() => onTickAdd(shortOsmId)}
        color="secondary"
        size="small"
        variant="text"
        endIcon={<CheckIcon color={ticked ? 'primary' : undefined} />}
      >
        Add tick
      </Button>
      <EditTickModal />
    </>
  );
};
