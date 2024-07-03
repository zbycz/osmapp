type ApiMocks = Record<
  string,
  {
    url: string;
    response: unknown;
  }
>;

export const apiMocks: ApiMocks = {};

apiMocks.wikidata = {
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

apiMocks.commonsCategory = {
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

apiMocks.commonsFile = {
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

apiMocks.wikipedia = {
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

apiMocks.wikipediaCs = {
  url: 'https://cs.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=410&format=json&titles=Yosemite%20National%20Park&origin=*',
  response: apiMocks.wikipedia.response,
};

apiMocks.fody = {
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

apiMocks.mapillary = {
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
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An8mIH1VtiVFr2mm6-M3rFNQb1V95bqjbtcuj5YnEacxO4Pgkfrb7OMFFtfHO7sO_pMXHrKjrYX2yoF1Z9PuTPXoO6Rj2OIz4HJ0UK6vT8NcFW8jDaISYqIDpkrr9ra1MXo5IFMCVo2MTqRb8Vg62g?stp=s1024x768&ccb=10-5&oh=00_AYD4EGuPMsSemv4N3gLP5Qad2EhLClSovwjp9FbPMHwEBA&oe=66ACC8C8&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An8mIH1VtiVFr2mm6-M3rFNQb1V95bqjbtcuj5YnEacxO4Pgkfrb7OMFFtfHO7sO_pMXHrKjrYX2yoF1Z9PuTPXoO6Rj2OIz4HJ0UK6vT8NcFW8jDaISYqIDpkrr9ra1MXo5IFMCVo2MTqRb8Vg62g?ccb=10-5&oh=00_AYB83xyz-puwtu1pQonoTig26YDBVmyNBBLJUqs6A1xRxQ&oe=66ACC8C8&_nc_sid=201bca&_nc_zt=28',
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
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An_6qhtOEYnMa4BuAxut7snDcz85v-xZ0AqyEGj-9GRnVIUVIUycvzYVWzKg3Id5Y55CxqVU2rv2iixXd2_XyLvPwGjDxWbIUfbN2-hjJLxrfNtA8hCx1JMDni0CVHwxFfeW8mIOU92wWERfN23gcYE?stp=s1024x768&ccb=10-5&oh=00_AYB8v8JKecYv6U8FImuWmuwVfFO_ON9HNXihQZ-9l3ONIw&oe=66ACC6B0&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An_6qhtOEYnMa4BuAxut7snDcz85v-xZ0AqyEGj-9GRnVIUVIUycvzYVWzKg3Id5Y55CxqVU2rv2iixXd2_XyLvPwGjDxWbIUfbN2-hjJLxrfNtA8hCx1JMDni0CVHwxFfeW8mIOU92wWERfN23gcYE?ccb=10-5&oh=00_AYBH30PsA833JIqAePNBPmBO9hHEVuJH-soE_eOLlePwrg&oe=66ACC6B0&_nc_sid=201bca&_nc_zt=28',
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
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9_ZPkbARt980mz9eWfhxjyaydvZqGcdmnZurAOOznSqNbGX-nyG9In2hsJKZeZkMTk8N60SG-yQ3ax2vui0T4Uq6aRNP6m1HfCrLysAfarumjlm9S8I50Jx9K7tDHzB47T90Of_FioWreMPECyVQ?stp=s1024x512&ccb=10-5&oh=00_AYBlBDx5gSiTqwPuXV-oPmhXbQm7d9wysegzusC6BNXQzw&oe=66ACE703&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9_ZPkbARt980mz9eWfhxjyaydvZqGcdmnZurAOOznSqNbGX-nyG9In2hsJKZeZkMTk8N60SG-yQ3ax2vui0T4Uq6aRNP6m1HfCrLysAfarumjlm9S8I50Jx9K7tDHzB47T90Of_FioWreMPECyVQ?ccb=10-5&oh=00_AYDM9oZiCMEX2vGV8-evdXSYvvQPiPpFp387wIouF-5D9A&oe=66ACE703&_nc_sid=201bca&_nc_zt=28',
        is_pano: true,
        id: '321151246189360',
      },
      {
        compass_angle: 299.02419996262,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421551089998, 50.087565349226],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421551089998, 50.087565349226],
        },
        captured_at: 1717141122911,
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An8Ky5V2KO_BwB0TxGbGF8B4abXmvQpcgDgs9AhJ2PWUqzJoGul_JHw7vdvJmKpj4tUxEFeFNSLy_8T8RyUguC2TugWHX1uBdQr02pWpE3ad4stcQlJNg2DjHlZM_9OnFx_ig_wB4Eq_kJAD0N3Wkw?stp=s1024x768&ccb=10-5&oh=00_AYAiqHJGRpvEv1fz_6Ii-MRS0mKWRCB1Vbe2Skhmpz8otg&oe=66ACB988&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An8Ky5V2KO_BwB0TxGbGF8B4abXmvQpcgDgs9AhJ2PWUqzJoGul_JHw7vdvJmKpj4tUxEFeFNSLy_8T8RyUguC2TugWHX1uBdQr02pWpE3ad4stcQlJNg2DjHlZM_9OnFx_ig_wB4Eq_kJAD0N3Wkw?ccb=10-5&oh=00_AYAGGC9ftwH-cnA-kuhcc6byFG-hUL-uyeOA40vwa0uUrw&oe=66ACB988&_nc_sid=201bca&_nc_zt=28',
        is_pano: false,
        id: '327836483539720',
      },
      {
        compass_angle: 236.02418851852,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.42149122807, 50.087591059998],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.42149122807, 50.087591059998],
        },
        captured_at: 1717141119980,
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An-cXK35FYB55zxAm3jyaPuiEXY1XRjIVHW6gZnQD5BO_B57QkZbnf2PLYxIilp9Wxn3MqoSqsh6NE6pLugclZPxdrXYj6T5jzGL_tiJoRNY0pwXEEdssdiLf2ULrCPF4q6FRmSkspFhUjCgDWSNbg?stp=s1024x768&ccb=10-5&oh=00_AYD8OjtTQik9-P1aUaVjatgwDyBu8ExmFG7wlKkD8Lt71w&oe=66ACB69A&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An-cXK35FYB55zxAm3jyaPuiEXY1XRjIVHW6gZnQD5BO_B57QkZbnf2PLYxIilp9Wxn3MqoSqsh6NE6pLugclZPxdrXYj6T5jzGL_tiJoRNY0pwXEEdssdiLf2ULrCPF4q6FRmSkspFhUjCgDWSNbg?ccb=10-5&oh=00_AYA5Q45PgWNB-Yh0C4wYQUyA2bgRhAN2t0DUubmqjcvCNg&oe=66ACB69A&_nc_sid=201bca&_nc_zt=28',
        is_pano: false,
        id: '786771350259062',
      },
      {
        compass_angle: 41.7,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421417255098, 50.087396426975],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421373050027, 50.087377100038],
        },
        captured_at: 1501171105708,
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9fQC_aZO3sRDkmmuWBTAEY2xbJ0qqlOWUWEJBiULZZsPkOOznHexLI_8exjaef5Sph5mH7xhidJ1euul-LJRf2dmIEK3lLbSQi2pLt8XTXBytU5ZJsN9cWFH2_0GFWNq-N12LfnsbfCemItt4KUg?stp=s1024x576&ccb=10-5&oh=00_AYC2gDQXlIa6jRvhuTefVZFZ7kKX-Dc4X4RuLkHbhS0HEA&oe=66ACBB58&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9fQC_aZO3sRDkmmuWBTAEY2xbJ0qqlOWUWEJBiULZZsPkOOznHexLI_8exjaef5Sph5mH7xhidJ1euul-LJRf2dmIEK3lLbSQi2pLt8XTXBytU5ZJsN9cWFH2_0GFWNq-N12LfnsbfCemItt4KUg?ccb=10-5&oh=00_AYCkTMQWE_PYtIoJRJrtSYmNOtgr-awt6_A9TSO8ra4c4w&oe=66ACBB58&_nc_sid=201bca&_nc_zt=28',
        is_pano: false,
        id: '927282008063676',
      },
      {
        compass_angle: 185.5,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421398908281, 50.087691031777],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421375540022, 50.087684939972],
        },
        captured_at: 1500907438953,
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9AnD_ok4AdpgpHsM9Yiavy0m63fnuLuVCLzGGXhO-47ATmpNeLOulNc_W56t5DFBTIURxTEwLKkVBxBONLXd6jvRLjovVnLobA0N7eXqLTXUZm8VCRBLPnkGOVBaYL6TmU_j1UF0ASZGZsUL7Gdw?stp=s1024x576&ccb=10-5&oh=00_AYCNKb67LJ_dl7Z5prwpzHkvwJMKQPPUuFt1REaZtnKsYw&oe=66ACE83C&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9AnD_ok4AdpgpHsM9Yiavy0m63fnuLuVCLzGGXhO-47ATmpNeLOulNc_W56t5DFBTIURxTEwLKkVBxBONLXd6jvRLjovVnLobA0N7eXqLTXUZm8VCRBLPnkGOVBaYL6TmU_j1UF0ASZGZsUL7Gdw?ccb=10-5&oh=00_AYDPlyFFvsx_GB6Z2nzjb8mzDrw_IKS2NHPryVKF5QpnTg&oe=66ACE83C&_nc_sid=201bca&_nc_zt=28',
        is_pano: false,
        id: '600712390887384',
      },
      {
        compass_angle: 0,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421309815081, 50.087342945383],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421309722222, 50.087342777778],
        },
        captured_at: 1558086407000,
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9WHyH4N1EbumQ5rsCduv5wxwbILfEiOrb0LbJk5JQjye96gvLfNyQ30LMYa8IESgCqvoJvgGaIyk8FRu_VT7kdElSbeBWvSyKiWMRKrcAzAomkjn6-QSsElKwhgDshrjcp1a65NFF1P_dzkxryJaI?stp=s1024x512&ccb=10-5&oh=00_AYDB-JlMkiQVk87c-MpgnLImSJbVPaGi0X4GnFf6zRzcaQ&oe=66ACCAEB&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An9WHyH4N1EbumQ5rsCduv5wxwbILfEiOrb0LbJk5JQjye96gvLfNyQ30LMYa8IESgCqvoJvgGaIyk8FRu_VT7kdElSbeBWvSyKiWMRKrcAzAomkjn6-QSsElKwhgDshrjcp1a65NFF1P_dzkxryJaI?ccb=10-5&oh=00_AYAO-PX6kNpkpoXZqlTYJY1G4hZ6nWUCo7kRCWVIsmnxgw&oe=66ACCAEB&_nc_sid=201bca&_nc_zt=28',
        is_pano: true,
        id: '111643670993970',
      },

      {
        compass_angle: 163.17413478928,
        computed_geometry: {
          type: 'Point',
          coordinates: [14.421604314566, 50.087541855909],
        },
        geometry: {
          type: 'Point',
          coordinates: [14.421606625, 50.087583141667],
        },
        captured_at: 1584099976500,
        thumb_1024_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An-ePHhWwQUCZh3KmK-v4Geke3Pk6gOBOwcFxlxS2B3EHifeRV_ahbOg3i5mzaZbRbr08JSsrmD42AreIbTk_jQHPK_EhPnAfZ74b-8mHAOSWQYgFDnJIjQoWpMGCuWsrhfzkozs3KtXcHlb1b8_eI8?stp=s1024x512&ccb=10-5&oh=00_AYA_Yn_GOfYi-rYvigjXE2skCOFaXEb7we43eb9_fZjkIQ&oe=66ACC2BC&_nc_sid=201bca&_nc_zt=28',
        thumb_original_url:
          'https://z-p3-scontent.fprg5-1.fna.fbcdn.net/m1/v/t6/An-ePHhWwQUCZh3KmK-v4Geke3Pk6gOBOwcFxlxS2B3EHifeRV_ahbOg3i5mzaZbRbr08JSsrmD42AreIbTk_jQHPK_EhPnAfZ74b-8mHAOSWQYgFDnJIjQoWpMGCuWsrhfzkozs3KtXcHlb1b8_eI8?ccb=10-5&oh=00_AYCRvKOIjBfo_EVy50R6PSz0hI4qQ3S17FzQVKpQsfcLig&oe=66ACC2BC&_nc_sid=201bca&_nc_zt=28',
        is_pano: true,
        id: '2019478678208450',
      },
    ],
  },
};
