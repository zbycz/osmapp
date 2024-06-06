import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';

const StyledIconButton = styled(IconButton)`
  padding: 12px;
`;

const StyledUserImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
`;

export const LoginIconButton = ({ onClick }) => {
  const { osmUser, userImage } = useOsmAuthContext();

  return (
    <StyledIconButton color="secondary" onClick={onClick}>
      {osmUser ? (
        <StyledUserImg src={userImage} alt={osmUser} onClick={onClick} />
      ) : (
        <AccountCircleIcon />
      )}
    </StyledIconButton>
  );
};
