// dentifier should be in the form: foldername.messageid.

export default {
  loading: 'Loading',
  error: 'Error',

  'homepage.subtitle': 'A universal OpenStreetMap app',
  'homepage.how_to_start': 'Start by typing your query into the searchbox.\nOr click any item on the map.',
  'homepage.examples.eg': 'eg.',
  'homepage.examples.charles_bridge_statues': 'Statues of Charles bridge',
  'homepage.screenshot_alt': 'Screenshot of OsmAPP',
  'homepage.osm_logo_alt': 'OpenStreetMap logo',
  'homepage.about_osm': `All map data is from
      <a href="https://osm.org">OpenStreetMap</a>, a map created by
      milions of contributors — similar to Wikipedia. You can find
      <em>Edit</em> button on each map feature.`,
  'homepage.heading_about_osmapp': 'About OsmAPP',
  'homepage.about_osmapp': `This application should provide everyday
        OpenStreetMap experience for everyone. Currently it is in beta
        stage, but it offers showing and editting POIs and basic search functionality.
        More features are planned - like switching layers,
        vector outdoor map, driving directions or favourite places.`,
  'homepage.github_link': `You may suggest new features on <a href="https://github.com/zbycz/osmapp">Github</a>.`,
  'homepage.special_thanks_heading': `Special thanks to`,
  'homepage.special_thanks': `<ul>
        <li><a href="https://www.maptiler.com/">MapTiler</a> for vector map tiles
        <li><a href="https://www.mapillary.com/">Mapillary</a>, <a href="https://openstreetmap.cz/fody">Fody</a>,
              <a href="https://www.wikipedia.org/">Wikipedia</a> for images
        <li><a href="https://nominatim.openstreetmap.org/">Nominatim</a> for search box
        <li><a href="https://www.openstreetmap.org/">OpenStreetMap</a> for the best world map database
      </ul>
  `,

  'searchbox.placeholder': 'Search OpenStreetMap',
  'searchbox.close_panel': 'Close side-panel',

  'featurepanel.no_name': 'No name',
  'featurepanel.share_button': 'Share',
  'featurepanel.save_button': 'Save to favorites',
  'featurepanel.directions_button': 'Directions',
  'featurepanel.error': 'Error __code__ while fetching feature from OpenStreetMap',
  'featurepanel.error_unknown': 'Unknown error while fetching feature from OpenStreetMap.',
  'featurepanel.error_network': "Can't get the feature, check your network cable.",
  'featurepanel.error_gone': 'This feature was recently deleted from OpenStreetMap.',
  'featurepanel.history_button': 'History »',
  'featurepanel.other_info_heading': 'More information',
  'featurepanel.edit_button_title': 'Edit in OpenStreetMap database',
  'featurepanel.edit_button': 'Edit place',
  'featurepanel.feature_description_nonosm': 'Map feature __type__',
  'featurepanel.feature_description_osm': '__type__ in OpenStreetMap database',
  'featurepanel.show_objects_around': 'Show objects around',
  'featurepanel.uncertain_image': 'This is the closest street view image. It may show different object.',
  'featurepanel.inline_edit_title': 'Edit',
  'featurepanel.objects_around': 'Objects around',

  'opening_hours.open': 'Open: __todayTime__',
  'opening_hours.now_closed_but_today': 'Now closed, today: __todayTime__',
  'opening_hours.today_closed': 'Today closed',
  'opening_hours.days_su_mo_tu_we_th_fr_sa': 'sunday|monday|tuesday|wednesday|thursday|friday|saturday',

  'map.edit_button': 'edit',
  'map.edit_button_title': 'open in iD editor',
  'map.copyright': '(c) OpenStreetMap.org contributors',
  'map.map_data_button': 'map data',

  'editdialog.edit_heading': 'Edit:',
  'editdialog.suggest_heading': 'Suggest an edit:',
  'editdialog.options_heading': 'Options',
  'editdialog.cancel_button': 'Cancel',
  'editdialog.save_button': 'Save',
  'editdialog.changes_needed': 'Please, make some changes.',
  'editdialog.loggedInMessage': 'You are logged in as <b>__osmUser__</b>, changes will be saved immediately.',
  'editdialog.logout': 'logout',
  'editdialog.anonymousMessage1': 'An <b>anonymous</b> note will be added to the map.<br />If you',
  'editdialog.anonymousMessage2_login': 'log in to OpenStreetMap',
  'editdialog.anonymousMessage3': ', your changes will be immediate.',
  'editdialog.add_major_tag': 'Add',
  'editdialog.location_checkbox': 'Change location',
  'editdialog.location_placeholder': 'eg. across the street',
  'editdialog.location_editor_to_be_added': 'The position cannot be edited here yet, you can do so in the <a href="__link__">iD editor</a>.',
  'editdialog.place_cancelled': 'Place cancelled or permanently closed',
  'editdialog.comment': 'Comment (optional)',
  'editdialog.comment_placeholder': 'link to the source of information etc.',
  'editdialog.info_edit': `Your edit will be immediately saved to the OpenStreetMap. Please,
         enter only information from your own or verified sources. It is prohibited
         to copy copyrighted data (e.g. Google Maps). <a href="https://wiki.openstreetmap.org/wiki/How_We_Map">More info</a>`,
  'editdialog.info_note': `Your suggestion will be processed by OpenStreetMap volunteers. Here
         you can add an additional note or describe position adjustment etc.
         It is also appropriate to support your contribution with a link to a source of information (web,
         photo, etc.).`,
  'editdialog.other_tags': 'Other properties – tags',
  'editdialog.other_tags.new_key': 'new key',
  'editdialog.other_tags.add': 'Add',
  'editdialog.other_tags.will_be_deleted': 'will be deleted',

  'editsuccess.close_button': 'Close',
  'editsuccess.note.heading': 'Thank you for your suggestion!',
  'editsuccess.note.subheading': 'OpenStreetMap volunteers will process it over time.',
  'editsuccess.note.body': 'It usually takes few days. However, in places with no active community, it can take a very long time.',
  'editsuccess.note.urlLabel': 'You can add information or follow updates here:',
  'editsuccess.note.textLabel': 'Note text',
  'editsuccess.edit.heading': 'Thank you for your edit!',
  'editsuccess.edit.subheading': 'Your change is starting to appear on maps around the world.',
  'editsuccess.edit.body': `It is already stored in the OSM database. You will see it on the "OSM Mapnik" map in a few minutes.
         The local map and various other applications are refreshed about once a month.
          <br/><br/>If this is a mistake, you can manually revert the values and save it again.`,
  'editsuccess.edit.urlLabel': `Your changes:`,
  'editsuccess.edit.textLabel': 'Comment',

  'tags.name': 'Name',
  'tags.website': 'Web',
  'tags.phone': 'Phone',
  'tags.opening_hours': 'Opening hours',
};
