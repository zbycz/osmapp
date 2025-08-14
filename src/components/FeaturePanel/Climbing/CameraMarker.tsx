import React from 'react';

type CameraTopDownMarkerProps = {
  width?: number;
  height?: number;
  index?: number;
  azimuth?: number;
  onClick?: () => void;
};

export const CameraMarker = ({
  width,
  height,
  azimuth = 0,
  index,
  onClick,
}: CameraTopDownMarkerProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 55 55"
    role="img"
    height={height}
    width={width}
  >
    <g transform="translate(11.5,11.5)" cursor="pointer" onClick={onClick}>
      <g
        transform={`rotate(${azimuth},16,16) translate(16,16) scale(2) translate(-16,-16)`}
      >
        <polygon points="16,2 10,14 22,14" fill="white" />
      </g>

      <path
        fill="#000"
        d="M26 7h-3.465l-1.704-2.555A1 1 0 0 0 20 4h-8a1 1 0 0 0-.831.445L9.464 7H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3Z"
      />

      <text fill="white" x={12} y={23} fontWeight="bold">
        {index}
      </text>
    </g>
  </svg>
);
