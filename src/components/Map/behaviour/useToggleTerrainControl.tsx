/* eslint-disable  no-underscore-dangle */
import maplibregl from 'maplibre-gl';
import { useAddMapEvent } from '../../helpers';

class OsmappTerrainControl extends maplibregl.TerrainControl {
  _toggleTerrain = () => {
    if (this._map.getTerrain()) {
      this._map.setTerrain(null);
      this._map.setMaxPitch(60);
    } else {
      this._map.setTerrain(this.options);
      this._map.setMaxPitch(85);
    }
    this._updateTerrainIcon();
  };
}

const terrainControl = new OsmappTerrainControl({
  source: 'terrain',
  exaggeration: 1,
});

let added = false;

export const useToggleTerrainControl = useAddMapEvent((map) => ({
  eventType: 'move',
  eventHandler: () => {
    if (map.getPitch() > 0) {
      if (!added) {
        map.addControl(terrainControl);
        added = true;
      }
    } else if (added) {
      map.removeControl(terrainControl);
      added = false;
    }
  },
}));
