# spacebrew-midi ##############################################################

Route MIDI events via Spacebrew

## CLI Utility Usage

The CLI utility is a quick and easy way to connect MIDI devices to the public Spacebrew admin interface.

Input ports start listening for two Note On events in the background to use as lower and upper boundaries for the range. The UI doesn't currently indicate this is occuring—sorry, bad UX! I'll get that fixed in the next version.

Output ports are currently connected for the entire C-0 through G-9 range.

WARNING: Simultaneous connections of the same type (input or output) segfaults on some platforms. Looking into the root cause...

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

// Connect to Spacebrew, passing an onOpen handler
sbmidi.connect(function () {

  // Determine the last available port, usually the most recently connected device
  var portNumber = sbmidi.getInPortCount() - 1;

  // One octave to either side of Middle C
  sbmidi.addInputRange(portNumber, 48, 72);

  // Similar for output!
  sbmidi.addOuputRange(portNumber, 48, 72);

  // Alternatively, just pass a port number and bounds will be "learned"
  // based on the next two Note On events received
  sbmidi.addInputRange(portNumber);

  // One octave to either side of Middle C in "latch" mode, which only listens
  // for Note On messages when toggling the state published to Spacebrew
  sbmidi.addInputRange(portNumber, 48, 72, "latch");

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

### v0.2.1

 * Addded ability to set modes on input ranges, implements "latch" mode

### v0.2.0

 * Added CLI utility
 * Added support for connecting multiple ports simultaneously (still has issues)
 * Added input range addition via "learning" from MIDI Note On events

### v0.1.1

 * Added MIDI output support

## TODO ######################################################################

 * Support more MIDI messages than just note on/off
 * Use Spacebrew custom messages for sending complex CC messages (knobs, sliders, etc.)
 * Publish MIDI helper library separately
 * Add CLI option parsing for non-interactive routing
 * JSON based config files to support building a device map library (think `spacebrew-midi --device QuNeo`)
 * Web interface to complement CLI for adding/editing routed messages
 * Handle closing things down (onClose handler to close MIDI ports, etc.)
 * Refactor so a range can be added on an already open port

## LICENSE ####################################################################

MIT
