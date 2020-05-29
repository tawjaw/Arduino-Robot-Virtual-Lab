"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servo = void 0;
const Component_1 = require("./Component");
const format_time_1 = require("./Uno/format-time");
const MHZ = 16000000;
class Servo extends Component_1.Component {
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
                this.widthOfLastPulse = format_time_1.getMilliSecconds((cpuCycles - this.startingCpuCyclesOfPulse) / MHZ);
            }
        }
        this.pinState = pinState;
    }
    reset() {
        this.widthOfLastPulse = 1.4;
        this.startingCpuCyclesOfPulse = -1;
    }
}
exports.Servo = Servo;
