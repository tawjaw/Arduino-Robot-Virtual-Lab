import { Robots } from "@p4labs/environments";
import { buildHex } from "./compile";
import "@p4labs/elements";
import { ArduinoIDEContainer } from "@p4labs/elements";

let editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
let simulationStatus = "off";

// Load Editor
declare const window: any; // eslint-disable-line @typescript-eslint/no-explicit-any
declare const monaco: any; // eslint-disable-line @typescript-eslint/no-explicit-any
window.require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs",
  },
});
window.require(["vs/editor/editor.main"], () => {
  editor = monaco.editor.create(document.querySelector(".code-editor"), {
    value: `#include <Servo.h>

Servo leftservo;  
Servo rightservo;  

const int pingPin = 11; // Trigger Pin of Ultrasonic Sensor
const int echoPin = 12; // Echo Pin of Ultrasonic Sensor

void setup() {
  Serial.begin(115200);
  leftservo.attach(9);  
  rightservo.attach(10);
  
  pinMode(pingPin, OUTPUT);
  pinMode(echoPin, INPUT);

  printDistance();

  //move forward fast
  leftservo.write(170);
  rightservo.write(10);
  delay(7000);

  printDistance();
  //rotate right fast
  leftservo.write(170);
  rightservo.write(170);
  delay(3000);

  printDistance();
  //move forward fast
  leftservo.write(170);
  rightservo.write(10);
  delay(8000);

  printDistance();
  //stop
  leftservo.write(90);
  rightservo.write(90);
}

void loop() {

}

void printDistance()
{
  long duration, inches, cm;
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(pingPin, LOW);
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
    language: "cpp",
    minimap: { enabled: false },
    automaticLayout: true,
  });
});

const statusLabel = document.querySelector("#status-label");
const compilerOutputText = document.querySelector("#compiler-output-text");
const serialOutputText = document.querySelector("#serial-output-text");

const arduinoContainer = document.querySelector<ArduinoIDEContainer>(
  "#ide-container"
);
arduinoContainer?.addEventListener("_status-change", (e: CustomEvent) =>
  handleIDEStatusChange(e)
);

function handleIDEStatusChange(e: CustomEvent) {
  const status = e.detail.status;
  if (status === "compiling" && simulationStatus !== "compiling") {
    compileAndRun();
  } else if (status === "off" && simulationStatus !== "off") {
    stopCode();
  }
  simulationStatus = status;
}

//set up robot environment
const canvas = document.getElementById("world");

const robot = new Robots.Arduino.TwoServoRobot(
  canvas,
  serialOutputText,
  arduinoContainer,
  "imgs/room-background.jpg"
);

robot.environment?.addObstacleRectangle(400, 50, 800, 20, "grey");
robot.environment?.addCoin(150, 100);
robot.environment?.addCoin(300, 100);
robot.environment?.addCoin(500, 300);
robot.environment?.addCoin(500, 400);
robot.environment?.addCoin(500, 600);

const runButton = document.querySelector("#run-button");
runButton?.addEventListener("click", compileAndRun);
const stopButton = document.querySelector("#stop-button");
stopButton?.addEventListener("click", stopCode);

async function compileAndRun() {
  if (serialOutputText) serialOutputText.textContent = "";
  try {
    const result = await buildHex(editor.getModel().getValue());
    if (simulationStatus === "compiling") {
      if (result.hex) {
        if (arduinoContainer) arduinoContainer.status = "on";
        if (compilerOutputText) compilerOutputText.textContent = "";

        simulationStatus = "on";
        robot.run(result.hex);
      } else {
        simulationStatus = "off";
        if (arduinoContainer) arduinoContainer.status = "off";
        if (compilerOutputText) compilerOutputText.textContent = result.stderr;
      }
    }
  } catch (err) {
    simulationStatus = "off";
    if (arduinoContainer) arduinoContainer.status = "off";

    alert("Failed: " + err);
  } finally {
  }
}

function stopCode() {
  //stopButton.setAttribute('disabled', '1');
  //runButton.removeAttribute('disabled');
  robot.stop();
  /*if (robot.arduino) {
    runner.stop();
    runner = null;
    leftMotorSpeed = 0;
    rightMotorSpeed = 0;
    
  }*/
}
