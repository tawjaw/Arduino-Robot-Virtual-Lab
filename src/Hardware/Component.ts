export abstract class Component{
    
    protected label : string;
    protected pin :  number;
    protected pinState : boolean;
    

    constructor(pin : number, label: string) 
    {
        this.pin = pin;
        this.label = label;
        this.pinState = false;

    }

    getLabel() : string { return this.label;}
    getPin() : number {return this.pin};
    getPinState() : boolean { return this.pinState;}
    
    abstract update(pinState : boolean, cpuCycles : number) : void;

}