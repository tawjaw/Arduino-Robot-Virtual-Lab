import * as Matter from "matter-js";



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
export function raycast(bodies, start, end, sort = true){
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
	for(var i = query.length - 1; i >= 0; i--){
		var bcols = ray.bodyCollisions(raytest, query[i].body);
		for(var k = bcols.length - 1; k >= 0; k--){
			cols.push(bcols[k]);
		}
	}
	
	//if desired, we then sort the collisions based on the
	//distance from the ray's start
	if(sort)
		cols.sort(function(a,b){
			return a.point.distance(start) - b.point.distance(start);
		});
	
	return cols;
}


//data type that contains information about an intersection 
//between a ray and a body
class raycol{
	//initailizes a 'raycol' object with the given data
	//param 'body' - stores the body that the ray has 
	//	collided with
	//param 'point' - stores the collision point
	//param 'normal' - stores the normal of the edge that
	//	the ray collides with
	//param 'verts' - stores the vertices of the edge that
	//	the ray collides with
	constructor(body, point, normal, verts){
		this.body = body;
		this.point = point;
		this.normal = normal;
		this.verts = verts;
	}
}

//data type that contains information and methods for a 
//ray object
class ray{
	//initializes a ray instance with the given parameters
	//param 'start' - the starting point of the ray
	//param 'end' - the ending point of the ray
	constructor(start, end){
		this.start = start;
		this.end = end;
	}
	
	yValueAt(x){
		//returns the y value on the ray at the specified x
		//slope-intercept form:
		//y = m * x + b
		return this.offsetY + this.slope * x; 
	} 
	xValueAt(y){
		//returns the x value on the ray at the specified y
		//slope-intercept form:
		//x = (y - b) / m
		return (y - this.offsetY) / this.slope;
	}
	
	pointInBounds(point){
		//checks to see if the specified point is within
		//the ray's bounding box (inclusive)
		var minX = Math.min(this.start.x, this.end.x);
		var maxX = Math.max(this.start.x, this.end.x);
		var minY = Math.min(this.start.y, this.end.y);
		var maxY = Math.max(this.start.y, this.end.y);
		return (
			point.x >= minX &&
			point.x <= maxX &&
			point.y >= minY &&
			point.y <= maxY );
	}
	calculateNormal(ref){
		//calulates the normal based on a specified
		//reference point
		var dif = this.difference;
		
		//gets the two possible normals as points that lie
		//perpendicular to the ray
		var norm1 = dif.normalized().rotate(Math.PI / 2);
		var norm2 = dif.normalized().rotate(Math.PI / -2);
		
		//returns the normal that is closer to the provided
		//reference point
		if(this.start.plus(norm1).distance(ref) < this.start.plus(norm2).distance(ref))
			return norm1;
		return norm2;
	}
	
	get difference(){
		//pretty self explanitory
		return this.end.minus(this.start);
	}
	get slope(){
		var dif = this.difference;
		return dif.y / dif.x;
	}	
	get offsetY(){
		//the y-offset at x = 0, in slope-intercept form:
		//b = y - m * x
		//offsetY = start.y - slope * start.x
		return this.start.y - this.slope * this.start.x;
	}
	get isHorizontal(){ return compareNum(this.start.y, this.end.y); }
	get isVertical(){ return compareNum(this.start.x, this.end.x); }
	
