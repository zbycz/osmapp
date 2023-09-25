import React, { useContext } from 'react';
import { ClimbingContext } from '../contexts/climbingContext';

export const Point = ({ x, y, onPointClick, type, index }) => {
  const isBelayVisible = type === 'belay';

  const { imageSize, setPointSelectedIndex } = useContext(ClimbingContext);
  const onClick = (e) => {
    onPointClick(e);
    setPointSelectedIndex(index);
    e.stopPropagation();
  };

  return (
    <>
      <circle
        id="clickablePoint"
        cx={imageSize.width * x}
        cy={imageSize.height * y}
        fill="transparent"
        r={10}
        onClick={onClick}
        cursor="pointer"
      >
        {type && <title>{type}</title>}
      </circle>

      <circle
        id="coloredPoint"
        cx={imageSize.width * x}
        cy={imageSize.height * y}
        fill={isBelayVisible ? 'transparent' : 'white'}
        stroke="royalblue"
        r={3}
        onClick={onClick}
        cursor="pointer"
      >
        {type && <title>{type}</title>}
      </circle>
    </>
  );
};
