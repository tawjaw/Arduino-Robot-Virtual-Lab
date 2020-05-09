export class Component {
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
