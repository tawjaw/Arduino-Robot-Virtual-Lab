"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("lit-element");
require("@polymer/iron-icon/iron-icon.js");
require("@polymer/iron-icons/iron-icons.js");
require("@polymer/iron-icons/editor-icons.js");
let ArduinoIDEContainer = class ArduinoIDEContainer extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.status = 'off';
        this.simulationTime = '0:00:000';
    }
    static get styles() {
        return lit_element_1.css `
      .switch input {
        display: inline;
        position: right;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
        filter: alpha(opacity=0);
        -moz-opacity: 0;
        opacity: 0;
        z-index: 100;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .switch {
        display: inline-flex;
        width: 180px;
        right: 1%;
        bottom: 30%;
        margin-right: 20px;
        margin-left: 0px;
        height: 55px;
        position: absolute;
        float: right;
        zoom: 0.4;
        -moz-transform: scale(0.4);
      }
      .icon-btn-switch:hover {
      }
      .switch:disabled {
        color: grey;
        background: grey;
        background-color: grey;
      }

      .switch label {
        display: block;
        width: 80%;
        height: 100%;
        position: relative;
        background: #1f2736; /*#121823*/
        background: linear-gradient(#121823, #161d2b);
        border-radius: 30px 30px 30px 30px;
        box-shadow: inset 0 3px 8px 1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 0, 0, 0.5),
          0 1px 0 rgba(255, 255, 255, 0.2);
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }
      .switch input:disabled ~ label {
        background: #292424; /*#121823*/
        background: linear-gradient(#2e3843, #3b3f44);
        border-radius: 30px 30px 30px 30px;
        box-shadow: inset 0 3px 8px 1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 0, 0, 0.5),
          0 1px 0 #292424;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }

      .switch input ~ label i {
        display: block;
        height: 51px;
        width: 51px;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 2;
        border-radius: inherit;
        background: #283446; /* Fallback */
        background: linear-gradient(#36455b, #283446);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 8px rgba(0, 0, 0, 0.3),
          0 12px 12px rgba(0, 0, 0, 0.4);
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }

      .switch input:disabled ~ label i {
        display: block;
        height: 51px;
        width: 51px;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 2;
        border-radius: inherit;
        background: pink; /* Fallback */
        background: linear-gradient(#59606b, #283446);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 8px rgba(0, 0, 0, 0.1),
          0 12px 12px #36455b;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }

      .switch label + span {
        content: '';
        display: inline-block;
        position: absolute;
        right: 0px;
        top: 17px;
        width: 18px;
        height: 18px;
        border-radius: 10px;
        background: #283446;
        background: gradient-gradient(#36455b, #283446);
        box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 10px rgba(185, 231, 253, 0), inset 0 0 8px rgba(0, 0, 0, 0.9),
          inset 0 -2px 5px rgba(0, 0, 0, 0.3), inset 0 -5px 5px rgba(0, 0, 0, 0.5);
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
        z-index: 2;
      }

      /* Toggle */
      .switch input:checked ~ .collecting-button {
      }
      .switch input:checked ~ label + span {
        content: '';
        display: inline-block;
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 10px;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
        z-index: 2;
        background: #b9f3fe;
        background: gradient-gradient(#ffffff, #77a1b9);
        box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 10px rgba(100, 231, 253, 1), inset 0 0 8px rgba(61, 157, 247, 0.8),
          inset 0 -2px 5px rgba(185, 231, 253, 0.3), inset 0 -3px 8px rgba(185, 231, 253, 0.5);
      }

      .switch input:disabled ~ label + span {
        background: red;
        background: gradient-gradient(#c70039, #900c3f);
        box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.1), 0 1px 0 #c70039, 0 0 10px #c70039,
          inset 0 0 8px #c70039, inset 0 -2px 5px #900c3f, inset 0 -3px 8px #900c3f;
      }

      .switch input:checked ~ label i {
        left: auto;
        left: 63%;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 8px rgba(0, 0, 0, 0.3),
          0 8px 8px rgba(0, 0, 0, 0.3), inset -1px 0 1px #b9f3fe;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }
      .switch input:disabled ~ label i {
        left: auto;
        left: 63%;
        color: grey;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 8px rgba(0, 0, 0, 0.3),
          0 8px 8px rgba(0, 0, 0, 0.3), inset -1px 0 1px #b9f3fe;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }

      .arduino-editor-container {
        width: 100%;
        max-width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid grey;
      }
      .arduino-editor {
      }
      .compiler-output {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 12px;
        max-height: 160px;
        overflow: auto;
      }

      .compiler-output pre {
        margin: 0;
        white-space: pre-line;
      }

      #serial-output-text {
        color: blue;
      }

      .cards-container {
        position: center;
        font-family: 'Open-Sans', sans-serif;
        color: #1d4059;
      }

      .card-header {
        background: #1d4059;
        position: relative;
        height: 4em;
      }

      .compiling-button {
        font-family: 'Share Tech Mono', monospace;
        color: #ffffff;
        text-align: center;
        position: absolute;
        left: 2%;
        color: #daf6ff;
        text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
        font-size: 20px;
        padding: 0 0 0;
        display: inline-block;
      }
      .compiling-button:hover {
        cursor: default;
      }
      .time-label {
        font-family: 'Share Tech Mono', monospace;
        color: #ffffff;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #daf6ff;
        text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
        letter-spacing: 0.1em;
        font-size: 20px;
        padding: 0 0 0;
        display: inline-block;
      }
      .spinner {
        top: 60%;
      }
      .button-group {
        margin: 100px auto;
        width: 300px;
        margin-bottom: 30px;
      }

      .button {
        background: #1d4059;
        width: 50px;
        height: 50px;
        padding: 20px;
        display: inline-block;
        margin: 0 -3px;
        color: #fff;
        font-size: 14px;
        text-align: center;

        font-family: 'Share Tech Mono', monospace;

        color: #daf6ff;
        letter-spacing: 0.1em;

        box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.9), 0px 10px 10px 0 rgba(111, 111, 111, 0.4);
      }
      .button ~ span {
        text-align: center;
        margin: 10px 0 20px 0;
        display: block;
        font-size: 32px;
        text-shadow: none;
      }
      .button:hover {
        background: #142c3e;
      }
      .button active {
        text-shadow: 0 0 10px #fff;

        color: #fff;
      }
      .button active ~ span {
        text-shadow: 0 0 20px #fff;
      }
    `;
    }
    render() {
        return lit_element_1.html `
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
        crossorigin="anonymous"
      />
      <div class="cards-container">
        <div class="card-header">
          ${this.status === 'compiling'
            ? lit_element_1.html `
                <div class="compiling-button">
                  <div class="spinner-border spinner " role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  ${this.status}
                </div>
              `
            : lit_element_1.html ``}
          ${this.status === 'on'
            ? lit_element_1.html `<div class="time-label" id="status-label">
                Simulation Time ${this.simulationTime}
              </div>`
            : lit_element_1.html ``}

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
        <div class="arduino-editor-container">
          <slot></slot>
        </div>
      </div>
    `;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    handleClick() {
        if (this.status === 'off') {
            this.status = 'compiling';
        }
        else {
            this.status = 'off';
        }
        const newMessage = new CustomEvent('_status-change', {
            detail: { status: this.status },
        });
        this.dispatchEvent(newMessage);
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
    setSimulationTime(time) {
        this.simulationTime = time;
    }
};
__decorate([
    lit_element_1.property()
], ArduinoIDEContainer.prototype, "status", void 0);
__decorate([
    lit_element_1.property({ type: String, reflect: true })
], ArduinoIDEContainer.prototype, "simulationTime", void 0);
ArduinoIDEContainer = __decorate([
    lit_element_1.customElement('p4-arduino-ide-container')
], ArduinoIDEContainer);
exports.ArduinoIDEContainer = ArduinoIDEContainer;
