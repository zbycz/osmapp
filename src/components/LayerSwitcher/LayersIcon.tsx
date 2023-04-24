import React from 'react';

// not used in tailwind version -- can be deleted when ready

const SvgComponent = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <svg height={26} width={26} {...props}>
    <path d="M.032 17.056l13-8 13 8-13 8-13-8" fill="#b9b9b9" />
    <path d="M.032 17.056l-.032.93 13 8 13-8 .032-.93-13 8z" fill="#737373" />
    <path d="M0 13.076l13-8 13 8-13 8-13-8" fill="#cdcdcd" />
    <path d="M0 13.076v.91l13 8 13-8v-.91l-13 8z" fill="#737373" />
    <path
      d="M0 8.986l13-8 13 8-13 8-13-8"
      fillOpacity={0.585}
      stroke="#797979"
      strokeWidth={0.1}
      fill="#e9e9e9"
    />
    <path d="M0 8.986v1l13 8 13-8v-1l-13 8z" fill="#737373" />
  </svg>
);

export default SvgComponent;
