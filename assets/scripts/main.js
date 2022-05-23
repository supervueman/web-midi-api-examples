// Vendors
import './vendor/jquery'
import './vendor/bootstrap'
import './vendor/fontawesome'

window.addEventListener('load', () => {
  console.log('load')
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
  }

  function success(midiAccess) {
    console.log('Success')
    console.log(midiAccess)
  }

  function failure() {
    console.log('Failed')
  }
})
