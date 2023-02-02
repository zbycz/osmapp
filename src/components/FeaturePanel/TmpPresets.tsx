import React from 'react';
import { getSchemaForFeature } from '../../services/tagging/idTaggingScheme';
import { Feature } from '../../services/types';

export const TmpPresets = ({ feature }: { feature: Feature }) => {
  const schema = getSchemaForFeature(feature);

  console.log(schema);

  return (
    <div>
      <hr />

      <h3>{schema.label} ({schema.presetKey})</h3>

      {schema.matchedFields.map(({ label, value }) => (
        <>
          <b>{label}</b>: {value}
          <br />
        </>
      ))}

      <hr />
    </div>
  );
};
