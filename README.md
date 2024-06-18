# OsmAPP

Let's create a universal OpenStreetMap app for broad public. It should be as easy to use as Google Maps, including clickable POIs and editing capabilites. See also [SotM 2021 talk](https://github.com/zbycz/osmapp-talk)

- master branch: https://osmapp.org
- examples: [Empire State Building](https://osmapp.org/way/34633854#17.00/40.7483/-73.9864), [Prague Castle](https://osmapp.org/relation/3312247#17.00/50.0900/14.4000) or click just anything

### project OpenClimbing.org (beta)

Open climbing maps and topos — photos are uploaded to _Wikimedia Commons_ and route data stored in _OpenStreetMap_ ([spec](https://wiki.openstreetmap.org/wiki/Key:wikimedia_commons:path)).

This is the same app deployed to another domain – only difference is branding and default layers.

- master branch: https://openclimbing.org
- examples: [Prokopské údolí](https://openclimbing.org/relation/17262674),
  [Roviště](https://openclimbing.org/relation/17130100),
  [Lomy nad Velkou](https://openclimbing.org/relation/17089246) or click just anything.

## How to contribute 🐱‍💻

You may [add issues](https://github.com/zbycz/osmapp/issues) here on github, or try to update the code in three simple steps:

1. edit code online with pencil icon (this opens a pull-request) ✏️
2. wait few minutes for a preview URL 💬
3. iterate 🔁

> If you are a JS dev, you may also `git clone` / `yarn` / `yarn dev` \
> Or [open OsmAPP in gitpod](https://gitpod.io/#https://github.com/zbycz/osmapp) or Github Codespaces - full dev environment in your browser. \
> If Vercel build fails, please run `yarn build` locally to debug it. \
> Some architecture [DOCS here](./DOCS.md)

## Features 🗺 📱 🖥

- **clickable map** – poi, cities, localities, ponds (more coming soon)
- **info panel** – presets and fields from iD, images from Wikipedia, Mapillary or Fody, line numbers on public transport stops
- **editing** – with osm login. For anonymous users a note is inserted.
- **search engine** – try for example "Tesco, London" (powered by Photon). Also category search from iD editor presets.
- **vector maps** – with the possibility of tilting to 3D (drag the compass, or do two fingers drag)
- **3D terrain** – turned on when tilted (use terrain icon to toggle off)
- **tourist map** – from MapTiler: vector, including marked routes
- **layer switcher** – still basic, but you can add your own layers
- **mobile applications** – using PWA technology, see [osmapp.org/install](https://osmapp.org/install)
- **permanent URLs** – eg. [osmapp.org/way/123557148](https://osmapp.org/way/123557148) and shortener, eg. [osmapp.org/kkjwwaw](https://osmapp.org/kkjwwaw)
- **creating POIs** – after clicking the coordinates (see eg. [osmapp.org/50.1,14.39](https://osmapp.org/50.1,14.39))
- **languages** – interface in English, Czech, German, Polish, Spanish, Amharic, Italian, French
- **undelete** – undo accidental delete in osmapp or elsewhere, eg. [here](https://osmapp.org/node/1219767385)
- and lot of little details 🙂

### Coming soon

- add routing [#31](https://github.com/zbycz/osmapp/issues/31)
- some ideas in [wireframes](https://drive.google.com/drive/folders/0B7awz2fKhg6yQ0JqTjhJRFV5aEE?resourcekey=0-NwX0M0KC3u85IGGyFonJAA&usp=sharing)

### Compatibility

- tested in Chrome 90 (Mac,Win,Android,iOS), Safari 14, Firefox 88, Edge 90 (slow)
- [webgl](https://caniuse.com/webgl) technology needed

### Changelog

OsmAPP is updated continuously with every commit, versioning just for reference:

- **v1.4.0** (added until 6/2024)
  - FeaturePanel
    - 🎉 use iD Tagging scheme for properties ([PR](https://github.com/zbycz/osmapp/pull/131), [2](https://github.com/zbycz/osmapp/pull/197))
    - 🖼 add panellum Panorama viewer for Mapillary (@Dlurak, [PR](https://github.com/zbycz/osmapp/pull/234))
    - ⭐️ add Stars (favorites) to every element ([PR](https://github.com/zbycz/osmapp/pull/229))
    - 🚌 add public transport labels (@Dlurak, [PR](https://github.com/zbycz/osmapp/pull/175), [2](https://github.com/zbycz/osmapp/pull/187))
    - add Food hygiene rating scheme (@Dlurak, [PR](https://github.com/zbycz/osmapp/pull/179))
    - add geoUri to coordinates dropdown ([PR](https://github.com/zbycz/osmapp/pull/153))

  - Search
    - 🔎 add search by categories + by overpass query ([PR](https://github.com/zbycz/osmapp/pull/186), [2](https://github.com/zbycz/osmapp/pull/192), [3](https://github.com/zbycz/osmapp/pull/213))

  - Layers:
    - 🏔️ add 3D terrain when user tilts ([PR](https://github.com/zbycz/osmapp/pull/184), [2](https://github.com/zbycz/osmapp/pull/193))
    - ❄️ add overlays support + Snow overlay ([PR](https://github.com/zbycz/osmapp/pull/244))
    - 🏞️ add cliffs to outdoor style ([PR](https://github.com/zbycz/osmapp/pull/264))
    - add attribution to layers ([PR](https://github.com/zbycz/osmapp/pull/154))
    - use new maptiler satellite (@kudlav, [PR](https://github.com/zbycz/osmapp/pull/151))
    - add bing satellite ([PR](https://github.com/zbycz/osmapp/pull/155))
    - add OpenPlaceGuide Africa - makina maps in Africa bbox ([PR](https://github.com/zbycz/osmapp/pull/205))
    - add ČÚZK Ortophoto in CZ bbox ([PR](https://github.com/zbycz/osmapp/pull/245))

  - misc
    - 🕸️ add url shortener for every feature ([PR](https://github.com/zbycz/osmapp/pull/290))
    - hackish fix of corrupted id from Maptiler ([PR](https://github.com/zbycz/osmapp/pull/230))
    - use OAuth 2.0, login button ([PR](https://github.com/zbycz/osmapp/pull/235), [2](https://github.com/zbycz/osmapp/pull/316), [3](https://github.com/zbycz/osmapp/pull/355))
    - add disclaimer to homepage - not an official app ([PR](https://github.com/zbycz/osmapp/pull/233))
    - optimize homepage because of [hackernews mention](https://news.ycombinator.com/item?id=38795559) 😵 ([PR](https://github.com/zbycz/osmapp/pull/219))
    - support language prefixes for all URLs for SEO ([PR](https://github.com/zbycz/osmapp/pull/141))

  - climbing features
    - 🧗 topo viewer and editor (@jvaclavik, many PRs starting with `climbing:`)
    - 🗺️ add climbing overlay ([PR](https://github.com/zbycz/osmapp/pull/295), [2](https://github.com/zbycz/osmapp/pull/294), [3](https://github.com/zbycz/osmapp/pull/293), [4](https://github.com/zbycz/osmapp/pull/292), [5](https://github.com/zbycz/osmapp/pull/344))
    - add branding for openclimbing.org domain ([PR](https://github.com/zbycz/osmapp/pull/263))

- **v1.3.0** (3/2023)
  - 💡 added dark mode UI ([PR](https://github.com/zbycz/osmapp/pull/137))
  - 🖼 updated to Mapillary v4 (@kudlav, [PR](https://github.com/zbycz/osmapp/pull/113))
  - added Spanish (@kresp0, [PR](https://github.com/zbycz/osmapp/pull/115))
  - added Italian (@ricloy, [PR](https://github.com/zbycz/osmapp/pull/108))
  - added French (@le-jun, [PR](https://github.com/zbycz/osmapp/pull/101))

- **v1.2.0** (2/2022)
  - 🔎 changed search to Photon API (@kudlav, [PR](https://github.com/zbycz/osmapp/pull/84))
  - added Amharic (@amenk, [PR](https://github.com/zbycz/osmapp/pull/89))
  - added German (@amenk, [PR](https://github.com/zbycz/osmapp/pull/88))
  - added Polish (@strebski, [PR](https://github.com/zbycz/osmapp/pull/77))

- **v1.1.0** (8/2021)
  - changed search to Maptiler API (@charleneolsen, [PR](https://github.com/zbycz/osmapp/pull/57))

## License

GNU GPL

## Related projects

Both via [#217](https://github.com/zbycz/osmapp/issues/217)

- **Qwant Maps** (sadly not developed anymore)

  - great tech stack: [BE in Python](https://github.com/Qwant/idunn), geocoding, directions, maplibre gl
  - https://github.com/Qwant/qwantmaps (may be recycled for osmapp in future)
  - eg. https://qwant.com/maps/place/osm:node:1369322781 - super fast (offline as of 6/24)

- Future.eco Voyage
  - Universal osm app by [@leam](https://github.com/laem)
  - https://futur.eco/voyage ([github](https://github.com/laem/futureco/tree/master/app/voyage))
