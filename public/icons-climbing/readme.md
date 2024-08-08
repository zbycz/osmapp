
Run docker.app first.

Then run this in `icons-climbing` folder.

```bash

rm -r sprites
mkdir sprites
mv icons sprites/
docker run --platform linux/amd64 -it -e FOLDER=icons -e THEME=climbing -v ${PWD}:/data dolomate/spritezero
mv sprites/icons ./

```
