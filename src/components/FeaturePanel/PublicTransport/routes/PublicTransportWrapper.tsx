import React from 'react';
import { LineInformation } from './requestRoutes';
import { LineNumber } from './LineNumber';
import { CategoryHeading } from './CategoryHeading';

const PublicTransportWrapper = ({ children }) => {
  const divStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
    gap: '0.5rem',
    flexWrap: 'wrap',
  };

  return <div style={divStyle}>{children}</div>;
};

interface CategoryProps {
  category: string;
  lines: LineInformation[];
  showHeading: boolean;
  onShow: () => void;
  onHide: () => void;
  onExclusiveShow: () => void;
  shown?: boolean;
}

export const PublicTransportCategory: React.FC<CategoryProps> = ({
  category,
  lines,
  showHeading,
  onShow,
  onHide,
  onExclusiveShow,
  shown = true,
}) => (
  <>
    {showHeading && (
      <CategoryHeading
        category={category}
        shown={shown}
        onShow={onShow}
        onHide={onHide}
        onExclusiveShow={onExclusiveShow}
      />
    )}
    <PublicTransportWrapper>
      {lines.map((line) => (
        <LineNumber key={line.ref} line={line} />
      ))}
    </PublicTransportWrapper>
  </>
);
