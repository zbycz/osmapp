# OsmAPP – beta

Lets create a universal OpenStreetMap app for broad public. It should be as easy to use as Google Maps, including clickable POIs and editing capabilites. See also [SotM 2021 talk](https://github.com/zbycz/osmapp-talk).

- **production**: https://osmapp.org
  - examples: [Empire State Building](https://osmapp.org/way/34633854#17.00/40.7483/-73.9864), [Prague Castle](https://osmapp.org/relation/3312247#17.00/50.0900/14.4000) or click just anything
- **master branch**: https://osmapp-git-master-zbycz.vercel.app/
  - it is currently undergoing a [major refactoring to TailwindCSS](https://github.com/zbycz/osmapp/issues/165) thanks to [@Flohhhhh](https://github.com/Flohhhhh)
  - until finished, some components would be MUI and some new design
  - some functionality may be broken

## How to contribute 🐱‍💻

You may [add issues](https://github.com/zbycz/osmapp/issues) here on github, or try to update the code in three simple steps:

1. edit code online with pencil icon (this opens a pull-request) ✏️
2. wait few minutes for a preview URL 💬
3. iterate 🔁

> If you are a JS dev, you may also `git clone` / `yarn` / `yarn dev` \
> Or [open OsmAPP in gitpod](https://gitpod.io/#https://github.com/zbycz/osmapp) - full dev environment in your browser. \
> If Vercel build fails, please run `yarn build` locally to debug it.

## Features 🗺 📱 🖥

- **clickable map** – poi, cities, localities, ponds (more coming soon)
- **info panel** – images from Wikipedia, Mapillary or Fody
- **editing** – for anonymous users inserts a note
- **search engine** – try for example "Tesco, London"
- **vector maps** – with the possibility of tilting to 3D (drag the compass, or two fingers drag)
- **tourist map** – from MapTiler: vector, including marked routes
- **layer switcher** – still basic, but you can add your own layers
- **mobile applications** – see [osmapp.org/install](https://osmapp.org/install)
- **permanent URLs** – eg. [osmapp.org/way/123557148](https://osmapp.org/way/123557148)
- **creating POIs** – after clicking the coordinates (see eg. [osmapp.org/50.1,14.39](https://osmapp.org/50.1,14.39))
- **languages** – interface in English, Czech, German, Polish, Spanish, Amharic, Italian, French
- **undelete** – undo accidental delete in osmapp or elsewhere, eg. [here](https://osmapp.org/node/1219767385)
- and lot of little details 🙂

### Coming soon

- presets from iD for showing+editing (in progress) - [PR #131](https://github.com/zbycz/osmapp/pull/131)
- add routing [#31](https://github.com/zbycz/osmapp/issues/31)
- some ideas in [wireframes](https://drive.google.com/drive/folders/0B7awz2fKhg6yQ0JqTjhJRFV5aEE?resourcekey=0-NwX0M0KC3u85IGGyFonJAA&usp=sharing)

### Compatibility

- tested in Chrome 90 (Mac,Win,Android,iOS), Safari 14, Firefox 88, Edge 90 (slow)
- [webgl](https://caniuse.com/webgl) technology needed

### Changelog

- v1.3.0
  - added dark mode UI (@zbycz, [PR](https://github.com/zbycz/osmapp/pull/137))
  - updated to Mapillary v4 (@kudlav, [PR](https://github.com/zbycz/osmapp/pull/113))
  - added Spanish (@kresp0, [PR](https://github.com/zbycz/osmapp/pull/115))
  - added Italian (@ricloy, [PR](https://github.com/zbycz/osmapp/pull/108))
  - added French (@le-jun, [PR](https://github.com/zbycz/osmapp/pull/101))
- v1.2.0
  - changed search to Photon API (@kudlav, [PR](https://github.com/zbycz/osmapp/pull/84))
  - added Amharic (@amenk, [PR](https://github.com/zbycz/osmapp/pull/89))
  - added German (@amenk, [PR](https://github.com/zbycz/osmapp/pull/88))
  - added Polish (@strebski, [PR](https://github.com/zbycz/osmapp/pull/77))
- v1.1.0
  - changed search to Maptiler API (@charleneolsen, [PR](https://github.com/zbycz/osmapp/pull/57))

## License

GNU GPL
