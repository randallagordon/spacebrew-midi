/*
 * spacebrew-midi
 * https://github.com/randallagordon/spacebrew-midi
 *
 * Copyright (c) 2013 Randall A. Gordon <randall@randallagordon.com>
 * Licensed under the MIT license.
*/

'use strict';

var Spacebrew = require('spacebrew.js').Spacebrew,
    midi = require('midi');

var sb = {};

var defaults = {
  server: 'sandbox.spacebrew.cc',
  name: 'MIDI -> Spacebrew',
  description: 'MIDI events, on Spacebrew!'
};

module.exports.connect = function( opts ) {
  opts = opts || {};

  sb = new Spacebrew.Client( opts.server || defaults.server,
                             opts.name || defaults.name,
                             opts.description || defaults.description );

  sb.connect();

};

var input = new midi.input();

console.log(input.getPortCount());

