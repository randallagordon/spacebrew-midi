"use strict";

var sbmidi = require("../lib/spacebrew-midi");

// Connect to Spacebrew, passing a callback to run when the connection is ready
sbmidi.connect(function () {
  var port = +process.argv[2] || 0;

  // QuNeo default mode: C-2 through D#3
  sbmidi.addInputRange( port,  0x24, 0x33 );
  sbmidi.addOutputRange( port,  0x00, 0x1F );

});
