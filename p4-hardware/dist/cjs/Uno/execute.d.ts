import { AVRTimer, CPU, AVRIOPort, AVRUSART } from 'avr8js';
import { MicroTaskScheduler } from './task-scheduler';
declare type Event = {
    period: number;
    eventCall: any;
};
export declare class AVRRunner {
    readonly program: Uint16Array;
    readonly cpu: CPU;
    readonly timer0: AVRTimer;
    readonly timer1: AVRTimer;
    readonly portB: AVRIOPort;
    readonly portC: AVRIOPort;
    readonly portD: AVRIOPort;
    readonly usart: AVRUSART;
    readonly speed = 16000000;
    readonly workUnitCycles = 500000;
    readonly taskScheduler: MicroTaskScheduler;
    private cpuEvents;
    private cpuEventsMicrosecond;
    constructor(hex: string);
    private cpuTimeMS;
    private cpuTimeMicroS;
    execute(callback: (cpu: CPU) => void): void;
    stop(): void;
    addCPUEvent(cpuEvent: Event): void;
    addCPUEventMicrosecond(cpuEvent: Event): void;
}
export {};
