import { presets } from './data';
import { Feature } from '../types';
import { Preset } from './types/Presets';

// taken from iD codebase https://github.com/openstreetmap/iD/blob/dd30a39d7487e1084396712ce861f4b6c5a07849/modules/presets/preset.js#L61
// _this is "preset" object with originalScore set
const matchScore = (_this, entityTags) => {
  /* eslint-disable no-restricted-syntax,guard-for-in */
  const { tags } = _this;
  const seen = {};
  let score = 0;

  // match on tags
  for (const k in tags) {
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
  const { addTags } = _this;
  for (const k in addTags) {
    if (!seen[k] && entityTags[k] === addTags[k]) {
      score += _this.originalScore;
    }
  }

  if (_this.searchable === false) {
    score *= 0.999;
  }

  return score;
  /* eslint-enable no-restricted-syntax,guard-for-in */
};

const index = {
  node: [],
  way: [],
  relation: [],
};

// build an index by geometry type
Object.values(presets).forEach((preset) => {
  const { geometry } = preset;

  geometry.forEach((geometryType) => {
    const record = {
      originalScore: (preset as any).matchScore ?? 1,
      ...preset,
    };

    // OsmAPP can't distinguish between points and vertices
    if (geometryType === 'point' || geometryType === 'vertex') {
      index.node.push(record);
    } else if (geometryType === 'line') {
      index.way.push(record);
    } else if (geometryType === 'area') {
      index.way.push(record);
      index.relation.push(record);
    } else if (geometryType === 'relation') {
      index.relation.push(record);
    }
  });
});

// inspired by _this.matchTags() in iD codebase
export const getPresetForFeature = (feature: Feature): Preset => {
  const { tags, osmMeta } = feature;
  const { type } = osmMeta;
  const candidates = [];

  index[type].forEach((candidate) => {
    const score = matchScore(candidate, tags);
    if (score !== -1) {
      candidates.push({ score, candidate });
    }
  });

  // iD editor has index by keys, which is sorted by alphabet. So amenities (eg.amenity=fountain) is sooner than natural=water .. LOL
  const sortedByKey = candidates.sort((a, b) =>
    Object.keys(a.candidate.tags)?.[0]?.localeCompare(
      Object.keys(b.candidate.tags)?.[0],
    ),
  );
  const sortedByScore = sortedByKey.sort((a, b) => b.score - a.score);
  const winner = sortedByScore[0];

  const winners = sortedByScore.filter((c) => c.score === winner.score);
  if (winners.length > 1) {
    console.info('This feature matches more presets by same score:', winners);
  }

  return winner.candidate;
};
