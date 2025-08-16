import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import styled from '@emotion/styled';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { DotLoader } from '../../helpers';

const StyledUserImg = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background-color: white;
  margin-left: 3px;
`;

export const LoginIconButton = ({ size = 24 }: { size?: number }) => {
  const { osmUser, loading, userImage } = useOsmAuthContext();

  return (
    <>
      {osmUser ? (
        <StyledUserImg src={userImage} alt={osmUser} $size={size} />
      ) : loading ? (
        <div>
          <DotLoader />
        </div>
      ) : (
        <AccountCircleIcon />
      )}
    </>
  );
};
