#!/usr/bin/env node
'use strict';

// Force set timezone
const fs = require('fs');
process.env.TZ = fs.readFileSync('/etc/timezone').toString().trim();

const handler = (error) => {
  if (error) {
    console.log('Encountered error', error);
    process.exit(1);
  }
};

// Handle command line options
const argv = require('yargs').argv;
if (argv.manager) {
  const Manager = require('../lib/manager/manager');
  const manager = new Manager({ options: argv });
  manager.start(handler);
} else if (argv.messanger) {
  const Messanger = require('../lib/messanger/messanger');
  const messanger = new Messanger({ options: argv });
  messanger.start(handler);
} else if (argv.container) {
  const Container = require('../lib/container/container');
  const container = new Container({ options: argv });
  container.start(handler);
}
