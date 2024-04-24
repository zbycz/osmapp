import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from 'react';
import styled from 'styled-components';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';

const StyledUserImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
`;
export const LoginIcon = ({ onClick }) => {
  const { osmUser, userImage } = useOsmAuthContext();

  return (
    <IconButton color="secondary" onClick={onClick}>
      {osmUser ? (
        <StyledUserImg src={userImage} alt={osmUser} onClick={onClick} />
      ) : (
        <AccountCircleIcon />
      )}
    </IconButton>
  );
};
