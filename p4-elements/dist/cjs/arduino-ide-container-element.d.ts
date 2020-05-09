import { LitElement } from 'lit-element';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/editor-icons.js';
export declare class ArduinoIDEContainer extends LitElement {
    status: string;
    simulationTime: string;
    static get styles(): import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
    connectedCallback(): void;
    private handleClick;
    compiling(): void;
    on(): void;
    setSimulationTime(time: string): void;
}
