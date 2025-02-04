// identifier should be in the form: foldername.messageid.

export default {
  loading: 'Chargement',
  error: 'Erreur',
  close_panel: 'Fermer cet onglet',
  webgl_error: `Oups, cette carte requiert l’utilisation de WebGL.<br /><br />
    Si votre appareil est compatible, essayez d’utiliser la dernière version de votre navigateur ou activez simplement WebGL :
    <ul><li>dans <a href="https://otechworld.com/webgl-in-firefox/">Firefox, Librewolf</a>
    <li>dans <a href="https://www.geeksforgeeks.org/how-to-enable-webgl-on-chrome/">Chrome, Chromium, Brave, Edge</a></ul>`,
  darkmode_auto: 'Mode sombre : auto',
  darkmode_on: 'Mode sombre : activé',
  darkmode_off: 'Mode sombre : désactivé',

  'project.osmapp.description': 'Une application OpenStreetMap universelle',

  'install.button': 'Installer l’application',
  'install.tabs_aria_label': 'Choisir la plateforme',
  'install.ios_intro': 'Ouvrir osmapp.org dans le <strong>navigateur Safari</strong>',
  'install.ios_share': 'Cliquez sur l’<strong>icône Partager</strong>',
  'install.ios_add': 'Cliquer sur <strong>Ajouter à l’écran d’accueil</strong>',
  'install.android_intro': 'Ouvrir osmapp.org dans le <strong>navigateur Chrome ou Firefox</strong>',
  'install.android_share': 'Cliquer sur le <strong>menu ···</strong>',
  'install.android_add': 'Cliquer sur <strong>Installer l’application</strong>',
  'install.desktop_intro': 'Ouvrir osmapp.org dans <strong>Chrome</strong>, <strong>Firefox</strong> ou <strong>Opera</strong>',
  'install.desktop_install': 'Cliquer sur le <strong>bouton d’installation</strong>',
  'install.outro': 'C’est tout ! OsmApp est sur votre écran d’accueil.',
  'install.note':
    'Note : Cette application fait appel à PWA pour permettre une installation rapide et sans faire appel à Google Play ou l’App Store.',

  'homepage.how_to_start': 'Commencez en tapant votre requête dans la barre de recherche.\nOu cliquez sur un élément de la carte.',
  'homepage.examples.eg': 'ex : ',
  'homepage.examples.charles_bridge_statues': 'Statuet du pont Charles',
  'homepage.screenshot_alt': 'Captures d’écran d’OsmAPP',
  'homepage.about_osm': `Toutes les données proviennent de
      <a href="https://osm.org">OpenStreetMap</a>, une carte créée par
      des millions de bénévoles – similaire à Wikipedia. Vous trouverez
      un bouton <em>Modifier</em> sur chaque élément de la carte.`,
  'homepage.heading_about_osmapp': 'À propos d’OsmAPP',
  'homepage.about_osmapp': `Cette application se veut être une interface pratique pour un usage au quotidien d’<i>OpenStreetMap</i>
     comprenant des fonctions de modifications. <br/>Elle propose actuellement plusieurs couches de carte, un moteur de recherche basique ainsi que des fonctions de modification.
     Des fonctions telles que la navigation ou les favoris sont prévues.`,
  'homepage.github_link': `Vous pouvez proposer de nouvelles fonctionnalités sur <a href="https://github.com/zbycz/osmapp" target='_blank'>GitHub</a>.`,
  'homepage.special_thanks_heading': `Remerciements à`,
  'homepage.for_images': 'pour les images 🖼',
  'homepage.for_osm': 'pour être la meilleure carte au monde 🌎',
  'homepage.maptiler': 'pour de superbes cartes vectorielles et son support pour ce projet ❤️',

  'searchbox.placeholder': 'Recherche OpenStreetMap',

  'featurepanel.no_name': 'Sans nom',
  'featurepanel.share_button': 'Partager',
  'featurepanel.save_button': 'Enregistrer en favoris',
  'featurepanel.directions_button': 'Navigation',
  'featurepanel.error': 'Erreur __code__ lors de la requête OpenStreetMap',
  'featurepanel.error_unknown': 'Erreur inconnue lors de la requête OpenStreetMap.',
  'featurepanel.error_network': 'Requête impossible, veuillez vérifier votre connexion.',
  'featurepanel.error_deleted': 'Cet élément n’existe plus sur OpenStreetMap.',
  'featurepanel.history_button': 'Historique»',
  'featurepanel.details_heading': 'Plus d’informations',
  'featurepanel.edit_button_title': 'Modifier sur OpenStreetMap',
  'featurepanel.edit_button': 'Modifier l’élément',
  'featurepanel.add_place_button': 'Ajouter un élément',
  'featurepanel.undelete_button': 'Restaurer',
  'featurepanel.feature_description_nonosm': 'Élément de type __type__',
  'featurepanel.feature_description_osm': '__type__ dans OpenStreetMap',
  'featurepanel.feature_description_point': 'Coordonnées',
  'featurepanel.show_objects_around': 'Montrer les éléments voisins',
  'featurepanel.uncertain_image': 'Ceci est l’image la plus proche et peut représenter un élément différent.',
  'featurepanel.inline_edit_title': 'Modifier',
  'featurepanel.objects_around': 'Éléments voisins',

  'opening_hours.open': 'Ouverture à : __todayTime__',
  'opening_hours.now_closed_but_today': 'Fermé, ouverture à : __todayTime__',
  'opening_hours.today_closed': 'Fermé aujourd’hui',
  'opening_hours.days_su_mo_tu_we_th_fr_sa': 'dimanche|lundi|mardi|mecredi|jeudi|vendredi|samedi',

  'map.github_title': 'GitHub',
  'map.language_title': 'Langue',
  'map.osm_copyright_tooltip': '© bénévoles OpenStreetMap.org<br> – données libres de la Terre 👌',
  'map.maptiler_copyright_tooltip':
    '© MapTiler.com ❤️<br> – tuiles vectorielles, hébergement, carte de plein air<br>Un grand merci pour son support dans ce projet ! 🙂 ',
  'map.more_button': 'Plus',
  'map.more_button_title': 'Plus d’options…',
  'map.edit_link': 'Modifier dans l’éditeur iD',
  'map.about_link': 'À propos de cette application',

  'editdialog.add_heading': 'Ajouter à OpenStreetMap',
  'editdialog.undelete_heading': 'Ajouter de nouveau à OpenStreetMap',
  'editdialog.edit_heading': 'Modifier',
  'editdialog.suggest_heading': 'Demander une modification',
  'editdialog.feature_type_select': 'Choisir un type',
  'editdialog.options_heading': 'Options',
  'editdialog.cancel_button': 'Annuler',
  'editdialog.save_button_edit': 'Sauvegarder sur OpenStreetMap',
  'editdialog.save_button_delete': 'Supprimer',
  'editdialog.save_button_note': 'Ajouter une note',
  'editdialog.changes_needed': 'Veuillez faire les modifications.',
  'editdialog.loggedInMessage': 'Vos modifications seront immédiatement sauvegardées sous le nom de compte <b>__osmUser__</b>.',
  'editdialog.logout': 'Déconnexion',
  'editdialog.anonymousMessage': 'Une note <b>anonymous</b> sera créée. En vous connectant sur OpenStreetMap, vos modifications seront immédiates.',
  'editdialog.add_major_tag': 'Ajouter',
  'editdialog.location_checkbox': 'Déplacer',
  'editdialog.location_placeholder': 'ex : de l’autre côté de la rue',
  'editdialog.location_editor_to_be_added':
    'L’application ne peut pas encore déplacer cet élément, vous pouvez le faire via l’<a href="__link__">éditeur iD</a>.',
  'editdialog.place_cancelled': 'Élément inexistant (suppression)',
  'editdialog.comment': 'Commentaire (optionnel)',
  'editdialog.comment_placeholder': 'Lien vers la source, etc…',
  'editdialog.info_edit': `Votre modificitation sera directement enregistrée sur OpenStreetMap. Veuillez,
         seulement entrer des informations de sources sûres. Il est interdit
         de copier des données sous Copyright (ex : Google Maps). <a href="https://wiki.openstreetmap.org/wiki/How_We_Map">Plus d’informations</a>`,
  'editdialog.info_note': `Votre demande sera traitée par des bénévoles OpenStreetMap. Vous pouvez ajouter une note supplémentaire ou ou apporter des détails.
         Il est recommandé d’accompagner votre contribution par un lien vers une source d’information (internet, photo, etc.).`,
  'editdialog.tags_editor': 'Toutes les attributs (Propriétés)',
  'editdialog.tags_editor_info': `Les attributs décrivent les éléments selon un format défini. Vous trouverez l’intégralité des attributs sur le <a href="https://wiki.openstreetmap.org/wiki/FR:%C3%89l%C3%A9ments_cartographiques" target="_blank">wiki OpenStreetMap</a>.`,

  'editsuccess.close_button': 'Fermer',
  'editsuccess.note.heading': 'Merci de votre contribution !',
  'editsuccess.note.subheading': 'Des bénévoles OpenStreetMap s’en chargeront.',
  'editsuccess.note.body': 'Cela prend généralement quelques jours, peut être plus selon l’activité de la communauté locale.',
  'editsuccess.note.urlLabel': 'Vous pouvez ajouter des informations et en suivre l’avancement ici :',
  'editsuccess.note.textLabel': 'Texte de la Note',
  'editsuccess.edit.heading': 'Merci de votre contribution !',
  'editsuccess.edit.subheading': 'Votre modification est en cours de diffusion autour du monde.',
  'editsuccess.edit.body': `La base de données a été modifiée. Le changement devrait apparaître sur « OSM Carto » dans quelques minutes.
         Les cartes telles qu’OsmAPP sont mises à jour selon une fréquence mensuelle.
          <br/><br/>Si une erreur a été faite, vous pouvez annulez les informations manuellement et enregistrer à nouveau.`,
  'editsuccess.edit.urlLabel': `Vos modifications :`,
  'editsuccess.edit.textLabel': 'Commentaire',

  'tags.name': 'Nom',
  'tags.website': 'Adresse internet',
  'tags.phone': 'Téléphone',
  'tags.opening_hours': 'Horaires',

  'layerswitcher.button': 'Cartes',
  'layerswitcher.heading': 'Fonds de carte',
  'layerswitcher.intro': 'Merci à OpenStreetMap pour ses données permettant de produires différentes cartes.',
  'layerswitcher.add_layer_button': 'Ajouter une couche personnalisée',

  'layers.basic': 'Basique',
  'layers.outdoor': 'Plein Air',
  'layers.mtb': 'VTT',
  'layers.snow': 'Neige',
  'layers.carto': 'OSM Carto',
  'layers.maptilerSat': 'Maptiler Satellite (zoom < 14)',
  'layers.bingSat': 'Bing Satellite',
  'layers.bike': 'Vélo',
};
