import styled from 'styled-components';

const getColor = ({ isEditMode, isSelected, hasRoute }) => {
  if (!isEditMode && !hasRoute) {
    return {
      background: 'transparent',
      text: '#444',
    };
  }

  if (isSelected) {
    return {
      background: 'royalblue',
      text: 'white',
    };
  }
  if (hasRoute) {
    return {
      background: '#ccc',
      text: '#444',
    };
  }
  return {
    background: 'transparent',
    text: '#444',
  };
};

export const RouteNumber = styled.div<{
  isEditMode: boolean;
  isSelected: boolean;
  hasRoute: boolean;
}>`
  width: 22px;
  height: 22px;
  line-height: 20px;
  border-radius: 50%;
  background: ${(props) => getColor(props).background};
  color: ${(props) => getColor(props).text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;

  border: solid 1px #fff;
`;
