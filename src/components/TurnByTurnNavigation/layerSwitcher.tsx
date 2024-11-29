import PersonAdd from '@mui/icons-material/PersonAdd';
import { isViewInsideBbox } from '../LayerSwitcher/helpers';
import { osmappLayers } from '../LayerSwitcher/osmappLayers';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';

const useLayers = () => {
  const { view, userLayers } = useMapStateContext();

  const toLayer = ([key, layer]): Layer => ({ ...layer, key });

  const entries = Object.entries(osmappLayers).filter(([_, { bboxes }]) => {
    if (!bboxes) return true;
    return bboxes.some((b) => isViewInsideBbox(view, b));
  });

  const basemaps = entries.filter(([, v]) => v.type === 'basemap');
  return [
    ...basemaps.map(toLayer),
    ...userLayers
      .filter(
        ({ bboxes }) =>
          !bboxes || bboxes.some((b) => isViewInsideBbox(view, b)),
      )
      .map((layer) => ({
        ...layer,
        key: layer.url,
        Icon: PersonAdd,
      })),
  ];
};

const StyledList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  list-style: none;
  padding: 0;
`;

const LayerButton = styled(ButtonBase)`
  width: 100%;
  overflow: hidden;
  padding-bottom: 0.5rem;
  flex-direction: column;
  gap: 0.5rem;

  border-radius: 0.5rem;
  outline: 1px solid ${({ theme }) => theme.palette.grey[700]};

  font-weight: 700;

  /* replace it with a preview img */
  div {
    height: 4rem;
    width: 100%;
    background: red;
    display: grid;
    align-items: center;
  }
`;

const LayerSwitcher = () => {
  const layers = useLayers();
  const { setActiveLayers } = useMapStateContext();

  return (
    <StyledList>
      {layers.map((layer) => (
        <li key={layer.key}>
          <LayerButton
            onClick={() => {
              setActiveLayers((prev) => [layer.key, ...prev.slice(1)]);
            }}
          >
            <div>PREVIEW IMG</div>
            {layer.name}
          </LayerButton>
        </li>
      ))}
    </StyledList>
  );
};

export const renderLayerSwitcher = () => <LayerSwitcher />;