	static intersect(rayA, rayB){
		//returns the intersection point between two rays
		//null if no intersection
		
		//conditional checks for axis aligned rays
		if(rayA.isVertical && rayB.isVertical) return null;
		if(rayA.isVertical) return new vec2(rayA.start.x, rayB.yValueAt(rayA.start.x));
		if(rayB.isVertical) return new vec2(rayB.start.x, rayA.yValueAt(rayB.start.x));
		if(compareNum(rayA.slope, rayB.slope)) return null;
		if(rayA.isHorizontal) return new vec2(rayB.xValueAt(rayA.start.y), rayA.start.y);
		if(rayB.isHorizontal) return new vec2(rayA.xValueAt(rayB.start.y), rayB.start.y);
		
		//slope intercept form:
		//y1 = m2 * x + b2; where y1 = m1 * x + b1:
		//m1 * x + b1 = m2 * x + b2:
		//x = (b2 - b1) / (m1 - m2)
		var x = (rayB.offsetY - rayA.offsetY) / (rayA.slope - rayB.slope)
		return new vec2(x, rayA.yValueAt(x));
	}
	static collisionPoint(rayA, rayB){
		//returns the collision point of two rays
		//null if no collision
		var intersection = ray.intersect(rayA, rayB);
		if(!intersection) return null;
		if(!rayA.pointInBounds(intersection)) return null;
		if(!rayB.pointInBounds(intersection)) return null;
		return intersection;
	}
	static bodyEdges(body){
		//returns all of the edges of a body in the
		//form of an array of ray objects
		var r = [];
		for (var i = body.parts.length - 1; i >= 0; i--){
			for(var k = body.parts[i].vertices.length - 1; k >= 0; k--){
				var k2 = k + 1;
				if(k2 >= body.parts[i].vertices.length)
					k2 = 0;
				var tray = new ray(
					vec2.fromOther(body.parts[i].vertices[k]) , 
					vec2.fromOther(body.parts[i].vertices[k2]) );
				
				//stores the vertices inside the edge
				//ray for future reference
				tray.verts = [
					body.parts[i].vertices[k] , 
					body.parts[i].vertices[k2] ];
				
				r.push(tray);
			}
		}
		return r;
	}
	static bodyCollisions(rayA, body){
		//returns all the collisions between a specified ray
		//and body in the form of an array of 'raycol' objects
		var r = [];
		
		//gets the edge rays from the body
		var edges = ray.bodyEdges(body);
		
		//iterates through each edge and tests for collision
		//with 'rayA'
		for(var i = edges.length - 1; i >= 0; i--){
			//gets the collision point
			var colpoint = ray.collisionPoint(rayA, edges[i]);
			
			//if there is no collision, then go to next edge
			if(!colpoint) continue;
			
			//calculates the edge's normal
			var normal = edges[i].calculateNormal(rayA.start);
			
			//adds the ray collision to the return array
			r.push(new raycol(body, colpoint, normal, edges[i].verts));
		}
		
		return r;
	}
}

//in order to avoid miscalculations due to floating point
//errors
//example:
//	var m = 6; m -= 1; m -= 3; m += 4
//	now 'm' probably equals 6.0000000008361 or something stupid
function compareNum(a, b, leniency = 0.00001){
	return Math.abs(b - a) <= leniency;
}

//
//included external dependencies:
//
//2d vector data type; contains information and methods for
//2-dimensional vectors
class vec2{
    //initailizes a 'vec2' object with specified values
    constructor(x = 0, y = x){
        this.x = x;
        this.y = y;
    }
   
    normalized(magnitude = 1){
        //returns a vector 2 with the same direction as this but
        //with a specified magnitude
        return this.multiply(magnitude / this.distance());
    }
    get inverted(){
        //returns the opposite of this vector
        return this.multiply(-1);
    }
    multiply(factor){
        //returns this multiplied by a specified factor    
        return new vec2(this.x * factor, this.y * factor);
    }
    plus(vec){
        //returns the result of this added to another
        //specified 'vec2' object
        return new vec2(this.x + vec.x, this.y + vec.y);
    }
    minus(vec){
        //returns the result of this subtracted by another
        //specified 'vec2' object
        return this.plus(vec.inverted);
    }
    rotate(rot){
        //rotates the vector by the specified angle
        var ang = this.direction;
        var mag = this.distance();
        ang += rot;
        return vec2.fromAng(ang, mag)
    }
    toPhysVector(){
        //converts this to a vector compatible with the
        //matter.js physics engine
        return Matter.Vector.create(this.x, this.y);
    }
   
    get direction(){
        //returns the angle this vector is pointing in radians
        return Math.atan2(this.y, this.x);
    }
    distance(vec = new vec2()){
        //returns the distance between this and a specified
        //'vec2' object
        var d = Math.sqrt(
            Math.pow(this.x - vec.x, 2) +
            Math.pow(this.y - vec.y, 2));
        return d;
    }
   
    clone(){
        //returns a new instance of a 'vec2' object with the
        //same value
        return new vec2(this.x, this.y);
    }
    static fromAng(angle, magnitude = 1){
        //returns a vector which points in the specified angle
        //and has the specified magnitude
        return new vec2(
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude);
    }
    static fromOther(vector){
        //converts other data types that contain 'x' and 'y'
        //properties to a 'vec2' object type
        return new vec2(vector.x, vector.y);
    }
   
    toString(){
        return "vector<" + this.x + ", " + this.y + ">";
    }
}