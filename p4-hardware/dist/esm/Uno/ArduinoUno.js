import { AVRRunner } from "./execute";
import { CPUPerformance } from "./cpu-performance";
import { Component } from "../Component";
import { formatTime } from "./format-time";
import { portDConfig, portBConfig } from "avr8js";
export class ArduinoUno {
    constructor() {
        this.runner = null;
        this.cpuEvents = [];
        this.cpuEventsMicrosecond = [];
        this.pinConnections = [];
        this.serialOutput = "";
        this.serialOutputElement = null;
        this.arduinoContainer = null;
        this.unoElement = null;
    }
    setSerialOutputElement(serialOutputElement) {
        this.serialOutputElement = serialOutputElement;
    }
    setTimeLabelElement(arduinoContainer) {
        this.arduinoContainer = arduinoContainer;
    }
    setUnoElement(arduinoUnoElement) {
        this.unoElement = arduinoUnoElement;
    }
    getSerialOutput() {
        return this.serialOutput;
    }
    addConnection(pin, component) {
        const connection = { pin: pin, component: component };
        //TODO can we allow multiple components to be connected to the same pin?
        /*for(const connection of this.digitalPinConnections)
            {
                if(connection.pin === pin)
                    return false;
            }*/
        this.pinConnections.push(connection);
        return true;
    }
    addCPUEvent(period, eventCall) {
        var _a;
        const cpuEvent = { period: period, eventCall: eventCall };
        this.cpuEvents.push(cpuEvent);
        (_a = this.runner) === null || _a === void 0 ? void 0 : _a.addCPUEvent(cpuEvent);
    }
    addCPUEventMicrosecond(period, eventCall) {
        var _a;
        const cpuEvent = { period: period, eventCall: eventCall };
        this.cpuEventsMicrosecond.push(cpuEvent);
        (_a = this.runner) === null || _a === void 0 ? void 0 : _a.addCPUEventMicrosecond(cpuEvent);
    }
    updateComponents(value, startPin, cpuCycles) {
        for (const connection of this.pinConnections) {
            const pin = connection.pin;
            if (pin >= startPin && pin <= startPin + 8) {
                connection.component.update(value & (1 << (pin - startPin)) ? true : false, cpuCycles);
            }
        }
    }
    executeProgram(hex) {
        this.runner = new AVRRunner(hex);
        const MHZ = 16000000;
        if (this.unoElement) {
            this.addConnection(13, new pin13(13, "led", this.unoElement));
        }
        for (const event of this.cpuEventsMicrosecond)
            this.runner.addCPUEventMicrosecond(event);
        for (const event of this.cpuEvents)
            this.runner.addCPUEvent(event);
        for (const connection of this.pinConnections)
            connection.component.reset();
        this.runner.portD.addListener((value) => {
            if (this.runner)
                this.updateComponents(value, 0, this.runner.cpu.cycles);
        });
        this.runner.portB.addListener((value) => {
            if (this.runner)
                this.updateComponents(value, 8, this.runner.cpu.cycles);
        });
        this.runner.usart.onByteTransmit = (value) => {
            this.serialOutput += String.fromCharCode(value);
            if (this.serialOutputElement)
                this.serialOutputElement.textContent += String.fromCharCode(value);
        };
        const cpuPerf = new CPUPerformance(this.runner.cpu, MHZ);
        this.runner.execute((cpu) => {
            const time = formatTime(cpu.cycles / MHZ);
            const speed = (cpuPerf.update() * 100).toFixed(0);
            if (this.arduinoContainer)
                this.arduinoContainer.simulationTime = `${time}`;
        });
    }
    stopExecute() {
        var _a;
        (_a = this.runner) === null || _a === void 0 ? void 0 : _a.stop();
        this.runner = null;
    }
    writeDigitalPin(pin, pinState) {
        let portConfig = portDConfig.PIN;
        let pinIndex = 0;
        if (pin > 0 && pin < 8) {
            portConfig = portDConfig.PIN;
            pinIndex = pin;
        }
        else if (pin < 13) {
            portConfig = portBConfig.PIN;
            pinIndex = pin - 8;
        }
        else
            return false;
        if (this.runner) {
            if (!pinState)
                this.runner.cpu.data[portConfig] &= ~(1 << pinIndex);
            else
                this.runner.cpu.data[portConfig] |= 1 << pinIndex;
            return true;
        }
        return false;
    }
}
class pin13 extends Component {
    constructor(pin, label, unoElement) {
        super(pin, label);
        this.unoElement = unoElement;
    }
    update(pinState, cpuCycles) {
        this.unoElement.led13 = pinState;
    }
    reset() {
        this.unoElement.led13 = false;
    }
}
