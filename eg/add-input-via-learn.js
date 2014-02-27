"use strict";

var sbmidi = require("../lib/spacebrew-midi");

// Connect to Spacebrew, passing a callback to run when the connection is ready
sbmidi.connect(function () {
  var port = +process.argv[2] || 0;

  // Passing only a port will start listening for the next two Note On events
  // to use as lower and upper bounds for the added range
  sbmidi.addInputRange(port);

});
