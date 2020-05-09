import { avrInstruction, AVRTimer, CPU, timer0Config, timer1Config, AVRIOPort, AVRUSART, portBConfig, portCConfig, portDConfig, usart0Config } from 'avr8js';
import { loadHex } from './intelhex';
import { MicroTaskScheduler } from './task-scheduler';
// ATmega328p params
const FLASH = 0x8000;
export class AVRRunner {
    constructor(hex) {
        this.program = new Uint16Array(FLASH);
        this.speed = 16e6; // 16 MHZ
        this.workUnitCycles = 500000;
        this.taskScheduler = new MicroTaskScheduler();
        //events
        this.cpuEvents = [];
        this.cpuEventsMicrosecond = [];
        this.cpuTimeMS = 0;
        this.cpuTimeMicroS = 0;
        loadHex(hex, new Uint8Array(this.program.buffer));
        this.cpu = new CPU(this.program);
        this.timer0 = new AVRTimer(this.cpu, timer0Config);
        this.timer1 = new AVRTimer(this.cpu, timer1Config);
        this.portB = new AVRIOPort(this.cpu, portBConfig);
        this.portC = new AVRIOPort(this.cpu, portCConfig);
        this.portD = new AVRIOPort(this.cpu, portDConfig);
        this.usart = new AVRUSART(this.cpu, usart0Config, this.speed);
        this.taskScheduler.start();
    }
    // CPU main loop
    execute(callback) {
        const cyclesToRun = this.cpu.cycles + this.workUnitCycles;
        while (this.cpu.cycles < cyclesToRun) {
            avrInstruction(this.cpu);
            this.timer0.tick();
            this.timer1.tick();
            this.usart.tick();
            if (Math.floor(this.cpu.cycles * 1000 / this.speed) !== this.cpuTimeMS) {
                this.cpuTimeMS = Math.floor(this.cpu.cycles * 1000 / this.speed);
                for (const event of this.cpuEvents) {
                    if (Math.floor(this.cpu.cycles * 1000 / this.speed) % event.period === 0) //events by ms
                     {
                        event.eventCall(this.cpu.cycles);
                    }
                }
            }
            if (Math.floor(this.cpu.cycles * 1000000 / this.speed) !== this.cpuTimeMicroS) {
                this.cpuTimeMicroS = Math.floor(this.cpu.cycles * 1000000 / this.speed);
                for (const event of this.cpuEventsMicrosecond) {
                    if (Math.floor(this.cpu.cycles * 1000000 / this.speed) % event.period === 0) {
                        event.eventCall(this.cpu.cycles);
                    }
                }
            }
        }
        callback(this.cpu);
        this.taskScheduler.postTask(() => this.execute(callback));
    }
    stop() {
        this.taskScheduler.stop();
    }
    addCPUEvent(cpuEvent) {
        this.cpuEvents.push(cpuEvent);
    }
    addCPUEventMicrosecond(cpuEvent) {
        this.cpuEventsMicrosecond.push(cpuEvent);
    }
}
