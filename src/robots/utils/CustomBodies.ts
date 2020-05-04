
import {Vertices, Body} from "matter-js";
import {commonExtend, getTranformedPoint} from "./utils"

export function createPartCircle(x: number, y: number, sides: number, radius: number, angleOffset:number, options: any) {
    options = options || {};
  
    var path = '';
    path +=  x.toFixed(3) + ' ' + y.toFixed(3) + ' '
    var offset = -Math.PI/(6*sides);
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
  

