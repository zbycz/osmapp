// https://www.openstreetmap.org/api/0.6/${type}/${id} --> xml2js
export const node = {
  geojson: {
    center: [14.3931537, 50.1004964],
    geometry: {
      type: 'Point',
      coordinates: [14.3931537, 50.1004964],
    },
    osmMeta: {
      changeset: '39183022',
      id: '4171192706',
      lat: '50.1004964',
      lon: '14.3931537',
      timestamp: '2016-05-08T15:14:15Z',
      type: 'node',
      uid: '162287',
      user: 'zby-cz',
      version: '2',
      visible: 'true',
    },
    properties: {
      class: 'library',
      subclass: 'books',
    },
    tags: {
      level: '-1',
      name: 'Neoluxor',
      opening_hours: 'Mo-Fr 08:00-19:00; Sa 09:00-14:00',
      shop: 'books',
    },
    type: 'Feature',
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

export const overpassWay = {
  link:
    'http://overpass-api.de/api/interpreter?data=way%287663781%29%3B%28._%3B%3E%3B%29%3Bout%3B',
  query: 'way(7663781);(._;>;);out;',

  geojson: {
    center: [14.389852900000001, 50.0995943],
    geometry: {
      coordinates: [
        [14.390274, 50.0999117],
        [14.3902903, 50.0997806],
        [14.390343, 50.0993561],
        [14.3902647, 50.0993519],
        [14.3902536, 50.0993434],
        [14.3901622, 50.0993383],
        [14.3901505, 50.099345],
        [14.3901466, 50.0993785],
        [14.3896467, 50.0993525],
        [14.3896196, 50.0993511],
        [14.3896273, 50.0993174],
        [14.3896159, 50.0993092],
        [14.3895082, 50.0993047],
        [14.3895111, 50.0992809],
        [14.3894357, 50.0992769],
        [14.3893791, 50.0997338],
        [14.3893628, 50.0998652],
        [14.3896757, 50.0998812],
        [14.3897352, 50.0998844],
        [14.3897965, 50.0998874],
        [14.390274, 50.0999117],
      ],
      type: 'LineString',
    },
    osmMeta: {
      id: '7663781',
      type: 'way',
    },
    properties: {
      class: 'lodging',
      subclass: 'hotel',
    },
    tags: {
      'addr:city': 'Praha',
      'addr:housenumber': '15',
      'addr:postcode': '16000',
      'addr:street': 'Evropská',
      building: 'civic',
      'building:levels': '1',
      email: 'info@diplomathotel.cz',
      fax: '+420 296 559 207',
      height: '10 m',
      name: 'Diplomat Prague',
      phone: '+420 296 559 111',
      'ref:ruian:building': '22072144',
      source: 'cuzk:ruian',
      tourism: 'hotel',
      website: 'www.vi-hotels.com/en/diplomat',
    },
    type: 'Feature',
  },

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API 0.7.55.5 2ca3f387">
<note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
<meta osm_base="2019-03-03T06:48:02Z"/>

  <node id="2911341798" lat="50.0992769" lon="14.3894357"/>
  <node id="2911341799" lat="50.0992809" lon="14.3895111"/>
  <node id="2911341800" lat="50.0993047" lon="14.3895082"/>
  <node id="2911341901" lat="50.0993092" lon="14.3896159"/>
  <node id="2911341902" lat="50.0993174" lon="14.3896273"/>
  <node id="2911341903" lat="50.0993383" lon="14.3901622"/>
  <node id="2911341904" lat="50.0993434" lon="14.3902536"/>
  <node id="2911341905" lat="50.0993450" lon="14.3901505"/>
  <node id="2911341906" lat="50.0993511" lon="14.3896196"/>
  <node id="2911341907" lat="50.0993519" lon="14.3902647"/>
  <node id="2911341908" lat="50.0993561" lon="14.3903430"/>
  <node id="2911341909" lat="50.0993785" lon="14.3901466"/>
  <node id="2911341910" lat="50.0998652" lon="14.3893628"/>
  <node id="2912535678" lat="50.0999117" lon="14.3902740"/>
  <node id="2912755526" lat="50.0993525" lon="14.3896467"/>
  <node id="2912755527" lat="50.0997338" lon="14.3893791"/>
  <node id="2912755528" lat="50.0997806" lon="14.3902903"/>
  <node id="3995906462" lat="50.0998844" lon="14.3897352">
    <tag k="entrance" v="main"/>
  </node>
  <node id="4755346645" lat="50.0998812" lon="14.3896757"/>
  <node id="4755346653" lat="50.0998874" lon="14.3897965"/>
  <way id="7663781">
    <nd ref="2912535678"/>
    <nd ref="2912755528"/>
    <nd ref="2911341908"/>
    <nd ref="2911341907"/>
    <nd ref="2911341904"/>
    <nd ref="2911341903"/>
    <nd ref="2911341905"/>
    <nd ref="2911341909"/>
    <nd ref="2912755526"/>
    <nd ref="2911341906"/>
    <nd ref="2911341902"/>
    <nd ref="2911341901"/>
    <nd ref="2911341800"/>
    <nd ref="2911341799"/>
    <nd ref="2911341798"/>
    <nd ref="2912755527"/>
    <nd ref="2911341910"/>
    <nd ref="4755346645"/>
    <nd ref="3995906462"/>
    <nd ref="4755346653"/>
    <nd ref="2912535678"/>
    <tag k="addr:city" v="Praha"/>
    <tag k="addr:housenumber" v="15"/>
    <tag k="addr:postcode" v="16000"/>
    <tag k="addr:street" v="Evropská"/>
    <tag k="building" v="civic"/>
    <tag k="building:levels" v="1"/>
    <tag k="email" v="info@diplomathotel.cz"/>
    <tag k="fax" v="+420 296 559 207"/>
    <tag k="height" v="10 m"/>
    <tag k="name" v="Diplomat Prague"/>
    <tag k="phone" v="+420 296 559 111"/>
    <tag k="ref:ruian:building" v="22072144"/>
    <tag k="source" v="cuzk:ruian"/>
    <tag k="tourism" v="hotel"/>
    <tag k="website" v="www.vi-hotels.com/en/diplomat"/>
  </way>

</osm>
`,
};

export const overpassWayMeta = {
  link:
    'http://overpass-api.de/api/interpreter?data=way%287663781%29%3B%28._%3B%3E%3B%29%3Bout%20meta%3B',
  query: 'way(7663781);(._;>;);out meta;',

  geojson: {
    ...overpassWay.geojson,
    osmMeta: {
      changeset: '47162556',
      id: '7663781',
      timestamp: '2017-03-25T21:00:29Z',
      type: 'way',
      uid: '255936',
      user: 'StenSoft',
      version: '10',
    },
  },

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API 0.7.55.5 2ca3f387">
<note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
<meta osm_base="2019-03-03T06:46:02Z"/>

  <node id="2911341798" lat="50.0992769" lon="14.3894357" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341799" lat="50.0992809" lon="14.3895111" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341800" lat="50.0993047" lon="14.3895082" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341901" lat="50.0993092" lon="14.3896159" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341902" lat="50.0993174" lon="14.3896273" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341903" lat="50.0993383" lon="14.3901622" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341904" lat="50.0993434" lon="14.3902536" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341905" lat="50.0993450" lon="14.3901505" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341906" lat="50.0993511" lon="14.3896196" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341907" lat="50.0993519" lon="14.3902647" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341908" lat="50.0993561" lon="14.3903430" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341909" lat="50.0993785" lon="14.3901466" version="1" timestamp="2014-06-11T15:25:15Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2911341910" lat="50.0998652" lon="14.3893628" version="1" timestamp="2014-06-11T15:25:16Z" changeset="22873667" uid="1708065" user="Salamandr"/>
  <node id="2912535678" lat="50.0999117" lon="14.3902740" version="4" timestamp="2017-03-25T21:00:28Z" changeset="47162556" uid="255936" user="StenSoft"/>
  <node id="2912755526" lat="50.0993525" lon="14.3896467" version="1" timestamp="2014-06-12T14:02:16Z" changeset="22889571" uid="1708065" user="Salamandr"/>
  <node id="2912755527" lat="50.0997338" lon="14.3893791" version="1" timestamp="2014-06-12T14:02:16Z" changeset="22889571" uid="1708065" user="Salamandr"/>
  <node id="2912755528" lat="50.0997806" lon="14.3902903" version="1" timestamp="2014-06-12T14:02:16Z" changeset="22889571" uid="1708065" user="Salamandr"/>
  <node id="3995906462" lat="50.0998844" lon="14.3897352" version="2" timestamp="2017-03-25T21:00:29Z" changeset="47162556" uid="255936" user="StenSoft">
    <tag k="entrance" v="main"/>
  </node>
  <node id="4755346645" lat="50.0998812" lon="14.3896757" version="1" timestamp="2017-03-25T21:00:28Z" changeset="47162556" uid="255936" user="StenSoft"/>
  <node id="4755346653" lat="50.0998874" lon="14.3897965" version="1" timestamp="2017-03-25T21:00:28Z" changeset="47162556" uid="255936" user="StenSoft"/>
  <way id="7663781" version="10" timestamp="2017-03-25T21:00:29Z" changeset="47162556" uid="255936" user="StenSoft">
    <nd ref="2912535678"/>
    <nd ref="2912755528"/>
    <nd ref="2911341908"/>
    <nd ref="2911341907"/>
    <nd ref="2911341904"/>
    <nd ref="2911341903"/>
    <nd ref="2911341905"/>
    <nd ref="2911341909"/>
    <nd ref="2912755526"/>
    <nd ref="2911341906"/>
    <nd ref="2911341902"/>
    <nd ref="2911341901"/>
    <nd ref="2911341800"/>
    <nd ref="2911341799"/>
    <nd ref="2911341798"/>
    <nd ref="2912755527"/>
    <nd ref="2911341910"/>
    <nd ref="4755346645"/>
    <nd ref="3995906462"/>
    <nd ref="4755346653"/>
    <nd ref="2912535678"/>
    <tag k="addr:city" v="Praha"/>
    <tag k="addr:housenumber" v="15"/>
    <tag k="addr:postcode" v="16000"/>
    <tag k="addr:street" v="Evropská"/>
    <tag k="building" v="civic"/>
    <tag k="building:levels" v="1"/>
    <tag k="email" v="info@diplomathotel.cz"/>
    <tag k="fax" v="+420 296 559 207"/>
    <tag k="height" v="10 m"/>
    <tag k="name" v="Diplomat Prague"/>
    <tag k="phone" v="+420 296 559 111"/>
    <tag k="ref:ruian:building" v="22072144"/>
    <tag k="source" v="cuzk:ruian"/>
    <tag k="tourism" v="hotel"/>
    <tag k="website" v="www.vi-hotels.com/en/diplomat"/>
  </way>

</osm>
`,
};

export const overpassBuggyWay = {
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API 0.7.55.5 2ca3f387">
  <node id="4005181658" lat="50.0995601" lon="14.3914853"/>
  <node id="4005181659" lat="50.0995423" lon="14.3914411"/>
  <node id="4005181660" lat="50.0995026" lon="14.3914219"/>
  <way id="397738824">
    <nd ref="4005181658"/>
    <nd ref="4005181659"/>
    <nd ref="4005181660"/>
    <nd ref="4005181658"/>
    <tag k="leisure" v="playground"/>
  </way>
</osm>
`,
};
