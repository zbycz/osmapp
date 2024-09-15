import React from 'react';
import styled from '@emotion/styled';

const EmptyValueWrapper = styled.div`
  color: #666;
`;
export const EmptyValue = () => <EmptyValueWrapper>?</EmptyValueWrapper>;
