"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMinimumDistanceToObstacle = exports.getTranformedPoint = exports.commonExtend = void 0;
var raycast_es6_1 = require("./raycast_es6");
//taken from  Matter.js library 
function commonExtend(obj, deep, options) {
    var argsStart, args, deepClone;
    if (typeof deep === 'boolean') {
        argsStart = 2;
        deepClone = deep;
    }
    else {
        argsStart = 1;
        deepClone = true;
    }
    for (var i = argsStart; i < arguments.length; i++) {
        var source = arguments[i];
        if (source) {
            for (var prop in source) {
                if (deepClone && source[prop] && source[prop].constructor === Object) {
                    if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {};
                        commonExtend(obj[prop], deepClone, source[prop]);
                    }
                    else {
                        obj[prop] = source[prop];
                    }
                }
                else {
                    obj[prop] = source[prop];
                }
            }
        }
    }
    return obj;
}
exports.commonExtend = commonExtend;
;
function getTranformedPoint(position, angle, offsetx, offsety) {
    var x = position.x;
    var y = position.y;
    //get center position wrt axis of the robot
    var xprime = x * Math.cos(angle) + y * Math.sin(angle);
    var yprime = -x * Math.sin(angle) + y * Math.cos(angle);
    //get value of xprime - w and yprime += h in game axis
    var w = offsetx;
    var h = offsety;
    return {
        x: (xprime + w) * Math.cos(angle) - (yprime + h) * Math.sin(angle),
        y: (yprime + h) * Math.cos(angle) + (xprime + w) * Math.sin(angle)
    };
}
exports.getTranformedPoint = getTranformedPoint;
function findMinimumDistanceToObstacle(startingPosition, startingAngle, radius, obstacles) {
    var minDistance = radius + 10000;
    var numberOfRays = 45;
    for (var i = 0; i < numberOfRays; i += 1) {
        var endPoint = getTranformedPoint(startingPosition, startingAngle - i * Math.PI / 180, 220, 0);
        //var newBody =  Bodies.circle(endPoint.x, endPoint.y, 5,{isSensor : true, label:"test"});
        //World.add(engine.world, [newBody]);
        var rays = raycast_es6_1.raycast(obstacles, startingPosition, endPoint, true);
        if (rays.length != 0) {
            var nearestPoint = rays[0].point;
            var distance = Math.sqrt((nearestPoint.x - startingPosition.x) * (nearestPoint.x - startingPosition.x) +
                (nearestPoint.y - startingPosition.y) * (nearestPoint.y - startingPosition.y));
            if (distance < minDistance)
                minDistance = distance;
        }
    }
    return minDistance;
}
exports.findMinimumDistanceToObstacle = findMinimumDistanceToObstacle;
