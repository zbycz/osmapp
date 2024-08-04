import React from 'react';
import styled from 'styled-components';
import { ClimbingRoute } from '../types';
import { Label } from './Label';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PhotoLink } from '../PhotoLink';
import { getCommonsImageUrl } from '../../../../services/images/getCommonsImageUrl';

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
  const { setPhotoPath, loadPhotoRelatedData, photoPath } =
    useClimbingContext();
  const onPhotoChange = (e: any, photo: string) => {
    // @TODO probably move to machine state function
    setPhotoPath(photo);
    setTimeout(() => {
      // @TODO fix it without timeout
      loadPhotoRelatedData();
    }, 100);
    stopPropagation(e);
  };

  const photos = route.paths ? Object.keys(route.paths) : [];

  return photos.length > 0 ? (
    <Container>
      <Label>Available in photos:</Label>
      <Row>
        {photos.map((photo) => {
          const url = getCommonsImageUrl(`File:${photo}`, 160);
          return (
            <PhotoLink
              isCurrentPhoto={photoPath === photo}
              onClick={(e) => onPhotoChange(e, photo)}
            >
              <img src={url} height={80} alt="Preview" />
            </PhotoLink>
          );
        })}
      </Row>
    </Container>
  ) : null;
};
