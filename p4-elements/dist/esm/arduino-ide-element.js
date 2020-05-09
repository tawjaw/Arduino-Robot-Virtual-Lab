var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, html, LitElement, property } from 'lit-element';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import './arduino-ide-container-element';
import './monaco-editor-element';
let ArduinoIDE = class ArduinoIDE extends LitElement {
    constructor() {
        super(...arguments);
        this.status = 'off';
        this.value = '';
        this.language = 'cpp';
        this.readOnly = false;
        this.height = '400px';
    }
    createRenderRoot() {
        return this;
    }
    render() {
        return html `
      <p4-arduino-ide-container
        status=${this.status}
        @_status-change=${(msg) => {
            this.statusChangeEvent(msg);
        }}>
        <p4-monaco-editor
          height=${this.height}
          value=${this.value}
          .readOnly=${this.status === 'on' ? true : this.readOnly}
          language=${this.language}
          @editor-value-change=${(msg) => {
            this.valueChangeEvent(msg);
        }}
        ></p4-monaco-editor>
      </p4-arduino-ide-container>
    `;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    statusChangeEvent(msg) {
        const newMessage = new CustomEvent('status-change', {
            detail: msg.detail,
        });
        this.dispatchEvent(newMessage);
    }
    valueChangeEvent(msg) {
        this.value = msg.detail.value;
    }
    compiling() {
        if (this.status === 'on') {
            this.status = 'compiling';
        }
    }
    on() {
        if (this.status === 'compiling') {
            this.status = 'on';
        }
    }
};
__decorate([
    property({ type: String, reflect: true })
], ArduinoIDE.prototype, "status", void 0);
__decorate([
    property({ type: String, reflect: true })
], ArduinoIDE.prototype, "value", void 0);
__decorate([
    property({ type: String, reflect: true })
], ArduinoIDE.prototype, "language", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ArduinoIDE.prototype, "readOnly", void 0);
__decorate([
    property({ type: String, reflect: true })
], ArduinoIDE.prototype, "height", void 0);
ArduinoIDE = __decorate([
    customElement('p4-arduino-ide')
], ArduinoIDE);
export { ArduinoIDE };
/*
<link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
        crossorigin="anonymous"
      />

      <div class="cards-container">
        <div class="card-header">
          ${this.status === 'compiling'
            ? html`
                <div class="compiling-button">
                  <div class="spinner-border spinner " role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  ${this.status}
                </div>
              `
            : html``}
          ${this.status === 'on'
            ? html`<div class="time-label" id="status-label">Simulation Time 0:00:00</div>`
            : html``}

          <div class="switch">
            <input
              type="checkbox"
              @click=${this.handleClick}
              .checked=${this.status !== 'off'}
              name="toggle"
            />
            <label for="toggle"><i></i></label>
            <span class="switch-status"></span>
          </div>
        </div>
        
          <monaco-element value=${this.value} language=${this.language} theme=${this.theme}>
        </div>
      </div>

*/
/*<div class="spacer"></div>
          <div class="code-editor"></div>
          <div class="compiler-output">
            <pre id="compiler-output-text">compiler output is here</pre>
            <pre id="serial-output-text"> this is the output of the Serial</pre>
          </div>

*/
/*

 <div class="button-group">
          <div class="button active">
            <span><iron-icon icon="editor:format-indent-increase"></iron-icon></span> Music
          </div>
          <div class="button "><span class="glyphicon glyphicon-credit-card"></span> Shopping</div>
          <div class="button"><span class="glyphicon glyphicon-cutlery"></span> Restaurants</div>
          <div class="button"><span class="glyphicon glyphicon glyphicon-film"></span> Cinema</div>
        </div>
      </div>
      <style include="prism-theme-default"></style>
      <div id="parent">
        <prism-highlighter>hello</prism-highlighter>
        <div id="output"></div>
      </div>
      */
/*  */
/*<div class="spacer"></div>
          <div class="code-editor"></div>
          <div class="compiler-output">
            <pre id="compiler-output-text">compiler output is here</pre>
            <pre id="serial-output-text"> this is the output of the Serial</pre>
          </div>

*/
/*

 <div class="button-group">
          <div class="button active">
            <span><iron-icon icon="editor:format-indent-increase"></iron-icon></span> Music
          </div>
          <div class="button "><span class="glyphicon glyphicon-credit-card"></span> Shopping</div>
          <div class="button"><span class="glyphicon glyphicon-cutlery"></span> Restaurants</div>
          <div class="button"><span class="glyphicon glyphicon glyphicon-film"></span> Cinema</div>
        </div>
      </div>
      <style include="prism-theme-default"></style>
      <div id="parent">
        <prism-highlighter>hello</prism-highlighter>
        <div id="output"></div>
      </div>
      */
