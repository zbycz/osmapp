# OsmAPP - OpenPlaceGuide Fork

Additional features for OpenPlaceGuide

- Allow Proxying requests which are not handled by OsmAPP
- Include link to OpenPlaceGuide pages (via discover service)
- Short links have a prefix "-"
- Currently branded for the beta deployment on [map.et](https://map.et/)

## Versioning

We use calver, `YY.MM.DD_MICRO` for the released, tagged on opg-master which is irregularly rebased on upstream/master

## Building / OPG-pages

This app integrates with OPG-pages to create a business directory with the interactive map as the start page.

To use this container together with the `docker-compose.yml` of [opg-pages](https://github.com/OpenPlaceGuide/opg-pages),
we specify `PROXY_BACKEND` during build.

```bash
docker build --build-arg PROXY_BACKEND=http://opg-pages/ . -t osmapp
```

## Development

We regularly rebase on upstream/master and try to keep changes as minimal as possible as well to contribute back anything
which is useful.

```
git fetch upstream
git checkout opg-master
git rebase upstream/master
```

That means our master branch does not reflect the full history. Old state can be restored using the release tags.

# OsmAPP – beta (Original Readme)

Let's create a universal app for OpenStreetMap ecosystem.
It should be as easy to use as Google Maps, including clickable POIs and editing capabilites.
Built with React, Next.js and Maplibre GL.
See also [SotM 2021 talk](https://github.com/zbycz/osmapp-talk).

- master branch: https://osmapp.org
- examples: [Empire State Building](https://osmapp.org/way/34633854#17.00/40.7483/-73.9864), [Prague Castle](https://osmapp.org/relation/3312247#17.00/50.0900/14.4000) or click just anything

### project OpenClimbing.org (beta)

Open climbing maps and topos. Photos are uploaded to _Wikimedia Commons_ and route data stored in _OpenStreetMap_ ([spec](https://wiki.openstreetmap.org/wiki/Key:wikimedia_commons:path)).

- **[Story behind openclimbing.org](https://medium.com/@jvaclavik/story-behind-openclimbing-org-ab448939c6ac)**
- master branch: https://openclimbing.org
- examples: [Prokopské údolí](https://openclimbing.org/relation/17262674),
  [Roviště](https://openclimbing.org/relation/17130100),
  [Lomy nad Velkou](https://openclimbing.org/relation/17089246) or click just anything.
- This is the same app served on another domain – only difference is branding and default layers.

## How to contribute 🐱‍💻

You may [add issues](https://github.com/zbycz/osmapp/issues) here on GitHub, or try to update the code in three simple steps:

1. edit code online with pencil icon (this opens a pull-request) ✏️
2. wait few minutes for a preview URL 💬
3. iterate 🔁

> If you are a JS dev, you may also `git clone` / `yarn` / `yarn dev` \
> Or [open OsmAPP in gitpod](https://gitpod.io/#https://github.com/zbycz/osmapp) or GitHub Codespaces – full dev environment in your browser. \
> If Vercel build fails, please run `yarn build` locally to debug it. \
> [Architecture DOCS here](https://github.com/zbycz/osmapp/wiki/Architecture).

## Features 🗺 📱 🖥

- **clickable map** – poi, cities, localities, ponds (more coming soon)
- **feature panel** – presets and fields from iD editor
  - Display multiple images from Wikipedia, Wikidata, Commons, Mapillary, KartaView, Panoramax or Fody
  - public transport: clickable line numbers (on stops), routes on map (on stations), stop itineraries (on routes)
  - Runway table on airports
  - Socket types on electric vehicle charging stations
- **editing** – Save changes with osm login. Insert note for anonymous users.
  - Opening hours editor – use simple editor for most common cases.
- **search engine** – try for example "Tesco, London" (powered by Photon).
  - Category search from [iD editor presets](https://github.com/openstreetmap/id-tagging-schema)
  - For advanced users: support for overpass queries (eg. `amenity=*` or `op:<query>`)
- **vector maps** – with the possibility of tilting to 3D (drag the compass, or do two fingers drag)
  - 3D terrain – turned on when tilted
  - tourist map – vector Outdoor map from MapTiler including marked routes
- **layer switcher** – you can add your own layers, also from editor-layer-index list
- **mobile applications** – using PWA technology, see [osmapp.org/install](https://osmapp.org/install)
- **permanent URLs** – eg. [osmapp.org/way/123557148](https://osmapp.org/way/123557148) and shortener, eg. [osmapp.org/kkjwwaw](https://osmapp.org/kkjwwaw)
- **creating POIs** – after clicking the coordinates (see eg. [osmapp.org/50.1,14.39](https://osmapp.org/50.1,14.39))
- **languages** – interface in English, Czech, German, Polish, Spanish, Amharic, Italian, French, Japanese
- **undelete** – undo accidental delete in osmapp or elsewhere, eg. [here](https://osmapp.org/node/1219767385)
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
[React](https://react.dev/),
[Next.js](https://nextjs.org/),
[Material-UI](https://mui.com/),
and many, many others.

Also, big thanks for Free licenses from these awesome companies:

- [MapTiler](https://www.maptiler.com/) – vector tiles
- [InteliJ IDEA](https://www.jetbrains.com/idea/) – Webstorm IDE
- [Sentry](https://sentry.io/) – error tracking
- [Vercel](https://vercel.com/) – hosting with generous free-tier \
  [![vercel.svg](.github/vercel.svg)](https://vercel.com/?utm_source=osm-app-team&utm_campaign=oss)

## License

GNU GPL

## Related projects

- **Cartes.app** 🇫🇷
  - Universal osm app by [@leam](https://github.com/laem) via [#217](https://github.com/zbycz/osmapp/issues/217)
  - https://cartes.app ([GitHub](https://github.com/laem/cartes))
- **OpenStreetMap-NG**
  - Migration of OSM.org to new technologies. We support this project! 🤞❤️
  - [https://github.com/Zaczero/openstreetmap-ng](https://github.com/Zaczero/openstreetmap-ng/blob/main/ANNOUNCEMENT.md)
- **Qwant Maps** (sadly not developed anymore)
  - great tech stack: [BE in Python](https://github.com/Qwant/idunn), geocoding, directions, MaplibreGL. We may reuse parts of code in future. Url was eg. `https://qwant.com/maps/place/osm:node:1369322781` – super fast + SSR.
  - https://github.com/Qwant/qwantmaps
- **Awesome OpenStreetMap projects**
  - curated list of OSM projects [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
  - https://github.com/osmlab/awesome-openstreetmap#readme
