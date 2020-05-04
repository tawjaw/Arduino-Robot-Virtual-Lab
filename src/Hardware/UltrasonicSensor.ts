import {Component} from "./Component";
import {getMilliSecconds, getMicroSeconds} from "./Uno/format-time";

const MHZ = 16000000;
const maxDistance = 300;

export class UltrasonicSensor extends Component{
    
    private echoPin : number;
    private echoPinState : boolean;
    
    private isTriggered : boolean = false;
    private startingTimeOfTrigger : number = 0;

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
            }
        }
        else
        {
            if(this.pinState)
            {
                const widthOfLastPulse = getMicroSeconds((cpuCycles - this.startingCpuCyclesOfPulse)/MHZ);
                if(widthOfLastPulse >= 10 && widthOfLastPulse <= 20) //10 micros to triger the echo + 10 error
                {
                    if(!this.echoPinState)
                    {
                        this.isTriggered = true;
                        this.startingTimeOfTrigger = Math.floor(cpuCycles*1000000/MHZ);
                    }
                }
            }
        }
        this.pinState = pinState;

    }

    getEchoPinState(cpuCycles : number) 
    {
       
        if(this.echoPinState)
        {
            const targetDuration = this.distanceOfObstacle*2/0.0343;
            const pulseDuration = Math.floor(cpuCycles*1000000/MHZ) - this.startingTimeOfEcho;

            if(pulseDuration >= targetDuration)    //flip the trigger down 
            {
                this.echoPinState = false;
            }
        }
        else
        {
            if(this.isTriggered && Math.floor(cpuCycles*1000000/MHZ) > this.startingTimeOfTrigger + 14) 
            //wait few milliseconds after the trigger for the echos to be sent
            //which gives enough time for pulseIn to get called, as it waits for the moment it turns HIGH
            //if the flip is immidiate, pulseIn will keep on waiting for the pin to go LOW and then HIGH or until it times out
            {
                this.echoPinState = true;
                this.startingTimeOfEcho = Math.floor(cpuCycles*1000000/MHZ);
                this.isTriggered = false;
            }
        }

        return this.echoPinState;

    }

    reset()
    {
        this.echoPinState = false;
        this.isTriggered = false;
        this.startingTimeOfTrigger  = 0;

        this.startingTimeOfEcho = 0;
        this.startingCpuCyclesOfPulse = -1;
        
    }
}