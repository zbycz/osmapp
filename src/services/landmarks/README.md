# Landmark views

Some important landmarks have predefined views, e.g. the Brandenburg Gate.

To contribute some yourself you need to add the relevant entries into `views.ts`, please take inspiration from the values already defined.

- **Key**: The shortId of a feature, you can see it in the console after clicking on a feature.
- **bearing**: Which direction points upwards on the map, a value of `90` will make east up
- **pitch**: The tilt angle of the map, 0 is a flat view from straight above and the maximum is 60
- **zoom**: The zoom, A higher value is a zoomed in more then a low value. The maximum is 24

`bearing`, `pitch` and `zoom` are all optional; leaving one out will simply not explicitly set that value

Feel free to open a pr and ask for help
Thanks for wanting to contribute :)
