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

var sb, midiIn, midiOut;

// TODO: Move to a MIDI Utility module
var noteTableHex = { 0x0C: "C-0", 0x0D: "C#0", 0x0E: "D-0", 0x0F: "D#0",
                     0x10: "E-0", 0x11: "F-0", 0x12: "F#0", 0x13: "G-0",
                     0x14: "G#0", 0x15: "A-0", 0x16: "A#0", 0x17: "B-0",
                     0x18: "C-1", 0x19: "C#1", 0x1A: "D-1", 0x1B: "D#1",
                     0x1C: "E-1", 0x1D: "F-1", 0x1E: "F#1", 0x1F: "G-1",
                     0x20: "G#1", 0x21: "A-1", 0x22: "A#1", 0x23: "B-1",
                     0x24: "C-2", 0x25: "C#2", 0x26: "D-2", 0x27: "D#2",
                     0x28: "E-2", 0x29: "F-2", 0x2A: "F#2", 0x2B: "G-2",
                     0x2C: "G#2", 0x2D: "A-2", 0x2E: "A#2", 0x2F: "B-2",
                     0x30: "C-3", 0x31: "C#3", 0x32: "D-3", 0x33: "D#3",
                     0x34: "E-3", 0x35: "F-3", 0x36: "F#3", 0x37: "G-3",
                     0x38: "G#3", 0x39: "A-3", 0x3A: "A#3", 0x3B: "B-3",
                     0x3C: "C-4", 0x3D: "C#4", 0x3E: "D-4", 0x3F: "D#4",
                     0x40: "E-4", 0x41: "F-4", 0x42: "F#4", 0x43: "G-4",
                     0x44: "G#4", 0x45: "A-4", 0x46: "A#4", 0x47: "B-4",
                     0x48: "C-5", 0x49: "C#5", 0x4A: "D-5", 0x4B: "D#5",
                     0x4C: "E-5", 0x4D: "F-5", 0x4E: "F#5", 0x4F: "G-5",
                     0x50: "G#5", 0x51: "A-5", 0x52: "A#5", 0x53: "B-5",
                     0x54: "C-6", 0x55: "C#6", 0x56: "D-6", 0x57: "D#6",
                     0x58: "E-6", 0x59: "F-6", 0x5A: "F#6", 0x5B: "G-6",
                     0x5C: "G#6", 0x5D: "A-6", 0x5E: "A#6", 0x5F: "B-6",
                     0x60: "C-7", 0x61: "C#7", 0x62: "D-7", 0x63: "D#7",
                     0x64: "E-7", 0x65: "F-7", 0x66: "F#7", 0x67: "G-7",
                     0x68: "G#7", 0x69: "A-7", 0x6A: "A#7", 0x6B: "B-7",
                     0x6C: "C-8", 0x6D: "C#8", 0x6E: "D-8", 0x6F: "D#8",
                     0x70: "E-8", 0x71: "F-8", 0x72: "F#8", 0x73: "G-8",
                     0x74: "G#8", 0x75: "A-8", 0x76: "A#8", 0x77: "B-8",
                     0x78: "C-9", 0x79: "C#9", 0x7A: "D-9", 0x7B: "D#9",
                     0x7C: "E-9", 0x7D: "F-9", 0x7E: "F#9", 0x7F: "G-9" };

var midiUtil = {
  humanizeNote: function( hex ) {
    return noteTableHex[ hex ] || "...";
  },
  dehumanizeNote: function( note ) {
    var hex = Object.keys( noteTableHex ).filter( function( key ) { return noteTableHex[ key ] === note; } )[ 0 ];

    if( hex === undefined ) {
      hex = note;
    }

    return hex;
  }
};

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
  sb.onBooleanMessage = handleSB;

  midiIn = new midi.input();
  midiIn.on( 'message', handleMIDI );

  midiOut = new midi.output();
};

module.exports.addInputRange = function( lowerBound, upperBound ) {
  for( var i = lowerBound; i <= upperBound; i++ ) {
    sb.addPublish( midiUtil.humanizeNote( i ), 'boolean', 'false' );
  }
};

module.exports.addOutputRange = function( lowerBound, upperBound ) {
  var note;

  for( var i = lowerBound; i <= upperBound; i++ ) {
    note = midiUtil.humanizeNote( i );

    if( note === "..." ) {
      sb.addSubscribe( i.toString( 16 ), 'boolean' );
    } else {
      sb.addSubscribe( note, 'boolean' );
    }
  }
};

module.exports.getPortCount = function() {
  return midiIn.getPortCount();
};

module.exports.getPortName = function( port ) {
  return midiIn.getPortName( port );
};

module.exports.openLastPort = function() {
  this.openPort( this.getPortCount() - 1 );
};

module.exports.openPort = function( port ) {
  console.log( "Opening ", midiIn.getPortName( port ) );
  midiIn.openPort( port );
  midiOut.openPort( port + 1 );
};


var handleSB = function( name, value ) {
  var hex = midiUtil.dehumanizeNote( name );

  console.log("Spacebrew Message - Name: %s\tValue: %s\tHex: %s", name, value, (+hex).toString(16));

  if( value ) {
    midiOut.sendMessage([ 0x90, hex, 0x7F ]);
  } else {
    midiOut.sendMessage([ 0x80, hex, 0x7F ]);
  }
};

var handleMIDI = function( deltaTime, message ) {
  switch( true ) {
    case ( message[ 0 ] >= 0x80 && message[ 0 ] <= 0x8F ):
      console.log( 'Note off: %s\t\t\t\t[ %s, %s, %s ]', midiUtil.humanizeNote( message[ 1 ] ), message[ 0 ], message[ 1 ], message[ 2 ] );
      sb.send( midiUtil.humanizeNote( message[ 1 ] ), 'boolean', 'false' );
      break;
    case ( message[ 0 ] >= 0x90 && message[ 0 ] <= 0x9F ):
      console.log( 'Note on:  %s with velocity 0x%s\t[ %s, %s, %s ]', midiUtil.humanizeNote( message[ 1 ] ), message[ 2 ].toString( 16 ), message[ 0 ], message[ 1 ], message[ 2 ] );
      sb.send( midiUtil.humanizeNote( message[ 1 ] ), 'boolean', 'true' );
      break;
    default:
      //console.log( 'm:',  message, ' d:', deltaTime );
  }
};
