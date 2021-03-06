var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, LitElement, property } from 'lit-element';
import * as monaco from 'monaco-editor';
let MonacoEditorElement = class MonacoEditorElement extends LitElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.language = 'cpp';
        this.readOnly = false;
        this.height = '400px';
    }
    createRenderRoot() {
        return this;
    }
    firstUpdated() {
        Object.assign(this.style, {
            display: 'block',
            height: this.height,
            width: '100%',
        });
        monaco.languages.register({ id: 'cpp' });
        this.editor = monaco.editor.create(this, {
            value: this.value,
            language: 'cpp',
            theme: 'vs',
            minimap: { enabled: false },
            readOnly: this.readOnly,
            tabCompletion: 'on',
            scrollbar: { horizontal: 'hidden' },
            automaticLayout: true,
        });
        this.model = this.editor.getModel();
        this.model.onDidChangeContent((e) => {
            this.value = this.model.getValue();
            const newMessage = new CustomEvent('editor-value-change', {
                detail: { value: this.value },
            });
            this.dispatchEvent(newMessage);
        });
        this.editor.layout();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    setValue(value) {
        this.value = value;
        this.model.setValue(value);
    }
    getValue() {
        return this.value;
    }
};
__decorate([
    property({ type: String, reflect: true })
], MonacoEditorElement.prototype, "value", void 0);
__decorate([
    property({ type: String, reflect: true })
], MonacoEditorElement.prototype, "language", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], MonacoEditorElement.prototype, "readOnly", void 0);
__decorate([
    property({ type: String, reflect: true })
], MonacoEditorElement.prototype, "height", void 0);
MonacoEditorElement = __decorate([
    customElement('p4-monaco-editor')
], MonacoEditorElement);
export { MonacoEditorElement };
