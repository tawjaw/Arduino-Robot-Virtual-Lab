import { Body } from "matter-js";
export declare function commonExtend(obj: any, deep: any, options: any): any;
export declare function getTranformedPoint(position: any, angle: number, offsetx: number, offsety: number): {
    x: number;
    y: number;
};
export declare function findMinimumDistanceToObstacle(startingPosition: any, startingAngle: number, radius: number, obstacles: Array<Body>): number;
