import { ICPU } from 'avr8js';
export declare class CPUPerformance {
    private cpu;
    private MHZ;
    private prevTime;
    private prevCycles;
    private samples;
    private sampleIndex;
    constructor(cpu: ICPU, MHZ: number);
    reset(): void;
    update(): number;
}
