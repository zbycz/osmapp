import presets from '../../../data/presets.json';
import { Feature } from '../types';

// taken from iD codebase https://github.com/openstreetmap/iD/blob/dd30a39d7487e1084396712ce861f4b6c5a07849/modules/presets/preset.js#L61
const matchScore = (_this, entityTags) => {
  const tags = _this.tags;
  let seen = {};
  let score = 0;

  // match on tags
  for (let k in tags) {
    seen[k] = true;
    if (entityTags[k] === tags[k]) {
      score += _this.originalScore;
    } else if (tags[k] === '*' && k in entityTags) {
      score += _this.originalScore / 2;
    } else {
      return -1;
    }
  }

  // boost score for additional matches in addTags - #6802
  const addTags = _this.addTags;
  for (let k in addTags) {
    if (!seen[k] && entityTags[k] === addTags[k]) {
      score += _this.originalScore;
    }
  }

  if (_this.searchable === false) {
    score *= 0.999;
  }

  return score;
};

const index = {
  node: [],
  way: [],
  relation: [],
};

// build an index by geometry type
Object.entries(presets).forEach(([presetKey, preset]) => {
  const { geometry, tags } = preset;

  geometry.forEach((geometryType) => {
    const record = {
      presetKey,
      originalScore: preset.matchScore ?? 1,
      ...preset,
    };

    // OsmAPP can't distinguish between points and vertices
    if (geometryType == 'point' || geometryType == 'vertex') {
      index['node'].push(record);
    } else if (geometryType == 'line') {
      index['way'].push(record);
    } else if (geometryType == 'area') {
      index['way'].push(record);
      index['relation'].push(record);
    } else if (geometryType == 'relation') {
      index['relation'].push(record);
    }
  });
});

// inspired by _this.matchTags() in iD codebase
export const getPresetForFeature = (feature: Feature) => {
  const { tags, osmMeta } = feature;
  const { type } = osmMeta;
  const candidates = [];

  index[type].forEach((candidate) => {
    const score = matchScore(candidate, tags);
    if (score !== -1) {
      candidates.push({ score, candidate });
    }
  });

  return candidates.sort((a, b) => b.score - a.score)[0].candidate;
};
