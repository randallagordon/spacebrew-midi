var sbmidi = require('../lib/spacebrew-midi');

// Connect to Spacebrew
sbmidi.connect();

// Open the "last" port, usually the most recently connected MIDI device
sbmidi.openLastPort();

// One octave starting with Middle C
sbmidi.addRange( 60, 72 );

