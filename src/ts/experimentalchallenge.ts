import { Robots } from "@p4labs/environments";
import { buildHex } from "./compile";
import "@p4labs/elements";
import { ArduinoIDEContainer } from "@p4labs/elements";
import $ from "jquery";

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
  editor = monaco.editor.create(
    document.querySelector("#ultrasonic-workshop-monaco"),
    {
      value: `#include <Servo.h>

Servo leftservo;  
Servo rightservo;  
const int pingPin = 5; // Trigger Pin of Ultrasonic Sensor
const int echoPin = 6; // Echo Pin of Ultrasonic Sensor

void setup() {
  leftservo.attach(9);  
  rightservo.attach(10);
  
   //set up the Serial
  Serial.begin(9600);
  //setupt the pin modes  
  pinMode(pingPin, OUTPUT);
  pinMode(echoPin, INPUT);

  leftservo.write(90);
  rightservo.write(90);

}

void loop() {

  long duration;  
  //clear the ping pin
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  //send the 10 microsecond trigger
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(pingPin, LOW);
  //get the pulse duration in microseconds
  duration = pulseIn(echoPin, HIGH);

  /*
    TASK: The coins are around 110 cm away from the top wall.
    Use the ultrasonic sensor data to navigate the robot in order
    to collect the coins.
  */

  delay(50);  
}
`,
      language: "cpp",
      minimap: { enabled: false },
      automaticLayout: true,
    }
  );
});

const compilerOutputText = document.querySelector(
  "#ultrasonic-compiler-output-text"
);
const serialOutputText = document.querySelector(
  "#ultrasonic-serial-output-text"
);

const arduinoContainer = document.querySelector<ArduinoIDEContainer>(
  "#ultrasonic-workshop-ide-container"
);

//set up robot environment
const canvas = document.getElementById("ultrasonic-world");

const robot = new Robots.Arduino.TwoServoRobot(
  canvas,
  serialOutputText,
  arduinoContainer,
  "imgs/room-background.jpg"
);

robot.environment.addObstacleRectangle(800, 400, 30, 800);
robot.environment.addObstacleRectangle(150, 0, 800, 30);

//robot.environment.addObstacleRectangle(400, 120, 600, 10);

//robot.environment.addObstacleRectangle(400, 100, 300, 100, "#3CAEA3");
robot.environment.addCoin(200, 120);
robot.environment.addCoin(300, 120);
robot.environment.addCoin(400, 120);
robot.environment.addCoin(500, 120);

robot.environment.addCoin(700, 200);
robot.environment.addCoin(700, 300);
robot.environment.addCoin(700, 400);
robot.environment.addCoin(700, 500);

const position = robot.environment.robotInitialPosition;
robot.environment.robotInitialPosition = { x: position.x, y: position.y + 70 };
robot.environment.reset();
robot.environment.tick(10);

robot.environment.OnAllCoinsCollectedEvent = (env) => {
  /*   env.coins = [];
  env.removedCoins = []; */
  env.obstacles = [];
  env.addObstacleRectangle(800, 400, 30, 800);
  env.addObstacleRectangle(
    Math.floor(Math.random() * (250 - 100 + 1) + 100),
    0,
    800,
    30
  );

  env.reset();
};
async function compileAndRun() {
  if (serialOutputText) serialOutputText.textContent = "";
  try {
    const result = await buildHex(editor.getModel().getValue());
    if (simulationStatus === "compiling") {
      if (result.hex) {
        if (arduinoContainer) arduinoContainer.status = "on";
        if (compilerOutputText) compilerOutputText.textContent = "";

        simulationStatus = "on";
        /* roboty = 200; //Math.floor(Math.random() * (250 - 170 + 1) + 170);
        robot.environment.robotInitialPosition = { x: 100, y: roboty };
        //robot.environment.addCoin()
        console.log(robot.environment.robot.position);
        robot.environment.reset(); */
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

/* $(document).keypress(function (e) {
  const key = e.which;
  if (key == 97) {
    robot.environment.setSpeeds(-16, 16);
    robot.environment.applyForces();
  }
  else if (key == 100)
  {
    robot.environment.setSpeeds(16, -16);
    robot.environment.applyForces();
  }
  else if (key == 119)
  {
    robot.environment.setSpeeds(16, 16);
    robot.environment.applyForces();
  }
}); */
