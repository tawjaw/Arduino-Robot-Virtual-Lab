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
  editor = monaco.editor.create(
    document.querySelector("#ultrasonic-workshop-monaco"),
    {
      value: `const int pingPin = 5; // Trigger Pin of Ultrasonic Sensor
const int echoPin = 6; // Echo Pin of Ultrasonic Sensor

void setup() {
  //set up the Serial
  Serial.begin(9600);
  //setupt the pin modes  
  pinMode(pingPin, OUTPUT);
  pinMode(echoPin, INPUT);

}

void loop() {
  //create a variable to save the duration in
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
  Serial.println(duration);

  /*
    TASK: Find the distance in cm at 
          every robot position.
  */
  delay(1000);
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
robot.environment.robotInitialPosition = { x: 350, y: 200 };
robot.environment.addObstacleRectangle(0, 400, 20, 800);
robot.environment.addObstacleRectangle(800, 400, 20, 800);
robot.environment.addObstacleRectangle(400, 0, 800, 20);
robot.environment.addObstacleRectangle(400, 800, 800, 20);

robot.environment.addObstacleRectangle(400, 100, 300, 100, "#3CAEA3");

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

//set up the buttons
const btnPositin1 = document.querySelector<ArduinoIDEContainer>("#position1");
btnPositin1.addEventListener("click", () => {
  robot.environment.setRobotPosition({ x: 350, y: 200 });
  console.log("hello");
});

const btnPositin2 = document.querySelector<ArduinoIDEContainer>("#position2");
btnPositin2.addEventListener("click", () => {
  robot.environment.setRobotPosition({ x: 350, y: 250 });
  console.log("hello");
});

const btnPositin3 = document.querySelector<ArduinoIDEContainer>("#position3");
btnPositin3.addEventListener("click", () => {
  robot.environment.setRobotPosition({ x: 350, y: 300 });
  console.log("hello");
});
