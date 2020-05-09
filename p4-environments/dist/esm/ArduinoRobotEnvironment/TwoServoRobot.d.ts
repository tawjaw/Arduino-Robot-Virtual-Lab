import { TwoWheelRobot } from "../robots/TwoWheelRobot";
import { ArduinoUno, Servo, UltrasonicSensor } from "@p4labs/hardware";
export declare class TwoServoRobot {
    arduino: ArduinoUno | null;
    servoLeft: Servo;
    servoRight: Servo;
    ultrasonic: UltrasonicSensor;
    environment: TwoWheelRobot | null;
    constructor(canvas: any, serialOutputElement: any, timeLabelElement: any, canvasBackground?: string);
    run(hex: string): void;
    stop(): void;
}
