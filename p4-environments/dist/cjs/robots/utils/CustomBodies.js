"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matter_js_1 = require("matter-js");
var utils_1 = require("./utils");
function createPartCircle(x, y, sides, radius, angleOffset, options) {
    options = options || {};
    var path = '';
    path += x.toFixed(3) + ' ' + y.toFixed(3) + ' ';
    var offset = -Math.PI / (6 * sides);
    for (var i = 0; i < sides; i += 1) {
        var angle = angleOffset + i * offset;
        var newPoint = utils_1.getTranformedPoint({ x: x, y: y }, angle, radius, 0);
        path += newPoint.x.toFixed(3) + ' ' + newPoint.y.toFixed(3) + ' ';
    }
    var polygon = {
        label: 'Polygon Body',
        position: { x: x, y: y },
        vertices: matter_js_1.Vertices.fromPath(path, undefined)
    };
    if (options.chamfer) {
        var chamfer = options.chamfer;
        polygon.vertices = matter_js_1.Vertices.chamfer(polygon.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
        delete options.chamfer;
    }
    return matter_js_1.Body.create(utils_1.commonExtend({}, polygon, options));
}
exports.createPartCircle = createPartCircle;
;
