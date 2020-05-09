import { Component } from "./Component";
export declare class UltrasonicSensor extends Component {
    private echoPin;
    private echoPinState;
    private isTriggered;
    private startingTimeOfTrigger;
    private startingTimeOfEcho;
    private startingCpuCyclesOfPulse;
    private distanceOfObstacle;
    constructor(triggerPin: number, echoPin: number, label?: string);
    setDistanceOfObstacle(distance: number): void;
    getEchoPin(): number;
    update(pinState: boolean, cpuCycles: number): void;
    getEchoPinState(cpuCycles: number): boolean;
    reset(): void;
}
