import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Switch,
} from '@material-ui/core';
import React from 'react';
import { useClimbingContext } from './contexts/ClimbingContext';
import { GradeSystemSelect } from './GradeSystemSelect';

export const ClimbingSettings = ({ isSettingsOpened, setIsSettingsOpened }) => {
  const {
    areRoutesVisible,
    setAreRoutesVisible,
    setSelectedRouteSystem,
    selectedRouteSystem,
  } = useClimbingContext();

  return (
    <Dialog
      onClose={() => {
        setIsSettingsOpened(false);
      }}
      open={isSettingsOpened}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText>Show routes on photo</ListItemText>
            <Switch
              color="primary"
              edge="end"
              onChange={(e) => {
                setAreRoutesVisible(e.target.checked);
              }}
              checked={areRoutesVisible}
            />
          </ListItem>
          <ListItem>
            <ListItemText>Default grade system</ListItemText>
            <GradeSystemSelect
              setGradeSystem={setSelectedRouteSystem}
              gradeSystem={selectedRouteSystem}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};
