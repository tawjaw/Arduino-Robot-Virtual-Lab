import { AVRRunner } from './execute';
import { CPUPerformance } from './cpu-performance';
import {Component} from "../Component";
import {formatTime} from "./format-time"
import { portDConfig, portBConfig } from "avr8js";

type Event = {
    period : number,  //milliseconds
    eventCall : any
}
type DigitalPinConnection = {
    pin : number,
    component : Component
}
export class ArduinoUno{
    private runner: AVRRunner | null = null;
    private cpuEvents : Event[] = [];
    private cpuEventsMicrosecond : Event[] = [];
    private pinConnections : DigitalPinConnection[] = [];
    private serialOutput : string = "";
    private serialOutputElement : Element | null = null;
    private timeLabelElement : Element | null = null;


    setSerialOutputElement(serialOutputElement : Element) : void
    {
        this.serialOutputElement = serialOutputElement;
    }
    setTimeLabelElement(timeLabelElement : Element) : void
    {
        this.timeLabelElement = timeLabelElement;
    }
    getSerialOutput() : string { return this.serialOutput;}

    addConnection(pin : number, component : Component) : boolean
    {
        const connection : DigitalPinConnection = { pin : pin, component : component};

        //TODO can we allow multiple components to be connected to the same pin?
        /*for(const connection of this.digitalPinConnections)
        {
            if(connection.pin === pin)
                return false;
        }*/
    
        this.pinConnections.push(connection);
        return true;
    }

    addCPUEvent(period: number, eventCall: any)
    {
        const cpuEvent : Event = { period: period, eventCall: eventCall};
        this.cpuEvents.push(cpuEvent);
        this.runner?.addCPUEvent(cpuEvent);
    }

    addCPUEventMicrosecond(period: number, eventCall: any)
    {
        const cpuEvent : Event = { period: period, eventCall: eventCall};
        this.cpuEventsMicrosecond.push(cpuEvent);
        this.runner?.addCPUEventMicrosecond(cpuEvent);
    }

    private updateComponents(value: number, startPin: number, cpuCycles: number) : void {
        for (const connection of this.pinConnections) {
          const pin = connection.pin;
          if (pin >= startPin && pin <= startPin + 8) {
            connection.component.update(value & (1 << (pin - startPin)) ? true : false, cpuCycles);
          }
        }
      }
    executeProgram(hex: string) {
        this.runner = new AVRRunner(hex);
        const MHZ = 16000000;
      
        for(const event of this.cpuEventsMicrosecond)
            this.runner.addCPUEventMicrosecond(event);
        for(const event of this.cpuEvents)
            this.runner.addCPUEvent(event);
        
        for(const connection of this.pinConnections)
            connection.component.reset();

        this.runner.portD.addListener(value => {
            
            this.updateComponents(value, 0, this.runner.cpu.cycles);
        });
        this.runner.portB.addListener(value => {
            this.updateComponents(value, 8, this.runner.cpu.cycles);
        });
    
        this.runner.usart.onByteTransmit = (value) => {
            this.serialOutput += String.fromCharCode(value);
            if(this.serialOutputElement)
                this.serialOutputElement.textContent += String.fromCharCode(value);

        };

    
        const cpuPerf = new CPUPerformance(this.runner.cpu, MHZ);
    
        this.runner.execute((cpu) => {
           
                const time = formatTime(cpu.cycles / MHZ);
                const speed = (cpuPerf.update() * 100).toFixed(0);
                if(this.timeLabelElement)
                    this.timeLabelElement.textContent = `Simulation time: ${time} (${speed}%)`;

        });
    }

    stopExecute()
    {
        this.runner?.stop();
        this.runner = null;
    }

    writeDigitalPin(pin: number, pinState: boolean) : boolean
    {
        let portConfig = portDConfig.PIN;
        let pinIndex = 0;

        if(pin > 0 && pin < 8)
        {
            portConfig = portDConfig.PIN;
            pinIndex = pin;
        }
        else if(pin < 13)
        { 
           portConfig = portBConfig.PIN;
           pinIndex = pin - 8;
        }
        else
            return false;

        if(this.runner)
        {
            if(!pinState)
                this.runner.cpu.data[portConfig] &= ~(1 << pinIndex);
            else
                this.runner.cpu.data[portConfig] |= 1 << pinIndex;

            return true;
        }

        return false;
    }

}

