import React from 'react';
import { useCurrentItem, useExpandedSections } from '../context/EditContext';
import { useLoadImages } from '../../FeatureImages/useLoadImages';
import { ImageSkeleton } from '../../FeatureImages/helpers';
import { NoImage } from '../../FeatureImages/NoImage';
import { Image } from '../../FeatureImages/Image/Image';
import { Slider, Wrapper } from '../../FeatureImages/Image/Slider';
import { getImageDefs } from '../../../../services/images/getImageDefs';
import { getApiId } from '../../../../services/helpers';
import { getGlobalMap } from '../../../../services/mapStorage';
import EditIcon from '@mui/icons-material/Edit';
import { AddNewImage } from './FeatureEditSection/ImagesEditor/AddNewImage';
import styled from '@emotion/styled';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useMoreMenu } from '../../Climbing/useMoreMenu';
import DeleteIcon from '@mui/icons-material/Delete';
import { DrawClimbingRoutesBanner } from './FeatureEditSection/ClimbingEditor/DrawClimbingRoutesBanner';
import { convertHexToRgba } from '../../../utils/colorUtils';
import ImageIcon from '@mui/icons-material/Image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const ImageName = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 2px;
  font-size: 9px;
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.9)};
`;
const Container = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
`;

export const MoreButton = () => {
  const { MoreMenu, handleClickMore } = useMoreMenu();

  return (
    <Container>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ minWidth: 0, padding: 1, borderRadius: '50%' }}
        onClick={handleClickMore}
      >
        <MoreHorizIcon />
      </Button>
      {/* <IconButton */}
      {/*   variant="contained" */}
      {/*   color="secondary" */}
      {/*   onClick={handleClickMore} */}
      {/* > */}
      {/*   <MoreHorizIcon color="secondary" /> */}
      {/* </IconButton> */}

      <MoreMenu>
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </MoreMenu>
    </Container>
  );
};

export const Gallery = ({ imageDefs }) => {
  const { loading, images } = useLoadImages(imageDefs);

  if (images.length === 0) {
    return <Wrapper>{loading ? <ImageSkeleton /> : <NoImage />}</Wrapper>;
  }
  console.log('___', images);
  return (
    <Wrapper>
      <Slider>
        {images.map((item) => (
          <Image
            key={item.image.imageUrl}
            def={item.def}
            image={item.image}
            onClick={() => {}}
            alt={`${item.image.link}`}
          >
            <MoreButton />
            <ImageName>{item.image.link}</ImageName>
          </Image>
        ))}
        <AddNewImage />
      </Slider>
    </Wrapper>
  );
};
const getMapCenter = () => getGlobalMap().getCenter().toArray();
export const ImagesEditor = () => {
  const { tags, shortId } = useCurrentItem();
  const osmType = getApiId(shortId).type;
  const imageDefs = getImageDefs(tags, osmType, getMapCenter());
  const { expanded, toggleExpanded } = useExpandedSections('images');

  return (
    <Accordion // TODO replace Accordion with custom collapse component, it is not accordion anymore :)
      disableGutters
      elevation={0}
      square
      expanded={expanded}
      onChange={toggleExpanded}
      slotProps={{ transition: { timeout: 0 } }}
      sx={{
        '&.MuiAccordion-root:before': {
          opacity: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ImageIcon />
          <Typography variant="button">Images</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Gallery imageDefs={imageDefs} />
        <DrawClimbingRoutesBanner />
      </AccordionDetails>
    </Accordion>
  );
};
