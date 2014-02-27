"use strict";

var sbmidi = require("../lib/spacebrew-midi");

// Connect to Spacebrew, passing a callback to run when the connection is ready
sbmidi.connect(function () {

  // On the last available port, add a one octave input range starting with Middle C
  sbmidi.addInputRange(sbmidi.getInPortCount() - 1,  60, 72);

});
