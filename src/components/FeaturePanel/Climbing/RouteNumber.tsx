import styled from 'styled-components';

export const RouteNumber = styled.div`
  width: 22px;
  height: 22px;
  line-height: 20px;
  border-radius: 50%;
  background: ${({ isSelected, hasRoute }) =>
    isSelected ? 'royalblue' : hasRoute ? '#ccc' : 'transparent'};
  color: ${({ isSelected, hasRoute }) =>
    isSelected ? 'white' : hasRoute ? '#444' : '#444'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;

  border: solid 1px #fff;
`;
