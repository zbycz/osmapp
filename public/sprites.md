# Create icon sprite

```
brew install librsvg
# or sudo apt-get install librsvg2-bin
yarn global add svgo


# download and extract
mkdir tmp tmp/down && cd tmp/down
wget https://github.com/openmaptiles/osm-bright-gl-style/archive/refs/heads/master.zip -O omt.zip
wget https://github.com/ideditor/temaki/archive/refs/heads/main.zip -O temaki.zip
wget https://github.com/mapbox/maki/archive/refs/heads/master.zip -O maki.zip
unzip maki.zip
unzip temaki.zip
unzip omt.zip
mkdir ../maki ../omt ../temaki
cp maki-main/icons/* ../maki/
cp osm-bright-gl-style-master/icons/* ../omt/
cp temaki-main/icons/* ../temaki/
cd ..


# work on each icon set separately
cd maki
for f in *.svg; do mv $f ${f//-/_}; done
for f in *.svg; do mv $f ${f//.svg/_11.svg}; done
cd ..

mkdir temaki-11
cd temaki
for f in *.svg; rsvg-convert -f svg -w 11 -h 11 $f > ../temaki-11/${f:0:-4}_11.svg
cd ..

mkdir icons-raw icons
mv temaki-11/*.svg icons-raw
mv omt/*.svg icons-raw
svgo -f ./icons-raw -o ./icons
mv maki/*.svg icons

rm -r ../icons
mv icons ..
cd ..



# finalize icons folder (bright-style needs these renames, iD understands without them)
cd icons
cp toilet_11.svg toilets_11.svg
cp waste_11.svg waste_basket_11.svg
cp meat_11.svg butcher_11.svg
cp doctor_11.svg doctors_11.svg
cp bicycle_11.svg bicycle_parking_11.svg
cp bicycle_11.svg cycling_11.svg
cp security_camera_11.svg surveillance_11.svg
cd ..

# add our own icons like circle2_11.svg

# generate sprite in public/ directory (start docker.app first)
rm -r sprites
mkdir sprites
mv icons sprites/
docker run --platform linux/amd64 -it -e FOLDER=icons -e THEME=osmapp -v ${PWD}:/data dolomate/spritezero
mv sprites/icons ./

# update local icons lookup
cat << 'EOF' | node > ../src/components/utils/icons/iconsLookup.ts
  require('fs').readFile('sprites/osmapp.json', 'utf8' , (err, data) => {
    if (err) {return console.error(err)}
    const sprite = JSON.parse(data);
    const names = Object.keys(sprite).map(s => s.replace(/_11$/, ''))
    console.log(`export const icons = ${JSON.stringify(names)};`)
  })
EOF


## TODO  - later

# We can use more sprite files and import them directly from iD project
// Icon prefixes:
// 2 far
// 250 fas
// 71 iD
// 550 maki
// 13 roentgen
// 630 temaki
// 50 undefined

cat << 'EOF' | node > ../src/assets/icons.ts
  const sprites = ['iD-sprite', 'maki-sprite', 'temaki-sprite', 'fa-sprite', 'roentgen-sprite'];
  const promises = sprites.map((f) => require('fs').promises.readFile('sprites/'+f+'.svg', 'utf8'));
  
  Promise.all(promises).then((values) => {
    const icons = values.map((content) => {
      return [...content.matchAll(/id="([^"]+)"/g)].map((matches) => matches[1]);
    })
    console.log(`export const icons = ${JSON.stringify(icons.flat())};`)
  });
EOF

```
