// identifier should be in the form: foldername.messageid.

export default {
  loading: 'Loading',
  error: 'Error',
  close_panel: 'Close panel',
  webgl_error: `Oops. This map needs WebGL technology.<br /><br />
     If you have a compatible device, try using the latest version of your browser or simply enable WebGL:
     <ul><li>in <a href="https://otechworld.com/webgl-in-firefox/">Firefox, Librewolf</a>
     <li>in <a href="https://www.geeksforgeeks.org/how-to-enable-webgl-on-chrome/">Chrome, Chromium, Brave, Edge</a></ul>`,
  darkmode_auto: 'Dark mode: auto',
  darkmode_on: 'Dark mode: on',
  darkmode_off: 'Dark mode: off',
  show_more: 'Show more',
  show_less: 'Show less',

  'user.login_register': 'Login / register',
  'user.logout': 'Logout',
  'user.my_ticks': 'My ticks',
  'user.user_settings': 'Settings',

  'my_ticks.title': 'My ticks',
  'my_ticks.route_name': 'Name',
  'my_ticks.route_grade': 'Grade',
  'my_ticks.route_style': 'Style',
  'my_ticks.route_date': 'Date',
  'my_ticks.no_ticks_paragraph1': 'You have no ticks so far…',
  'my_ticks.no_ticks_paragraph2': 'Try to add one on the crag',

  'tick.style_description_not_selected': 'No climbing style selected.',
  'tick.style_description_OS': 'Climbing the route on the first try without any prior knowledge or practice.',
  'tick.style_description_FL': 'Climbing the route on the first try with some prior knowledge or beta.',
  'tick.style_description_RP': 'Successfully climbing the route after practicing it beforehand.',
  'tick.style_description_PP': 'Successfully climbing the route with pre-placed protection after practicing it.',
  'tick.style_description_RK': 'Climbing the route using a mix of free climbing and aid climbing.',
  'tick.style_description_AF': 'Climbing the route entirely free without using aid.',
  'tick.style_description_TR': 'Climbing the route with a rope already anchored at the top.',
  'tick.style_description_FS': 'Climbing the route without any protective gear or ropes.',

  'climbing_renderer.climbing_grade': 'climbing grade ',

  'project.osmapp.description': 'A universal app for OpenStreetMap',
  'project.osmapp.serpDescription':
    'An open-source map of the world based on the OpenStreetMap database. Features a search, clickable points of interest, in-app map edits, and more!',

  'project.openclimbing.description': 'Free wiki climbing map',
  'project.openclimbing.serpDescription': 'A wiki based open-source climbing map with topos. Built on OpenStreetMap and Wikipedia projects.',

  'install.button': 'Install app',
  'install.tabs_aria_label': 'Choose your platform',
  'install.ios_intro': 'Open osmapp.org in the <strong>Safari browser</strong>',
  'install.ios_share': 'Tap <strong>Share icon</strong>',
  'install.ios_add': 'Tap <strong>Add to Home Screen</strong>',
  'install.android_intro': 'Open osmapp.org in the <strong>Chrome or Firefox browser</strong>',
  'install.android_share': 'Tap the <strong>three dots menu</strong>',
  'install.android_add': 'Tap <strong>Install app</strong>',
  'install.desktop_intro': 'Open osmapp.org in <strong>Chrome</strong>, <strong>FirefoxOS</strong> or <strong>Opera</strong>',
  'install.desktop_install': 'Click the <strong>install button</strong>',
  'install.outro': 'Thats all! Look for OsmAPP at your home screen.',
  'install.note': 'Note: This app uses PWA technology – featuring quick installation and no need for Google Play or App Store.',
  'homepage.how_to_start': 'Start by typing your query into the searchbox.\nOr click any item on the map.',
  'homepage.go_to_map_button': 'Go to map',
  'homepage.examples.eg': 'eg.',
  'homepage.examples.charles_bridge_statues': 'Statues of Charles bridge',
  'homepage.screenshot_alt': 'Screenshot of OsmAPP',
  'homepage.about_osm': `All map data is from
      <a href="https://osm.org">OpenStreetMap</a>, a map created by
      millions of contributors — similar to Wikipedia. You can find
      <em>Edit</em> button on each map feature.`,
  'homepage.heading_about_osmapp': 'About OsmAPP',
  'homepage.about_osmapp': `This application should offer a convenient interface for everyday use of <i>OpenStreetMap</i>
     including editing options. <br/>Currently it includes various map layers, POI editing and a basic search engine.
     Features such as navigation or favorite places are planned.`,
  'homepage.github_link': `You may suggest new features on <a href="https://github.com/zbycz/osmapp" target='_blank'>GitHub</a>.`,
  'homepage.special_thanks_heading': `Special thanks to`,
  'homepage.for_images': 'for images 🖼',
  'homepage.for_osm': 'for the best world map 🌎',
  'homepage.maptiler': 'for awesome vector maps and for supporting this project  ❤️ ',
  'homepage.vercel': 'for a great app hosting platform',
  'homepage.disclaimer_heading': 'Disclaimer',
  'homepage.disclaimer': `OpenStreetMap and OSM are a trademark of the OpenStreetMap Foundation. This project is not endorsed by or affiliated with the <a href="https://osmfoundation.org/" target='_blank'>OpenStreetMap Foundation</a>.`,
  'homepage.disclaimer_maptiler': `Vector maps ("Basic" and "Outdoor") contain some place names from the Wikidata project, more <a href="https://github.com/openstreetmap/openstreetmap-website/pull/4042#issuecomment-1562761674" target='_blank'>here</a>.`,

  'searchbox.placeholder': 'Search OpenStreetMap',
  'searchbox.category': 'category',
  'searchbox.overpass_success': 'Results found: __count__',
  'searchbox.overpass_error': 'Error fetching results. __message__',
  'searchbox.overpass_custom_query': 'custom query',

  'featurepanel.no_name': 'No name',
  'featurepanel.share_button': 'Share',
  'featurepanel.favorites_save_button': 'Save to favorites',
  'featurepanel.favorites_unsave_button': 'Remove from favorites',
  'featurepanel.directions_button': 'Directions',
  'featurepanel.error': 'Error __code__ while fetching feature from OpenStreetMap',
  'featurepanel.error_unknown': 'Unknown error while fetching feature from OpenStreetMap.',
  'featurepanel.error_network': "Can't get the feature, check your network cable.",
  'featurepanel.error_deleted': 'This object is marked as deleted in OpenStreetMap.',
  'featurepanel.info_no_tags': 'This object has no tags. Usually it means that it only carries geometry/location for a parent object.',
  'featurepanel.history_button': 'History »',
  'featurepanel.details_heading': 'Details',
  'featurepanel.all_tags_heading': 'All tags',
  'featurepanel.edit_button_title': 'Edit in OpenStreetMap database',
  'featurepanel.note_button': 'Suggest an edit',
  'featurepanel.edit_button': 'Edit details',
  'featurepanel.add_place_button': 'Add a place',
  'featurepanel.undelete_button': 'Un-delete',
  'featurepanel.feature_description_nonosm': 'Map feature __type__',
  'featurepanel.feature_description_osm': '__type__ in OpenStreetMap database',
  'featurepanel.feature_description_point': 'Map coordinates',
  'featurepanel.show_tags': 'Show tags',
  'featurepanel.show_objects_around': 'Show nearby objects',
  'featurepanel.uncertain_image': 'This is the closest street view image from Mapillary. It may be inaccurate.',
  'featurepanel.inline_edit_title': 'Edit',
  'featurepanel.objects_around': 'Nearby objects',
  'featurepanel.more_in_openplaceguide': 'More information on __instanceName__',
  'featurepanel.climbing_restriction': 'Climbing restriction',

  'opening_hours.all_day': '24 hours',
  'opening_hours.open': 'Open: __todayTime__',
  'opening_hours.now_closed_but_today': 'Closed now - Open __todayTime__',
  'opening_hours.today_closed': 'Closed today',
  'opening_hours.opens_soon': 'Opens soon',
  'opening_hours.opens_soon_today': 'Opens soon: __todayTime__',
  'opening_hours.closes_soon': 'Closes soon',
  'opening_hours.days_su_mo_tu_we_th_fr_sa': 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday',
  'opening_hours.editor.closed': 'closed',
  'opening_hours.editor.create_advanced': 'You may create more detailed opening hours in <link>YoHours tool</link>.',
  'opening_hours.editor.cant_edit_here': "This opening hours can't be edited here. Please use the <link>YoHours tool</link>.",

  'map.github_title': 'GitHub repository',
  'map.language_title': 'Change language',
  'map.osm_copyright_tooltip': '(c) OpenStreetMap.org contributors<br> – free map data of the Earth 👌',
  'map.maptiler_copyright_tooltip': '(c) MapTiler.com ❤️ <br> – vector tiles, hosting, outdoor map<br>Big thanks for supporting this project! 🙂 ',
  'map.more_button': 'more',
  'map.more_button_title': 'More options…',
  'map.edit_link': 'Edit this area in iD editor',
  'map.about_link': 'About this app',
  'map.compass_tooltip': 'Drag to enter 3D. Click to reset.',

  'editdialog.add_heading': 'Add to OpenStreetMap',
  'editdialog.undelete_heading': 'Add again to OpenStreetMap',
  'editdialog.edit_heading': 'Edit:',
  'editdialog.suggest_heading': 'Suggest an edit:',
  'editdialog.feature_type_select': 'Choose type',
  'editdialog.options_heading': 'Options',
  'editdialog.cancel_button': 'Cancel',
  'editdialog.save_button_edit': 'Save to OSM',
  'editdialog.save_button_delete': 'Delete',
  'editdialog.save_button_note': 'Submit',
  'editdialog.changes_needed': 'Please, make some changes.',
  'editdialog.osm_session_expired': 'Your OpenStreetMap session has expired. Please, log in again.',
  'editdialog.loggedInMessage': 'You are logged in as <b>__osmUser__</b>, changes will be saved immediately.',
  'editdialog.logout': 'logout',
  'editdialog.anonymousMessage1': 'An <b>anonymous</b> note will be added to the map.<br />If you',
  'editdialog.anonymousMessage2_login': 'log in to OpenStreetMap',
  'editdialog.anonymousMessage3': ', your changes will be immediate.',
  'editdialog.add_major_tag': 'Add',
  'editdialog.location_checkbox': 'New location',
  'editdialog.location_placeholder': 'eg. across the street',
  'editdialog.location_editor_to_be_added': 'The position cannot be edited here yet, you can do so in the <a href="__link__">iD editor</a>.',
  'editdialog.place_cancelled': 'Permanently closed (delete)',
  'editdialog.comment': 'Comment (optional)',
  'editdialog.comment_placeholder': 'Note, link to source, etc.',
  'editdialog.info_edit': `Your edit will be immediately saved to the OpenStreetMap. Please,
         enter only information from your own or verified sources. It is prohibited
         to copy copyrighted data (e.g. Google Maps). <a href="https://wiki.openstreetmap.org/wiki/How_We_Map">More info</a>`,
  'editdialog.info_note':
    'Your suggestion will be reviewed by OpenStreetMap volunteers. You can add additional information such as a link to a photo or a link to source material for them below!',
  'editdialog.other_tags_heading': 'Other tags',
  'editdialog.other_tags': 'Edit Tags',
  'editdialog.other_tags.new_key': 'new key',
  'editdialog.other_tags.will_be_deleted': 'will be deleted',
  'editdialog.other_tags.info': `Tags contain the data used to display objects on the map!<br>You can find <a href="https://wiki.openstreetmap.org/wiki/Map_Features">a reference for all tags on the OpenStreetMap Wiki</a>!`,

  'editsuccess.close_button': 'Done',
  'editsuccess.note.heading': 'Thank you for your suggestion!',
  'editsuccess.note.subheading': 'OpenStreetMap volunteers will review it.',
  'editsuccess.note.body':
    'It usually takes a few days for a change to be reviewed. If there are no volunteers working on the area it could take a while!',
  'editsuccess.note.urlLabel': 'You can add information or follow updates here:',
  'editsuccess.note.textLabel': 'Note text',
  'editsuccess.edit.heading': 'Thank you for your edit!',
  'editsuccess.edit.subheading': 'Your change is starting to appear on maps around the world.',
  'editsuccess.edit.body': `Your change will appear in the OSM database immediately, it will be visible in the "OSM Carto" layer in a few minutes!
         OsmAPP map and other applications are refreshed about once a month.
          <br/><br/>If this is a mistake, you can manually revert the values and save it again.`,
  'editsuccess.edit.urlLabel': `Your changes:`,
  'editsuccess.edit.textLabel': 'Comment',

  'tags.name': 'Name',
  'tags.website': 'Website',
  'tags.phone': 'Phone',
  'tags.opening_hours': 'Hours',

  'coordinates.geo_uri': 'GeoURI (phone map app)',
  'coordinates.copy_value': 'Copy __value__', // keep it short, don't mention clipboard

  'layerswitcher.button': 'Layers',
  'layerswitcher.heading': 'Map layers',
  'layerswitcher.intro': 'Thanks to the fact that OpenStreetMap offers source data, anyone can produce different variants of the map.',
  'layerswitcher.add_layer_button': 'Add custom layer',
  'layerswitcher.add_layer_prompt': 'Add custom TMS layer – needs correct CORS:\n(beta feature)',
  'layerswitcher.overlays': 'Overlays',
  'layerswitcher.not_all_work': 'Please note that some layers may not work in OsmAPP.',
  'layerswitcher.license': 'License',
  'layerswitcher.privacy_policy': 'Privacy policy',
  'layerswitcher.category': 'Category',
  'layerswitcher.category_photo': 'Aerial imagery',
  'layerswitcher.category_osmbasedmap': 'Normal layer',
  'layerswitcher.compatible_license': 'License compatible for editing OpenStreetMap',
  'layerswitcher.layers_in_area': 'Filter layers in this area',

  'layers.basic': 'Basic',
  'layers.makina_africa': 'OpenPlaceGuide Africa',
  'layers.outdoor': 'Outdoor',
  'layers.mtb': 'MTB',
  'layers.snow': 'Snow',
  'layers.carto': 'OSM Carto',
  'layers.maptilerSat': 'Maptiler Satellite (z<14)',
  'layers.bingSat': 'Bing Satellite',
  'layers.bike': 'Bike',
  'layers.climbing': 'Climbing',

  'climbingpanel.create_climbing_route': 'Draw new route in schema',
  'climbingpanel.edit_climbing_route': 'Edit route in schema',
  'climbingpanel.finish_climbing_route': 'Finish route',
  'climbingpanel.cancel_climbing_route': 'Cancel',
  'climbingpanel.delete_climbing_route': 'Delete route __route__ in schema',
  'climbingpanel.create_first_node': 'Click on the beginning of the route',
  'climbingpanel.create_next_node': 'Follow direction of the route',
  'climbingpanel.draw_route': 'Draw route',

  'climbingpanel.show_route_detail': 'Show route detail',
  'climbingpanel.add_tick': 'Add tick',

  'runway.information': 'Runway information',
  'runway.runway': 'Runway',
  'runway.size': 'Length (m) - Width (m)',
  'runway.surface': 'Surface',
};
