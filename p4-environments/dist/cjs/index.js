"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _matterenvironments = __importStar(require("./robots"));
var _arduinoenvironments = __importStar(require("./ArduinoRobotEnvironment"));
var Robots;
(function (Robots) {
    var Matter;
    (function (Matter) {
        Matter.TwoWheelRobot = _matterenvironments.TwoWheelRobot;
    })(Matter = Robots.Matter || (Robots.Matter = {}));
    var Arduino;
    (function (Arduino) {
        Arduino.TwoServoRobot = _arduinoenvironments.TwoServoRobot;
    })(Arduino = Robots.Arduino || (Robots.Arduino = {}));
})(Robots = exports.Robots || (exports.Robots = {}));
