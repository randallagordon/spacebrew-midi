# spacebrew-midi ##############################################################

Pipe MIDI events to Spacebrew

*Warning: HERE BE DRAGONS!*

### Example ###################################################################

    var sbmidi = require('spacebrew-midi');

    // Connect to Spacebrew
    sbmidi.connect();

    // Open the "last" port, usually the most recently connected MIDI device
    sbmidi.openLastInPort();
    sbmidi.openLastOutPort();

    // One octave to either side of Middle C
    sbmidi.addInputRange( 48, 72 );

    // Similar for output!
    sbmidi.addOuputRange( 48, 72 );

And over in the Admin interface you'll see:

![Screenshot of Spacebrew Admin running example code](https://github.com/randallagordon/spacebrew-midi/raw/master/img/readme-example.png "Screenshot of Spacebrew Admin running example code")

By default this will create a connection to the public [Spacebrew
Admin](http://spacebrew.github.com/spacebrew/admin/admin.html?server=sandbox.spacebrew.cc)
interface.

To connect to another server: `sbmidi.connect({ server: "http://localhost/" })`

To use a different name and description: `sbmidi.connect({ name: "Bob", description: "Bob's MIDI Controller" })`

### TODO ######################################################################

 * Support more MIDI messages than just note on/off
 * Use Spacebrew custom messages for sending complex CC messages
 * Break out MIDI helper functions into their own library (And publish separately)

## License ####################################################################

MIT
