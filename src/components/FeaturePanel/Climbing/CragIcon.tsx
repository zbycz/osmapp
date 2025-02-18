type CragIconProps = {
  fill: string;
  stroke: string;
  height?: number;
  width?: number;
};

export const CragIcon = ({
  fill,
  stroke,
  height = 24,
  width = 24,
}: CragIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="path-1-inside-1_1773_247" fill="white">
      <path d="M12.1463 2L21.2927 22.0323H3L12.1463 2Z" />
    </mask>
    <path d="M12.1463 2L21.2927 22.0323H3L12.1463 2Z" fill={fill} />
    <path
      d="M12.1463 2L13.5108 1.377L12.1463 -1.61153L10.7818 1.377L12.1463 2ZM21.2927 22.0323V23.5323H23.6265L22.6572 21.4093L21.2927 22.0323ZM3 22.0323L1.6355 21.4093L0.666176 23.5323H3V22.0323ZM10.7818 2.623L19.9282 22.6553L22.6572 21.4093L13.5108 1.377L10.7818 2.623ZM21.2927 20.5323H3V23.5323H21.2927V20.5323ZM4.3645 22.6553L13.5108 2.623L10.7818 1.377L1.6355 21.4093L4.3645 22.6553Z"
      fill={stroke}
      mask="url(#path-1-inside-1_1773_247)"
    />
  </svg>
);
