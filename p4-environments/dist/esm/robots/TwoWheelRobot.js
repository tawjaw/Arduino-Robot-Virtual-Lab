"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoWheelRobot = void 0;
var matter_js_1 = require("matter-js");
var CustomBodies_1 = require("./utils/CustomBodies");
var utils_1 = require("./utils/utils");
var TwoWheelRobot = /** @class */ (function () {
    function TwoWheelRobot(canvas, robotInitialPosition, robotInitialAngle, background) {
        if (robotInitialPosition === void 0) { robotInitialPosition = { x: 50, y: 100 }; }
        if (robotInitialAngle === void 0) { robotInitialAngle = 0; }
        if (background === void 0) { background = "white"; }
        this.removedCoins = [];
        this._canvas = canvas;
        this._engine = matter_js_1.Engine.create();
        this.background = background;
        //remove gravity
        this._engine.world.gravity.y = 0;
        this._render = matter_js_1.Render.create({
            canvas: this._canvas,
            engine: this._engine,
            options: {
                width: 800,
                height: 800,
                wireframes: false,
                background: this.background
            }
        });
        this._runner = matter_js_1.Runner.create();
        this.obstacles = [];
        this.coins = [];
        this.rightWheelSpeed = 0;
        this.leftWheelSpeed = 0;
        this.ultrasonicSensorDistance = TwoWheelRobot.maxUltrasonicDistance;
        //create the robot body object
        this.robotBody = matter_js_1.Bodies.rectangle(100, 100, 50, 30, { render: { fillStyle: 'DarkRed' } });
        this.leftWheelBody = matter_js_1.Bodies.rectangle(88, 82, 20, 6, { render: { fillStyle: 'black' } });
        this.rightWheelBody = matter_js_1.Bodies.rectangle(88, 118, 20, 6, { render: { fillStyle: 'black' } });
        //create the ultrasonic sensor body
        this.ultrasonicSensor = CustomBodies_1.createPartCircle(110, -30, 50, 200, -3 * Math.PI / 7, { label: 'ultrasonic' });
        this.ultrasonicSensor.isSensor = true;
        this.ultrasonicSensor.render.opacity = 0.2;
        this.ultrasonicSensor.mass = 0;
        this.ultrasonicSensor.area = 0;
        //create the robot from parts
        this.robot = matter_js_1.Body.create({ parts: [this.ultrasonicSensor, this.robotBody, this.leftWheelBody, this.rightWheelBody] });
        this.robot.frictionAir = 0.5;
        matter_js_1.Body.setMass(this.robot, 1000);
        this.robotInitialPosition = robotInitialPosition;
        this.robotInitialAngle = robotInitialAngle;
        //add circle obstacle for testing
        //add obstacle
        /* var obstacle = Bodies.circle(200, 200, 50);
        Body.setMass(obstacle, 100000000);  //make it very heavy
        this.obstacles.push(obstacle);
         */
        matter_js_1.World.add(this._engine.world, [this.robot,]); //obstacle]);
        matter_js_1.Render.run(this._render);
        this.reset();
        //add collision events to calculate obstacle distance
        var self = this;
        matter_js_1.Events.on(this._engine, 'collisionActive', function (event) { self.onCollision(event); }); //;
        matter_js_1.Events.on(this._engine, 'collisionEnd', function (event) {
            var pairs = event.pairs;
            pairs.forEach(function (_a) {
                var bodyA = _a.bodyA, bodyB = _a.bodyB;
                if ((bodyA.label === 'ultrasonic' && bodyB.label === 'obstacle') ||
                    (bodyB.label === 'ultrasonic' && bodyA.label === 'obstacle')) {
                    self.ultrasonicSensorDistance = TwoWheelRobot.maxUltrasonicDistance;
                }
            });
        });
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
    TwoWheelRobot.prototype.onCollision = function (event) {
        var _this = this;
        var pairs = event.pairs;
        //console.log(pairs);
        pairs.forEach(function (_a) {
            var bodyA = _a.bodyA, bodyB = _a.bodyB;
            if (bodyA.label === 'ultrasonic' || bodyB.label === 'ultrasonic') {
                if (_this.robot) {
                    _this.updateUltrasonicSensor();
                }
            }
            else if (bodyA.label === 'coin' && bodyB.label !== 'ultrasonic') {
                matter_js_1.World.remove(_this._engine.world, bodyA);
                _this.removedCoins.push(bodyA);
            }
            else if (bodyB.label === 'coin' && bodyA.label !== 'ultrasonic') {
                matter_js_1.World.remove(_this._engine.world, bodyB);
                _this.removedCoins.push(bodyB);
            }
        });
    };
    TwoWheelRobot.prototype.updateUltrasonicSensor = function () {
        var sensorStartingPoint = utils_1.getTranformedPoint(this.robot.position, 0, 15, -10);
        var startingAngle = this.robot.angle - 5 * Math.PI / 12;
        this.ultrasonicSensorDistance = utils_1.findMinimumDistanceToObstacle(sensorStartingPoint, startingAngle, 200, this.obstacles);
        if (this.ultrasonicSensorDistance > TwoWheelRobot.maxUltrasonicDistance)
            this.ultrasonicSensorDistance = TwoWheelRobot.maxUltrasonicDistance;
    };
    TwoWheelRobot.prototype.addObstacleRectangle = function (posX, posY, width, height, color) {
        if (color === void 0) { color = "grey"; }
        var obstacle = matter_js_1.Bodies.rectangle(posX, posY, width, height, { isStatic: true, label: 'obstacle', render: { fillStyle: color } });
        this.obstacles.push(obstacle);
        matter_js_1.World.add(this._engine.world, [obstacle]);
    };
    TwoWheelRobot.prototype.addCoin = function (posX, posY) {
        var coin = matter_js_1.Bodies.circle(posX, posY, 15, { isSensor: true, label: 'coin' });
        this.coins.push(coin);
        coin.render.sprite.texture = 'imgs/coin.png';
        matter_js_1.World.add(this._engine.world, [coin]);
    };
    TwoWheelRobot.prototype.setSpeeds = function (left, right) {
        this.leftWheelSpeed = left;
        this.rightWheelSpeed = right;
    };
    TwoWheelRobot.prototype.applyForces = function () {
        var leftForcePosition = utils_1.getTranformedPoint(this.robotBody.position, this.robot.angle, -10, -500);
        var rightForcePosition = utils_1.getTranformedPoint(this.robotBody.position, this.robot.angle, -10, 500);
        var leftWheelForce = matter_js_1.Vector.create(TwoWheelRobot.forceMultiplier * Math.abs(this.leftWheelSpeed), 0);
        leftWheelForce = matter_js_1.Vector.rotate(leftWheelForce, this.robot.angle);
        if (this.leftWheelSpeed < 0)
            leftWheelForce = matter_js_1.Vector.neg(leftWheelForce);
        var rightWheelForce = matter_js_1.Vector.create(TwoWheelRobot.forceMultiplier * Math.abs(this.rightWheelSpeed), 0);
        rightWheelForce = matter_js_1.Vector.rotate(rightWheelForce, this.robot.angle);
        if (this.rightWheelSpeed < 0)
            rightWheelForce = matter_js_1.Vector.neg(rightWheelForce);
        matter_js_1.Body.applyForce(this.robot, leftForcePosition, leftWheelForce);
        matter_js_1.Body.applyForce(this.robot, rightForcePosition, rightWheelForce);
    };
    TwoWheelRobot.prototype.setRobotPosition = function (position) {
        matter_js_1.Body.setPosition(this.robot, position);
    };
    TwoWheelRobot.prototype.setRobotInitialPosition = function (position) {
    };
    TwoWheelRobot.prototype.run = function () {
        matter_js_1.Engine.run(this._engine);
    };
    TwoWheelRobot.prototype.tick = function (period) {
        matter_js_1.Engine.update(this._engine, period);
    };
    TwoWheelRobot.prototype.reset = function () {
        matter_js_1.Body.setPosition(this.robot, this.robotInitialPosition);
        matter_js_1.Body.setAngle(this.robot, this.robotInitialAngle);
        matter_js_1.Body.setVelocity(this.robot, { x: 0, y: 0 });
        matter_js_1.Body.setAngularVelocity(this.robot, 0);
        for (var _i = 0, _a = this.removedCoins; _i < _a.length; _i++) {
            var coin = _a[_i];
            matter_js_1.World.addBody(this._engine.world, coin);
        }
        this.removedCoins = [];
        this.tick(10);
        this.updateUltrasonicSensor();
    };
    TwoWheelRobot.maxUltrasonicDistance = 200;
    TwoWheelRobot.forceMultiplier = 1;
    return TwoWheelRobot;
}());
exports.TwoWheelRobot = TwoWheelRobot;
