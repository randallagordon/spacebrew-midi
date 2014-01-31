var sbmidi = require('../lib/spacebrew-midi');

// Connect to Spacebrew
sbmidi.connect();

// Open the "last" port, usually the most recently connected MIDI device
sbmidi.openLastPort();

// One octave starting with Middle C
sbmidi.addInputRange( 60, 72 );

