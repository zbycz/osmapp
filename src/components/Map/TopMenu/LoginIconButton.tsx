import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { isMobileMode } from '../../helpers';

const StyledIconButton = styled(IconButton)`
  padding: 12px;

  svg {
    filter: drop-shadow(0 0 2px #ffffff);

    @media ${isMobileMode} {
      filter: invert(100%);
    }
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
