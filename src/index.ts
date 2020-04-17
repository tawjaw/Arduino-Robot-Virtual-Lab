import '@wokwi/elements';
import { buildHex } from './compile';
import { AVRRunner } from './execute';
import { formatTime, getMilliSecconds } from './format-time';
import './index.css';
import { CPUPerformance } from './cpu-performance';
import { EditorHistoryUtil } from './utils/editor-history.util';
import "./RobotEnvironment";
import { ultrasonicDistance } from './RobotEnvironment';

function toFixedNumber(num, digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(num*pow) / pow;
}

let editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
const BLINK_CODE = `#include <Servo.h>

Servo leftservo;  
Servo rightservo;  


void setup() {
    Serial.begin(115200);

  leftservo.attach(9);  
  rightservo.attach(10);

}

void loop() {

    //move forward fast
    leftservo.write(170);
    rightservo.write(170);
    delay(3000);

    //rotate right fast
    leftservo.write(170);
    rightservo.write(10);
    delay(3000);

    //rotate left slowly
    leftservo.write(90);
    rightservo.write(120);
    delay(3000);
    
    //move backward very slowly
    leftservo.write(75);
    rightservo.write(75);
    delay(3000);
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
export let rightMotorSpeed = 0;


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


let pin9BeginningTimeOfPulse = undefined;
let pin9State = 0;
let pin10BeginningTimeOfPulse = undefined;
let pin10State = 0;

function executeProgram(hex: string) {
  runner = new AVRRunner(hex);
  const MHZ = 16000000;


  

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
  
  const servoMinPulse = 0.000544;

  runner.execute((cpu) => {
    const time = formatTime(cpu.cycles / MHZ);
    const speed = (cpuPerf.update() * 100).toFixed(0);
    statusLabel.textContent = `Simulation time: ${time} (${speed}%)`;



    // Hook to PORTB Pins 8 to 13
  runner.portB.addListener(value => {
    /*leftMotorSpeed = value & 0x03;
    isleftMotorReverse = (value & 0x04) ? true : false;
    rightMotorSpeed = (value >>> 3) & 0x03;
    isrightMotorReverse = ((value >>> 3) & 0x04) ? true : false;
  */
  const D9bit = 1 << 1;
  const D10bit = 1 << 2;
  if(value & D9bit) 
  {
    if(pin9BeginningTimeOfPulse == undefined || pin9State === 0 )
      {
        pin9BeginningTimeOfPulse = cpu.cycles;
        pin9State = 1;
      }
  } 
  else
  {
    if(pin9State === 1)
    {
      //console.log(getMilliSecconds((cpu.cycles - pin9BeginningTimeOfPulse )/MHZ)-1.4);
      pin9State = 0;
      leftMotorSpeed = toFixedNumber(getMilliSecconds((cpu.cycles - pin9BeginningTimeOfPulse )/MHZ)-1.4, 1, 10);
      if(leftMotorSpeed > 0.9)  leftMotorSpeed = 0.9;
      if(leftMotorSpeed < -0.9) leftMotorSpeed = -0.9;
    }
  }  


   
  });

      // Hook to PORTB Pins 8 to 13
      runner.portB.addListener(value => {
        /*leftMotorSpeed = value & 0x03;
        isleftMotorReverse = (value & 0x04) ? true : false;
        rightMotorSpeed = (value >>> 3) & 0x03;
        isrightMotorReverse = ((value >>> 3) & 0x04) ? true : false;
      */
      const D9bit = 1 << 1;
      const D10bit = 1 << 2;

    
      if(value & D10bit) 
      {
        if(pin10BeginningTimeOfPulse == undefined || pin10State === 0 )
          {
            pin10BeginningTimeOfPulse = cpu.cycles;
            pin10State = 1;
          }
      } 
      else
      {
        if(pin10State === 1)
        {
          //console.log(getMilliSecconds((cpu.cycles - pin10BeginningTimeOfPulse )/MHZ)-1.4);
          pin10State = 0;
          rightMotorSpeed = toFixedNumber(getMilliSecconds((cpu.cycles - pin10BeginningTimeOfPulse )/MHZ)-1.4, 1, 10);
          if(rightMotorSpeed > 0.9)  rightMotorSpeed = 0.9;
          if(rightMotorSpeed < -0.9) rightMotorSpeed = -0.9;
        }
      }  
      //leftMotorSpeed = (value & D9bit) ? 5 : 0;
      //rightMotorSpeed = (value & D10bit) ? 5 : 0;
       
      });
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

