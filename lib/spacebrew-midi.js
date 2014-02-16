/*
 * spacebrew-midi
 * https://github.com/randallagordon/spacebrew-midi
 *
 * Copyright (c) 2013-2014 Randall A. Gordon <randall@randallagordon.com>
 * Licensed under the MIT license.
 */

"use strict";

var Spacebrew = require("spacebrew.js").Spacebrew,
    midi = require("midi"),
    midiUtil = require("./midiutil.js");

var sb, midiIn, midiOut;

var defaults = {
  server: "sandbox.spacebrew.cc",
  name: "MIDI -> Spacebrew",
  description: "MIDI events, on Spacebrew! Code on GitHub: https://github.com/randallagordon/spacebrew-midi"
};

// MIDI Helpers
function getPorts(midiObj) {
  var i, ports = [];

  for (i = 0; i < midiObj.getPortCount(); i++) {
    ports.push(midiObj.getPortName(i));
  }

  return ports;
}

module.exports.getInPorts = function() {
  return getPorts(midiIn);
};

module.exports.getOutPorts = function() {
  return getPorts(midiOut);
};

module.exports.getInPortCount = function() {
  return midiIn.getPortCount();
}

module.exports.getOutPortCount = function() {
  return midiOut.getPortCount();
}

module.exports.openInPort = function(port) {
  console.log("Opening Input:\t", midiIn.getPortName(port));
  midiIn.openPort(port);
};

module.exports.openLastInPort = function() {
  this.openInPort(this.getInPortCount() - 1);
};

module.exports.openOutPort = function(port) {
  console.log("Opening Output:\t", midiOut.getPortName(port));
  midiOut.openPort(port);
};

module.exports.openLastOutPort = function() {
  this.openOutPort(this.getOutPortCount() - 1);
};

// Spacebrew Functions
module.exports.connect = function(opts) {
  opts = opts || {};

  sb = new Spacebrew.Client(opts.server || defaults.server,
    opts.name || defaults.name,
    opts.description || defaults.description);

  sb.connect();
  sb.onBooleanMessage = handleSB;

  midiIn = new midi.input();
  midiIn.on("message", handleMIDI);

  midiOut = new midi.output();
};

module.exports.addInputRange = function(lowerBound, upperBound) {
  for (var i = lowerBound; i <= upperBound; i++) {
    sb.addPublish(midiUtil.humanizeNote(i), "boolean", "false");
  }
};

module.exports.addOutputRange = function(lowerBound, upperBound) {
  var note;

  for (var i = lowerBound; i <= upperBound; i++) {
    note = midiUtil.humanizeNote(i);

    if (note === "...") {
      sb.addSubscribe(i.toString(16), "boolean");
    } else {
      sb.addSubscribe(note, "boolean");
    }
  }
};

// Handlers
var handleSB = function(name, value) {
  var hex = midiUtil.dehumanizeNote(name);

  console.log("Spacebrew Message - Name: %s\tValue: %s\tHex: %s", name, value, (+hex).toString(16));

  if (value) {
    midiOut.sendMessage([0x90, hex, 0x7F]);
  } else {
    midiOut.sendMessage([0x80, hex, 0x7F]);
  }
};

var handleMIDI = function(deltaTime, message) {
  switch (true) {
    case (message[0] >= 0x80 && message[0] <= 0x8F):
      console.log("Note off: %s\t\t\t\t[ %s, %s, %s ]", midiUtil.humanizeNote(message[1]), message[0], message[1], message[2]);
      sb.send(midiUtil.humanizeNote(message[1]), "boolean", "false");
      break;
    case (message[0] >= 0x90 && message[0] <= 0x9F):
      console.log("Note on:  %s with velocity 0x%s\t[ %s, %s, %s ]", midiUtil.humanizeNote(message[1]), message[2].toString(16), message[0], message[1], message[2]);
      sb.send(midiUtil.humanizeNote(message[1]), "boolean", "true");
      break;
    default:
      //console.log( "m:",  message, " d:", deltaTime );
  }
};
