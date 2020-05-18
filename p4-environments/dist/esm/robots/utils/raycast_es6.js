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
exports.raycast = void 0;
var Matter = __importStar(require("matter-js"));
///
///				code by Isaiah Smith
///		technostalgic.itch.io  |  @technostalgicGM
///
///						repo:
///	https://github.com/Technostalgic/MatterJS_Raycast.git
///
//raycast functionality integrated with matter.js since there 
//is no built-in method for raycasting that returns the ray's
//intersection points
//function 'raycast' - returns an array of 'raycol' objects
//param 'bodies' - bodies to check collision with; passed 
//	through 'Matter.Query.ray()'
//param 'start' - start point of raycast
//param 'end' - end point of raycast
//param 'sort' - whether or not the ray collisions should be
//	sorted based on distance from the origin
function raycast(bodies, start, end, sort) {
    if (sort === void 0) { sort = true; }
    //convert the start & end parameters to my custom
    //'vec2' object type
    start = vec2.fromOther(start);
    end = vec2.fromOther(end);
    //The bodies that the raycast will be tested against
    //are queried and stored in the variable 'query'.
    //This uses the built-in raycast method which takes
    //advantage of the broad-phase collision optomizations
    //instead of iterating through each body in the list
    var query = Matter.Query.ray(bodies, start, end);
    //'cols': the array that will contain the ray 
    //collision information
    var cols = [];
    //'raytest': the ray object that will be tested for
    //collision against the bodies
    var raytest = new ray(start, end);
    //Next, since all the bodies that the ray collides with
    //have already been queried, we iterate through each
    //one to see where the ray intersects with the body
    //and gather other information
    for (var i = query.length - 1; i >= 0; i--) {
        var bcols = ray.bodyCollisions(raytest, query[i].body);
        for (var k = bcols.length - 1; k >= 0; k--) {
            cols.push(bcols[k]);
        }
    }
    //if desired, we then sort the collisions based on the
    //distance from the ray's start
    if (sort)
        cols.sort(function (a, b) {
            return a.point.distance(start) - b.point.distance(start);
        });
    return cols;
}
exports.raycast = raycast;
//data type that contains information about an intersection 
//between a ray and a body
var raycol = /** @class */ (function () {
    //initailizes a 'raycol' object with the given data
    //param 'body' - stores the body that the ray has 
    //	collided with
    //param 'point' - stores the collision point
    //param 'normal' - stores the normal of the edge that
    //	the ray collides with
    //param 'verts' - stores the vertices of the edge that
    //	the ray collides with
    function raycol(body, point, normal, verts) {
        this.body = body;
        this.point = point;
        this.normal = normal;
        this.verts = verts;
    }
    return raycol;
}());
//data type that contains information and methods for a 
//ray object
var ray = /** @class */ (function () {
    //initializes a ray instance with the given parameters
    //param 'start' - the starting point of the ray
    //param 'end' - the ending point of the ray
    function ray(start, end) {
        this.start = start;
        this.end = end;
    }
    ray.prototype.yValueAt = function (x) {
        //returns the y value on the ray at the specified x
        //slope-intercept form:
        //y = m * x + b
        return this.offsetY + this.slope * x;
    };
    ray.prototype.xValueAt = function (y) {
        //returns the x value on the ray at the specified y
        //slope-intercept form:
        //x = (y - b) / m
        return (y - this.offsetY) / this.slope;
    };
    ray.prototype.pointInBounds = function (point) {
        //checks to see if the specified point is within
        //the ray's bounding box (inclusive)
        var minX = Math.min(this.start.x, this.end.x);
        var maxX = Math.max(this.start.x, this.end.x);
        var minY = Math.min(this.start.y, this.end.y);
        var maxY = Math.max(this.start.y, this.end.y);
        return (point.x >= minX &&
            point.x <= maxX &&
            point.y >= minY &&
            point.y <= maxY);
    };
    ray.prototype.calculateNormal = function (ref) {
        //calulates the normal based on a specified
        //reference point
        var dif = this.difference;
        //gets the two possible normals as points that lie
        //perpendicular to the ray
        var norm1 = dif.normalized().rotate(Math.PI / 2);
        var norm2 = dif.normalized().rotate(Math.PI / -2);
        //returns the normal that is closer to the provided
        //reference point
        if (this.start.plus(norm1).distance(ref) < this.start.plus(norm2).distance(ref))
            return norm1;
        return norm2;
    };
    Object.defineProperty(ray.prototype, "difference", {
        get: function () {
            //pretty self explanitory
            return this.end.minus(this.start);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "slope", {
        get: function () {
            var dif = this.difference;
            return dif.y / dif.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "offsetY", {
        get: function () {
            //the y-offset at x = 0, in slope-intercept form:
            //b = y - m * x
            //offsetY = start.y - slope * start.x
            return this.start.y - this.slope * this.start.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "isHorizontal", {
        get: function () { return compareNum(this.start.y, this.end.y); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "isVertical", {
        get: function () { return compareNum(this.start.x, this.end.x); },
        enumerable: false,
        configurable: true
    });
    ray.intersect = function (rayA, rayB) {
        //returns the intersection point between two rays
        //null if no intersection
        //conditional checks for axis aligned rays
        if (rayA.isVertical && rayB.isVertical)
            return null;
        if (rayA.isVertical)
            return new vec2(rayA.start.x, rayB.yValueAt(rayA.start.x));
        if (rayB.isVertical)
            return new vec2(rayB.start.x, rayA.yValueAt(rayB.start.x));
        if (compareNum(rayA.slope, rayB.slope))
            return null;
        if (rayA.isHorizontal)
            return new vec2(rayB.xValueAt(rayA.start.y), rayA.start.y);
        if (rayB.isHorizontal)
            return new vec2(rayA.xValueAt(rayB.start.y), rayB.start.y);
        //slope intercept form:
        //y1 = m2 * x + b2; where y1 = m1 * x + b1:
        //m1 * x + b1 = m2 * x + b2:
        //x = (b2 - b1) / (m1 - m2)
        var x = (rayB.offsetY - rayA.offsetY) / (rayA.slope - rayB.slope);
        return new vec2(x, rayA.yValueAt(x));
    };
    ray.collisionPoint = function (rayA, rayB) {
        //returns the collision point of two rays
        //null if no collision
        var intersection = ray.intersect(rayA, rayB);
        if (!intersection)
            return null;
        if (!rayA.pointInBounds(intersection))
            return null;
        if (!rayB.pointInBounds(intersection))
            return null;
        return intersection;
    };
    ray.bodyEdges = function (body) {
        //returns all of the edges of a body in the
        //form of an array of ray objects
        var r = [];
        for (var i = body.parts.length - 1; i >= 0; i--) {
            for (var k = body.parts[i].vertices.length - 1; k >= 0; k--) {
                var k2 = k + 1;
                if (k2 >= body.parts[i].vertices.length)
                    k2 = 0;
                var tray = new ray(vec2.fromOther(body.parts[i].vertices[k]), vec2.fromOther(body.parts[i].vertices[k2]));
                //stores the vertices inside the edge
                //ray for future reference
                tray.verts = [
                    body.parts[i].vertices[k],
                    body.parts[i].vertices[k2]
                ];
                r.push(tray);
            }
        }
        return r;
    };
    ray.bodyCollisions = function (rayA, body) {
        //returns all the collisions between a specified ray
        //and body in the form of an array of 'raycol' objects
        var r = [];
        //gets the edge rays from the body
        var edges = ray.bodyEdges(body);
        //iterates through each edge and tests for collision
        //with 'rayA'
        for (var i = edges.length - 1; i >= 0; i--) {
            //gets the collision point
            var colpoint = ray.collisionPoint(rayA, edges[i]);
            //if there is no collision, then go to next edge
            if (!colpoint)
                continue;
            //calculates the edge's normal
            var normal = edges[i].calculateNormal(rayA.start);
            //adds the ray collision to the return array
            r.push(new raycol(body, colpoint, normal, edges[i].verts));
        }
        return r;
    };
    return ray;
}());
//in order to avoid miscalculations due to floating point
//errors
//example:
//	var m = 6; m -= 1; m -= 3; m += 4
//	now 'm' probably equals 6.0000000008361 or something stupid
function compareNum(a, b, leniency) {
    if (leniency === void 0) { leniency = 0.00001; }
    return Math.abs(b - a) <= leniency;
}
//
//included external dependencies:
//
//2d vector data type; contains information and methods for
//2-dimensional vectors
var vec2 = /** @class */ (function () {
    //initailizes a 'vec2' object with specified values
    function vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = x; }
        this.x = x;
        this.y = y;
    }
    vec2.prototype.normalized = function (magnitude) {
        if (magnitude === void 0) { magnitude = 1; }
        //returns a vector 2 with the same direction as this but
        //with a specified magnitude
        return this.multiply(magnitude / this.distance());
    };
    Object.defineProperty(vec2.prototype, "inverted", {
        get: function () {
            //returns the opposite of this vector
            return this.multiply(-1);
        },
        enumerable: false,
        configurable: true
    });
    vec2.prototype.multiply = function (factor) {
        //returns this multiplied by a specified factor    
        return new vec2(this.x * factor, this.y * factor);
    };
    vec2.prototype.plus = function (vec) {
        //returns the result of this added to another
        //specified 'vec2' object
        return new vec2(this.x + vec.x, this.y + vec.y);
    };
    vec2.prototype.minus = function (vec) {
        //returns the result of this subtracted by another
        //specified 'vec2' object
        return this.plus(vec.inverted);
    };
    vec2.prototype.rotate = function (rot) {
        //rotates the vector by the specified angle
        var ang = this.direction;
        var mag = this.distance();
        ang += rot;
        return vec2.fromAng(ang, mag);
    };
    vec2.prototype.toPhysVector = function () {
        //converts this to a vector compatible with the
        //matter.js physics engine
        return Matter.Vector.create(this.x, this.y);
    };
    Object.defineProperty(vec2.prototype, "direction", {
        get: function () {
            //returns the angle this vector is pointing in radians
            return Math.atan2(this.y, this.x);
        },
        enumerable: false,
        configurable: true
    });
    vec2.prototype.distance = function (vec) {
        if (vec === void 0) { vec = new vec2(); }
        //returns the distance between this and a specified
        //'vec2' object
        var d = Math.sqrt(Math.pow(this.x - vec.x, 2) +
            Math.pow(this.y - vec.y, 2));
        return d;
    };
    vec2.prototype.clone = function () {
        //returns a new instance of a 'vec2' object with the
        //same value
        return new vec2(this.x, this.y);
    };
    vec2.fromAng = function (angle, magnitude) {
        if (magnitude === void 0) { magnitude = 1; }
        //returns a vector which points in the specified angle
        //and has the specified magnitude
        return new vec2(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
    };
    vec2.fromOther = function (vector) {
        //converts other data types that contain 'x' and 'y'
        //properties to a 'vec2' object type
        return new vec2(vector.x, vector.y);
    };
    vec2.prototype.toString = function () {
        return "vector<" + this.x + ", " + this.y + ">";
    };
    return vec2;
}());
