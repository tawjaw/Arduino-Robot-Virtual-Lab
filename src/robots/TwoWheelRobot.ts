import {Body, Engine, Render, Bodies, World, Vector, Runner, Events, Mouse, MouseConstraint} from "matter-js";
import {createPartCircle} from "./utils/CustomBodies"
import { getTranformedPoint, findMinimumDistanceToObstacle } from "./utils/utils";


export class TwoWheelRobot {
    private _canvas : any;
    private _engine : Engine;
    private _render : Render; 
    private _runner : Runner;

    robotBody : Body;
    leftWheelBody : Body;
    rightWheelBody : Body;
    robotInitialPosition : Vector;
    robotInitialAngle : number;

    ultrasonicSensor : Body;
    static readonly maxUltrasonicDistance = 200;
    ultrasonicSensorDistance : number;
    
    robot : Body;

    obstacles : Array<Body>;
    coins : Array<Body>;

    static readonly forceMultiplier = 1;
    leftWheelSpeed : number;
    rightWheelSpeed : number;

    constructor(canvas:any, robotInitialPosition : Vector = { x: 50, y: 100}, robotInitialAngle : number = 0) {
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
              wireframes: false
            }
          });
        
        this._runner = Runner.create();
       
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
        this.ultrasonicSensor = createPartCircle(110,-30, 50,200, -3*Math.PI/7,{});
        this.ultrasonicSensor.isSensor = true;
        this.ultrasonicSensor.render.opacity = 0.2;
        this.ultrasonicSensor.mass = 0;
        this.ultrasonicSensor.area =  0;  
        //create the robot from parts
        this.robot = Body.create({parts: [this.ultrasonicSensor,this.robotBody, this.leftWheelBody, this.rightWheelBody]});
        this.robot.frictionAir = 0.5;
        Body.setMass(this.robot, 1000);
        this.robotInitialPosition = robotInitialPosition;
        this.robotInitialAngle = robotInitialAngle; 


        //add circle obstacle for testing
        //add obstacle
    /* var obstacle = Bodies.circle(200, 200, 50);
    Body.setMass(obstacle, 100000000);  //make it very heavy
    this.obstacles.push(obstacle);
     */
        World.add(this._engine.world, [this.robot, ]);//obstacle]);

        Render.run(this._render); 


        //add collision events to calculate obstacle distance
        let self = this;
        Events.on(this._engine, 'collisionActive',function(event) {self.onCollision(event);});
        Events.on(this._engine, "collisionEnd", function(event) {
            self.ultrasonicSensorDistance = TwoWheelRobot.maxUltrasonicDistance;
        })


        /* //add mouse for testing
            // add mouse control
        var mouse = Mouse.create(this._render.canvas),
        mouseConstraint = MouseConstraint.create(this._engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        World.add(this._engine.world, mouseConstraint);

        // keep the mouse in sync with rendering
        this._render.mouse = mouse;

        */    
    }

    private onCollision(event)
    {   
        if(this.robot)
        {
        const sensorStartingPoint = getTranformedPoint(this.robot.position, 0, 15, -10);   
        const startingAngle = this.robot.angle - 5*Math.PI/12;
        this.ultrasonicSensorDistance = findMinimumDistanceToObstacle(sensorStartingPoint, startingAngle, 200, this.obstacles);
        if(this.ultrasonicSensorDistance > TwoWheelRobot.maxUltrasonicDistance) 
            this.ultrasonicSensorDistance = TwoWheelRobot.maxUltrasonicDistance;
        
        }
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

    const leftForcePosition = getTranformedPoint(this.robotBody.position, this.robot.angle, -10, -500);
    const rightForcePosition = getTranformedPoint(this.robotBody.position, this.robot.angle, -10, 500);
    
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

    setRobotPosition(position : Vector) : void
    {
        Body.setPosition(this.robot, position);
    }
    
    setRobotInitialPosition(position : Vector) : void
    {

    }
    run() {
        Engine.run(this._engine);
    }

    tick(period : number) {
        Engine.update(this._engine, period);
    }

    reset()
    {
        this.onCollision(undefined);
        Body.setPosition(this.robot, this.robotInitialPosition);
        Body.setAngle(this.robot, this.robotInitialAngle);
    }
}
