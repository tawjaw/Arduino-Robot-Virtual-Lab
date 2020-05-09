export declare abstract class Component {
    protected label: string;
    protected pin: number;
    protected pinState: boolean;
    constructor(pin: number, label: string);
    getLabel(): string;
    getPin(): number;
    getPinState(): boolean;
    abstract update(pinState: boolean, cpuCycles: number): void;
    abstract reset(): void;
}
