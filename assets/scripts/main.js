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
    // Если не подключено миди устройстов то inputs size будет 0
    console.log(midiAccess)

    // Вызывается при включении или отключении миди устройства
    midiAccess.addEventListener('statechange', updateDevices);

    const inputs = midiAccess.inputs

    inputs.forEach(input => {
      console.log(input)
      input.onmidimessage = handleInput
    })
  }

  function updateDevices(event) {
    console.log(event)
    setMidiDeviceName(event.port?.name)
  }

  function setMidiDeviceName(name) {
    if (name) {
      $('.title').text(name)
    } else {
      $('.title').text('Unknown')
    }
  }

  function handleInput(event) {
    console.log(event)
  }

  function failure() {
    console.log('Failed')
  }
})
