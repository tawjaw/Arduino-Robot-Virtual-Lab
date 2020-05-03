import {Body, Engine, Render, Bodies, World, Vector, Runner} from "matter-js";
import {createPartCircle} from "./utils/CustomBodies"
import { getTranformedPoint } from "./utils/utils";


export class TwoWheelRobot {
    private _canvas : any;
    private _engine : Engine;
    private _render : Render; 
    private _runner : Runner;

    robotBody : Body;
    leftWheelBody : Body;
    rightWheelBody : Body;
   
    ultrasonicSensor : Body;
    static readonly maxUltrasonicDistance = 200;
    ultrasonicSensorDistance : number;
    
    robot : Body;

    obstacles : Array<Body>;
    coins : Array<Body>;

    static readonly forceMultiplier = 1;
    leftWheelSpeed : number;
    rightWheelSpeed : number;

    constructor(canvas:any) {
        this._canvas = canvas;
        this._engine = Engine.create();

        //remove gravity
        this._engine.world.gravity.y = 0;

        this._render = Render.create({
            canvas: this._canvas,
            engine: this._engine,
            options: {
              width: 800,
              height: 800,
              wireframes: false,
              showAxes: true,
              showPositions: true
            }
          });
        
        this._runner = Runner.create();
        //this._render.options.showAxes: true;
        //this._render.options.showPositions: true;
        //this._render.options.show
        //initialize
        this.obstacles = [];
        this.coins = [];
        this.rightWheelSpeed = 0;
        this.leftWheelSpeed = 0;
        this.ultrasonicSensorDistance = TwoWheelRobot.maxUltrasonicDistance;

        //create the robot body object
        this.robotBody = Bodies.rectangle(100, 100, 50, 30 );
        this.leftWheelBody = Bodies.rectangle(88, 82, 20, 6);
        this.rightWheelBody = Bodies.rectangle(88, 118, 20, 6);
        //create the ultrasonic sensor body
        this.ultrasonicSensor = createPartCircle(115,-30, 50,200, -3*Math.PI/8,{});
        this.ultrasonicSensor.isSensor = true;
        this.ultrasonicSensor.render.opacity = 0.2;
        this.ultrasonicSensor.mass = 0;
        this.ultrasonicSensor.area =  0;  
        //create the robot from parts
        this.robot = Body.create({parts: [this.ultrasonicSensor,this.robotBody, this.leftWheelBody, this.rightWheelBody]});
        this.robot.frictionAir = 0.5;
        Body.setMass(this.robot, 1000);
        Body.setPosition(this.robot, {x: 300, y: 300});
        World.add(this._engine.world, [this.robot]);

        Render.run(this._render); 
        Engine.run(this._engine);
    }

    addObstacleRectangle(posX : number, posY : number, width : number, height : number, color = "grey", label = "rectangle" ) : void {
        const obstacle = Bodies.rectangle(posX, posY, width, height, { isStatic: true, label: label, render: {fillStyle : color} });
        this.obstacles.push(obstacle);
        World.add(this._engine.world, [obstacle]);
    }
    setSpeeds(left : number, right : number) : void {
        this.leftWheelSpeed = left;
        this.rightWheelSpeed = right;
    }
    
    applyForces() : void {

    const leftForcePosition = getTranformedPoint(this.robotBody.position, this.robot.angle, -10, -5000);
    const rightForcePosition = getTranformedPoint(this.robotBody.position, this.robot.angle, -10, 5000);
    
    let leftWheelForce = Vector.create(TwoWheelRobot.forceMultiplier*Math.abs(this.leftWheelSpeed), 0);
    leftWheelForce = Vector.rotate(leftWheelForce, this.robot.angle);
    if(this.leftWheelSpeed < 0)
        leftWheelForce = Vector.neg(leftWheelForce);
    
    let rightWheelForce = Vector.create(TwoWheelRobot.forceMultiplier*Math.abs(this.rightWheelSpeed), 0);
    rightWheelForce = Vector.rotate(rightWheelForce, this.robot.angle);
    if(this.rightWheelSpeed < 0)
        rightWheelForce = Vector.neg(rightWheelForce);


    Body.applyForce(this.robot, leftForcePosition, leftWheelForce);
    Body.applyForce(this.robot, rightForcePosition, rightWheelForce);
    
    }

    run() {
        Engine.run(this._engine);
        Render.run(this._render); 
    }

    tick(period : number) {
        Engine.update(this._engine, period);
        //Runner.tick(this._runner, this._engine, 1);
    }
}
