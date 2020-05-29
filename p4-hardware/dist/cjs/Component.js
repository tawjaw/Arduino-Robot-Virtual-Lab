"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
class Component {
    constructor(pin, label) {
        this.pin = pin;
        this.label = label;
        this.pinState = false;
    }
    getLabel() { return this.label; }
    getPin() { return this.pin; }
    ;
    getPinState() { return this.pinState; }
}
exports.Component = Component;
