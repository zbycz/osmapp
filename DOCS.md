# OsmAPP code concepts

Last update: 4/2024

## Clicking POIs in map

When clicking a feature on map (`useOnMapClicked`), we only get skeleton. That is a feature without tags, only with a few properties computed by our MVT tiles provider. We get `name`, `class` and `subclass`.

Note: `class` and `subclass` is used to display icons on the map, and osmapp mirrors this behaviour in `getPoiClass()` so we can generally show the same icons as the webgl map.

After user clicks a POI on the map, the skeleton is shown immediately in FeaturePanel and loading indicator starts spinning.

## Fetching features

This is done by next.js extension `getIntitialProps` on the `App` component. It is run on server-side if correct URL is loaded (SSR), or later in the browser.

1. getInitialFeature() – special getCoordsFeature() can be dispatched
2. fetchFeature() - gets the data
3. fetchFeatureWithCenter()
   - for ways and relations we ask overpass to fill in the `center` prop, so we save some data
   - osm data is converted to osmapp `Feature` type by `osmToFeature()` – compatible with GeoJSON spec
   - `addSchemaToFeature()` adds the iD presets and fields (we also fetch fresh `fetchSchemaTranslations()`). iD schema is still experimental, if this fails, osmapp will show just tags.
4. `addMembersAndParents()` – currently switched on only for select features
