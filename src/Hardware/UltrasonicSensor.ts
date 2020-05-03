import {Component} from "./Component";
import {getMilliSecconds, getMicroSeconds} from "./Uno/format-time";

const MHZ = 16000000;
const maxDistance = 300;

export class UltrasonicSensor extends Component{
    
    private echoPin : number;
    private echoPinState : boolean;
    
    private startingTimeOfEcho : number = 0;
    private startingCpuCyclesOfPulse : number = -1;
    private distanceOfObstacle : number = maxDistance;

    constructor(triggerPin : number, echoPin: number, label = "UltrasonicSensor") 
    {
        super(triggerPin, label);
        this.echoPin = echoPin;
        this.echoPinState = false;
    }


    setDistanceOfObstacle(distance : number) : void { this.distanceOfObstacle = distance;}
    getEchoPin() : number { return this.echoPin;}

    update(pinState : boolean, cpuCycles : number)
    {
        if(pinState)
        {
            if(!this.pinState)   //if we are LOW 
            {
               this.startingCpuCyclesOfPulse = cpuCycles;
               //console.log("triggered.. waiting for 10 microsecond");
            }
        }
        else
        {
            if(this.pinState)
            {
                const widthOfLastPulse = getMicroSeconds((cpuCycles - this.startingCpuCyclesOfPulse)/MHZ);
                //console.log("width: " , widthOfLastPulse);
                if(widthOfLastPulse >= 10 && widthOfLastPulse <= 20) //10 micros to triger the echo
                {
                    if(!this.echoPinState)
                    {
                        this.echoPinState = true;
                        this.startingTimeOfEcho = Math.floor(cpuCycles*1000000/MHZ);
                    }
                }
            }
        }
        this.pinState = pinState;
        
        console.log(this.pinState, this.echoPinState, this.startingCpuCyclesOfPulse, this.startingTimeOfEcho);
    }

    getEchoPinState(cpuCycles : number) 
    {
        //console.log("get echo pin state");
        if(this.echoPinState)
        {
            const targetDuration = this.distanceOfObstacle*2/0.0343;
            const pulseDuration = Math.floor(cpuCycles*1000000/MHZ) - this.startingTimeOfEcho;
            //console.log("target: " , targetDuration, " Pulse: ", pulseDuration);
            const error = 50;
            if(pulseDuration >= targetDuration)    //flip the trigger down 
            {
                this.echoPinState = false;
            }
        }

        return this.echoPinState;

    }
}