import { ScaleControl } from 'maplibre-gl';

// https://github.com/maplibre/maplibre-gl-js/blob/afe4377706429a6b4e708e62a3c39a795ae8f28e/src/ui/control/scale_control.js#L36-L83

class ClickableScaleControl extends (ScaleControl as any) {
  private onClick;

  private getHoverText;

  constructor({ onClick, getHoverText, ...options }) {
    super(options);
    this.onClick = onClick;
    this.getHoverText = getHoverText;
  }

  onAdd(map) {
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

const isImperial = () => window.localStorage.getItem('imperial');

export const PersistedScaleControl = new ClickableScaleControl({
  maxWidth: 80,
  unit: isImperial() ? 'imperial' : 'metric',
  onClick: () => {
    PersistedScaleControl.setUnit(isImperial() ? 'metric' : 'imperial');
    localStorage.setItem('imperial', isImperial() ? '' : 'yes');
  },
  getHoverText: () => (isImperial() ? 'km' : 'mile'),
});
