import { Engine, Render, Bodies, World, Body, Events, Vertices, Vector} from "matter-js";
import {leftMotorSpeed, isleftMotorReverse, rightMotorSpeed, isrightMotorReverse } from "./index.ts"


var myCanvas = document.getElementById('world');


var engine = Engine.create();
engine.world.gravity.y = 0;

var render = Render.create({
  canvas: myCanvas,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false
  }
});

var topWall = Bodies.rectangle(400, 50, 720, 20, { isStatic: true });
var wheel1 = Bodies.rectangle(40, 232, 20, 6);
var robotBody = Bodies.rectangle(50, 250, 50, 30 );
var wheel2 = Bodies.rectangle(40, 268, 20, 5);
var robot = Body.create({parts: [wheel1, robotBody, wheel2]});




Body.setMass(robot, 1000);
robot.friction = 0.9;
robot.frictionAir = 0.5;
Body.setPosition(robot, {x: 200, y: 200});
//Body.rotate(robot, 1);
World.add(engine.world, [topWall, robot]);

Engine.run(engine);

Render.run(render);



Events.on(engine, "afterUpdate", function() {

    //console.log(robot.mass);
    const multiplier = 0.001;
    const angle = robot.angle;
    const x = robot.position.x;
    const y = robot.position.y;
    //get center position wrt axis of the robot
    const xprime = x*Math.cos(angle) + y*Math.sin(angle);
    const yprime = -x*Math.sin(angle) + y*Math.cos(angle);

    //get value of xprime - w and yprime += h in game axis
    const w = 0;
    const h = 20;
    const leftx = (xprime-w)*Math.cos(angle) - (yprime-h)*Math.sin(angle);
    const lefty = (yprime-h)*Math.cos(angle)+(xprime-w)*Math.sin(angle);
    
    const rightx = (xprime-w)*Math.cos(angle) - (yprime+h)*Math.sin(angle);
    const righty = (yprime+h)*Math.cos(angle)+(xprime-w)*Math.sin(angle);

    let leftWheelForce = {x: Math.cos(angle)*multiplier*leftMotorSpeed*leftx, y : Math.sin(angle)*multiplier*leftMotorSpeed*lefty};
    let rightWheelForce = {x: Math.cos(angle)*multiplier*rightMotorSpeed*rightx, y : Math.sin(angle)*multiplier*rightMotorSpeed*righty};
    
    Body.applyForce(robot, {x: leftx, y: lefty}, leftWheelForce);
    Body.applyForce(robot, {x: rightx, y: righty},rightWheelForce);
   
});

const resetCarButton = document.querySelector('#reset-car');
resetCarButton.addEventListener('click', function(){
    Body.setPosition(robot, {x: 200, y: 200});
    Body.setAngle(robot, 0);
});


