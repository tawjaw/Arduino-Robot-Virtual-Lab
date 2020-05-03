import {Vertices, Engine, Render, Bodies, World, Body, Events, Mouse, MouseConstraint, Composites, Composite, Vector} from "matter-js";
import {leftMotorSpeed, isleftMotorReverse, rightMotorSpeed, isrightMotorReverse } from "./index.ts"
import {raycast} from './robots/utils/raycast_es6'

export let ultrasonicDistance = 400;

var myCanvas = document.getElementById('world');


var engine = Engine.create();
engine.world.gravity.y = 0;

var render = Render.create({
  canvas: myCanvas,
  engine: engine,
  options: {
    width: 800,
    height: 800,
    wireframes: false
  }
});

var topWall = Bodies.rectangle(300, 50, 500, 20, { isStatic: true });
topWall.label = "topwall";

var rightWall = Bodies.rectangle(750, 450, 20, 720, { isStatic: true });
rightWall.label = "rightwall";

var wheel1 = Bodies.rectangle(40, 232, 20, 6);
var robotBody = Bodies.rectangle(50, 250, 50, 30 );
var wheel2 = Bodies.rectangle(40, 268, 20, 5);



var sensor2 = createPartCircle(65,108, 50,200, -0,{});//, {chamfer: { radius: [0, 100, 0] }});
Body.setAngle(sensor2, -3*Math.PI/8)

sensor2.isSensor = true;
sensor2.render.opacity = 0.2;
Body.setMass(sensor2, 0);
Body.setInertia(sensor2, 0);
sensor2.area = 0;

var robot = Body.create({parts: [wheel1, robotBody, wheel2, sensor2]});

Body.setAngle(robot, 1.7);
var sensor =   Bodies.rectangle(400, 200, 150, 150, { 
  chamfer: { radius: [140, 0, 20, 0] }
});

Body.setAngle(sensor, 0.785398);

Body.setMass(robot, 1000);
robot.friction = 0.9;
robot.frictionAir = 0.5;
Body.setPosition(robot, {x: 200, y: 400});

//add obstacle
var obstacle = Bodies.circle(200, 200, 50);
Body.setMass(obstacle, 100000000);  //make it very heavy


World.add(engine.world, [topWall, rightWall, robot, obstacle]);

var obstacles = [topWall, rightWall, obstacle]


Engine.run(engine);
Render.run(render);



Events.on(engine, "afterUpdate", function(event) {
    
    //console.log(robot.position);
    const multiplier = 0.005;
    const angle = robot.angle;
   
    const left = getTranformedPointOfBody(robot, 0, -20);
    const right = getTranformedPointOfBody(robot, 0, 20);
    
    

    let leftWheelForce = {x: Math.cos(angle)*multiplier*leftMotorSpeed*left.x, y : Math.sin(angle)*multiplier*leftMotorSpeed*left.y};
    let rightWheelForce = {x: Math.cos(angle)*multiplier*rightMotorSpeed*right.x, y : Math.sin(angle)*multiplier*rightMotorSpeed*right.y};
    
    Body.applyForce(robot, {x: left.x, y: left.y}, leftWheelForce);
    Body.applyForce(robot, {x: right.x, y: right.y},rightWheelForce);
    console.log(leftMotorSpeed, rightMotorSpeed);
   /* if (event.timestamp % 5000 < 50)
        console.log(robot.position)*/
});

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    render.options.showCollisions = true;
    render.options.showSeparations =  true;




Events.on(engine, 'collisionActive', function(event) {

  const sensorStartingPoint = getTranformedPointOfBody(robot, 15, -10)
  
  const startingAngle = robot.angle - Math.PI/2 + Math.PI/8;

  ultrasonicDistance = findMinimumDistanceToObstacle(sensorStartingPoint, startingAngle, 200, obstacles);
 
});


Events.on(engine, 'collisionEnd', function(event) {
  ultrasonicDistance = 400;
  
});


const resetCarButton = document.querySelector('#reset-car');
resetCarButton.addEventListener('click', function(){
    Body.setPosition(robot, {x: 200, y: 200});
    Body.setAngle(robot, 0);
});



function getTranformedPointOfBody(body, offsetx, offsety)
{
  const angle = body.angle;
  const x = body.position.x;
  const y = body.position.y;
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



function getTranformedPoint(position, angle, offsetx, offsety)
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





function commonExtend(obj, deep) {
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



function createPartCircle(x, y, sides, radius, angleOffset, options) {
  options = options || {};

  var path = '';
  path +=  x.toFixed(3) + ' ' + y.toFixed(3) + ' '
  var offset = -Math.PI/(4*sides);
  for(var i = 0; i < sides; i += 1)
  {
    var angle = angleOffset+ i*offset;
    const newPoint = getTranformedPoint({x:x, y:y}, angle, radius, 0);
    path += newPoint.x.toFixed(3) + ' ' + newPoint.y.toFixed(3) + ' ';
  }

  var polygon = { 
      label: 'Polygon Body',
      position: { x: x, y: y },
      vertices: Vertices.fromPath(path)
  };

  if (options.chamfer) {
      var chamfer = options.chamfer;
      polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, 
          chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
      delete options.chamfer;
  }

  return Body.create(commonExtend({}, polygon, options));
};



function findMinimumDistanceToObstacle(startingPosition,startingAngle, radius, obstacles:Array<Body>)
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
