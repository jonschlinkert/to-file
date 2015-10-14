'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var utils = require('./utils');
var toFile = require('./');

describe('utils', function () {
  it('should get the stat object for a file:', function () {
    var stat = utils.tryStat('index.js');
    assert(stat.isFile() === true);
  });

  it('should get the stat object for a file relative to cwd:', function () {
    var stat = utils.tryStat('a.txt', {cwd: 'fixtures'});
    assert(stat.isFile() === true);
  });

  it('should return null when the file does not exist', function () {
    var stat = utils.tryStat('foo.txt', {cwd: 'fixtures'});
    assert(stat === null);
  });
});

describe('toFile', function () {
  it('should get the stat object for a file:', function () {
    var file = toFile('index.js');
    assert(file.stat);
    assert(typeof file.stat === 'object');
    assert(file.stat.isFile() === true);
  });

  it('should get the stat object for a file relative to cwd:', function () {
    var file = toFile('a.txt', {cwd: 'fixtures'});
    assert(file.stat.isFile() === true);
  });

  it('should return null when the file does not exist', function () {
    var file = toFile('foo.txt', {cwd: 'fixtures'});
    assert(file.stat === null);
  });

  it('should use `fs.lstat`', function () {
    var file = toFile('a.txt', {cwd: 'fixtures'});
    assert(typeof file.stat.isSymbolicLink === 'function');
  });

  it('should expose `file.path`:', function () {
    var file = toFile('index.js');
    assert(file.path);
    assert(typeof file.path === 'string');
    assert(file.path === 'index.js');
  });

  it('should expose the stat object on `stat`:', function () {
    var file = toFile('index.js');
    assert(file.stat);
    assert(typeof file.stat === 'object');
    assert(typeof file.stat.isFile === 'function');
    assert(typeof file.stat.isDirectory === 'function');
  });

  it('should expose `cwd`:', function () {
    var file = toFile('a.txt', {cwd: 'fixtures'});
    assert(file.cwd);
    assert(typeof file.cwd === 'string');
    assert(file.cwd === 'fixtures');
  });

  it('should resolve the abolute path using cwd:', function () {
    var file = toFile('a.txt', {cwd: 'fixtures'});
    assert(file.path === 'fixtures/a.txt');
  });

  it('should expose `base`:', function () {
    var file = toFile('index.js');
    assert(typeof file.base === 'string');
    assert(file.base === '');
  });

  it('should get the glob parent from the glob pattern:', function () {
    var file = toFile('a.txt', 'fixtures/*.js');
    assert(file.base);
    assert(typeof file.base === 'string');
    assert(file.base === 'fixtures');
  });

  it('should get the glob parent an array of glob patterns:', function () {
    var file = toFile('a.txt', ['fixtures/*.js']);
    assert(file.base);
    assert(typeof file.base === 'string');
    assert(file.base === 'fixtures');
  });

  it('should not update the glob base when pattern is ".":', function () {
    var file = toFile('index.js', ['*.js']);
    assert(typeof file.base === 'string');
    assert(file.base === '');
  });

  it('should expose `file.options`', function () {
    var file = toFile('a.txt', 'fixtures/*.js', {foo: 'bar'});
    assert(file.options);
    assert(typeof file.options === 'object');
    assert(file.options.foo === 'bar');
  });

  it('should expose `file.contents`', function () {
    var file = toFile('fixtures/a.txt');
    assert(file.contents);
  });

  it('should read file.contents as a buffer', function () {
    var file = toFile('fixtures/a.txt', 'fixtures/*.js', {foo: 'bar'});
    assert(Buffer.isBuffer(file.contents));
    assert(file.contents.toString() === 'aaa');
  });
});
