import { LitElement } from 'lit-element';
export declare class MonacoEditorElement extends LitElement {
    value: string;
    language: string;
    readOnly: boolean;
    height: string;
    createRenderRoot(): this;
    private editor;
    private model;
    firstUpdated(): void;
    connectedCallback(): void;
    setValue(value: string): void;
    getValue(): string;
}
