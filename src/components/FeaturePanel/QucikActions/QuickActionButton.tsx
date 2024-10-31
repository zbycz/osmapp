import styled from '@emotion/styled';
import { forwardRef, MouseEventHandler } from 'react';
import { useUserThemeContext } from '../../../helpers/theme';

const StyledQuickActionButton = styled.button<{ $outlineColor: string }>`
  border-radius: 100vmax;
  background: transparent;
  border: 1px solid ${({ $outlineColor }) => $outlineColor};
  color: inherit;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  /* Used to overwrite pointer-events: none from the collapsed featurepanel drawer */
  pointer-events: all;
`;

type Props = {
  icon: React.FC<{ fontSize: 'small' }>;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const QuickActionButton = forwardRef<HTMLButtonElement, Props>(
  ({ icon: Icon, label, onClick }, ref) => {
    const { currentTheme } = useUserThemeContext();

    return (
      <StyledQuickActionButton
        ref={ref}
        onClick={onClick}
        $outlineColor={currentTheme === 'dark' ? '#71717a' : '#d4d4d8'}
      >
        <Icon fontSize="small" />
        {label}
      </StyledQuickActionButton>
    );
  },
);
QuickActionButton.displayName = 'QuickActionButton';
