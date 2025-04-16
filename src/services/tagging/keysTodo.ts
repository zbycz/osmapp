import { Feature, FeatureTags } from '../types';
import { UiField } from './types/Presets';

export type KeysTodo = typeof keysTodo;

export const keysTodo = {
  state: [] as string[],
  init(feature: Feature) {
    this.state = Object.keys(feature.tags);
  },
  resolveTags(tags: FeatureTags) {
    Object.keys(tags).forEach((key) => this.remove(key));
  },
  has(key: string) {
    return this.state.includes(key);
  },
  hasAny(keys: string[]) {
    return keys?.some((key) => this.state.includes(key));
  },
  remove(key: string) {
    const index = this.state.indexOf(key);
    if (index > -1) {
      this.state.splice(index, 1);
    }
  },
  removeByRegexp(regexp: RegExp) {
    this.state = this.state.filter((key: string) => !regexp.test(key));
  },
  resolveFields(fieldsArray: UiField[]) {
    fieldsArray.forEach((field) => {
      if (field?.field?.key) {
        this.remove(field.field.key);
      }
      if (field?.field?.keys) {
        field.field.keys.forEach((key) => this.remove(key));
      }
    });
  },
  mapOrSkip<T>(fn: (key: string) => T): NonNullable<T>[] {
    const skippedFields = [];
    const output = [];

    while (this.state.length) {
      const field = this.state.shift();
      const result = fn(field); // this can remove items from this.state
      if (result) {
        output.push(result);
      } else {
        skippedFields.push(field);
      }
    }

    this.state = skippedFields;
    return output;
  },
};
