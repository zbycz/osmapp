export type ApiMock = {
  url: string;
  response: unknown;
};

export const WIKIDATA: ApiMock = {
  url: 'https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&format=json&entity=Q180402&origin=*',
  response: {
    claims: {
      P18: [
        {
          mainsnak: {
            snaktype: 'value',
            property: 'P18',
            hash: 'b8c57d62b58b258173175cee3615169e17927449',
            datavalue: {
              value: 'Half Dome with Eastern Yosemite Valley (50MP).jpg',
              type: 'string',
            },
            datatype: 'commonsMedia',
          },
          type: 'statement',
          id: 'q180402$A6F07363-5391-42B8-BABF-B4B7BF9D4DBC',
          rank: 'preferred',
        },
      ],
    },
  },
};

export const COMMONS_CATEGORY: ApiMock = {
  url: 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=410&format=json&titles=Category%3AYosemite%20National%20Park&origin=*',
  response: {
    batchcomplete: '',
    query: {
      pages: {
        '51519': {
          pageid: 51519,
          ns: 14,
          title: 'Category:Yosemite National Park',
        },
      },
    },
  },
};

export const COMMONS_FILE: ApiMock = {
  url: 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=410&format=json&titles=File%3AHlubo%C4%8Depsk%C3%A9%20plotny%20-%20Prav%C3%A1%20plotna.jpg&origin=*',
  response: {
    batchcomplete: '',
    query: {
      pages: {
        '145779916': {
          pageid: 145779916,
          ns: 6,
          title: 'File:Hlubočepské plotny - Pravá plotna.jpg',
          imagerepository: 'local',
          imageinfo: [
            {
              thumburl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/410px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              thumbwidth: 410,
              thumbheight: 314,
              responsiveUrls: {
                '1.5':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/615px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
                '2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg/820px-Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              },
              url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              descriptionurl:
                'https://commons.wikimedia.org/wiki/File:Hlubo%C4%8Depsk%C3%A9_plotny_-_Prav%C3%A1_plotna.jpg',
              descriptionshorturl:
                'https://commons.wikimedia.org/w/index.php?curid=145779916',
            },
          ],
        },
      },
    },
  },
};

export const WIKIPEDIA: ApiMock = {
  url: 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=410&format=json&titles=Yosemite%20National%20Park&origin=*',
  response: {
    batchcomplete: '',
    query: {
      pages: {
        '48664': {
          pageid: 48664,
          ns: 0,
          title: 'Yosemite National Park',
          thumbnail: {
            source:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/410px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
            width: 410,
            height: 418,
          },
          pageimage: 'Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg',
        },
      },
    },
  },
};

export const WIKIPEDIA_CS: ApiMock = {
  url: 'https://cs.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=410&format=json&titles=Yosemite%20National%20Park&origin=*',
  response: WIKIPEDIA.response,
};

export const FODY: ApiMock = {
  url: 'https://osm.fit.vutbr.cz/fody/api/close?lat=50.0995841&lon=14.304877&limit=1&distance=50',
  response: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [14.30481, 50.09958],
        },
        properties: {
          id: 25530,
          author: 'Milancer',
          ref: 'AB030',
          tags: 'pesi:;rozcestnik:',
          created: '2019-11-10 15:19:18',
          enabled: 't',
          distance: 4.80058345,
        },
      },
    ],
  },
};

export const MAPILLARY: ApiMock = {
  url: 'https://graph.mapillary.com/images?access_token=MLY|4742193415884187|44e43b57d0211d8283a7ca1c3e6a63f2&fields=compass_angle,computed_geometry,geometry,captured_at,thumb_1024_url,thumb_original_url,is_pano&bbox=14.4208535,50.0870654,14.421653500000001,50.0878654',
  response: {
    data: [
      {
        compass_angle: 194.02419996262,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421551089998, 50.087565349226],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421551089998, 50.087565349226],
        },
        captured_at: 1717141124911,
        thumb_1024_url: 'xxx',
        thumb_original_url: 'xxx',
        is_pano: false,
        id: '375719495494059',
      },
      {
        compass_angle: 269.9,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421366352906, 50.087320707947],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421424469965, 50.087293650001],
        },
        captured_at: 1448281422000,
        thumb_1024_url: 'xxx',
        thumb_original_url: 'xxx',
        is_pano: false,
        id: '903876213766215',
      },
      {
        compass_angle: 343.14147579344,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421627585298, 50.087494303731],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421633830556, 50.087523947222],
        },
        captured_at: 1584100010500,
        thumb_1024_url: 'mapillary_url_1024',
        thumb_original_url: 'mapillary_url_original',
        is_pano: true,
        id: '321151246189360',
      },
    ],
  },
};
