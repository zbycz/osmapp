// @flow

// https://www.openstreetmap.org/api/0.6/${type}/${id} --> xml2js
export const node = {
  geojson: {
    geometry: {
      coordinates: ['14.3931537', '50.1004964'],
    },
    osmMeta: {
      type: 'node',
      changeset: '39183022',
      id: '4171192706',
      lat: '50.1004964',
      lon: '14.3931537',
      timestamp: '2016-05-08T15:14:15Z',
      uid: '162287',
      user: 'zby-cz',
      version: '2',
      visible: 'true',
    },
    properties: {
      level: '-1',
      name: 'Neoluxor',
      opening_hours: 'Mo-Fr 08:00-19:00; Sa 09:00-14:00',
      shop: 'books',
    },
  },

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="CGImap 0.6.1 (11408 thorn-02.openstreetmap.org)" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">
 <node id="4171192706" visible="true" version="2" changeset="39183022" timestamp="2016-05-08T15:14:15Z" user="zby-cz" uid="162287" lat="50.1004964" lon="14.3931537">
  <tag k="level" v="-1"/>
  <tag k="name" v="Neoluxor"/>
  <tag k="opening_hours" v="Mo-Fr 08:00-19:00; Sa 09:00-14:00"/>
  <tag k="shop" v="books"/>
 </node>
</osm>
`,
};

export const way = {
  geojson: {
    geometry: {
      coordinates: [undefined, undefined],
    },
    osmMeta: {
      type: 'way',
      changeset: '28637449',
      id: '317992446',
      timestamp: '2015-02-05T21:06:56Z',
      uid: '3516',
      user: 'BiIbo',
      version: '2',
      visible: 'true',
    },
    properties: {
      'garden:type': 'residential',
      leisure: 'garden',
    },
  },
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="CGImap 0.6.1 (11632 thorn-03.openstreetmap.org)" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">
 <way id="317992446" visible="true" version="2" changeset="28637449" timestamp="2015-02-05T21:06:56Z" user="BiIbo" uid="3516">
  <nd ref="3243430559"/>
  <nd ref="2861857026"/>
  <nd ref="2861857023"/>
  <nd ref="2861857025"/>
  <nd ref="3243430694"/>
  <nd ref="3243430692"/>
  <nd ref="3243430739"/>
  <nd ref="3243430743"/>
  <nd ref="3243430749"/>
  <nd ref="2861858313"/>
  <nd ref="2861858330"/>
  <nd ref="2861858336"/>
  <nd ref="2861858344"/>
  <nd ref="3243430738"/>
  <nd ref="3243430717"/>
  <nd ref="3243430558"/>
  <nd ref="3243430661"/>
  <nd ref="3243430555"/>
  <nd ref="3243430559"/>
  <tag k="garden:type" v="residential"/>
  <tag k="leisure" v="garden"/>
 </way>
</osm>`,
};
