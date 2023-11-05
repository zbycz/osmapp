import React from 'react';
import {
  PanelContent,
  PanelScrollbars,
  PanelWrapper,
} from '../../src/components/utils/PanelHelpers';
import { presets } from '../../src/services/tagging/data';
import {
  fetchSchemaTranslations,
  getPresetTranslation,
} from '../../src/services/tagging/translations';
import { getServerIntl } from '../../src/services/intlServer';
import { setIntl } from '../../src/services/intl';
// import { getPresetForFeature } from '../../src/services/tagging/presets';

const Category = ({ heading, out, time }) => (
    <PanelWrapper>
      <PanelScrollbars>
        <PanelContent>
          <h1>{heading}</h1>
          <p>{time} ms</p>

          <ul>
            {out.map((item) => (
                <li key={item.id}>
                  <a href={`/${item.type}/${item.id}`}>{item.name}</a>
                </li>
              ))}
          </ul>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
export const getServerSideProps = async (ctx) => {
  const { query } = ctx;
  const { key } = query;

  const preset = presets[Array.isArray(key) ? key.join('/') : key];
  if (!preset) {
    return {
      notFound: true,
    };
  }

  setIntl(await getServerIntl(ctx));
  await fetchSchemaTranslations(); // TODO import cycle
  const { presetKey, name } = preset;
  const heading = getPresetTranslation(presetKey) ?? name ?? presetKey;

  const start = performance.now();
  // load file all.json
  const all = await import('../../public/lists/all.json');

  const out = all.elements.map((feature) => 
    // const presetForFeature = getPresetForFeature({
    //   ...feature,
    //   osmMeta: { type: feature.type },
    // });

     ({
      id: feature.id,
      type: feature.type,
      name: feature.tags.name,
      // label: getPresetTranslation(presetForFeature.presetKey),
    })
  );

  const time = Math.round(performance.now() - start);

  return { props: { heading, preset, out, time } };
};

export default Category;
