// Vendors
import './vendor/jquery'
import './vendor/bootstrap'
import './vendor/fontawesome'

window.addEventListener('load', () => {
  let audioCtx

  const startButton = $('.start-btn')

  const oscillators = {}

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

    // 127 - максимальная сила нажатия
    const velocityGainAmout = (1 / 127) * velocity
    const velocityGain = audioCtx.createGain()

    velocityGain.gain.value = velocityGainAmout

    osc.type = 'sine'
    osc.frequency.value = midiToFrequency(note)

    osc.connect(oscGain)
    oscGain.connect(velocityGain)
    velocityGain.connect(audioCtx.destination)

    osc.gain = oscGain
    oscillators[note.toString()] = osc

    osc.start()
  }

  function noteOff(note) {
    console.log(note)
    const osc = oscillators[note.toString()]
    const oscGain = osc.gain

    oscGain.gain.setValueAtTime(oscGain.gain.value, audioCtx.currentTime)
    // Для того что бы убрать щелчек после отжатия клавиши
    oscGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03)

    setTimeout(() => {
      osc.stop()
      osc.disconnect()
    }, 10)

    delete oscillators[note.toString()]
  }

  function failure() {
    console.log('Failed')
  }
})
