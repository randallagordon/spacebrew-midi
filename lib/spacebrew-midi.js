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

var sb, midiIn;

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

  midiIn = new midi.input();
  midiIn.on( 'message', handleMIDI );
};

module.exports.addRange = function( lowerBound, upperBound ) {
  for( var i = lowerBound; i <= upperBound; i++ ) {
    sb.addPublish( i.toString(), 'boolean', 'false' );
  }
};

var handleMIDI = function( deltaTime, message ) {
  switch( message[ 0 ] ) {
  case 131:
    console.log( 'off', message[ 1 ], message[ 2 ] );
    sb.send( message[ 1 ].toString(), 'boolean', 'false' );
    break;
  case 147:
    console.log( 'on ', message[ 1 ], message[ 2 ] );
    sb.send( message[ 1 ].toString(), 'boolean', 'true' );
    break;
  default:
    console.log( 'm:',  message, ' d:', deltaTime );
  }

};

module.exports.getPortCount = function() {
  return midiIn.getPortCount();
};

module.exports.openLastPort = function() {
  this.openPort( this.getPortCount() - 1 );
};

module.exports.openPort = function( port ) {
  console.log( "Opening ", midiIn.getPortName( port ) );
  midiIn.openPort( port );
};

