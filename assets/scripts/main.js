// Vendors
import './vendor/jquery'
import './vendor/bootstrap'
import './vendor/fontawesome'

window.addEventListener('load', () => {
  let audioCtx

  const startButton = $('.start-btn')

  startButton.click(() => {
    audioCtx = new AudioContext()
    console.log(audioCtx)
  })

  function midiToFrequency(number) {
    const a = 440
    return (a / 32) * (2 ** ((number - 9) / 12))
  }

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

    const osc = audioCtx.createOscillator()
    const oscGain = audioCtx.createGain()

    oscGain.gain.value = 0.33
    console.log(osc)

    osc.type = 'sine'
    osc.frequency.value = midiToFrequency(note)

    osc.connect(oscGain)
    oscGain.connect(audioCtx.destination)
    osc.start()
  }

  function noteOff(note) {
    console.log(note)
  }

  function failure() {
    console.log('Failed')
  }
})
