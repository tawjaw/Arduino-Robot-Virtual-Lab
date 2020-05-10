import { buildHex } from "./compile";
import "@p4labs/elements";
import { ArduinoIDEContainer } from "@p4labs/elements";
import { ArduinoUnoElement } from "@wokwi/elements";
import { ArduinoUno } from "@p4labs/hardware";

const arduinoElement: ArduinoUnoElement = document.querySelector(
  "#setup-workshop-wokwi-arduino"
);

const unoBoard = new ArduinoUno();
if (arduinoElement) unoBoard.setUnoElement(arduinoElement);

let editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
let simulationStatus = "off";

window.require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs",
  },
});
window.require(["vs/editor/editor.main"], () => {
  editor = monaco.editor.create(
    document.querySelector("#setup-workshop-monaco"),
    {
      value: `void setup() {
  // initialize digital pin 
  //LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);

  // turn the LED on (HIGH is the voltage level)
  digitalWrite(LED_BUILTIN, HIGH);  
  // wait for 3 second 
  delay(3000);    

  /*
    TASK: can you turn off the built in LED
    after waiting for 3 seconds?
  */

}
//loop function is empty and is 
//doing nothing after the setup
void loop() {
}
 

`,
      language: "cpp",
      minimap: { enabled: false },
      automaticLayout: true,
    }
  );
});

const statusLabel = document.querySelector("#status-label");
const compilerOutputText = document.querySelector("#compiler-output-text");
const serialOutputText = document.querySelector("#serial-output-text");

const arduinoContainer = document.querySelector<ArduinoIDEContainer>(
  "#setup-workshop-ide-container"
);

unoBoard.setSerialOutputElement(serialOutputText);
unoBoard.setTimeLabelElement(arduinoContainer);

async function compileAndRun() {
  if (serialOutputText) serialOutputText.textContent = "";
  try {
    const result = await buildHex(editor.getModel().getValue());
    if (simulationStatus === "compiling") {
      if (result.hex) {
        if (arduinoContainer) arduinoContainer.status = "on";
        if (compilerOutputText) compilerOutputText.textContent = "";

        simulationStatus = "on";
        unoBoard.executeProgram(result.hex);
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
  unoBoard.stopExecute();
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
