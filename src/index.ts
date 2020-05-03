import { TwoServoRobot } from "./ArduinoRobotEnvironment/TwoServoRobot";
import { buildHex } from './compile';
import './index.css';


let editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Load Editor
declare const window: any; // eslint-disable-line @typescript-eslint/no-explicit-any
declare const monaco: any; // eslint-disable-line @typescript-eslint/no-explicit-any
window.require.config({
  paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }
});
window.require(['vs/editor/editor.main'], () => {
  editor = monaco.editor.create(document.querySelector('.code-editor'), {
    value: `#include <Servo.h>

Servo leftservo;  
Servo rightservo;  

const int pingPin = 11; // Trigger Pin of Ultrasonic Sensor
const int echoPin = 12; // Echo Pin of Ultrasonic Sensor

void setup() {
  Serial.begin(115200);
  leftservo.attach(9);  
  rightservo.attach(10);

}

void loop() {

  printDistance();

  //move forward fast
  leftservo.write(170);
  rightservo.write(170);
  delay(3000);

  printDistance();
  //rotate right fast
  leftservo.write(170);
  rightservo.write(10);
  delay(3000);

  printDistance();
  //rotate left slowly
  leftservo.write(90);
  rightservo.write(120);
  delay(3000);
  
  printDistance();
  //move backward very slowly
  leftservo.write(75);
  rightservo.write(75);
  delay(3000);


}

void printDistance()
{
  long duration, inches, cm;
  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(pingPin, LOW);
  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);
  inches = microsecondsToInches(duration);
  cm = microsecondsToCentimeters(duration);
  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();

}
long microsecondsToInches(long microseconds) {
  return microseconds / 74 / 2;
}

long microsecondsToCentimeters(long microseconds) {
  return microseconds / 29 / 2;
}
`,
    language: 'cpp',
    minimap: { enabled: false }
  });
});



const statusLabel = document.querySelector('#status-label');
const compilerOutputText = document.querySelector('#compiler-output-text');
const serialOutputText = document.querySelector('#serial-output-text');


//set up robot environment
const canvas = document.getElementById('world');

const robot = new TwoServoRobot(canvas, serialOutputText, statusLabel); 

robot.environment?.addObstacleRectangle(400, 50, 800, 20, "DarkRed", "topwall");   



const runButton = document.querySelector('#run-button');
runButton?.addEventListener('click', compileAndRun);
const stopButton = document.querySelector('#stop-button');
stopButton?.addEventListener('click', stopCode);



async function compileAndRun() {
  

  runButton?.setAttribute('disabled', '1');

  serialOutputText.textContent = '';
  try {
    statusLabel.textContent = 'Compiling...';
    const result = await buildHex(editor.getModel().getValue());
    compilerOutputText.textContent = result.stderr || result.stdout;
    if (result.hex) {
      compilerOutputText.textContent += '\nSimulation Started...';
      stopButton.removeAttribute('disabled');
      
      robot.run(result.hex);
      //executeProgram(result.hex);
    } else {
      runButton.removeAttribute('disabled');
    }
 } catch (err) {
    runButton.removeAttribute('disabled');
    alert('Failed: ' + err);
  } finally {
    statusLabel.textContent = '';
  }
}



function stopCode() {
  stopButton.setAttribute('disabled', '1');
  runButton.removeAttribute('disabled');
  robot.stop();
  /*if (robot.arduino) {
    runner.stop();
    runner = null;
    leftMotorSpeed = 0;
    rightMotorSpeed = 0;
    
  }*/
}


