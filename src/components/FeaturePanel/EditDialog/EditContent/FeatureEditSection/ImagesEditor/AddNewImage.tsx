import styled from '@emotion/styled';
import { Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { IMAGE_HEIGHT } from '../../../../FeatureImages/helpers';
import { convertHexToRgba } from '../../../../../utils/colorUtils';

const Container = styled.div`
  display: inline-block;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.default, 0.7)};
  padding: 20px 30px;
  border-radius: 3px;
  height: ${IMAGE_HEIGHT}px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) =>
      convertHexToRgba(theme.palette.background.default, 0.9)};
  }
`;

export const AddNewImage = () => {
  return (
    <Container>
      <Stack justifyContent="center" alignItems="center" height="100%">
        <AddIcon />
        <Typography variant="caption">Add new image</Typography>
      </Stack>
    </Container>
  );
};
