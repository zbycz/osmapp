const fs = require('fs');

const filename = 'tagging-scheme.cs.json';
const content = fs.readFileSync(filename, 'utf8');
const a = JSON.parse(content);

const out = {};

Object.entries(a.cs.presets.presets).forEach(([key, { name }]) => {
  out[key] = name;
});

const out_filename = 'a.json';
const out_json = JSON.stringify(out, null, 2);
fs.writeFileSync(out_filename, out_json);

//  Cannot find module 'node/fs' why?
//  https://stackoverflow.com/questions/56238356/cannot-find-module-node-fs-why
