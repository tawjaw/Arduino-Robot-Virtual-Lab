import { Component } from "../Component";
import { ArduinoIDEContainer } from "@p4labs/elements";
import { ArduinoUnoElement } from "@wokwi/elements";
export declare class ArduinoUno {
    private runner;
    private cpuEvents;
    private cpuEventsMicrosecond;
    private pinConnections;
    private serialOutput;
    private serialOutputElement;
    private arduinoContainer;
    private unoElement;
    setSerialOutputElement(serialOutputElement: Element): void;
    setTimeLabelElement(arduinoContainer: ArduinoIDEContainer): void;
    setUnoElement(arduinoUnoElement: ArduinoUnoElement): void;
    getSerialOutput(): string;
    addConnection(pin: number, component: Component): boolean;
    addCPUEvent(period: number, eventCall: any): void;
    addCPUEventMicrosecond(period: number, eventCall: any): void;
    private updateComponents;
    executeProgram(hex: string): void;
    stopExecute(): void;
    writeDigitalPin(pin: number, pinState: boolean): boolean;
}
