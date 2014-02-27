# spacebrew-midi ##############################################################

Route MIDI events via Spacebrew

## CLI Utility Usage

The CLI utility is a quick and easy way to connect MIDI devices to the public Spacebrew admin interface.

```sh
$ npm i -g spacebrew-midi
$ spacebrew-midi

Spacebrew MIDI - Select a device to connect to Spacebrew                    
  ------------------------------------------------------------------------  
   INPUT on QUNEO:0                                                         
   INPUT on MPK mini:0                                                      
  OUTPUT on QUNEO:0 - Connected!                                            
  OUTPUT on MPK mini:0                                                      
```

## Module Usage Example ###################################################################

```js
var sbmidi = require("spacebrew-midi");

// Connect to Spacebrew
sbmidi.connect(function () {

  // Determine the last available port, usually the most recently connected device
  var portNumber = sbmidi.getInPortCount() - 1;

  // One octave to either side of Middle C
  sbmidi.addInputRange( portNumber, 48, 72 );

  // Similar for output!
  sbmidi.addOuputRange( portNumber, 48, 72 );

});
```

And over in the Admin interface you'll see:

![Screenshot of Spacebrew Admin running example code](https://github.com/randallagordon/spacebrew-midi/raw/master/img/readme-example.png "Screenshot of Spacebrew Admin running example code")

By default this will create a connection to the public [Spacebrew
Admin](http://spacebrew.github.com/spacebrew/admin/admin.html?server=sandbox.spacebrew.cc)
interface.

To connect to another server: `sbmidi.connect({ server: "http://localhost/" })`

To use a different name and description: `sbmidi.connect({ name: "Bob", description: "Bob's MIDI Controller" })`

## CHANGELOG ######################################################################

### v0.2.0

 * Added CLI utility
 * Added support for connecting multiple ports simultaneously (still has issues)

### v0.1.1

 * Added MIDI output support

## TODO ######################################################################

 * Support more MIDI messages than just note on/off
 * Use Spacebrew custom messages for sending complex CC messages
 * Publish MIDI helper library separately
 * Add CLI option parsing for non-interactive routing
 * Web interface to complement CLI for adding/editing routed messages
 * Handle closing things down (onClose handler to close MIDI ports, etc.)

## LICENSE ####################################################################

MIT
