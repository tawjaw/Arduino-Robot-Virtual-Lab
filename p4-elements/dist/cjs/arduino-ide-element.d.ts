import { LitElement } from 'lit-element';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import './arduino-ide-container-element';
import './monaco-editor-element';
export declare class ArduinoIDE extends LitElement {
    status: string;
    value: string;
    language: string;
    readOnly: boolean;
    height: string;
    createRenderRoot(): this;
    render(): import("lit-element").TemplateResult;
    connectedCallback(): void;
    private statusChangeEvent;
    private valueChangeEvent;
    compiling(): void;
    on(): void;
}
