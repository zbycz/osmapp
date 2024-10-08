import React from 'react';
import { useUserThemeContext } from '../../../../helpers/theme';
import styled from '@emotion/styled';
import { osmColorToHex, whiteOrBlackText } from '../../helpers/color';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import { LineInformation } from './requestRoutes';

export const getBgColor = (color: string | undefined, darkmode: boolean) => {
  if (color) return osmColorToHex(color);

  return darkmode ? '#898989' : '#dddddd';
};

const LineNumberWrapper = styled(Link)<{
  color: string | undefined;
  darkmode: boolean;
}>`
  background-color: ${({ color, darkmode }) => getBgColor(color, darkmode)};
  color: ${({ color, darkmode }) =>
    whiteOrBlackText(getBgColor(color, darkmode))};
  padding: 0.2rem 0.4rem;
  borderradius: 0.125rem;
  display: inline;
`;

type Tags = Record<string, string>;
const formatTooltip = (tags: Tags, routes: { tags: Tags }[]) => {
  const formatTags = (tags: Tags) => {
    const parts = [tags.from, ...(tags.via ? [tags.via] : []), tags.to];
    return parts.flatMap((str) => str.split(';')).join(' - ');
  };

  if (tags.from && tags.to) {
    return formatTags(tags);
  }

  const relevantRoute =
    routes.find(({ tags }) => tags.from && tags.via && tags.to) ||
    routes.find(({ tags }) => tags.from && tags.to);
  if (!relevantRoute) {
    return undefined;
  }

  return formatTags(relevantRoute.tags);
};

export const LineNumber = ({ line }: { line: LineInformation }) => {
  const { currentTheme } = useUserThemeContext();
  const darkmode = currentTheme === 'dark';

  return (
    <Tooltip
      title={formatTooltip(line.tags, line.routes)}
      arrow
      placement="top"
    >
      <LineNumberWrapper
        href={`/${line.osmType}/${line.osmId}`}
        color={line.colour}
        darkmode={darkmode}
      >
        {line.ref}
      </LineNumberWrapper>
    </Tooltip>
  );
};
