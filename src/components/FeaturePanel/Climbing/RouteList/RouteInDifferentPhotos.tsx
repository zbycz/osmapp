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
const Row = styled.div`
  display: flex;
`;

export const RouteInDifferentPhotos = ({
  route,
  stopPropagation,
}: {
  route: ClimbingRoute;
  stopPropagation: (e: any) => void;
}) => {
  const { setPhotoPath, handleImageLoad, photoPath } = useClimbingContext();
  console.log('___route', route);
  const onPhotoChange = (e: any, photo: string) => {
    // @TODO probably move to machine state function
    setPhotoPath(photo);
    setTimeout(() => {
      // @TODO fix it without timeout
      handleImageLoad();
    }, 100);
    stopPropagation(e);
  };

  const photos = Object.keys(route.paths);
  return photos.length > 0 ? (
    <Container>
      <Label>Available in photos:</Label>
      <Row>
        {photos.map((photo, index) => (
          <PhotoLink
            isCurrentPhoto={photoPath === photo}
            onClick={(e) => onPhotoChange(e, photo)}
          >
            {index}
          </PhotoLink>
        ))}
      </Row>
    </Container>
  ) : (
    <Label>Route is not marked in any photo</Label>
  );
};
