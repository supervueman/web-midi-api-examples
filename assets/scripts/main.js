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
      input.addEventListener('midimessage', (event) => {
        handleInput(event)
      })
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
    const command = event.data[0]
    const note = event.data[1]
    const velocity = event.data[2]
    console.log(command, note, velocity)

    switch (command) {
    // Код нажатия и отжатия на каждом устройстве разные
    // 149 - код нажатия на клавишу на Arturia keylab essential
    case 149:
      if (velocity > 0) {
        noteOn(note, velocity)
      } else {
        noteOff(note)
      }
      break;
    // 133 - код отжатия клавиши на Arturia keylab essential
    case 133:
      noteOff(note)
      break;
    }
  }

  function noteOn(note, velocity) {
    console.log(note, velocity)
  }

  function noteOff(note) {
    console.log(note)
  }

  function failure() {
    console.log('Failed')
  }
})
