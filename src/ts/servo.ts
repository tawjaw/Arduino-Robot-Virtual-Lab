import { Robots } from "@p4labs/environments";
import { buildHex } from "./compile";
import "@p4labs/elements";
import { ArduinoIDEContainer } from "@p4labs/elements";

let editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
let rotateeditor: any;
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
  editor = monaco.editor.create(
    document.querySelector("#moveforward-workshop-monaco"),
    {
      value: `#include <Servo.h>

Servo leftservo;  
Servo rightservo;  

void setup() {
  leftservo.attach(9);  
  rightservo.attach(10);
  
  //move forward fast
  leftservo.write(170);
  /*
    TASK: make the right servo
    move forward too
  */
  
  delay(3000);  //is this enough time to get all the coins?

  //stop moving
  leftservo.write(90);
  rightservo.write(90);

}

void loop() {

}
`,
      language: "cpp",
      minimap: { enabled: false },
      automaticLayout: true,
    }
  );
});

const compilerOutputText = document.querySelector(
  "#moveforward-compiler-output-text"
);
const serialOutputText = document.querySelector(
  "#moveforward-serial-output-text"
);

const arduinoContainer = document.querySelector<ArduinoIDEContainer>(
  "#moveforward-workshop-ide-container"
);

//set up robot environment
const canvas = document.getElementById("moveforward-world");

const robot = new Robots.Arduino.TwoServoRobot(
  canvas,
  serialOutputText,
  arduinoContainer,
  "imgs/room-background.jpg"
);
robot.environment.robotInitialPosition = { x: 50, y: 300 };
robot.environment.addObstacleRectangle(0, 400, 20, 800);
robot.environment.addObstacleRectangle(800, 400, 20, 800);
robot.environment.addObstacleRectangle(400, 0, 800, 20);
robot.environment.addObstacleRectangle(400, 800, 800, 20);

robot.environment?.addCoin(250, 300);
robot.environment?.addCoin(450, 300);
robot.environment?.addCoin(650, 300);
robot.environment.reset();

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
  }
}

function stopCode() {
  robot.stop();
}

function handleIDEStatusChange(e: CustomEvent) {
  const status = e.detail.status;
  if (status === "compiling" && simulationStatus !== "compiling") {
    compileAndRun();
  } else if (status === "off" && simulationStatus !== "off") {
    stopCode();
  }
  simulationStatus = status;
}

arduinoContainer?.addEventListener("_status-change", (e: CustomEvent) =>
  handleIDEStatusChange(e)
);

let rotatesimulationStatus = "off";

window.require(["vs/editor/editor.main"], () => {
  rotateeditor = monaco.editor.create(
    document.querySelector("#rotate-workshop-monaco"),
    {
      value: `#include <Servo.h>

Servo leftservo;  
Servo rightservo;  

void setup() {
  leftservo.attach(9);  
  rightservo.attach(10);
  
  //move forward fast
  leftservo.write(170);
  
  delay(3000);

  /*
    TASK: Get all the coins!
  */
  
  //stop moving
  leftservo.write(90);
  rightservo.write(90);

}

void loop() {

}
`,
      language: "cpp",
      minimap: { enabled: false },
      automaticLayout: true,
    }
  );
});

const rotatecompilerOutputText = document.querySelector(
  "#rotate-compiler-output-text"
);
const rotateserialOutputText = document.querySelector(
  "#rotate-serial-output-text"
);

const rotatearduinoContainer = document.querySelector<ArduinoIDEContainer>(
  "#rotate-workshop-ide-container"
);

//set up robot environment
const rotatecanvas = document.getElementById("rotate-world");

const rotaterobot = new Robots.Arduino.TwoServoRobot(
  rotatecanvas,
  rotateserialOutputText,
  rotatearduinoContainer,
  "imgs/room-background.jpg"
);
rotaterobot.environment.robotInitialPosition = { x: 50, y: 100 };
rotaterobot.environment.addObstacleRectangle(0, 400, 20, 800);
rotaterobot.environment.addObstacleRectangle(800, 400, 20, 800);
rotaterobot.environment.addObstacleRectangle(400, 0, 800, 20);
rotaterobot.environment.addObstacleRectangle(400, 800, 800, 20);

rotaterobot.environment?.addCoin(250, 100);
rotaterobot.environment?.addCoin(450, 100);
rotaterobot.environment?.addCoin(650, 100);
rotaterobot.environment?.addCoin(700, 300);
rotaterobot.environment?.addCoin(700, 500);
rotaterobot.environment?.addCoin(700, 700);

rotaterobot.environment.reset();

async function rotatecompileAndRun() {
  console.log("rotate start");
  if (rotateserialOutputText) rotateserialOutputText.textContent = "";
  try {
    const result = await buildHex(rotateeditor.getModel().getValue());
    if (rotatesimulationStatus === "compiling") {
      if (result.hex) {
        if (rotatearduinoContainer) rotatearduinoContainer.status = "on";
        if (rotatecompilerOutputText) rotatecompilerOutputText.textContent = "";

        rotatesimulationStatus = "on";
        rotaterobot.run(result.hex);
      } else {
        rotatesimulationStatus = "off";
        if (rotatearduinoContainer) rotatearduinoContainer.status = "off";
        if (rotatecompilerOutputText)
          rotatecompilerOutputText.textContent = result.stderr;
      }
    }
  } catch (err) {
    rotatesimulationStatus = "off";
    if (rotatearduinoContainer) rotatearduinoContainer.status = "off";

    alert("Failed: " + err);
  }
}

function rotatestopCode() {
  rotaterobot.stop();
}

function rotatehandleIDEStatusChange(e: CustomEvent) {
  const status = e.detail.status;
  if (status === "compiling" && rotatesimulationStatus !== "compiling") {
    rotatecompileAndRun();
  } else if (status === "off" && rotatesimulationStatus !== "off") {
    rotatestopCode();
  }
  rotatesimulationStatus = status;
}

rotatearduinoContainer?.addEventListener("_status-change", (e: CustomEvent) =>
  rotatehandleIDEStatusChange(e)
);
