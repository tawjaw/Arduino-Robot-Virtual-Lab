import {raycast} from "./raycast_es6";
import {Body, Bodies, World} from "matter-js";

  //taken from  Matter.js library 
  export function commonExtend(obj : any, deep : any, options : any) {
    var argsStart,
        args,
        deepClone;
  
    if (typeof deep === 'boolean') {
        argsStart = 2;
        deepClone = deep;
    } else {
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
                    } else {
                        obj[prop] = source[prop];
                    }
                } else {
                    obj[prop] = source[prop];
                }
            }
        }
    }
    
    return obj;
  };
  

export function getTranformedPoint(position : any, angle : number, offsetx : number, offsety : number)
{
  const x = position.x;
  const y = position.y;
  //get center position wrt axis of the robot
  const xprime = x*Math.cos(angle) + y*Math.sin(angle);
  const yprime = -x*Math.sin(angle) + y*Math.cos(angle);

  //get value of xprime - w and yprime += h in game axis
  const w = offsetx;
  const h = offsety;
  return {
    x: (xprime+w)*Math.cos(angle) - (yprime+h)*Math.sin(angle),
    y: (yprime+h)*Math.cos(angle)+(xprime+w)*Math.sin(angle)
  }


}


export function findMinimumDistanceToObstacle(startingPosition: any,startingAngle : number, radius : number, obstacles:Array<Body>)
{
    let minDistance = radius + 10000;
   
    const numberOfRays = 45;

    for(var i =0; i < numberOfRays; i+=1)
    {
      const endPoint = getTranformedPoint(startingPosition, startingAngle-i*Math.PI/180, 220,0);
      //var newBody =  Bodies.circle(endPoint.x, endPoint.y, 5,{isSensor : true, label:"test"});
        //World.add(engine.world, [newBody]);
      var rays = raycast(obstacles,startingPosition, endPoint, true);
      if(rays.length != 0)
      {
        const nearestPoint = rays[0].point;
        
        const distance = Math.sqrt((nearestPoint.x-startingPosition.x)*(nearestPoint.x-startingPosition.x)+
                                   (nearestPoint.y-startingPosition.y)*(nearestPoint.y-startingPosition.y));
        if(distance < minDistance)  minDistance = distance;
      }
    }

    return minDistance;
    
}
