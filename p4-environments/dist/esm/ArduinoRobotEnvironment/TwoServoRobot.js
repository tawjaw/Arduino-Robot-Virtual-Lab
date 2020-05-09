"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TwoWheelRobot_1 = require("../robots/TwoWheelRobot");
var hardware_1 = require("@p4labs/hardware");
var TwoServoRobot = /** @class */ (function () {
    function TwoServoRobot(canvas, serialOutputElement, timeLabelElement, canvasBackground) {
        var _this = this;
        if (canvasBackground === void 0) { canvasBackground = 'white'; }
        this.arduino = null;
        this.servoLeft = new hardware_1.Servo(9, "leftServo");
        this.servoRight = new hardware_1.Servo(10, "rightServo");
        this.ultrasonic = new hardware_1.UltrasonicSensor(11, 12);
        this.environment = null;
        this.environment = new TwoWheelRobot_1.TwoWheelRobot(canvas, undefined, undefined, canvasBackground);
        this.arduino = new hardware_1.ArduinoUno();
        this.arduino.setSerialOutputElement(serialOutputElement);
        this.arduino.setTimeLabelElement(timeLabelElement);
        //connect the servos
        this.arduino.addConnection(9, this.servoLeft);
        this.arduino.addConnection(10, this.servoRight);
        this.arduino.addConnection(11, this.ultrasonic);
        //add arduino events
        //update the wheel speeds from servo components
        this.arduino.addCPUEvent(5, function () {
            var _a;
            var leftServoSpeed = (_this.servoLeft.getWidthOfLastPulse() - 1.4) / 5;
            var rightServoSpeed = -1 * (_this.servoRight.getWidthOfLastPulse() - 1.4) / 5;
            (_a = _this.environment) === null || _a === void 0 ? void 0 : _a.setSpeeds(leftServoSpeed, rightServoSpeed);
            //console.log("Left: ", leftServoSpeed,this.servoLeft.getWidthOfLastPulse(),"\nRight: ", rightServoSpeed, this.servoRight.getWidthOfLastPulse());
        });
        //apply the force on the wheels
        this.arduino.addCPUEvent(100, function () {
            var _a;
            (_a = _this.environment) === null || _a === void 0 ? void 0 : _a.applyForces();
        });
        this.arduino.addCPUEvent(100, function () {
            var _a;
            (_a = _this.environment) === null || _a === void 0 ? void 0 : _a.tick(100);
        });
        this.arduino.addCPUEventMicrosecond(5, function (cpuCycles) {
            var _a;
            if (_this.environment)
                _this.ultrasonic.setDistanceOfObstacle(_this.environment.ultrasonicSensorDistance);
            (_a = _this.arduino) === null || _a === void 0 ? void 0 : _a.writeDigitalPin(_this.ultrasonic.getEchoPin(), _this.ultrasonic.getEchoPinState(cpuCycles));
        });
        /*
        this.arduino.addCPUEvent(1000, () =>{
           console.log(this.environment?.rightWheelSpeed, this.environment?.leftWheelSpeed);
        })
        */
    }
    TwoServoRobot.prototype.run = function (hex) {
        var _a, _b, _c;
        (_a = this.environment) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.environment) === null || _b === void 0 ? void 0 : _b.tick(100);
        (_c = this.arduino) === null || _c === void 0 ? void 0 : _c.executeProgram(hex);
    };
    TwoServoRobot.prototype.stop = function () {
        var _a;
        (_a = this.arduino) === null || _a === void 0 ? void 0 : _a.stopExecute();
        this.servoLeft.widthOfLastPulse = 1.4;
        this.servoRight.widthOfLastPulse = 1.4;
    };
    return TwoServoRobot;
}());
exports.TwoServoRobot = TwoServoRobot;
