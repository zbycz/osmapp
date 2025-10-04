import styled from '@emotion/styled';

export const IMAGE_HEIGHT = 238;

export const ImageSkeleton = styled.div`
  width: 200px;
  height: ${IMAGE_HEIGHT}px;
  margin: 0 auto;
  animation: skeleton-loading 1s linear infinite alternate;

  @keyframes skeleton-loading {
    0% {
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'hsl(0,0%,40%)' : 'hsl(0, 0%, 95%)'};
    }
    100% {
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'hsl(0, 0%,32%)' : 'hsl(0, 0%, 87%)'};
    }
  }
`;
