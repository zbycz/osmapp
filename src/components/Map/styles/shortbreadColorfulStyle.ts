import { GLYPHS, OSMAPP_SOURCES, OSMAPP_SPRITE } from '../consts';
import { StyleSpecification } from 'maplibre-gl';

// https://github.com/versatiles-org/versatiles-style
export const shortbreadColorfulStyle = {
  version: 8,
  name: 'versatiles-shadow',
  metadata: {
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  sources: OSMAPP_SOURCES,
  sprite: [
    ...OSMAPP_SPRITE,
    {
      id: 'basics',
      url: 'https://vector.openstreetmap.org/demo/shortbread/sprites/basics/sprites',
    },
  ],
  glyphs: GLYPHS,

  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'rgb(249,244,238)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-ocean',
      type: 'fill',
      'source-layer': 'ocean',
      paint: {
        'fill-color': 'rgb(190,221,243)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-glacier',
      type: 'fill',
      'source-layer': 'water_polygons',
      filter: ['all', ['==', 'kind', 'glacier']],
      paint: {
        'fill-color': 'rgb(255,255,255)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-commercial',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'commercial', 'retail']],
      paint: {
        'fill-color': 'rgba(247,222,237,0.251)',
        'fill-opacity': {
          stops: [
            [10, 0],
            [11, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-industrial',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'industrial', 'quarry', 'railway']],
      paint: {
        'fill-color': 'rgba(255,244,194,0.333)',
        'fill-opacity': {
          stops: [
            [10, 0],
            [11, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-residential',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'garages', 'residential']],
      paint: {
        'fill-color': 'rgba(234,230,225,0.2)',
        'fill-opacity': {
          stops: [
            [10, 0],
            [11, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-agriculture',
      type: 'fill',
      'source-layer': 'land',
      filter: [
        'all',
        [
          'in',
          'kind',
          'brownfield',
          'farmland',
          'farmyard',
          'greenfield',
          'greenhouse_horticulture',
          'orchard',
          'plant_nursery',
          'vineyard',
        ],
      ],
      paint: {
        'fill-color': 'rgb(240,231,209)',
        'fill-opacity': {
          stops: [
            [10, 0],
            [11, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-waste',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'landfill']],
      paint: {
        'fill-color': 'rgb(219,214,189)',
        'fill-opacity': {
          stops: [
            [10, 0],
            [11, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-park',
      type: 'fill',
      'source-layer': 'land',
      filter: [
        'all',
        ['in', 'kind', 'park', 'village_green', 'recreation_ground'],
      ],
      paint: {
        'fill-color': 'rgb(217,217,165)',
        'fill-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-garden',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'allotments', 'garden']],
      paint: {
        'fill-color': 'rgb(217,217,165)',
        'fill-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-burial',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'cemetery', 'grave_yard']],
      paint: {
        'fill-color': 'rgb(221,219,202)',
        'fill-opacity': {
          stops: [
            [13, 0],
            [14, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-leisure',
      type: 'fill',
      'source-layer': 'land',
      filter: [
        'all',
        ['in', 'kind', 'miniature_golf', 'playground', 'golf_course'],
      ],
      paint: {
        'fill-color': 'rgb(231,237,222)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-rock',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'bare_rock', 'scree', 'shingle']],
      paint: {
        'fill-color': 'rgb(224,228,229)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-forest',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'forest']],
      paint: {
        'fill-color': 'rgb(102,170,68)',
        'fill-opacity': {
          stops: [
            [7, 0],
            [8, 0.1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-grass',
      type: 'fill',
      'source-layer': 'land',
      filter: [
        'all',
        ['in', 'kind', 'grass', 'grassland', 'meadow', 'wet_meadow'],
      ],
      paint: {
        'fill-color': 'rgb(216,232,200)',
        'fill-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-vegetation',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'heath', 'scrub']],
      paint: {
        'fill-color': 'rgb(217,217,165)',
        'fill-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-sand',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'beach', 'sand']],
      paint: {
        'fill-color': 'rgb(250,250,237)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'land-wetland',
      type: 'fill',
      'source-layer': 'land',
      filter: ['all', ['in', 'kind', 'bog', 'marsh', 'string_bog', 'swamp']],
      paint: {
        'fill-color': 'rgb(211,230,219)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-river',
      type: 'line',
      'source-layer': 'water_lines',
      filter: [
        'all',
        ['in', 'kind', 'river'],
        ['!=', 'tunnel', true],
        ['!=', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(190,221,243)',
        'line-width': {
          stops: [
            [9, 0],
            [10, 3],
            [15, 5],
            [17, 9],
            [18, 20],
            [20, 60],
          ],
        },
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-canal',
      type: 'line',
      'source-layer': 'water_lines',
      filter: [
        'all',
        ['in', 'kind', 'canal'],
        ['!=', 'tunnel', true],
        ['!=', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(190,221,243)',
        'line-width': {
          stops: [
            [9, 0],
            [10, 2],
            [15, 4],
            [17, 8],
            [18, 17],
            [20, 50],
          ],
        },
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-stream',
      type: 'line',
      'source-layer': 'water_lines',
      filter: [
        'all',
        ['in', 'kind', 'stream'],
        ['!=', 'tunnel', true],
        ['!=', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(190,221,243)',
        'line-width': {
          stops: [
            [13, 0],
            [14, 1],
            [15, 2],
            [17, 6],
            [18, 12],
            [20, 30],
          ],
        },
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-ditch',
      type: 'line',
      'source-layer': 'water_lines',
      filter: [
        'all',
        ['in', 'kind', 'ditch'],
        ['!=', 'tunnel', true],
        ['!=', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(190,221,243)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [17, 4],
            [18, 8],
            [20, 20],
          ],
        },
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-area',
      type: 'fill',
      'source-layer': 'water_polygons',
      filter: ['==', 'kind', 'water'],
      paint: {
        'fill-color': 'rgb(190,221,243)',
        'fill-opacity': {
          stops: [
            [4, 0],
            [6, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-area-river',
      type: 'fill',
      'source-layer': 'water_polygons',
      filter: ['==', 'kind', 'river'],
      paint: {
        'fill-color': 'rgb(190,221,243)',
        'fill-opacity': {
          stops: [
            [4, 0],
            [6, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-area-small',
      type: 'fill',
      'source-layer': 'water_polygons',
      filter: ['in', 'kind', 'reservoir', 'basin', 'dock'],
      paint: {
        'fill-color': 'rgb(190,221,243)',
        'fill-opacity': {
          stops: [
            [4, 0],
            [6, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-dam-area',
      type: 'fill',
      'source-layer': 'dam_polygons',
      filter: ['==', 'kind', 'dam'],
      paint: {
        'fill-color': 'rgb(249,244,238)',
        'fill-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-dam',
      type: 'line',
      'source-layer': 'dam_lines',
      filter: ['==', 'kind', 'dam'],
      paint: {
        'line-color': 'rgb(190,221,243)',
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-pier-area',
      type: 'fill',
      'source-layer': 'pier_polygons',
      filter: ['in', 'kind', 'pier', 'breakwater', 'groyne'],
      paint: {
        'fill-color': 'rgb(249,244,238)',
        'fill-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'water-pier',
      type: 'line',
      'source-layer': 'pier_lines',
      filter: ['in', 'kind', 'pier', 'breakwater', 'groyne'],
      paint: {
        'line-color': 'rgb(249,244,238)',
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-dangerarea',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'danger_area'],
      paint: {
        'fill-color': 'rgb(255,0,0)',
        'fill-outline-color': 'rgb(255,0,0)',
        'fill-opacity': 0.3,
        'fill-pattern': 'basics:pattern-warning',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-university',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'university'],
      paint: {
        'fill-color': 'rgb(255,255,128)',
        'fill-opacity': 0.1,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-college',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'college'],
      paint: {
        'fill-color': 'rgb(255,255,128)',
        'fill-opacity': 0.1,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-school',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'school'],
      paint: {
        'fill-color': 'rgb(255,255,128)',
        'fill-opacity': 0.1,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-hospital',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'hospital'],
      paint: {
        'fill-color': 'rgb(255,102,102)',
        'fill-opacity': 0.1,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-prison',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'prison'],
      paint: {
        'fill-color': 'rgb(253,242,252)',
        'fill-pattern': 'basics:pattern-striped',
        'fill-opacity': 0.1,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-parking',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'parking'],
      paint: {
        'fill-color': 'rgb(235,232,230)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-bicycleparking',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'bicycle_parking'],
      paint: {
        'fill-color': 'rgb(235,232,230)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'site-construction',
      type: 'fill',
      'source-layer': 'sites',
      filter: ['in', 'kind', 'construction'],
      paint: {
        'fill-color': 'rgb(169,169,169)',
        'fill-pattern': 'basics:pattern-hatched_thin',
        'fill-opacity': 0.1,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'airport-area',
      type: 'fill',
      'source-layer': 'street_polygons',
      filter: ['in', 'kind', 'runway', 'taxiway'],
      paint: {
        'fill-color': 'rgb(255,255,255)',
        'fill-opacity': 0.5,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'airport-taxiway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['==', 'kind', 'taxiway'],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [13, 0],
            [14, 2],
            [15, 10],
            [16, 14],
            [18, 20],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'airport-runway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['==', 'kind', 'runway'],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 6],
            [13, 9],
            [14, 16],
            [15, 24],
            [16, 40],
            [17, 100],
            [18, 160],
            [20, 300],
          ],
        },
      },
      layout: {
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'airport-taxiway',
      type: 'line',
      'source-layer': 'streets',
      filter: ['==', 'kind', 'taxiway'],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [13, 0],
            [14, 1],
            [15, 8],
            [16, 12],
            [18, 18],
            [20, 36],
          ],
        },
        'line-opacity': {
          stops: [
            [13, 0],
            [14, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'airport-runway',
      type: 'line',
      'source-layer': 'streets',
      filter: ['==', 'kind', 'runway'],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 5],
            [13, 8],
            [14, 14],
            [15, 22],
            [16, 38],
            [17, 98],
            [18, 158],
            [20, 298],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'building:outline',
      type: 'fill',
      'source-layer': 'buildings',
      paint: {
        'fill-color': 'rgb(223,219,215)',
        'fill-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'building',
      type: 'fill',
      'source-layer': 'buildings',
      paint: {
        'fill-color': 'rgb(242,234,226)',
        'fill-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
        'fill-translate': [-2, -2],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-pedestrian-zone',
      type: 'fill',
      'source-layer': 'street_polygons',
      filter: ['all', ['==', 'tunnel', true], ['==', 'kind', 'pedestrian']],
      paint: {
        'fill-color': 'rgb(247,247,247)',
        'fill-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-footway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'footway']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'hsl(288,13%,86%)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-steps:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'steps']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'hsl(288,13%,86%)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-path:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'path']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'hsl(288,13%,86%)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-cycleway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'cycleway']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'hsl(203,11%,87%)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-track:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'track'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [14, 2],
            [16, 4],
            [18, 18],
            [19, 48],
            [20, 96],
          ],
        },
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-pedestrian:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'pedestrian'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'service'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(221,220,218)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 3],
            [18, 12],
            [19, 32],
            [20, 48],
          ],
        },
        'line-opacity': {
          stops: [
            [15, 0],
            [16, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-livingstreet:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'living_street'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-residential:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'residential'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-unclassified:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'unclassified'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-tertiary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-secondary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-primary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-trunk-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-motorway-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-tertiary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(222,222,222)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-secondary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [11, 2],
            [14, 5],
            [16, 8],
            [18, 30],
            [19, 68],
            [20, 138],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-primary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [8, 0],
            [9, 1],
            [10, 4],
            [14, 6],
            [16, 12],
            [18, 36],
            [19, 74],
            [20, 144],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-trunk:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [7, 0],
            [8, 2],
            [10, 4],
            [14, 6],
            [16, 12],
            [18, 36],
            [19, 74],
            [20, 144],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-motorway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(234,176,126)',
        'line-dasharray': [1, 0.3],
        'line-width': {
          stops: [
            [5, 0],
            [6, 2],
            [10, 5],
            [14, 5],
            [16, 14],
            [18, 38],
            [19, 84],
            [20, 168],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-footway',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'footway']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'hsl(288,33%,94%)',
        'line-dasharray': [1, 0.2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-steps',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'steps']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'hsl(288,33%,94%)',
        'line-dasharray': [1, 0.2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-path',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'path']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'hsl(288,33%,94%)',
        'line-dasharray': [1, 0.2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-way-cycleway',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'cycleway']],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'hsl(203,30%,95%)',
        'line-dasharray': [1, 0.2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-track',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'track'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 3],
            [18, 16],
            [19, 44],
            [20, 88],
          ],
        },
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-pedestrian',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'pedestrian'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-service',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'service'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 2],
            [18, 10],
            [19, 28],
            [20, 40],
          ],
        },
        'line-opacity': {
          stops: [
            [15, 0],
            [16, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-livingstreet',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'living_street'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-residential',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'residential'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-unclassified',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'unclassified'], ['==', 'tunnel', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-track-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'track'],
        ['==', 'bicycle', 'designated'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(247,247,247)',
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-pedestrian-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'pedestrian'],
        ['==', 'bicycle', 'designated'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-service-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'service'],
        ['==', 'bicycle', 'designated'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(247,247,247)',
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-livingstreet-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'living_street'],
        ['==', 'bicycle', 'designated'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-residential-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'residential'],
        ['==', 'bicycle', 'designated'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-unclassified-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'unclassified'],
        ['==', 'bicycle', 'designated'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-tertiary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-secondary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,240,179)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-primary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,240,179)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-trunk-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,240,179)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-motorway-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,209,148)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-tertiary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-secondary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,240,179)',
        'line-width': {
          stops: [
            [11, 1],
            [14, 4],
            [16, 6],
            [18, 28],
            [19, 64],
            [20, 130],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-primary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,240,179)',
        'line-width': {
          stops: [
            [8, 0],
            [9, 2],
            [10, 3],
            [14, 5],
            [16, 10],
            [18, 34],
            [19, 70],
            [20, 140],
          ],
        },
        'line-opacity': {
          stops: [
            [8, 0],
            [9, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-trunk',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,240,179)',
        'line-width': {
          stops: [
            [7, 0],
            [8, 1],
            [10, 3],
            [14, 5],
            [16, 10],
            [18, 34],
            [19, 70],
            [20, 140],
          ],
        },
        'line-opacity': {
          stops: [
            [7, 0],
            [8, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-street-motorway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,209,148)',
        'line-width': {
          stops: [
            [5, 0],
            [6, 1],
            [10, 4],
            [14, 4],
            [16, 12],
            [18, 36],
            [19, 80],
            [20, 160],
          ],
        },
        'line-opacity': {
          stops: [
            [5, 0],
            [6, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-tram:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'tram'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-narrowgauge:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'narrow_gauge'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-subway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'subway'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(166,184,199)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 1],
            [15, 3],
            [16, 3],
            [18, 6],
            [19, 8],
            [20, 10],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 0.5],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-lightrail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [8, 1],
            [13, 1],
            [15, 1],
            [20, 14],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 0.5],
          ],
        },
      },
      minzoom: 8,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-lightrail-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [16, 1],
            [20, 14],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-rail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [8, 1],
            [13, 1],
            [15, 1],
            [20, 14],
          ],
        },
        'line-opacity': {
          stops: [
            [8, 0],
            [9, 0.3],
          ],
        },
      },
      minzoom: 8,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-rail-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [16, 1],
            [20, 14],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-monorail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'monorail'], ['==', 'tunnel', true]],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-funicular:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'funicular'], ['==', 'tunnel', true]],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-tram',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'tram'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-narrowgauge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'narrow_gauge'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-subway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'subway'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(188,202,213)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 1],
            [15, 2],
            [16, 2],
            [18, 5],
            [19, 6],
            [20, 8],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-lightrail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-lightrail-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-rail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['!has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 0.3],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-rail-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['has', 'service'],
        ['==', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-monorail',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'monorail'], ['==', 'tunnel', true]],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'tunnel-transport-funicular',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'funicular'], ['==', 'tunnel', true]],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge',
      type: 'fill',
      'source-layer': 'bridges',
      paint: {
        'fill-color': 'rgb(244,239,233)',
        'fill-antialias': true,
        'fill-opacity': 0.8,
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-pedestrian-zone',
      type: 'fill',
      'source-layer': 'street_polygons',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['==', 'kind', 'pedestrian'],
      ],
      paint: {
        'fill-color': 'rgba(251,235,255,0.25)',
        'fill-opacity': {
          stops: [
            [12, 0],
            [13, 1],
            [14, 0],
            [15, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-footway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'footway'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(226,212,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-steps:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'steps'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(226,212,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-path:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'path'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(226,212,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-cycleway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'cycleway'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(215,224,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-track:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'track'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [14, 2],
            [16, 4],
            [18, 18],
            [19, 48],
            [20, 96],
          ],
        },
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-pedestrian:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'pedestrian'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(221,220,218)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 3],
            [18, 12],
            [19, 32],
            [20, 48],
          ],
        },
        'line-opacity': {
          stops: [
            [15, 0],
            [16, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-livingstreet:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'living_street'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-residential:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'residential'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-unclassified:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'unclassified'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-tertiary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-secondary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-primary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-trunk-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-motorway-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-tertiary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(207,205,202)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-secondary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [11, 2],
            [14, 5],
            [16, 8],
            [18, 30],
            [19, 68],
            [20, 138],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-primary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [8, 0],
            [9, 1],
            [10, 4],
            [14, 6],
            [16, 12],
            [18, 36],
            [19, 74],
            [20, 144],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-trunk:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [7, 0],
            [8, 2],
            [10, 4],
            [14, 6],
            [16, 12],
            [18, 36],
            [19, 74],
            [20, 144],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-motorway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [5, 0],
            [6, 2],
            [10, 5],
            [14, 5],
            [16, 14],
            [18, 38],
            [19, 84],
            [20, 168],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-footway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'footway'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(251,235,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-steps',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'steps'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(251,235,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-path',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'path'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(251,235,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'way-cycleway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'cycleway'],
      ],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(239,249,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-track',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'track'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 3],
            [18, 16],
            [19, 44],
            [20, 88],
          ],
        },
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-pedestrian',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'pedestrian'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(251,235,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 0],
            [14, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 2],
            [18, 10],
            [19, 28],
            [20, 40],
          ],
        },
        'line-opacity': {
          stops: [
            [15, 0],
            [16, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-livingstreet',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'living_street'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-residential',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'residential'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-unclassified',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'unclassified'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-track-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'track'],
        ['==', 'bicycle', 'designated'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-pedestrian-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'pedestrian'],
        ['==', 'bicycle', 'designated'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-service-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'service'],
        ['==', 'bicycle', 'designated'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-livingstreet-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'living_street'],
        ['==', 'bicycle', 'designated'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-residential-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'residential'],
        ['==', 'bicycle', 'designated'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-unclassified-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'unclassified'],
        ['==', 'bicycle', 'designated'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-tertiary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-secondary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-primary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-trunk-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-motorway-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,204,136)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-tertiary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-secondary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [11, 1],
            [14, 4],
            [16, 6],
            [18, 28],
            [19, 64],
            [20, 130],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-primary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [8, 0],
            [9, 2],
            [10, 3],
            [14, 5],
            [16, 10],
            [18, 34],
            [19, 70],
            [20, 140],
          ],
        },
        'line-opacity': {
          stops: [
            [8, 0],
            [9, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-trunk',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [7, 0],
            [8, 1],
            [10, 3],
            [14, 5],
            [16, 10],
            [18, 34],
            [19, 70],
            [20, 140],
          ],
        },
        'line-opacity': {
          stops: [
            [7, 0],
            [8, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'street-motorway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,204,136)',
        'line-width': {
          stops: [
            [5, 0],
            [6, 1],
            [10, 4],
            [14, 4],
            [16, 12],
            [18, 36],
            [19, 80],
            [20, 160],
          ],
        },
        'line-opacity': {
          stops: [
            [5, 0],
            [6, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-tram:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'tram'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-narrowgauge:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'narrow_gauge'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-subway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'subway'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(166,184,199)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 1],
            [15, 3],
            [16, 3],
            [18, 6],
            [19, 8],
            [20, 10],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-lightrail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [8, 1],
            [13, 1],
            [15, 1],
            [20, 14],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      minzoom: 8,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-lightrail-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [16, 1],
            [20, 14],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-rail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [8, 1],
            [13, 1],
            [15, 1],
            [20, 14],
          ],
        },
        'line-opacity': {
          stops: [
            [8, 0],
            [9, 1],
          ],
        },
      },
      minzoom: 8,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-rail-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [16, 1],
            [20, 14],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-monorail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'monorail'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-funicular:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'funicular'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-tram',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'tram'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-narrowgauge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'narrow_gauge'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-subway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'subway'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(188,202,213)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 1],
            [15, 2],
            [16, 2],
            [18, 5],
            [19, 6],
            [20, 8],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-lightrail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-lightrail-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-rail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['!has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-rail-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['has', 'service'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-monorail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'monorail'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-funicular',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'funicular'],
        ['!=', 'bridge', true],
        ['!=', 'tunnel', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'transport-ferry',
      type: 'line',
      'source-layer': 'ferries',
      minzoom: 10,
      paint: {
        'line-color': 'rgb(171,199,219)',
        'line-width': {
          stops: [
            [10, 1],
            [13, 2],
            [14, 3],
            [16, 4],
            [17, 6],
          ],
        },
        'line-opacity': {
          stops: [
            [10, 0],
            [11, 1],
          ],
        },
        'line-dasharray': [1, 1],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-footway:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'footway']],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [15, 0],
            [16, 7],
            [18, 10],
            [19, 17],
            [20, 31],
          ],
        },
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-steps:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'steps']],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [15, 0],
            [16, 7],
            [18, 10],
            [19, 17],
            [20, 31],
          ],
        },
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-path:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'path']],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [15, 0],
            [16, 7],
            [18, 10],
            [19, 17],
            [20, 31],
          ],
        },
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-cycleway:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'cycleway']],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [15, 0],
            [16, 7],
            [18, 10],
            [19, 17],
            [20, 31],
          ],
        },
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-track:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'track'], ['==', 'bridge', true]],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
        'line-width': {
          stops: [
            [14, 3],
            [16, 6],
            [18, 25],
            [19, 67],
            [20, 134],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-pedestrian:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'pedestrian'], ['==', 'bridge', true]],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 8],
            [18, 36],
            [19, 90],
            [20, 179],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-service:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'service'], ['==', 'bridge', true]],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
        'line-width': {
          stops: [
            [14, 3],
            [16, 6],
            [18, 25],
            [19, 67],
            [20, 134],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-livingstreet:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'living_street'], ['==', 'bridge', true]],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 8],
            [18, 36],
            [19, 90],
            [20, 179],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-residential:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'residential'], ['==', 'bridge', true]],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 8],
            [18, 36],
            [19, 90],
            [20, 179],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-unclassified:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'unclassified'], ['==', 'bridge', true]],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 8],
            [18, 36],
            [19, 90],
            [20, 179],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-tertiary-link:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 8],
            [18, 36],
            [19, 90],
            [20, 179],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-secondary-link:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 10],
            [18, 20],
            [20, 56],
          ],
        },
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-primary-link:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 10],
            [18, 20],
            [20, 56],
          ],
        },
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-trunk-link:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 10],
            [18, 20],
            [20, 56],
          ],
        },
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-motorway-link:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 10],
            [18, 20],
            [20, 56],
          ],
        },
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-tertiary:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
        'line-width': {
          stops: [
            [12, 3],
            [14, 4],
            [16, 8],
            [18, 36],
            [19, 90],
            [20, 179],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-secondary:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
        'line-width': {
          stops: [
            [11, 3],
            [14, 7],
            [16, 11],
            [18, 42],
            [19, 95],
            [20, 193],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-primary:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [8, 0],
            [9, 1],
            [10, 6],
            [14, 8],
            [16, 17],
            [18, 50],
            [19, 104],
            [20, 202],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-trunk:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [7, 0],
            [8, 3],
            [10, 6],
            [14, 8],
            [16, 17],
            [18, 50],
            [19, 104],
            [20, 202],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-motorway:bridge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      layout: {
        'line-cap': 'butt',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(244,239,233)',
        'line-opacity': 0.5,
        'line-width': {
          stops: [
            [5, 0],
            [6, 3],
            [10, 7],
            [14, 7],
            [16, 20],
            [18, 53],
            [19, 118],
            [20, 235],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-pedestrian-zone',
      type: 'fill',
      'source-layer': 'street_polygons',
      filter: ['all', ['==', 'bridge', true], ['==', 'kind', 'pedestrian']],
      paint: {
        'fill-color': 'rgb(255,255,255)',
        'fill-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-footway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'footway']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(226,212,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-steps:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'steps']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(226,212,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-path:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'path']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(226,212,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-cycleway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'cycleway']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [19, 12],
            [20, 22],
          ],
        },
        'line-color': 'rgb(215,224,230)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-track:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'track'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [14, 2],
            [16, 4],
            [18, 18],
            [19, 48],
            [20, 96],
          ],
        },
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-pedestrian:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'pedestrian'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'service'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(221,220,218)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 3],
            [18, 12],
            [19, 32],
            [20, 48],
          ],
        },
        'line-opacity': {
          stops: [
            [15, 0],
            [16, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-livingstreet:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'living_street'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-residential:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'residential'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-unclassified:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'unclassified'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-tertiary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-secondary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-primary-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-trunk-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-motorway-link:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 7],
            [18, 14],
            [20, 40],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-tertiary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(217,217,217)',
        'line-width': {
          stops: [
            [12, 2],
            [14, 3],
            [16, 6],
            [18, 26],
            [19, 64],
            [20, 128],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-secondary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [11, 2],
            [14, 5],
            [16, 8],
            [18, 30],
            [19, 68],
            [20, 138],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-primary:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [8, 0],
            [9, 1],
            [10, 4],
            [14, 6],
            [16, 12],
            [18, 36],
            [19, 74],
            [20, 144],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-trunk:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [7, 0],
            [8, 2],
            [10, 4],
            [14, 6],
            [16, 12],
            [18, 36],
            [19, 74],
            [20, 144],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-motorway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(233,172,119)',
        'line-width': {
          stops: [
            [5, 0],
            [6, 2],
            [10, 5],
            [14, 5],
            [16, 14],
            [18, 38],
            [19, 84],
            [20, 168],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-footway',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'footway']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(251,235,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-steps',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'steps']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(251,235,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-path',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'path']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(251,235,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-way-cycleway',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'cycleway']],
      layout: {
        'line-cap': 'butt',
      },
      paint: {
        'line-width': {
          stops: [
            [15, 0],
            [16, 4],
            [18, 6],
            [19, 10],
            [20, 20],
          ],
        },
        'line-color': 'rgb(239,249,255)',
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-track',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'track'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 3],
            [18, 16],
            [19, 44],
            [20, 88],
          ],
        },
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-pedestrian',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'pedestrian'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-service',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'service'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(247,247,247)',
        'line-width': {
          stops: [
            [14, 1],
            [16, 2],
            [18, 10],
            [19, 28],
            [20, 40],
          ],
        },
        'line-opacity': {
          stops: [
            [15, 0],
            [16, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-livingstreet',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'living_street'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-residential',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'residential'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-unclassified',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['==', 'kind', 'unclassified'], ['==', 'bridge', true]],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-track-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'track'],
        ['==', 'bicycle', 'designated'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-pedestrian-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'pedestrian'],
        ['==', 'bicycle', 'designated'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-service-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'service'],
        ['==', 'bicycle', 'designated'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-livingstreet-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'living_street'],
        ['==', 'bicycle', 'designated'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-residential-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'residential'],
        ['==', 'bicycle', 'designated'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-unclassified-bicycle',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'kind', 'unclassified'],
        ['==', 'bicycle', 'designated'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(239,249,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-tertiary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'tertiary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-secondary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'secondary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-primary-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'primary'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-trunk-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'trunk'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-motorway-link',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'motorway'],
        ['==', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,204,136)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 12],
            [20, 38],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-tertiary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'tertiary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,255,255)',
        'line-width': {
          stops: [
            [12, 1],
            [14, 2],
            [16, 5],
            [18, 24],
            [19, 60],
            [20, 120],
          ],
        },
        'line-opacity': {
          stops: [
            [12, 0],
            [13, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-secondary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'secondary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [11, 1],
            [14, 4],
            [16, 6],
            [18, 28],
            [19, 64],
            [20, 130],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-primary',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'primary'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [8, 0],
            [9, 2],
            [10, 3],
            [14, 5],
            [16, 10],
            [18, 34],
            [19, 70],
            [20, 140],
          ],
        },
        'line-opacity': {
          stops: [
            [8, 0],
            [9, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-trunk',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'trunk'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,238,170)',
        'line-width': {
          stops: [
            [7, 0],
            [8, 1],
            [10, 3],
            [14, 5],
            [16, 10],
            [18, 34],
            [19, 70],
            [20, 140],
          ],
        },
        'line-opacity': {
          stops: [
            [7, 0],
            [8, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-street-motorway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'bridge', true],
        ['in', 'kind', 'motorway'],
        ['!=', 'link', true],
      ],
      paint: {
        'line-color': 'rgb(255,204,136)',
        'line-width': {
          stops: [
            [5, 0],
            [6, 1],
            [10, 4],
            [14, 4],
            [16, 12],
            [18, 36],
            [19, 80],
            [20, 160],
          ],
        },
        'line-opacity': {
          stops: [
            [5, 0],
            [6, 1],
          ],
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'butt',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-tram:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'tram'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-narrowgauge:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'narrow_gauge'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-subway:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'subway'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(166,184,199)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 1],
            [15, 3],
            [16, 3],
            [18, 6],
            [19, 8],
            [20, 10],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-lightrail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [8, 1],
            [13, 1],
            [15, 1],
            [20, 14],
          ],
        },
        'line-opacity': {
          stops: [
            [11, 0],
            [12, 1],
          ],
        },
      },
      minzoom: 8,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-lightrail-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [16, 1],
            [20, 14],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-rail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [8, 1],
            [13, 1],
            [15, 1],
            [20, 14],
          ],
        },
        'line-opacity': {
          stops: [
            [8, 0],
            [9, 1],
          ],
        },
      },
      minzoom: 8,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-rail-service:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [16, 1],
            [20, 14],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-monorail:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'monorail'], ['==', 'bridge', true]],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-funicular:outline',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'funicular'], ['==', 'bridge', true]],
      minzoom: 15,
      paint: {
        'line-color': 'rgb(177,187,196)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 5],
            [18, 7],
            [20, 20],
          ],
        },
        'line-dasharray': [0.1, 0.5],
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-tram',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'tram'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-narrowgauge',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'narrow_gauge'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-subway',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'subway'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(188,202,213)',
        'line-width': {
          stops: [
            [11, 0],
            [12, 1],
            [15, 2],
            [16, 2],
            [18, 5],
            [19, 6],
            [20, 8],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-lightrail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-lightrail-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'light_rail'],
        ['has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-rail',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['!has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [14, 0],
            [15, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
        'line-opacity': {
          stops: [
            [14, 0],
            [15, 1],
          ],
        },
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-rail-service',
      type: 'line',
      'source-layer': 'streets',
      filter: [
        'all',
        ['in', 'kind', 'rail'],
        ['has', 'service'],
        ['==', 'bridge', true],
      ],
      paint: {
        'line-color': 'rgb(197,204,211)',
        'line-width': {
          stops: [
            [15, 0],
            [16, 1],
            [20, 10],
          ],
        },
        'line-dasharray': [2, 2],
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-monorail',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'monorail'], ['==', 'bridge', true]],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'bridge-transport-funicular',
      type: 'line',
      'source-layer': 'streets',
      filter: ['all', ['in', 'kind', 'funicular'], ['==', 'bridge', true]],
      minzoom: 13,
      paint: {
        'line-width': {
          stops: [
            [13, 0],
            [16, 1],
            [17, 2],
            [18, 3],
            [20, 5],
          ],
        },
        'line-color': 'rgb(177,187,196)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-amenity',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'amenity']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'amenity'],
          'arts_centre',
          'basics:icon-art_gallery',
          'atm',
          'basics:icon-atm',
          'bank',
          'basics:icon-bank',
          'bar',
          'basics:icon-bar',
          'bench',
          'basics:icon-bench',
          'bicycle_rental',
          'basics:icon-bicycle_share',
          'biergarten',
          'basics:icon-beergarden',
          'cafe',
          'basics:icon-cafe',
          'car_rental',
          'basics:icon-car_rental',
          'car_sharing',
          'basics:icon-car_rental',
          'car_wash',
          'basics:icon-car_wash',
          'cinema',
          'basics:icon-cinema',
          'college',
          'basics:icon-college',
          'community_centre',
          'basics:icon-community',
          'dentist',
          'basics:icon-dentist',
          'doctors',
          'basics:icon-doctor',
          'dog_park',
          'basics:icon-dog_park',
          'drinking_water',
          'basics:icon-drinking_water',
          'embassy',
          'basics:icon-embassy',
          'fast_food',
          'basics:icon-fast_food',
          'fire_station',
          'basics:icon-fire_station',
          'fountain',
          'basics:icon-fountain',
          'grave_yard',
          'basics:icon-cemetery',
          'hospital',
          'basics:icon-hospital',
          'hunting_stand',
          'basics:icon-huntingstand',
          'library',
          'basics:icon-library',
          'marketplace',
          'basics:icon-marketplace',
          'nightclub',
          'basics:icon-nightclub',
          'nursing_home',
          'basics:icon-nursinghome',
          'pharmacy',
          'basics:icon-pharmacy',
          'place_of_worship',
          'basics:icon-place_of_worship',
          'playground',
          'basics:icon-playground',
          'police',
          'basics:icon-police',
          'post_box',
          'basics:icon-postbox',
          'post_office',
          'basics:icon-post',
          'prison',
          'basics:icon-prison',
          'pub',
          'basics:icon-beer',
          'recycling',
          'basics:icon-recycling',
          'restaurant',
          'basics:icon-restaurant',
          'school',
          'basics:icon-school',
          'shelter',
          'basics:icon-shelter',
          'telephone',
          'basics:icon-telephone',
          'theatre',
          'basics:icon-theatre',
          'toilets',
          'basics:icon-toilet',
          'townhall',
          'basics:icon-town_hall',
          'vending_machine',
          'basics:icon-vendingmachine',
          'veterinary',
          'basics:icon-veterinary',
          'waste_basket',
          'basics:icon-waste_basket',
          '',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-leisure',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'leisure']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'leisure'],
          'golf_course',
          'basics:icon-golf',
          'ice_rink',
          'basics:icon-icerink',
          'pitch',
          'basics:icon-pitch',
          'stadium',
          'basics:icon-stadium',
          'swimming_pool',
          'basics:icon-swimming',
          'water_park',
          'basics:icon-waterpark',
          'basics:icon-sports',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-tourism',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'tourism']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'tourism'],
          'chalet',
          'basics:icon-chalet',
          'information',
          'basics:transport-information',
          'picnic_site',
          'basics:icon-picnic_site',
          'viewpoint',
          'basics:icon-viewpoint',
          'zoo',
          'basics:icon-zoo',
          '',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-shop',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'shop']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'shop'],
          'alcohol',
          'basics:icon-alcohol_shop',
          'bakery',
          'basics:icon-bakery',
          'beauty',
          'basics:icon-beauty',
          'beverages',
          'basics:icon-beverages',
          'books',
          'basics:icon-books',
          'butcher',
          'basics:icon-butcher',
          'chemist',
          'basics:icon-chemist',
          'clothes',
          'basics:icon-clothes',
          'doityourself',
          'basics:icon-doityourself',
          'dry_cleaning',
          'basics:icon-drycleaning',
          'florist',
          'basics:icon-florist',
          'furniture',
          'basics:icon-furniture',
          'garden_centre',
          'basics:icon-garden_centre',
          'general',
          'basics:icon-shop',
          'gift',
          'basics:icon-gift',
          'greengrocer',
          'basics:icon-greengrocer',
          'hairdresser',
          'basics:icon-hairdresser',
          'hardware',
          'basics:icon-hardware',
          'jewelry',
          'basics:icon-jewelry_store',
          'kiosk',
          'basics:icon-kiosk',
          'laundry',
          'basics:icon-laundry',
          'newsagent',
          'basics:icon-newsagent',
          'optican',
          'basics:icon-optician',
          'outdoor',
          'basics:icon-outdoor',
          'shoes',
          'basics:icon-shoes',
          'sports',
          'basics:icon-sports',
          'stationery',
          'basics:icon-stationery',
          'toys',
          'basics:icon-toys',
          'travel_agency',
          'basics:icon-travel_agent',
          'video',
          'basics:icon-video',
          'basics:icon-shop',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-man_made',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'man_made']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'man_made'],
          'lighthouse',
          'basics:icon-lighthouse',
          'surveillance',
          'basics:icon-surveillance',
          'tower',
          'basics:icon-observation_tower',
          'watermill',
          'basics:icon-watermill',
          'windmill',
          'basics:icon-windmill',
          '',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-historic',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'historic']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'historic'],
          'artwork',
          'basics:icon-artwork',
          'castle',
          'basics:icon-castle',
          'monument',
          'basics:icon-monument',
          'wayside_shrine',
          'basics:icon-shrine',
          'basics:icon-historic',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-emergency',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'emergency']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
        'icon-image': [
          'match',
          ['get', 'emergency'],
          'defibrillator',
          'basics:icon-defibrillator',
          'fire_hydrant',
          'basics:icon-hydrant',
          'phone',
          'basics:icon-emergency_phone',
          '',
        ],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-highway',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'highway']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'poi-office',
      type: 'symbol',
      'source-layer': 'pois',
      filter: ['to-boolean', ['get', 'office']],
      minzoom: 16,
      layout: {
        'icon-size': {
          stops: [
            [16, 0.5],
            [19, 0.5],
            [20, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-optional': true,
        'text-font': ['noto_sans_regular'],
      },
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
          ],
        },
        'icon-color': 'rgb(85,85,85)',
        'text-color': 'rgb(85,85,85)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'boundary-country:outline',
      type: 'line',
      'source-layer': 'boundaries',
      filter: [
        'all',
        ['==', 'admin_level', 2],
        ['!=', 'maritime', true],
        ['!=', 'disputed', true],
        ['!=', 'coastline', true],
      ],
      paint: {
        'line-color': 'rgb(249,245,239)',
        'line-blur': 1,
        'line-width': {
          stops: [
            [2, 0],
            [3, 2],
            [10, 8],
          ],
        },
        'line-opacity': 0.75,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'boundary-country-disputed:outline',
      type: 'line',
      'source-layer': 'boundaries',
      filter: [
        'all',
        ['==', 'admin_level', 2],
        ['==', 'disputed', true],
        ['!=', 'maritime', true],
        ['!=', 'coastline', true],
      ],
      paint: {
        'line-width': {
          stops: [
            [2, 0],
            [3, 2],
            [10, 8],
          ],
        },
        'line-opacity': 0.75,
        'line-color': 'rgb(249,245,239)',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'boundary-state:outline',
      type: 'line',
      'source-layer': 'boundaries',
      filter: [
        'all',
        ['==', 'admin_level', 4],
        ['!=', 'maritime', true],
        ['!=', 'disputed', true],
        ['!=', 'coastline', true],
      ],
      paint: {
        'line-color': 'rgb(250,245,240)',
        'line-blur': 1,
        'line-width': {
          stops: [
            [7, 0],
            [8, 2],
            [10, 4],
          ],
        },
        'line-opacity': 0.75,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'boundary-country',
      type: 'line',
      'source-layer': 'boundaries',
      filter: [
        'all',
        ['==', 'admin_level', 2],
        ['!=', 'maritime', true],
        ['!=', 'disputed', true],
        ['!=', 'coastline', true],
      ],
      paint: {
        'line-color': 'rgb(166,166,200)',
        'line-width': {
          stops: [
            [2, 0],
            [3, 1],
            [10, 4],
          ],
        },
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'boundary-country-disputed',
      type: 'line',
      'source-layer': 'boundaries',
      filter: [
        'all',
        ['==', 'admin_level', 2],
        ['==', 'disputed', true],
        ['!=', 'maritime', true],
        ['!=', 'coastline', true],
      ],
      paint: {
        'line-width': {
          stops: [
            [2, 0],
            [3, 1],
            [10, 4],
          ],
        },
        'line-color': 'rgb(190,188,207)',
        'line-dasharray': [2, 1],
      },
      layout: {
        'line-cap': 'square',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'boundary-state',
      type: 'line',
      'source-layer': 'boundaries',
      filter: [
        'all',
        ['==', 'admin_level', 4],
        ['!=', 'maritime', true],
        ['!=', 'disputed', true],
        ['!=', 'coastline', true],
      ],
      paint: {
        'line-color': 'rgb(166,166,200)',
        'line-width': {
          stops: [
            [7, 0],
            [8, 1],
            [10, 2],
          ],
        },
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-address-housenumber',
      type: 'symbol',
      'source-layer': 'addresses',
      filter: ['has', 'housenumber'],
      layout: {
        'text-field': '{housenumber}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'point',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [17, 8],
            [19, 10],
          ],
        },
      },
      paint: {
        'text-halo-color': 'rgb(243,235,227)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
        'icon-color': 'rgb(169,164,158)',
        'text-color': 'rgb(169,164,158)',
      },
      minzoom: 17,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-motorway-shield',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'motorway'],
      layout: {
        'text-field': '{ref}',
        'text-font': ['noto_sans_bold'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [14, 10],
            [18, 12],
            [20, 16],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(255,255,255)',
        'text-color': 'rgb(255,255,255)',
        'text-halo-color': 'rgb(255,204,136)',
        'text-halo-width': 0.1,
        'text-halo-blur': 1,
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-pedestrian',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'pedestrian'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-livingstreet',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'living_street'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-residential',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'residential'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-unclassified',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'unclassified'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-tertiary',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'tertiary'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-secondary',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'secondary'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-primary',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'primary'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-street-trunk',
      type: 'symbol',
      'source-layer': 'street_labels',
      filter: ['==', 'kind', 'trunk'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'symbol-placement': 'line',
        'text-anchor': 'center',
        'text-size': {
          stops: [
            [12, 10],
            [15, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-neighbourhood',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'neighbourhood'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': { stops: [[14, 12]] },
        'text-transform': 'uppercase',
      },
      paint: {
        'icon-color': 'rgb(40,67,73)',
        'text-color': 'rgb(40,67,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-quarter',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'quarter'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': { stops: [[13, 13]] },
        'text-transform': 'uppercase',
      },
      paint: {
        'icon-color': 'rgb(40,62,73)',
        'text-color': 'rgb(40,62,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-suburb',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'suburb'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [11, 11],
            [13, 14],
          ],
        },
        'text-transform': 'uppercase',
      },
      paint: {
        'icon-color': 'rgb(40,57,73)',
        'text-color': 'rgb(40,57,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 11,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-hamlet',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'hamlet'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [10, 11],
            [12, 14],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(40,48,73)',
        'text-color': 'rgb(40,48,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-village',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'village'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [9, 11],
            [12, 14],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(40,48,73)',
        'text-color': 'rgb(40,48,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 11,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-town',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'town'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [8, 11],
            [12, 14],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(40,48,73)',
        'text-color': 'rgb(40,48,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 9,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-boundary-state',
      type: 'symbol',
      'source-layer': 'boundary_labels',
      filter: ['in', 'admin_level', 4, '4'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-transform': 'uppercase',
        'text-anchor': 'top',
        'text-offset': [0, 0.2],
        'text-padding': 0,
        'text-optional': true,
        'text-size': {
          stops: [
            [5, 8],
            [8, 12],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(61,61,77)',
        'text-color': 'rgb(61,61,77)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 5,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-city',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'city'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [7, 11],
            [10, 14],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(40,48,73)',
        'text-color': 'rgb(40,48,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 7,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-statecapital',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'state_capital'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [6, 11],
            [10, 15],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(40,48,73)',
        'text-color': 'rgb(40,48,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 6,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-place-capital',
      type: 'symbol',
      'source-layer': 'place_labels',
      filter: ['==', 'kind', 'capital'],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-size': {
          stops: [
            [5, 12],
            [10, 16],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(40,48,73)',
        'text-color': 'rgb(40,48,73)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 5,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-boundary-country-small',
      type: 'symbol',
      'source-layer': 'boundary_labels',
      filter: [
        'all',
        ['in', 'admin_level', 2, '2'],
        ['<=', 'way_area', 10000000],
      ],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-transform': 'uppercase',
        'text-anchor': 'top',
        'text-offset': [0, 0.2],
        'text-padding': 0,
        'text-optional': true,
        'text-size': {
          stops: [
            [4, 8],
            [5, 11],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 4,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-boundary-country-medium',
      type: 'symbol',
      'source-layer': 'boundary_labels',
      filter: [
        'all',
        ['in', 'admin_level', 2, '2'],
        ['<', 'way_area', 90000000],
        ['>', 'way_area', 10000000],
      ],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-transform': 'uppercase',
        'text-anchor': 'top',
        'text-offset': [0, 0.2],
        'text-padding': 0,
        'text-optional': true,
        'text-size': {
          stops: [
            [3, 8],
            [5, 12],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 3,
    },
    {
      source: 'versatiles-shortbread',
      id: 'label-boundary-country-large',
      type: 'symbol',
      'source-layer': 'boundary_labels',
      filter: [
        'all',
        ['in', 'admin_level', 2, '2'],
        ['>=', 'way_area', 90000000],
      ],
      layout: {
        'text-field': '{name}',
        'text-font': ['noto_sans_regular'],
        'text-transform': 'uppercase',
        'text-anchor': 'top',
        'text-offset': [0, 0.2],
        'text-padding': 0,
        'text-optional': true,
        'text-size': {
          stops: [
            [2, 8],
            [5, 13],
          ],
        },
      },
      paint: {
        'icon-color': 'rgb(51,51,68)',
        'text-color': 'rgb(51,51,68)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 2,
    },
    {
      source: 'versatiles-shortbread',
      id: 'marking-oneway',
      type: 'symbol',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'oneway', true],
        [
          'in',
          'kind',
          'trunk',
          'primary',
          'secondary',
          'tertiary',
          'unclassified',
          'residential',
          'living_street',
        ],
      ],
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 175,
        'icon-rotate': 90,
        'icon-rotation-alignment': 'map',
        'icon-padding': 5,
        'symbol-avoid-edges': true,
        'icon-image': 'basics:marking-arrow',
        'text-font': ['noto_sans_regular'],
      },
      minzoom: 16,
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
            [20, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
            [20, 0.4],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'marking-oneway-reverse',
      type: 'symbol',
      'source-layer': 'streets',
      filter: [
        'all',
        ['==', 'oneway_reverse', true],
        [
          'in',
          'kind',
          'trunk',
          'primary',
          'secondary',
          'tertiary',
          'unclassified',
          'residential',
          'living_street',
        ],
      ],
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 75,
        'icon-rotate': -90,
        'icon-rotation-alignment': 'map',
        'icon-padding': 5,
        'symbol-avoid-edges': true,
        'icon-image': 'basics:marking-arrow',
        'text-font': ['noto_sans_regular'],
      },
      minzoom: 16,
      paint: {
        'icon-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
            [20, 0.4],
          ],
        },
        'text-opacity': {
          stops: [
            [16, 0],
            [17, 0.4],
            [20, 0.4],
          ],
        },
      },
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-bus',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: ['==', 'kind', 'bus_stop'],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [16, 0.5],
            [18, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:icon-bus',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 16,
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-tram',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: ['==', 'kind', 'tram_stop'],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [15, 0.5],
            [17, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:transport-tram',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 15,
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-subway',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: [
        'all',
        ['in', 'kind', 'station', 'halt'],
        ['==', 'station', 'subway'],
      ],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [14, 0.5],
            [16, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:icon-rail_metro',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-lightrail',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: [
        'all',
        ['in', 'kind', 'station', 'halt'],
        ['==', 'station', 'light_rail'],
      ],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [14, 0.5],
            [16, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:icon-rail_light',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 14,
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-station',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: [
        'all',
        ['in', 'kind', 'station', 'halt'],
        ['!in', 'station', 'light_rail', 'subway'],
      ],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [13, 0.5],
            [15, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:icon-rail',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-airfield',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: ['all', ['==', 'kind', 'aerodrome'], ['!has', 'iata']],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [13, 0.5],
            [15, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:icon-airfield',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 13,
    },
    {
      source: 'versatiles-shortbread',
      id: 'symbol-transit-airport',
      type: 'symbol',
      'source-layer': 'public_transport',
      filter: ['all', ['==', 'kind', 'aerodrome'], ['has', 'iata']],
      layout: {
        'text-field': '{name}',
        'icon-size': {
          stops: [
            [12, 0.5],
            [14, 1],
          ],
        },
        'symbol-placement': 'point',
        'icon-keep-upright': true,
        'text-font': ['noto_sans_regular'],
        'text-size': 10,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        'icon-image': 'basics:icon-airport',
      },
      paint: {
        'icon-opacity': 0.7,
        'icon-color': 'rgb(102,98,106)',
        'text-color': 'rgb(102,98,106)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 2,
        'text-halo-blur': 1,
      },
      minzoom: 12,
    },
  ],
} as StyleSpecification;
