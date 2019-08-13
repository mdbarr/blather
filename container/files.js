'use strict';

const fs = require('fs');
const dree = require('dree');
const mime = require('mime');
const { merge } = require('barrkeep/utils');

const defaults = {
  stat: false,
  normalize: true,
  followLinks: true,
  size: true,
  hash: true,
  exclude: /(node_modules|\.git)/
};

function Files (container, directory, options = {}) {
  this.config = merge(defaults, options, true);

  this.tree = {};

  this.files = new Map();

  this.open = (path) => {
    if (this.files.has(path)) {
      container.events.emit({
        type: 'files:file:opened',
        data: this.files.get(path)
      });
    } else {
      const name = path.replace(/^.*\/([^/]+)$/, '$1');
      const extension = name.replace(/^([^.]+\.)/, '');

      const model = {
        name,
        path,
        extension,
        type: null,
        closeable: true,
        contents: null,
        stat: null
      };

      fs.stat(path, (error, stat) => {
        if (error) {
          container.events.emit({
            type: 'error',
            data: error
          });
        } else {
          model.stat = stat;
          if (stat.isBlockDevice()) {
            model.type = 'block-device';
          } else if (stat.isCharacterDevice()) {
            model.type = 'character-device';
          } else if (stat.isDirectory()) {
            model.type = 'directory';
          } else if (stat.isFIFO()) {
            model.type = 'fifo';
          } else if (stat.isFile()) {
            model.type = 'file';
          } else if (stat.isSocket()) {
            model.type = 'socket';
          }

          this.setAttributes(model);

          fs.readFile(path, (error, data) => {
            if (error) {
              container.events.emit({
                type: 'error',
                data: error
              });
            } else {
              model.contents = data.toString();

              this.files.set(path, model);

              container.events.emit({
                type: 'files:file:opened',
                data: model
              });
            }
          });
        }
      });
    }
  };

  this.setAttributes = (item) => {
    item.color = 'white';
    item.icon = 'mdi-file';

    // names
    if (item.name === 'Dockerfile') {
      item.mime = 'text/x-dockerfile';
      item.color = '#3A8CB4';
      item.icon = 'mdi-docker';
    } else if (item.name === 'CMakeLists.txt') {
      item.mime = 'text/x-cmake';
      item.color = '#649AD2';
      item.icon = 'mdi-language-c';
    } else if (item.name === 'package.json') {
      item.mime = 'application/json';
      item.color = '#89BB5A';
      item.icon = 'mdi-nodejs';
    } else if (item.name === 'yarn.lock') {
      item.mime = 'text/plain';
      item.color = '#89BB5A';
      item.icon = 'mdi-nodejs';
    } else if (item.extension === 'c' || item.extension === 'h') {
      item.mime = 'text/x-csrc';
      item.icon = 'mdi-langauge-c';
      item.color = '#649AD2';
    } else if (item.extension === 'cpp' || item.extension === 'hpp') {
      item.mime = 'text/x-csrc';
      item.icon = 'mdi-language-cpp';
      item.color = '#649AD2';
    } else if (item.extension === 'css') {
      item.mime = 'text/x-css';
      item.color = '#2673BA';
      item.icon = 'mdi-language-css3';
    } else if (item.extension === 'diff' || item.extension === 'patch') {
      item.mime = 'text/x-diff';
      item.icon = 'mdi-vector-difference';
    } else if (item.extension === 'groovy') {
      item.mime = 'text/x-groovy';
      item.color = '#5382A1';
      item.icon = 'mdi-language-java';
    } else if (item.extension === 'hs' || item.extension === 'lhs') {
      item.mime = 'text/x-haskell';
      item.color = '#649AD2';
      item.icon = 'mdi-language-haskell';
    } else if (item.extension === 'html' || item.extension === 'htm') {
      item.mime = 'text/html';
      item.color = '#E44D26';
      item.icon = 'mdi-language-html5';
    } else if (item.extension === 'java') {
      item.mime = 'text/x-java';
      item.color = '#5382A1';
      item.icon = 'mdi-language-java';
    } else if (item.extension === 'js') {
      item.mime = 'text/javascript';
      item.color = '#F0DB4F';
      item.icon = 'mdi-language-javascript';
    } else if (item.extension === 'json') {
      item.mime = 'application/json';
      item.icon = 'mdi-json';
    } else if (item.extension === 'md') {
      item.mime = 'text/x-markdown';
      item.color = '#56157f';
      item.icon = 'mdi-markdown';
    } else if (item.extension === 'pl' || item.extension === 'pm') {
      item.mime = 'text/x-perl';
      item.icon = 'mdi-file-code';
    } else if (item.extension === 'php') {
      item.mime = 'text/x-php';
      item.icon = 'mdi-language-php';
    } else if (item.extension === 'py') {
      item.mime = 'text/x-python';
      item.color = '#3674A5';
      item.icon = 'mdi-language-python';
    } else if (item.extension === 'rst') {
      item.mime = 'text/x-rst';
      item.icon = 'mdi-file-document';
    } else if (item.extension === 'rb') {
      item.mime = 'text/x-ruby';
    } else if (item.extension === 'sc' || item.extension === 'scala') {
      item.mime = 'text/x-scala';
      item.icon = 'mdi-file-code';
    } else if (item.extension === 'scss') {
      item.mime = 'text/x-scss';
      item.color = '#2673BA';
      item.icon = 'mdi-language-css3';
    } else if (item.extension === 'sh' || item.extension === 'bash') {
      item.mime = 'text/x-sh';
      item.icon = 'mdi-file-code';
    } else if (item.extension === 'ts') {
      item.mime = 'text/typescript';
      item.color = '#2A7ACC';
      item.icon = 'mdi-language-typescript';
    } else if (item.extension === 'vue') {
      item.mime = 'text/x-vue';
      item.color = '#41B883';
      item.icon = 'mdi-vuejs';
    } else if (item.extenision === 'yml' || item.extensio === 'yaml') {
      item.mime = 'text/x-yaml';
      item.icon = 'mdi-file-code';
    } else if (item.extension === 'xml') {
      item.mime = 'application/xml';
      item.icon = 'mdi-file-code';
    } else if (item.extension === 'gif') {
      item.icon = 'mdi-gif';
    } else if (item.extension === 'ico' || item.extension === 'jpg' ||
               item.extension === 'jpeg' || item.extension === 'png') {
      item.icon = 'mdi-file-image';
    } else {
      item.mime = mime.getType(item.extension) || 'text/plain';
    }
  };

  this.scan = () => {
    this.tree = dree.scan(directory, this.config, (element) => {
      this.setAttributes(element);
    });

    container.events.emit({
      type: 'files:tree:update',
      data: this.tree
    });

    return this.tree;
  };

  container.events.on('files:file:open', (event) => {
    console.log('open request', event.data);
    this.open(event.data.path);
  });

  this.start = () => {
    this.scan();

    this.watcher = fs.watch(directory, {
      persistent: true,
      recursive: true
    });

    this.watcher.on('change', (type) => {
      if (type === 'rename') {
        this.scan();
      }
    });
  };
}

module.exports = (directory, options) => {
  return new Files(directory, options);
};