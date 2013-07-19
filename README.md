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

![Screenshot of Spacebrew Admin running example code](https://github.com/randallagordon/spacebrew-midi/raw/master/img/readme-example.png "Screenshot of Spacebrew Admin running example code")

By default this will create a connection to the public [Spacebrew
Admin](http://spacebrew.github.com/spacebrew/admin/admin.html?server=sandbox.spacebrew.cc)
interface.

To connect to another server: `sbmidi.connect({ server: 'http://localhost/' })`

### TODO ######################################################################

 * Support more MIDI messages than just note on/off
 * Use Spacebrew custom messages for sending complex CC messages

## License ####################################################################

MIT

