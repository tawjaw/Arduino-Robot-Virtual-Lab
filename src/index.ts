import '@wokwi/elements';
import { buildHex } from './compile';
import { AVRRunner } from './execute';
import { formatTime } from './format-time';
import './index.css';
import { CPUPerformance } from './cpu-performance';
import { EditorHistoryUtil } from './utils/editor-history.util';
import "./RobotEnvironment";
import { ultrasonicDistance } from './RobotEnvironment';

let editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
const BLINK_CODE = `
void setUpMotors()
{
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
}
void setLeftWheelSpeed(int speed)
{
 switch(speed)
 {
   case 0: 
    digitalWrite(8, LOW);
    digitalWrite(9, LOW);
    break;
   case 1:
    digitalWrite(8, HIGH);
    digitalWrite(9, LOW);
    break;
   case 2: 
    digitalWrite(8, LOW);
    digitalWrite(9, HIGH);
    break;
   case 3:
    digitalWrite(8, HIGH);
    digitalWrite(9, HIGH);
    break;
   default:
    digitalWrite(8, LOW);
    digitalWrite(9, LOW);
 }
}
void setRightWheelSpeed(int speed)
{
 switch(speed)
 {
   case 0: 
    digitalWrite(11, LOW);
    digitalWrite(12, LOW);
    break;
   case 1:
    digitalWrite(11, HIGH);
    digitalWrite(12, LOW);
    break;
   case 2: 
    digitalWrite(11, LOW);
    digitalWrite(12, HIGH);
    break;
   case 3:
    digitalWrite(11, HIGH);
    digitalWrite(12, HIGH);
    break;
   default:
    digitalWrite(11, LOW);
    digitalWrite(12, LOW);
 }
}
void setup() {
  Serial.begin(115200);
  setUpMotors();

}
void loop() {
  /*
  //move forward slowly
  setRightWheelSpeed(1);
  setLeftWheelSpeed(1);
  delay(5000);

  //rotate right (left wheel on)
  setRightWheelSpeed(0);
  setLeftWheelSpeed(1);
  delay(5000);
  */
  int value = analogRead(A0);
  Serial.println(value);
  delay(5000);
  
}`.trim();

// Load Editor
declare const window: any; // eslint-disable-line @typescript-eslint/no-explicit-any
declare const monaco: any; // eslint-disable-line @typescript-eslint/no-explicit-any
window.require.config({
  paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }
});
window.require(['vs/editor/editor.main'], () => {
  editor = monaco.editor.create(document.querySelector('.code-editor'), {
    value: EditorHistoryUtil.getValue() || BLINK_CODE,
    language: 'cpp',
    minimap: { enabled: false }
  });
});

// set up motor states
export let leftMotorSpeed = 0;
export let isleftMotorReverse = false;
export let rightMotorSpeed = 0;
export let isrightMotorReverse = false;


// Set up toolbar
let runner: AVRRunner;

/* eslint-disable @typescript-eslint/no-use-before-define */
const runButton = document.querySelector('#run-button');
runButton.addEventListener('click', compileAndRun);
const stopButton = document.querySelector('#stop-button');
stopButton.addEventListener('click', stopCode);
const revertButton = document.querySelector('#revert-button');
revertButton.addEventListener('click', setBlinkSnippet);
const statusLabel = document.querySelector('#status-label');
const compilerOutputText = document.querySelector('#compiler-output-text');
const serialOutputText = document.querySelector('#serial-output-text');



function executeProgram(hex: string) {
  runner = new AVRRunner(hex);
  const MHZ = 16000000;


  // Hook to PORTB Pins 8 to 13
  runner.portB.addListener(value => {
    leftMotorSpeed = value & 0x03;
    isleftMotorReverse = (value & 0x04) ? true : false;
    rightMotorSpeed = (value >>> 3) & 0x03;
    isrightMotorReverse = ((value >>> 3) & 0x04) ? true : false;
  });
  //update value of sensor to A0
  runner.cpu.writeHooks[0x7a] = (value) => {
    if (value & (1 << 6)) {
      runner.cpu.data[0x7a] = value & ~(1 << 6); // clear bit - conversion done
      const analogValue = ultrasonicDistance;
      runner.cpu.data[0x78] = analogValue & 0xff;
      runner.cpu.data[0x79] = (analogValue >> 8) & 0x3;
      return true; // don't update
    }
  }


  runner.usart.onByteTransmit = (value) => {
    serialOutputText.textContent += String.fromCharCode(value);
  };
  const cpuPerf = new CPUPerformance(runner.cpu, MHZ);
  runner.execute((cpu) => {
    const time = formatTime(cpu.cycles / MHZ);
    const speed = (cpuPerf.update() * 100).toFixed(0);
    statusLabel.textContent = `Simulation time: ${time} (${speed}%)`;
  });
}




async function compileAndRun() {
  

  storeUserSnippet();

  runButton.setAttribute('disabled', '1');
  revertButton.setAttribute('disabled', '1');

  serialOutputText.textContent = '';
  try {
    statusLabel.textContent = 'Compiling...';
    const result = await buildHex(editor.getModel().getValue());
    compilerOutputText.textContent = result.stderr || result.stdout;
    if (result.hex) {
      compilerOutputText.textContent += '\nProgram running...';
      stopButton.removeAttribute('disabled');
      executeProgram(result.hex);
    } else {
      runButton.removeAttribute('disabled');
    }
  } catch (err) {
    runButton.removeAttribute('disabled');
    revertButton.removeAttribute('disabled');
    alert('Failed: ' + err);
  } finally {
    statusLabel.textContent = '';
  }
}

function storeUserSnippet() {
  EditorHistoryUtil.clearSnippet();
  EditorHistoryUtil.storeSnippet(editor.getValue());
}

function stopCode() {
  stopButton.setAttribute('disabled', '1');
  runButton.removeAttribute('disabled');
  revertButton.removeAttribute('disabled');
  if (runner) {
    runner.stop();
    runner = null;
    leftMotorSpeed = 0;
    rightMotorSpeed = 0;
    
  }
}

function setBlinkSnippet() {
  editor.setValue(BLINK_CODE);
  EditorHistoryUtil.storeSnippet(editor.getValue());
}

