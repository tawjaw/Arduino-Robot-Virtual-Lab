"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Robots = void 0;
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
