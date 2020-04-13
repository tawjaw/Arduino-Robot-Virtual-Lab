import * as avr8js from 'avr8js';
import { LEDElement } from '@wokwi/elements';
import { loadBlink } from './arduino-blink';

const led = document.querySelector<LEDElement & Element>('wokwi-led'); 

const program = new Uint16Array(16384);
loadBlink(program);

const cpu = new avr8js.CPU(program);
const timer0 = new avr8js.AVRTimer(cpu, avr8js.timer0Config);
const portB = new avr8js.AVRIOPort(cpu, avr8js.portBConfig);
portB.addListener(() => {
  led.value = portB.pinState(5) === avr8js.PinState.High;
});

function runCode() {
  for (let i = 0; i < 50000; i++) {
    avr8js.avrInstruction(cpu);
    timer0.tick();
  }
  setTimeout(runCode, 0);
}

runCode();