import React, { forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styled from 'styled-components';
import { Divider, Menu, MenuItem } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useMapStateContext } from '../utils/MapStateContext';
import { useBoolState } from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { toDeg, toDM } from '../../utils';

const StyledMenuItem = styled(MenuItem)`
  svg {
    font-size: 12px;
    color: #bbb;
    margin: -7px 0 0 5px;
  }

  &:focus {
    text-decoration: none;
    svg {
      outline: 0;
    }
  }
`;

const StyledToggleButton = styled(IconButton)`
  position: absolute !important;
  margin: -10px 0 0 -10px !important;

  svg {
    font-size: 17px;
  }
`;

export const ToggleButton = forwardRef<any, any>(
  ({ onClick, isShown = false }, ref) => (
    <StyledToggleButton onClick={onClick} aria-label="Toggle" ref={ref}>
      {!isShown && <ExpandMoreIcon fontSize="small" />}
      {isShown && <ExpandLessIcon fontSize="small" />}
    </StyledToggleButton>
  ),
);

const CopyTextItem = ({ text }) => (
  <MenuItem onClick={() => navigator.clipboard.writeText(text)}>
    Copy {text}
  </MenuItem>
);

const LinkItem = ({ href, label }) => (
  <StyledMenuItem component="a" href={href} target="_blank" rel="noopener">
    {label} <OpenInNewIcon />
  </StyledMenuItem>
);

const useGetItems = (lat, lon) => {
  const {
    view: [z],
  } = useMapStateContext();
  const { feature } = useFeatureContext();

  const zInt = Math.round(z);
  const osmQuery = feature?.osmMeta?.id
    ? `${feature.osmMeta.type}/${feature.osmMeta.id}`
    : `?mlat=${lat}&mlon=${lon}&zoom=${z}`;

  return [
    {
      label: 'OpenStreetMap.org',
      href: `https://openstreetmap.org/${osmQuery}`,
    },
    {
      label: 'OpenStreetMap.cz',
      href: `https://openstreetmap.cz/${osmQuery}`,
    },
    {
      label: 'Mapy.cz',
      href: `https://mapy.cz/zakladni?z=${zInt}&q=${lat}%C2%B0%20${lon}%C2%B0`,
    },
    {
      label: 'Google Maps',
      href: `https://google.com/maps/search/${lat}%C2%B0%20${lon}%C2%B0/@${lat},${lon},${z}z`,
    },
  ];
};

export const Coords = ({ coords: [lon, lat] }) => {
  const [opened, open, close] = useBoolState(false);
  const anchorRef = React.useRef();
  const items = useGetItems(lat, lon);

  return (
    <span title="latitude, longitude (y, x)">
      {toDeg(lat, lon)}
      <Menu
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
        disableAutoFocusItem
      >
        {items.map(({ label, href }) => (
          <LinkItem key={label} href={href} label={label} />
        ))}
        <Divider />
        <CopyTextItem text={toDeg(lat, lon)} />
        <CopyTextItem text={toDM(lat, lon)} />
      </Menu>
      <ToggleButton onClick={open} ref={anchorRef} />
    </span>
  );
};

const Coordinates = ({ feature: { center } }) =>
  center === undefined || center[0] == null || center[1] == null ? null : (
    <Coords coords={center} />
  );

export default Coordinates;
