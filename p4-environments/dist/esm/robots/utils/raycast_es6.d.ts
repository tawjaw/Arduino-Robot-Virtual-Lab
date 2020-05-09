export function raycast(bodies: any, start: any, end: any, sort?: boolean): raycol[];
declare class raycol {
    constructor(body: any, point: any, normal: any, verts: any);
    body: any;
    point: any;
    normal: any;
    verts: any;
}
export {};
