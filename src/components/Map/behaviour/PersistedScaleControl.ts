import { Map, ScaleControl } from 'maplibre-gl';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';
import { useEffect, MutableRefObject } from 'react';

// https://github.com/maplibre/maplibre-gl-js/blob/afe4377706429a6b4e708e62a3c39a795ae8f28e/src/ui/control/scale_control.js#L36-L83

class ClickableScaleControl extends ScaleControl {
  private onClick: () => void;

  private getHoverText: () => string;

  constructor({ onClick, getHoverText, ...options }) {
    super(options);
    this.onClick = onClick;
    this.getHoverText = getHoverText;
  }

  onAdd(map: Map) {
    const control = super.onAdd(map);
    control.addEventListener('click', this.onClick);
    control.setAttribute('style', 'cursor: pointer');

    control.addEventListener('mouseover', () =>
      this.setText(this.getHoverText()),
    );
    control.addEventListener('mouseout', () => this._onMove()); // eslint-disable-line no-underscore-dangle

    return control;
  }

  private setText(text: string) {
    this._container.innerHTML = text; // eslint-disable-line no-underscore-dangle
  }
}

export const usePersistedScaleControl = (
  mapRef: MutableRefObject<Map | null>,
  isReady: boolean,
) => {
  const { userSettings, setUserSetting } = useUserSettingsContext();
  const { isImperial } = userSettings;

  useEffect(() => {
    const map = mapRef.current;
    if (!isReady || !map) return;

    const scaleControl = new ClickableScaleControl({
      maxWidth: 80,
      unit: isImperial ? 'imperial' : 'metric',
      onClick: () => setUserSetting('isImperial', !isImperial),
      getHoverText: () => (isImperial ? 'km' : 'mile'),
    });

    try {
      map.addControl(scaleControl, 'bottom-right');
    } catch {}

    return () => {
      try {
        map.removeControl(scaleControl);
      } catch {}
    };
  }, [mapRef, isReady, isImperial, setUserSetting]);
};
