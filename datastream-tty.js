/*******************************************************************************

  Bare Conductive Pi Cap
  ----------------------

  datastream-tty.cpp - streams capacitive sense data from MPR121 to stdout

  Written for Raspberry Pi.

  Bare Conductive code written by Szymon Kaliski.

  This work is licensed under a Creative Commons Attribution-ShareAlike 3.0
  Unported License (CC BY-SA 3.0) http://creativecommons.org/licenses/by-sa/3.0/

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

 *******************************************************************************/

var MPR121 = require('node-picap');
var mpr121;

try {
  mpr121 = new MPR121();
}

catch (e) {
  console.log(e);
  process.exit(1);
}

mpr121.on('data', function(data) {
  // split out each of the various data streams...
  var touch = data.map(function(electrode) { return electrode.isTouched ? 1 : 0; });
  var tths  = data.map(function(electrode) { return electrode.touchThreshold; });
  var rths  = data.map(function(electrode) { return electrode.releaseThreshold; });
  var fdat  = data.map(function(electrode) { return electrode.filtered; });
  var bval  = data.map(function(electrode) { return electrode.baseline; });
  var diff  = data.map(function(electrode) { return electrode.baseline - electrode.filtered; });

  // ...and send them out via stdout - simples!
  console.log('TOUCH: ' + touch.join(' '));
  console.log('TTHS: ' + tths.join(' '));
  console.log('RTHS: ' + rths.join(' '));
  console.log('FDAT: ' + fdat.join(' '));
  console.log('BVAL: ' + bval.join(' '));
  console.log('DIFF: ' + diff.join(' '));
});

// this allows us to exit the program via Ctrl+C while still exiting elegantly
process.on('SIGINT', function () {
  process.exit(0);
});
