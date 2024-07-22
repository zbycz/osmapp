import React, { Component } from 'react';

// https://jakearchibald.github.io/svgomg/
// https://www.smooth-code.com/open-source/svgr/playground/

interface Props {
  width: number;
  height: number;
  className?: string;
}
export default class LogoOsmapp extends Component<Props, never> {
  static muiName = 'LogoOsmapp';

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { width, height } = this.props;
    return (
      <img
        src="/logo-map-et.svg"
        alt="map.et Logo"
        width={width}
        height={height}
      />
    );
  }
}
