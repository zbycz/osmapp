import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';

const StyledIconButton = styled(IconButton)`
  padding: 12px;

  svg {
    filter: drop-shadow(0 0 2px #ffffff);
  }
`;

const StyledUserImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
`;

export const LoginIconButton = ({ anchorRef, onClick }) => {
  const { osmUser, userImage } = useOsmAuthContext();

  return (
    <StyledIconButton ref={anchorRef} color="secondary" onClick={onClick}>
      {osmUser ? (
        <StyledUserImg src={userImage} alt={osmUser} />
      ) : (
        <AccountCircleIcon />
      )}
    </StyledIconButton>
  );
};
