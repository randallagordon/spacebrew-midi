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

var sb,
    //midiIn, midiOut,
    midiIns = {},
    midiOuts = {};

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
  return getPorts(new midi.input());
};

module.exports.getOutPorts = function() {
  return getPorts(new midi.output());
};

module.exports.getInPortCount = function() {
  return (new midi.input()).getPortCount();
};

module.exports.getOutPortCount = function() {
  return (new midi.output()).getPortCount();
};


// Handlers
var handleSB = function(name, value) {
  var message = name.split(" - "),
      portName = message[0],
      note = message[1],
      hex = midiUtil.dehumanizeNote(note);

  console.log("Spacebrew Message - Name: %s\tValue: %s\tHex: %s", name, value, (+hex).toString(16));

  if (value) {
    midiOuts[portName].sendMessage([0x90, hex, 0x7F]);
  } else {
    midiOuts[portName].sendMessage([0x80, hex, 0x7F]);
  }
};

var handleMIDI = function(portName, deltaTime, message) {
  switch (true) {
  case (message[0] >= 0x80 && message[0] <= 0x8F):
    console.log("%s - Note off: %s\t\t\t\t[ %s, %s, %s ]", portName, midiUtil.humanizeNote(message[1]), message[0], message[1], message[2]);
    sb.send(portName + " - " + midiUtil.humanizeNote(message[1]), "boolean", "false");
    break;
  case (message[0] >= 0x90 && message[0] <= 0x9F):
    console.log("%s - Note on:  %s with velocity 0x%s\t[ %s, %s, %s ]", portName, midiUtil.humanizeNote(message[1]), message[2].toString(16), message[0], message[1], message[2]);
    sb.send(portName + " - " + midiUtil.humanizeNote(message[1]), "boolean", "true");
    break;
  default:
    //console.log( "m:",  message, " d:", deltaTime );
  }
};


// Spacebrew Functions
module.exports.connect = function(done, opts) {
  opts = opts || {};

  sb = new Spacebrew.Client(opts.server || defaults.server,
    opts.name || defaults.name,
    opts.description || defaults.description);

  sb.onBooleanMessage = handleSB;
  sb.onOpen = done;
  sb.connect();
};

module.exports.addInputRange = function(port, lowerBound, upperBound) {
  var midiIn = new midi.input();
  var portName = midiIn.getPortName(port);
  midiIn.openPort(port);
  midiIn.on("message", function (deltaTime, message) {
    return handleMIDI(portName, deltaTime, message);
  });
  midiIns[portName] = midiIn;

  for (var i = lowerBound; i <= upperBound; i++) {
    sb.addPublish(portName + " - " + midiUtil.humanizeNote(i), "boolean", "false");
  }
};

module.exports.addOutputRange = function(port, lowerBound, upperBound) {
  var note;

  var midiOut = new midi.output();
  var portName = midiOut.getPortName(port);
  midiOut.openPort(port);
  midiOuts[portName] = midiOut;

  for (var i = lowerBound; i <= upperBound; i++) {
    note = midiUtil.humanizeNote(i);

    if (note === "...") {
      sb.addSubscribe(portName + " - " + i.toString(16), "boolean");
    } else {
      sb.addSubscribe(portName + " - " + note, "boolean");
    }
  }
};
