/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import { Feature } from '../../../../services/types';
import { ClimbingRouteTableRow } from './ClimbingRouteTableRow';

type Props = {
  routeId: string;
  stopPropagation: (e: React.MouseEvent) => void;
  parentRef: React.RefObject<HTMLDivElement>;
  feature: Feature;
};

export const RenderListRow = ({ routeId, parentRef, feature }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { userSettings } = useUserSettingsContext();

  const {
    routes,
    routeSelectedIndex,
    routeIndexExpanded,
    setRouteIndexExpanded,
    setRouteListTopOffset,
  } = useClimbingContext();

  const index = routes.findIndex((route) => route.id === routeId);

  useEffect(() => {
    if (
      userSettings['climbing.selectRoutesByScrolling'] &&
      ref.current &&
      parentRef.current
    ) {
      const elementRect = ref.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const relativeTop = elementRect.top - parentRect.top;

      setRouteListTopOffset(index, relativeTop);
    }
  }, [
    index,
    parentRef,
    setRouteListTopOffset,
    routeIndexExpanded,
    userSettings,
  ]);

  useEffect(() => {
    if (
      !userSettings['climbing.selectRoutesByScrolling'] &&
      routeSelectedIndex === index
    ) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [routeSelectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    setRouteIndexExpanded(routeIndexExpanded === index ? null : index);
  };
  return (
    <ClimbingRouteTableRow
      feature={feature}
      index={index}
      onClick={handleClick}
      ref={ref}
    />
  );
};
