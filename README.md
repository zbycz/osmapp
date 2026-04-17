# OsmAPP

Let's create a universal app for OpenStreetMap ecosystem.
It should be as easy to use as Google Maps, including clickable POIs and editing capabilites.
Built with React, Next.js and Maplibre GL.
See also [SotM 2021 talk](https://github.com/zbycz/osmapp-talk).

- master branch: https://osmapp.org
- examples: [Empire State Building](https://osmapp.org/way/34633854#17.00/40.7483/-73.9864), [Prague Castle](https://osmapp.org/relation/3312247#17.00/50.0900/14.4000) or click just anything

_Note:_ The OpenClimbing project was forked into a [stand-alone repository](https://github.com/jvaclavik/openclimbing) to enable faster iterations.

## How to contribute 🐱‍💻

You may [add issues](https://github.com/zbycz/osmapp/issues) here on GitHub, or try to update the code in three simple steps:

1. edit code online with pencil icon (this opens a pull-request) ✏️
2. wait few minutes for a preview URL 💬
3. iterate 🔁

> If you are a JS dev, you may also `git clone` / `yarn` / `yarn dev` \
> Or [open OsmAPP in gitpod](https://gitpod.io/#https://github.com/zbycz/osmapp) or GitHub Codespaces – full dev environment in your browser. \
> Consider setting `NEXT_PUBLIC_ENABLE_TEST_API=true` in `.env.local` for testing. \
> If Vercel build fails, please run `yarn build` locally to debug it. \
> [Architecture DOCS here](https://github.com/zbycz/osmapp/wiki/Architecture) + AI docs here: [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/zbycz/osmapp)

## Features 🗺 📱 🖥

- **clickable map** – POIs, cities, localities, ponds, airports (more coming soon)
- **feature panel** – presets and fields from iD editor
  - Display multiple images from Wikipedia, Wikidata, Commons, Mapillary, KartaView, Panoramax or Fody
  - public transport: clickable line numbers (on stops), routes on map (on stations), stop itineraries (on routes)
  - Socket types on electric vehicle charging stations
  - Runway table on airports, viewpoint direction arrow, colors as colors
- **editing** – Save changes with osm login. Insert note for anonymous users.
  - Opening hours editor – use simple editor for most common cases.
  - Relation hierarchy editor - simply click through relation childs and parents. Optimized for climbing=area, climbing=crag and routes.
- **search engine** – try for example "Tesco, London" (powered by Photon).
  - Category search from [iD editor presets](https://github.com/openstreetmap/id-tagging-schema)
  - For advanced users: support for overpass queries (e.g. `amenity=*` or `op:<query>`)
- **directions** - everyhing you need from modern app - drag&drop destinations, drag markers, click to map to select, etc. (by [GraphHopper Directions API](https://www.graphhopper.com/))
- **vector maps** – with the possibility of tilting to 3D (drag the compass, or do two fingers drag)
  - 3D terrain – turned on when tilted
  - tourist map – vector Outdoor map from MapTiler including marked routes
- **layer switcher** – you can add your own layers, also from editor-layer-index list
- **mobile applications** – using PWA technology, see [osmapp.org/install](https://osmapp.org/install)
- **permanent URLs** – eg. [osmapp.org/way/123557148](https://osmapp.org/way/123557148) and shortener, eg. [osmapp.org/kkjwwaw](https://osmapp.org/kkjwwaw)
- **creating POIs** – after clicking the coordinates (see e.g. [osmapp.org/50.1,14.39](https://osmapp.org/50.1,14.39))
- **languages** – interface in English, Czech, German, Polish, Spanish, Amharic, Italian, French, Japanese, Chinese (Simplified & Traditional), Russian
- **undelete** – undo accidental delete in osmapp or elsewhere, e.g. [here](https://osmapp.org/node/1219767385)
- and a lot of little details 🙂

### Change log + Roadmap

- ➡️ [Changelog here](https://github.com/zbycz/osmapp/releases)
- ➡️ [Roadmap here](https://github.com/zbycz/osmapp/issues/507)

_OsmAPP is updated continuously with every commit. Versioning is used only for summarizing the changes once in a while._

You may discuss OsmAPP in [Openstreetmap Discord, channel #software](https://discord.com/channels/413070382636072960/429092644438802432) – tag @zbycz.

## Special thanks to

We are standing on the shoulders of giants, OsmAPP would not be possible without:
[OpenStreetMap](https://www.openstreetmap.org/),
[MapLibre GL](https://maplibre.org/maplibre-gl-js/),
[Wikimedia projects](https://www.wikimedia.org/),
[Photon search](https://photon.komoot.io/),
[Mapillary](https://www.mapillary.com/),
[Overpass](https://wiki.openstreetmap.org/wiki/Overpass_API),
[iD editor tagging schema](https://github.com/openstreetmap/id-tagging-schema),
[indoor=](https://indoorequal.com/),
[React](https://react.dev/),
[Next.js](https://nextjs.org/),
[Material-UI](https://mui.com/),
and many, many others.

Also, big thanks for support/sponsorship from these awesome companies: ❤️

- [MapTiler](https://www.maptiler.com/) – vector tiles provider
- [Thunderforest](https://www.thunderforest.com/) - beatiful raster maps
- [GraphHopper Directions API](https://www.graphhopper.com/) - routing API
- [InteliJ IDEA](https://www.jetbrains.com/idea/) – Webstorm IDE
- [Sentry](https://sentry.io/) – error tracking
- [Vercel](https://vercel.com/) – preview deployments

## License

GNU GPL

## Related projects

- **OpenClimbing.org**
  - Open-data climbing maps and topos – OpenStreetMap + Wikimedia. Based on OsmAPP, forked into a separate repository in March 2026.
  - https://github.com/jvaclavik/openclimbing
- **Facilmap.org**
  - relation viewer, POIs filtering, collaborative maps, embed etc.
  - https://facilmap.org/ ([Github](https://github.com/FacilMap/facilmap))
- **Cartes.app** 🇫🇷
  - Universal osm app by [@leam](https://github.com/laem) via [#217](https://github.com/zbycz/osmapp/issues/217)
  - https://cartes.app ([GitHub](https://github.com/laem/cartes))
- **MapCarta**
  - Clickable OSM POIs, images from wikipedia
  - https://mapcarta.com (closed sourced)
- **Awesome OpenStreetMap projects**
  - curated list of OSM projects [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
  - https://github.com/osmlab/awesome-openstreetmap#readme
