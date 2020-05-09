import { Component } from "./Component";
import { getMilliSecconds } from "./Uno/format-time";
const MHZ = 16000000;
export class Servo extends Component {
    constructor(pin, label = "Servo") {
        super(pin, label);
        this.widthOfLastPulse = 1.4;
        this.startingCpuCyclesOfPulse = -1;
    }
    getWidthOfLastPulse() { return this.widthOfLastPulse; }
    update(pinState, cpuCycles) {
        if (pinState) {
            if (!this.pinState) //if we are LOW 
             {
                this.startingCpuCyclesOfPulse = cpuCycles;
            }
        }
        else {
            if (this.pinState) {
                this.widthOfLastPulse = getMilliSecconds((cpuCycles - this.startingCpuCyclesOfPulse) / MHZ);
            }
        }
        this.pinState = pinState;
    }
    reset() {
        this.widthOfLastPulse = 1.4;
        this.startingCpuCyclesOfPulse = -1;
    }
}
