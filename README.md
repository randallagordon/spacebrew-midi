# spacebrew-midi ##############################################################

Pipe MIDI events to Spacebrew

HERE BE DRAGONS!

### Example ###################################################################

    var sbmidi = require('spacebrew-midi');

    sbmidi.connect();

    sbmidi.doSomeStuff();

By default this will create a connection to the public [Spacebrew
Admin](http://spacebrew.github.com/spacebrew/admin/admin.html?server=sandbox.spacebrew.cc)
interface.

To connect to another server: `sbmidi.connect({ server: 'http://localhost/' })`

### TODO ######################################################################

Pretty much everything.

## License ####################################################################

MIT

