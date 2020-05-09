import { Component } from "./Component";
export declare class Servo extends Component {
    widthOfLastPulse: number;
    startingCpuCyclesOfPulse: number;
    constructor(pin: number, label?: string);
    getWidthOfLastPulse(): number;
    update(pinState: boolean, cpuCycles: number): void;
    reset(): void;
}
