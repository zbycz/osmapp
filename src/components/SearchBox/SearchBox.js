// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

const CustomizedInputBase = ({ classes, resetFeature }) => (
  <Paper className={classes.root} elevation={1}>
    <IconButton className={classes.iconButton} disabled>
      <SearchIcon />
    </IconButton>
    <InputBase
      className={classes.input}
      placeholder="Prohledat OpenStreetMap"
    />
    {/* <IconButton className={classes.iconButton} aria-label="Search"> */}
    {/* <MoreVertIcon /> */}
    {/* </IconButton> */}
    <Divider className={classes.divider} />
    <IconButton
      className={classes.iconButton}
      aria-label="Zavřít panel"
      onClick={resetFeature}
    >
      <CloseIcon />
    </IconButton>
  </Paper>
);

export default withStyles(styles)(CustomizedInputBase);
