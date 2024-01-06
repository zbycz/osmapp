import React from 'react';
import styled from 'styled-components';
import { ClimbingRoute } from '../types';
import { Label } from './Label';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PhotoLink } from '../PhotoLink';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const RouteInDifferentPhotos = ({ route }: { route: ClimbingRoute }) => {
  const { setPhotoPath, handleImageLoad, photoPath } = useClimbingContext();

  const onPhotoChange = (photo: string) => {
    // @TODO probably move to machine state function
    setPhotoPath(photo);
    setTimeout(() => {
      // @TODO fix it without timeout
      handleImageLoad();
    }, 100);
  };

  const photos = Object.keys(route.paths);
  return photos.length > 0 ? (
    <Container>
      <Label>Available in photos:</Label>
      <div>
        {photos.map((photo) => (
          <PhotoLink
            isCurrentPhoto={photoPath === photo}
            onClick={() => onPhotoChange(photo)}
          >
            {photo}
          </PhotoLink>
        ))}
      </div>
    </Container>
  ) : (
    <Label>Route is not marked in any photo</Label>
  );
};
