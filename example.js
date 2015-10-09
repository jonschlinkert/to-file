'use strict';

var glob = require('glob');
var toFile = require('./');

var files = glob.sync('*.js');

files = files.map(function (fp) {
  return toFile(fp, '*.js');
});

console.log(files[0].options)
