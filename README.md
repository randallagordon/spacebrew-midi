# spacebrew-midi ##############################################################

Pipe MIDI events to Spacebrew

*Warning: HERE BE DRAGONS!*

### Example ###################################################################

    var sbmidi = require('spacebrew-midi');

    // Connect to Spacebrew
    sbmidi.connect();

    // Open the "last" port, usually the most recently connected MIDI device
    sbmidi.openLastPort();

    // One octave to either side of Middle C
    sbmidi.addRange( 48, 72 );


By default this will create a connection to the public [Spacebrew
Admin](http://spacebrew.github.com/spacebrew/admin/admin.html?server=sandbox.spacebrew.cc)
interface.

To connect to another server: `sbmidi.connect({ server: 'http://localhost/' })`

### TODO ######################################################################

 * Support more MIDI messages than just note on/off
 * Pass human-friendly note IDs to Spacebrew ("C-4" instead of "60")

## License ####################################################################

MIT

