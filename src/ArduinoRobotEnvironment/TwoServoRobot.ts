import {TwoWheelRobot} from "../robots/TwoWheelRobot";
import {ArduinoUno, Servo, UltrasonicSensor} from "../Hardware";
import { ultrasonicDistance } from "../RobotEnvironment";


export class TwoServoRobot {

    public arduino : ArduinoUno | null = null;
    public servoLeft : Servo = new Servo(9, "leftServo");
    public servoRight : Servo = new Servo(10, "rightServo");
    public ultrasonic : UltrasonicSensor = new UltrasonicSensor(11, 12);
    public environment : TwoWheelRobot | null = null;
    
    
    
    constructor(canvas:any, serialOutputElement : any, timeLabelElement : any) {
        this.environment = new TwoWheelRobot(canvas);
        this.arduino = new ArduinoUno();
        this.arduino.setSerialOutputElement(serialOutputElement);
        this.arduino.setTimeLabelElement(timeLabelElement)

        //connect the servos
        this.arduino.addConnection(9, this.servoLeft);
        this.arduino.addConnection(10, this.servoRight);
        this.arduino.addConnection(11, this.ultrasonic);

        //add arduino events
        //update the wheel speeds from servo components
        this.arduino.addCPUEvent(5, () => {
            const leftServoSpeed = this.servoLeft.getWidthOfLastPulse() - 1.4;
            const rightServoSpeed = this.servoRight.getWidthOfLastPulse() - 1.4;
            this.environment?.setSpeeds(leftServoSpeed, rightServoSpeed);
        })
        
        //apply the force on the wheels
        this.arduino.addCPUEvent(50, () => {
            this.environment?.applyForces();
        })
        this.arduino.addCPUEventMicrosecond(50, (cpuCycles : number) => {
            if(this.environment)
                this.ultrasonic.setDistanceOfObstacle(this.environment.ultrasonicSensorDistance);
            this.arduino?.writeDigitalPin(this.ultrasonic.getEchoPin(), this.ultrasonic.getEchoPinState(cpuCycles));
        })
        this.arduino.addCPUEvent(1000, () =>{
           console.log(this.environment?.rightWheelSpeed, this.environment?.leftWheelSpeed);
        })
    }

    run(hex: string)
    {
        this.arduino?.executeProgram(hex);
    }
    
    stop()
    {
        this.arduino?.stopExecute();
        this.servoLeft.widthOfLastPulse = 1.4;
        this.servoRight.widthOfLastPulse = 1.4;
    }
}