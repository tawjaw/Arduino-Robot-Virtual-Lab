import * as _matterenvironments from './robots';
import * as _arduinoenvironments from './ArduinoRobotEnvironment';
export declare namespace Robots {
    namespace Matter {
        export import TwoWheelRobot = _matterenvironments.TwoWheelRobot;
    }
    namespace Arduino {
        export import TwoServoRobot = _arduinoenvironments.TwoServoRobot;
    }
}
