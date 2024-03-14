import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const StyledActionButton = styled(IconButton)`
  svg {
    width: 20px;
    height: 20px;
    color: ${({ color }) => color || '#fff'};
  }
`;
