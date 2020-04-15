// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = exports.isCEPolyfill = typeof window !== 'undefined' && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */
const reparentNodes = exports.reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.insertBefore(start, before);
        start = n;
    }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = exports.removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};
//# sourceMappingURL=dom.js.map
},{}],"../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = exports.marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = exports.nodeMarker = `<!--${marker}-->`;
const markerRegex = exports.markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = exports.boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                    if (node.hasAttributes()) {
                        const attributes = node.attributes;
                        const { length } = attributes;
                        // Per
                        // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                        // attributes are not guaranteed to be returned in document order.
                        // In particular, Edge/IE can return them out of order, so we cannot
                        // assume a correspondence between part index and attribute index.
                        let count = 0;
                        for (let i = 0; i < length; i++) {
                            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                                count++;
                            }
                        }
                        while (count-- > 0) {
                            // Get the template literal section leading up to the first
                            // expression in this attribute
                            const stringForPart = strings[partIndex];
                            // Find the attribute name
                            const name = lastAttributeNameRegex.exec(stringForPart)[2];
                            // Find the corresponding attribute
                            // All bound attributes have had a suffix added in
                            // TemplateResult#getHTML to opt out of special attribute
                            // handling. To look up the attribute value we also need to add
                            // the suffix.
                            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                            const attributeValue = node.getAttribute(attributeLookupName);
                            node.removeAttribute(attributeLookupName);
                            const statics = attributeValue.split(markerRegex);
                            this.parts.push({ type: 'attribute', index, name, strings: statics });
                            partIndex += statics.length - 1;
                        }
                    }
                    if (node.tagName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                    const data = node.data;
                    if (data.indexOf(marker) >= 0) {
                        const parent = node.parentNode;
                        const strings = data.split(markerRegex);
                        const lastIndex = strings.length - 1;
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        for (let i = 0; i < lastIndex; i++) {
                            let insert;
                            let s = strings[i];
                            if (s === '') {
                                insert = createMarker();
                            } else {
                                const match = lastAttributeNameRegex.exec(s);
                                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                    s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                                }
                                insert = document.createTextNode(s);
                            }
                            parent.insertBefore(insert, node);
                            this.parts.push({ type: 'node', index: ++index });
                        }
                        // If there's no text, we must insert a comment to mark our place.
                        // Else, we can trust it will stick around after cloning.
                        if (strings[lastIndex] === '') {
                            parent.insertBefore(createMarker(), node);
                            nodesToRemove.push(node);
                        } else {
                            node.data = strings[lastIndex];
                        }
                        // We have a part for each match found
                        partIndex += lastIndex;
                    }
                } else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                    if (node.data === marker) {
                        const parent = node.parentNode;
                        // Add a new marker node to be the startNode of the Part if any of
                        // the following are true:
                        //  * We don't have a previousSibling
                        //  * The previousSibling is already the start of a previous part
                        if (node.previousSibling === null || index === lastPartIndex) {
                            index++;
                            parent.insertBefore(createMarker(), node);
                        }
                        lastPartIndex = index;
                        this.parts.push({ type: 'node', index });
                        // If we don't have a nextSibling, keep this node so we have an end.
                        // Else, we can remove it to save future costs.
                        if (node.nextSibling === null) {
                            node.data = '';
                        } else {
                            nodesToRemove.push(node);
                            index--;
                        }
                        partIndex++;
                    } else {
                        let i = -1;
                        while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                            // Comment node has a binding marker inside, make an inactive part
                            // The binding won't work, but subsequent bindings will
                            // TODO (justinfagnani): consider whether it's even worth it to
                            // make bindings in comments work
                            this.parts.push({ type: 'node', index: -1 });
                            partIndex++;
                        }
                    }
                }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
exports.Template = Template;
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = exports.isTemplatePartActive = part => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = exports.createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex =
// eslint-disable-next-line no-control-regex
exports.lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
//# sourceMappingURL=template.js.map
},{}],"../node_modules/lit-html/lib/modify-template.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeNodesFromTemplate = removeNodesFromTemplate;
exports.insertNodeIntoTemplate = insertNodeIntoTemplate;

var _template = require('./template.js');

const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module shady-render
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
}
const countNodes = node => {
    let count = node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if ((0, _template.isTemplatePartActive)(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}
//# sourceMappingURL=modify-template.js.map
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = exports.directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};
const isDirective = exports.isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};
//# sourceMappingURL=directive.js.map
},{}],"../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = exports.noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = exports.nothing = {};
//# sourceMappingURL=part.js.map
},{}],"../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TemplateInstance = undefined;

var _dom = require('./dom.js');

var _template = require('./template.js');

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!(0, _template.isTemplatePartActive)(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            } else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (_dom.isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}
exports.TemplateInstance = TemplateInstance; //# sourceMappingURL=template-instance.js.map
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SVGTemplateResult = exports.TemplateResult = undefined;

var _dom = require('./dom.js');

var _template = require('./template.js');

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = _template.lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
            } else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
exports.TemplateResult = TemplateResult; /**
                                          * A TemplateResult for SVG fragments.
                                          *
                                          * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
                                          * SVG namespace, then modifies the template to remove the `<svg>` tag so that
                                          * clones only container the original fragment.
                                          */

class SVGTemplateResult extends TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        (0, _dom.reparentNodes)(content, svgElement.firstChild);
        return template;
    }
}
exports.SVGTemplateResult = SVGTemplateResult; //# sourceMappingURL=template-result.js.map
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isIterable = exports.isPrimitive = undefined;

var _directive = require('./directive.js');

var _dom = require('./dom.js');

var _part = require('./part.js');

var _templateInstance = require('./template-instance.js');

var _templateResult = require('./template-result.js');

var _template = require('./template.js');

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */
const isPrimitive = exports.isPrimitive = value => {
    return value === null || !(typeof value === 'object' || typeof value === 'function');
};
const isIterable = exports.isIterable = value => {
    return Array.isArray(value) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                } else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
exports.AttributeCommitter = AttributeCommitter; /**
                                                  * A Part that controls all or part of an attribute value.
                                                  */

class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!(0, _directive.isDirective)(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while ((0, _directive.isDirective)(this.value)) {
            const directive = this.value;
            this.value = _part.noChange;
            directive(this);
        }
        if (this.value === _part.noChange) {
            return;
        }
        this.committer.commit();
    }
}
exports.AttributePart = AttributePart; /**
                                        * A Part that controls a location within a Node tree. Like a Range, NodePart
                                        * has start and end locations and can set and update the Nodes between those
                                        * locations.
                                        *
                                        * NodeParts support several value types: primitives, Nodes, TemplateResults,
                                        * as well as arrays and iterables of those types.
                                        */

class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild((0, _template.createMarker)());
        this.endNode = container.appendChild((0, _template.createMarker)());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = (0, _template.createMarker)());
        part.__insert(this.endNode = (0, _template.createMarker)());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = (0, _template.createMarker)());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while ((0, _directive.isDirective)(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = _part.noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === _part.noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        } else if (value instanceof _templateResult.TemplateResult) {
            this.__commitTemplateResult(value);
        } else if (value instanceof Node) {
            this.__commitNode(value);
        } else if (isIterable(value)) {
            this.__commitIterable(value);
        } else if (value === _part.nothing) {
            this.value = _part.nothing;
            this.clear();
        } else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling && node.nodeType === 3 /* Node.TEXT_NODE */) {
                // If we only have a single text node between the markers, we can just
                // set its value, rather than replacing it.
                // TODO(justinfagnani): Can we just check if this.value is primitive?
                node.data = valueAsString;
            } else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
            this.value.update(value.values);
        } else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                } else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
exports.NodePart = NodePart; /**
                              * Implements a boolean attribute, roughly as defined in the HTML
                              * specification.
                              *
                              * If the value is truthy, then the attribute is present with a value of
                              * ''. If the value is falsey, the attribute is removed.
                              */

class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while ((0, _directive.isDirective)(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = _part.noChange;
            directive(this);
        }
        if (this.__pendingValue === _part.noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            } else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = _part.noChange;
    }
}
exports.BooleanAttributePart = BooleanAttributePart; /**
                                                      * Sets attribute values for PropertyParts, so that the value is only set once
                                                      * even if there are multiple parts for a property.
                                                      *
                                                      * If an expression controls the whole property value, then the value is simply
                                                      * assigned to the property under control. If there are string literals or
                                                      * multiple expressions, then the strings are expressions are interpolated into
                                                      * a string first.
                                                      */

class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
exports.PropertyCommitter = PropertyCommitter;
class PropertyPart extends AttributePart {}
exports.PropertyPart = PropertyPart; // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.

let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    } catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = e => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while ((0, _directive.isDirective)(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = _part.noChange;
            directive(this);
        }
        if (this.__pendingValue === _part.noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = _part.noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        } else {
            this.value.handleEvent(event);
        }
    }
}
exports.EventPart = EventPart; // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.

const getOptions = o => o && (eventOptionsSupported ? { capture: o.capture, passive: o.passive, once: o.once } : o.capture);
//# sourceMappingURL=parts.js.map
},{"./directive.js":"../node_modules/lit-html/lib/directive.js","./dom.js":"../node_modules/lit-html/lib/dom.js","./part.js":"../node_modules/lit-html/lib/part.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../node_modules/lit-html/lib/template-result.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.templateCaches = undefined;
exports.templateFactory = templateFactory;

var _template = require('./template.js');

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(_template.marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new _template.Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
} /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
const templateCaches = exports.templateCaches = new Map();
//# sourceMappingURL=template-factory.js.map
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = undefined;

var _dom = require('./dom.js');

var _parts = require('./parts.js');

var _templateFactory = require('./template-factory.js');

const parts = exports.parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */
const render = exports.render = (result, container, options) => {
  let part = parts.get(container);
  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({ templateFactory: _templateFactory.templateFactory }, options)));
    part.appendInto(container);
  }
  part.setValue(result);
  part.commit();
};
//# sourceMappingURL=render.js.map
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./parts.js":"../node_modules/lit-html/lib/parts.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js"}],"../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = undefined;

var _parts = require('./parts.js');

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new _parts.AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new _parts.NodePart(options);
    }
}
exports.DefaultTemplateProcessor = DefaultTemplateProcessor; /**
                                                              * @license
                                                              * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
                                                              * This code may only be used under the BSD style license found at
                                                              * http://polymer.github.io/LICENSE.txt
                                                              * The complete set of authors may be found at
                                                              * http://polymer.github.io/AUTHORS.txt
                                                              * The complete set of contributors may be found at
                                                              * http://polymer.github.io/CONTRIBUTORS.txt
                                                              * Code distributed by Google as part of the polymer project is also
                                                              * subject to an additional IP rights grant found at
                                                              * http://polymer.github.io/PATENTS.txt
                                                              */

const defaultTemplateProcessor = exports.defaultTemplateProcessor = new DefaultTemplateProcessor();
//# sourceMappingURL=default-template-processor.js.map
},{"./parts.js":"../node_modules/lit-html/lib/parts.js"}],"../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.svg = exports.html = exports.Template = exports.isTemplatePartActive = exports.createMarker = exports.TemplateResult = exports.SVGTemplateResult = exports.TemplateInstance = exports.templateFactory = exports.templateCaches = exports.render = exports.parts = exports.PropertyPart = exports.PropertyCommitter = exports.NodePart = exports.isPrimitive = exports.isIterable = exports.EventPart = exports.BooleanAttributePart = exports.AttributePart = exports.AttributeCommitter = exports.nothing = exports.noChange = exports.reparentNodes = exports.removeNodes = exports.isDirective = exports.directive = exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = undefined;

var _defaultTemplateProcessor = require('./lib/default-template-processor.js');

Object.defineProperty(exports, 'DefaultTemplateProcessor', {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, 'defaultTemplateProcessor', {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});

var _directive = require('./lib/directive.js');

Object.defineProperty(exports, 'directive', {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, 'isDirective', {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});

var _dom = require('./lib/dom.js');

Object.defineProperty(exports, 'removeNodes', {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, 'reparentNodes', {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});

var _part = require('./lib/part.js');

Object.defineProperty(exports, 'noChange', {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, 'nothing', {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});

var _parts = require('./lib/parts.js');

Object.defineProperty(exports, 'AttributeCommitter', {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, 'AttributePart', {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, 'BooleanAttributePart', {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, 'EventPart', {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, 'isIterable', {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, 'isPrimitive', {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, 'NodePart', {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, 'PropertyCommitter', {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, 'PropertyPart', {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});

var _render = require('./lib/render.js');

Object.defineProperty(exports, 'parts', {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, 'render', {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});

var _templateFactory = require('./lib/template-factory.js');

Object.defineProperty(exports, 'templateCaches', {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, 'templateFactory', {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});

var _templateInstance = require('./lib/template-instance.js');

Object.defineProperty(exports, 'TemplateInstance', {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});

var _templateResult = require('./lib/template-result.js');

Object.defineProperty(exports, 'SVGTemplateResult', {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, 'TemplateResult', {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});

var _template = require('./lib/template.js');

Object.defineProperty(exports, 'createMarker', {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, 'isTemplatePartActive', {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, 'Template', {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});

// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = exports.html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = exports.svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);
//# sourceMappingURL=lit-html.js.map
},{"./lib/default-template-processor.js":"../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../node_modules/lit-html/lib/dom.js","./lib/part.js":"../node_modules/lit-html/lib/part.js","./lib/parts.js":"../node_modules/lit-html/lib/parts.js","./lib/render.js":"../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/shady-render.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = exports.TemplateResult = exports.svg = exports.html = undefined;

var _litHtml = require('../lit-html.js');

Object.defineProperty(exports, 'html', {
    enumerable: true,
    get: function () {
        return _litHtml.html;
    }
});
Object.defineProperty(exports, 'svg', {
    enumerable: true,
    get: function () {
        return _litHtml.svg;
    }
});
Object.defineProperty(exports, 'TemplateResult', {
    enumerable: true,
    get: function () {
        return _litHtml.TemplateResult;
    }
});

var _dom = require('./dom.js');

var _modifyTemplate = require('./modify-template.js');

var _render = require('./render.js');

var _templateFactory = require('./template-factory.js');

var _templateInstance = require('./template-instance.js');

var _template = require('./template.js');

// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` + `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = scopeName => result => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = _templateFactory.templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        _templateFactory.templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(_template.marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new _template.Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = scopeName => {
    TEMPLATE_TYPES.forEach(type => {
        const templates = _templateFactory.templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach(template => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach(s => {
                    styles.add(s);
                });
                (0, _modifyTemplate.removeNodesFromTemplate)(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        (0, _modifyTemplate.insertNodeIntoTemplate)(template, condensedStyle, content.firstChild);
    } else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    } else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        (0, _modifyTemplate.removeNodesFromTemplate)(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render = exports.render = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = _render.parts.has(container);
    const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ && !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    (0, _render.render)(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = _render.parts.get(renderContainer);
        _render.parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof _templateInstance.TemplateInstance ? part.value.template : undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        (0, _dom.removeNodes)(container, container.firstChild);
        container.appendChild(renderContainer);
        _render.parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};
//# sourceMappingURL=shady-render.js.map
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./modify-template.js":"../node_modules/lit-html/lib/modify-template.js","./render.js":"../node_modules/lit-html/lib/render.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template.js":"../node_modules/lit-html/lib/template.js","../lit-html.js":"../node_modules/lit-html/lit-html.js"}],"../node_modules/lit-element/lib/updating-element.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = exports.defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = exports.notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this._updateState = 0;
        this._instanceProperties = undefined;
        // Initialize to an unresolved Promise so we can make sure the element has
        // connected before first update.
        this._updatePromise = new Promise(res => this._enableUpdatingResolver = res);
        /**
         * Map with keys for any properties that have changed since the last
         * update cycle with previous values.
         */
        this._changedProperties = new Map();
        /**
         * Map with keys of properties that should be reflected when updated.
         */
        this._reflectingProperties = undefined;
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, _options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this._requestUpdate(name, oldValue);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) || defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {}
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            } else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
            // tslint:disable-next-line:no-any
            ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    _requestUpdate(name, oldValue) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            const options = ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            } else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        } catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return this._updateState & STATE_UPDATE_REQUESTED;
    }
    get hasUpdated() {
        return this._updateState & STATE_HAS_UPDATED;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            } else {
                this._markUpdated();
            }
        } catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    _getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {}
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {}
}
exports.UpdatingElement = UpdatingElement;
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;
//# sourceMappingURL=updating-element.js.map
},{}],"../node_modules/lit-element/lib/decorators.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.property = property;
exports.internalProperty = internalProperty;
exports.query = query;
exports.queryAsync = queryAsync;
exports.queryAll = queryAll;
exports.eventOptions = eventOptions;
exports.queryAssignedNodes = queryAssignedNodes;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        }
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 *
 * @param tagName The name of the custom element to define.
 */
const customElement = exports.customElement = tagName => classOrDescriptor => typeof classOrDescriptor === 'function' ? legacyCustomElement(tagName, classOrDescriptor) : standardCustomElement(tagName, classOrDescriptor);
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor && !('value' in element.descriptor)) {
        return Object.assign(Object.assign({}, element), { finisher(clazz) {
                clazz.createProperty(element.key, options);
            } });
    } else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            }
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the internalProperty decorator.
 *
 * @example
 *
 *     class MyElement {
 *       @property({ type: Boolean })
 *       clicked = false;
 *     }
 *
 * @ExportDecoratedItems
 */
function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) => name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
}
/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 */
function internalProperty(options) {
    return property({ attribute: false, hasChanged: options === null || options === void 0 ? void 0 : options.hasChanged });
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 *     class MyElement {
 *       @query('#first')
 *       first;
 *
 *       render() {
 *         return html`
 *           <div id="first"></div>
 *           <div id="second"></div>
 *         `;
 *       }
 *     }
 *
 */
function query(selector) {
    return (protoOrDescriptor,
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true
        };
        return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
    };
}
// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 *     class MyElement {
 *       @queryAsync('#first')
 *       first;
 *
 *       render() {
 *         return html`
 *           <div id="first"></div>
 *           <div id="second"></div>
 *         `;
 *       }
 *     }
 *
 *     // external usage
 *     async doSomethingWithFirst() {
 *      (await aMyElement.first).doSomething();
 *     }
 */
function queryAsync(selector) {
    return (protoOrDescriptor,
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            async get() {
                await this.updateComplete;
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true
        };
        return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
    };
}
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * @example
 *
 *     class MyElement {
 *       @queryAll('div')
 *       divs;
 *
 *       render() {
 *         return html`
 *           <div id="first"></div>
 *           <div id="second"></div>
 *         `;
 *       }
 *     }
 */
function queryAll(selector) {
    return (protoOrDescriptor,
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelectorAll(selector);
            },
            enumerable: true,
            configurable: true
        };
        return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
    };
}
const legacyQuery = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardQuery = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor
});
const standardEventOptions = (options, element) => {
    return Object.assign(Object.assign({}, element), { finisher(clazz) {
            Object.assign(clazz.prototype[element.key], options);
        } });
};
const legacyEventOptions =
// tslint:disable-next-line:no-any legacy decorator
(options, proto, name) => {
    Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 *
 *     class MyElement {
 *       clicked = false;
 *
 *       render() {
 *         return html`
 *           <div @click=${this._onClick}`>
 *             <button></button>
 *           </div>
 *         `;
 *       }
 *
 *       @eventOptions({capture: true})
 *       _onClick(e) {
 *         this.clicked = true;
 *       }
 *     }
 */
function eventOptions(options) {
    // Return value typed as any to prevent TypeScript from complaining that
    // standard decorator function signature does not match TypeScript decorator
    // signature
    // TODO(kschaaf): unclear why it was only failing on this decorator and not
    // the others
    return (protoOrDescriptor, name) => name !== undefined ? legacyEventOptions(options, protoOrDescriptor, name) : standardEventOptions(options, protoOrDescriptor);
}
/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 */
function queryAssignedNodes(slotName = '', flatten = false) {
    return (protoOrDescriptor,
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                const selector = `slot${slotName ? `[name=${slotName}]` : ''}`;
                const slot = this.renderRoot.querySelector(selector);
                return slot && slot.assignedNodes({ flatten });
            },
            enumerable: true,
            configurable: true
        };
        return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
    };
}
//# sourceMappingURL=decorators.js.map
},{}],"../node_modules/lit-element/lib/css-tag.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = exports.supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            } else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
exports.CSSResult = CSSResult; /**
                                * Wrap a value for interpolation in a css tagged template literal.
                                *
                                * This is unsafe because untrusted CSS text can be used to phone home
                                * or exfiltrate data to an attacker controlled site. Take care to only use
                                * this with trusted input.
                                */

const unsafeCSS = exports.unsafeCSS = value => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = value => {
    if (value instanceof CSSResult) {
        return value.cssText;
    } else if (typeof value === 'number') {
        return value;
    } else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = exports.css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};
//# sourceMappingURL=css-tag.js.map
},{}],"../node_modules/lit-element/lit-element.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LitElement = exports.SVGTemplateResult = exports.TemplateResult = exports.svg = exports.html = undefined;

var _updatingElement = require('./lib/updating-element.js');

Object.keys(_updatingElement).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function () {
            return _updatingElement[key];
        }
    });
});

var _decorators = require('./lib/decorators.js');

Object.keys(_decorators).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function () {
            return _decorators[key];
        }
    });
});

var _litHtml = require('lit-html/lit-html.js');

Object.defineProperty(exports, 'html', {
    enumerable: true,
    get: function () {
        return _litHtml.html;
    }
});
Object.defineProperty(exports, 'svg', {
    enumerable: true,
    get: function () {
        return _litHtml.svg;
    }
});
Object.defineProperty(exports, 'TemplateResult', {
    enumerable: true,
    get: function () {
        return _litHtml.TemplateResult;
    }
});
Object.defineProperty(exports, 'SVGTemplateResult', {
    enumerable: true,
    get: function () {
        return _litHtml.SVGTemplateResult;
    }
});

var _cssTag = require('./lib/css-tag.js');

Object.keys(_cssTag).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function () {
            return _cssTag[key];
        }
    });
});

var _shadyRender = require('lit-html/lib/shady-render.js');

// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.3.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
class LitElement extends _updatingElement.UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (userStyles === undefined) {
            this._styles = [];
        } else if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) =>
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach(v => styles.unshift(v));
            this._styles = styles;
        } else {
            this._styles = [userStyles];
        }
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot = this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it.
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
        } else if (_cssTag.supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
        } else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor.render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach(s => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */
    render() {
        return renderNotImplemented;
    }
}
exports.LitElement = LitElement; /**
                                  * Ensure this class is marked as `finalized` as an optimization ensuring
                                  * it will not needlessly try to `finalize`.
                                  *
                                  * Note this property name is a string to prevent breaking Closure JS Compiler
                                  * optimizations. See updating-element.ts for more information.
                                  */

LitElement['finalized'] = true;
/**
 * Render method used to render the value to the element's DOM.
 * @param result The value to render.
 * @param container Node into which to render.
 * @param options Element name.
 * @nocollapse
 */
LitElement.render = _shadyRender.render;
//# sourceMappingURL=lit-element.js.map
},{"lit-html/lib/shady-render.js":"../node_modules/lit-html/lib/shady-render.js","./lib/updating-element.js":"../node_modules/lit-element/lib/updating-element.js","./lib/decorators.js":"../node_modules/lit-element/lib/decorators.js","lit-html/lit-html.js":"../node_modules/lit-html/lit-html.js","./lib/css-tag.js":"../node_modules/lit-element/lib/css-tag.js"}],"../node_modules/@wokwi/elements/dist/esm/led-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEDElement = undefined;

var _litElement = require("lit-element");

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const lightColors = {
  red: '#ff8080',
  green: '#80ff80',
  blue: '#8080ff',
  yellow: '#ffff80',
  orange: '#ffcf80',
  white: '#ffffff'
};
let LEDElement = class LEDElement extends _litElement.LitElement {
  constructor() {
    super(...arguments);
    this.value = false;
    this.brightness = 1.0;
    this.color = 'red';
    this.lightColor = null;
    this.label = '';
  }
  static get styles() {
    return _litElement.css`
      :host {
        display: inline-block;
      }

      .led-container {
        display: flex;
        flex-direction: column;
        width: 40px;
      }

      .led-label {
        font-size: 10px;
        text-align: center;
        color: gray;
        position: relative;
        line-height: 1;
        top: -8px;
      }
    `;
  }
  render() {
    const { color, lightColor } = this;
    const lightColorActual = lightColor || lightColors[color] || '#ff8080';
    const opacity = this.brightness ? 0.3 + this.brightness * 0.7 : 0;
    const lightOn = this.value && this.brightness > Number.EPSILON;
    return _litElement.html`
      <div class="led-container">
        <svg
          width="40"
          height="50"
          version="1.2"
          viewBox="-10 -5 35.456 39.618"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="light1" x="-0.8" y="-0.8" height="2.2" width="2.8">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="light2" x="-0.8" y="-0.8" height="2.2" width="2.8">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <rect x="3.451" y="19.379" width="2.1514" height="9.8273" fill="#8c8c8c" />
          <path
            d="m12.608 29.618c0-1.1736-0.86844-2.5132-1.8916-3.4024-0.41616-0.3672-1.1995-1.0015-1.1995-1.4249v-5.4706h-2.1614v5.7802c0 1.0584 0.94752 1.8785 1.9462 2.7482 0.44424 0.37584 1.3486 1.2496 1.3486 1.7694"
            fill="#8c8c8c"
          />
          <path
            d="m14.173 13.001v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
            opacity=".3"
          />
          <path
            d="m14.173 13.001v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
            fill="#e6e6e6"
            opacity=".5"
          />
          <path
            d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v4.6296c1.4738 1.6517 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586l-4e-5 -1.5235c-7e-4 -1.1419-0.4744-2.2032-1.283-3.1054z"
            fill="#d1d1d1"
            opacity=".9"
          />
          <g>
            <path
              d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v4.6296c1.4738 1.6517 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586l-4e-5 -1.5235c-7e-4 -1.1419-0.4744-2.2032-1.283-3.1054z"
              opacity=".7"
            />
            <path
              d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v3.1054c1.4738 1.6502 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586-7.4e-4 -1.1412-0.47444-2.2025-1.283-3.1047z"
              opacity=".25"
            />
            <ellipse cx="7.0877" cy="16.106" rx="7.087" ry="4.9608" opacity=".25" />
          </g>
          <polygon
            points="2.2032 16.107 3.1961 16.107 3.1961 13.095 6.0156 13.095 10.012 8.8049 3.407 8.8049 2.2032 9.648"
            fill="#666666"
          />
          <polygon
            points="11.215 9.0338 7.4117 13.095 11.06 13.095 11.06 16.107 11.974 16.107 11.974 8.5241 10.778 8.5241"
            fill="#666666"
          />
          <path
            d="m14.173 13.001v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
            fill="${color}"
            opacity=".65"
          />
          <g fill="#ffffff">
            <path
              d="m10.388 3.7541 1.4364-0.2736c-0.84168-1.1318-2.0822-1.9577-3.5417-2.2385l0.25416 1.0807c0.76388 0.27072 1.4068 0.78048 1.8511 1.4314z"
              opacity=".5"
            />
            <path
              d="m0.76824 19.926v1.5199c0.64872 0.5292 1.4335 0.97632 2.3076 1.3169v-1.525c-0.8784-0.33624-1.6567-0.78194-2.3076-1.3118z"
              opacity=".5"
            />
            <path
              d="m11.073 20.21c-0.2556 0.1224-0.52992 0.22968-0.80568 0.32976-0.05832 0.01944-0.11736 0.04032-0.17784 0.05832-0.56376 0.17928-1.1614 0.31896-1.795 0.39456-0.07488 0.0094-0.1512 0.01872-0.22464 0.01944-0.3204 0.03024-0.64368 0.05832-0.97056 0.05832-0.14832 0-0.30744-0.01512-0.4716-0.02376-1.2002-0.05688-2.3306-0.31464-3.2976-0.73944l-2e-5 -8.3895v-4.8254c0-1.471 0.84816-2.7295 2.0736-3.3494l-0.02232-0.05328-1.2478-1.512c-1.6697 1.003-2.79 2.8224-2.79 4.9118v11.905c-0.04968-0.04968-0.30816-0.30888-0.48024-0.52992l-0.30744 0.6876c1.4011 1.4818 3.8088 2.4617 6.5426 2.4617 1.6798 0 3.2371-0.37368 4.5115-1.0022l-0.52704-0.40896-0.01006 0.0072z"
              opacity=".5"
            />
          </g>
          <g class="light" style="display: ${lightOn ? '' : 'none'}">
            <ellipse
              cx="8"
              cy="10"
              rx="10"
              ry="10"
              fill="${lightColorActual}"
              filter="url(#light2)"
              style="opacity: ${opacity}"
            ></ellipse>
            <ellipse cx="8" cy="10" rx="2" ry="2" fill="white" filter="url(#light1)"></ellipse>
            <ellipse
              cx="8"
              cy="10"
              rx="3"
              ry="3"
              fill="white"
              filter="url(#light1)"
              style="opacity: ${opacity}"
            ></ellipse>
          </g>
        </svg>
        <span class="led-label">${this.label}</span>
      </div>
    `;
  }
};
__decorate([(0, _litElement.property)()], LEDElement.prototype, "value", void 0);
__decorate([(0, _litElement.property)()], LEDElement.prototype, "brightness", void 0);
__decorate([(0, _litElement.property)()], LEDElement.prototype, "color", void 0);
__decorate([(0, _litElement.property)()], LEDElement.prototype, "lightColor", void 0);
__decorate([(0, _litElement.property)()], LEDElement.prototype, "label", void 0);
exports.LEDElement = LEDElement = __decorate([(0, _litElement.customElement)('wokwi-led')], LEDElement);
exports.LEDElement = LEDElement;
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/@wokwi/elements/dist/esm/pushbutton-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PushbuttonElement = undefined;

var _litElement = require("lit-element");

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const SPACE_KEY = 32;
let PushbuttonElement = class PushbuttonElement extends _litElement.LitElement {
  constructor() {
    super(...arguments);
    this.color = 'red';
    this.pressed = false;
  }
  static get styles() {
    return _litElement.css`
      button {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        text-decoration: none;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      button:active .button-circle {
        fill: url(#grad-down);
      }

      .clickable-element {
        cursor: pointer;
      }
    `;
  }
  render() {
    const { color } = this;
    return _litElement.html`
      <button
        aria-label="${color} pushbutton"
        @mousedown=${this.down}
        @mouseup=${this.up}
        @touchstart=${this.down}
        @touchend=${this.up}
        @keydown=${e => e.keyCode === SPACE_KEY && this.down()}
        @keyup=${e => e.keyCode === SPACE_KEY && this.up()}
      >
        <svg
          width="18mm"
          height="12mm"
          version="1.1"
          viewBox="-3 0 18 12"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <linearGradient id="grad-up" x1="0" x2="1" y1="0" y2="1">
              <stop stop-color="#ffffff" offset="0" />
              <stop stop-color="${color}" offset="0.3" />
              <stop stop-color="${color}" offset="0.5" />
              <stop offset="1" />
            </linearGradient>
            <linearGradient
              id="grad-down"
              xlink:href="#grad-up"
              gradientTransform="rotate(180,0.5,0.5)"
            ></linearGradient>
          </defs>
          <rect x="0" y="0" width="12" height="12" rx=".44" ry=".44" fill="#464646" />
          <rect x=".75" y=".75" width="10.5" height="10.5" rx=".211" ry=".211" fill="#eaeaea" />
          <g fill="#1b1b1">
            <circle cx="1.767" cy="1.7916" r=".37" />
            <circle cx="10.161" cy="1.7916" r=".37" />
            <circle cx="10.161" cy="10.197" r=".37" />
            <circle cx="1.767" cy="10.197" r=".37" />
          </g>
          <g fill="#eaeaea">
            <path
              d="m-0.3538 1.4672c-0.058299 0-0.10523 0.0469-0.10523 0.10522v0.38698h-2.1504c-0.1166 0-0.21045 0.0938-0.21045 0.21045v0.50721c0 0.1166 0.093855 0.21045 0.21045 0.21045h2.1504v0.40101c0 0.0583 0.046928 0.10528 0.10523 0.10528h0.35723v-1.9266z"
            />
            <path
              d="m-0.35376 8.6067c-0.058299 0-0.10523 0.0469-0.10523 0.10523v0.38697h-2.1504c-0.1166 0-0.21045 0.0939-0.21045 0.21045v0.50721c0 0.1166 0.093855 0.21046 0.21045 0.21046h2.1504v0.401c0 0.0583 0.046928 0.10528 0.10523 0.10528h0.35723v-1.9266z"
            />
            <path
              d="m12.354 1.4672c0.0583 0 0.10522 0.0469 0.10523 0.10522v0.38698h2.1504c0.1166 0 0.21045 0.0938 0.21045 0.21045v0.50721c0 0.1166-0.09385 0.21045-0.21045 0.21045h-2.1504v0.40101c0 0.0583-0.04693 0.10528-0.10523 0.10528h-0.35723v-1.9266z"
            />
            <path
              d="m12.354 8.6067c0.0583 0 0.10523 0.0469 0.10523 0.10522v0.38698h2.1504c0.1166 0 0.21045 0.0938 0.21045 0.21045v0.50721c0 0.1166-0.09386 0.21045-0.21045 0.21045h-2.1504v0.40101c0 0.0583-0.04693 0.10528-0.10523 0.10528h-0.35723v-1.9266z"
            />
          </g>
          <g class="clickable-element">
            <circle class="button-circle" cx="6" cy="6" r="3.822" fill="url(#grad-up)" />
            <circle
              cx="6"
              cy="6"
              r="2.9"
              fill="${color}"
              stroke="#2f2f2f"
              stroke-opacity=".47"
              stroke-width=".08"
            />
          </g>
        </svg>
      </button>
    `;
  }
  down() {
    if (!this.pressed) {
      this.pressed = true;
      this.dispatchEvent(new Event('button-press'));
    }
  }
  up() {
    if (this.pressed) {
      this.pressed = false;
      this.dispatchEvent(new Event('button-release'));
    }
  }
};
__decorate([(0, _litElement.property)()], PushbuttonElement.prototype, "color", void 0);
__decorate([(0, _litElement.property)()], PushbuttonElement.prototype, "pressed", void 0);
exports.PushbuttonElement = PushbuttonElement = __decorate([(0, _litElement.customElement)('wokwi-pushbutton')], PushbuttonElement);
exports.PushbuttonElement = PushbuttonElement;
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/@wokwi/elements/dist/esm/resistor-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResistorElement = undefined;

var _litElement = require("lit-element");

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const bandColors = {
    [-2]: 'silver',
    [-1]: '#c4a000',
    0: 'black',
    1: 'brown',
    2: 'red',
    3: 'orange',
    4: 'yellow',
    5: 'green',
    6: 'blue',
    7: 'violet',
    8: 'gray',
    9: 'white'
};
let ResistorElement = class ResistorElement extends _litElement.LitElement {
    constructor() {
        super(...arguments);
        this.value = '1000';
    }
    breakValue(value) {
        const exponent = value >= 1e10 ? 9 : value >= 1e9 ? 8 : value >= 1e8 ? 7 : value >= 1e7 ? 6 : value >= 1e6 ? 5 : value >= 1e5 ? 4 : value >= 1e4 ? 3 : value >= 1e3 ? 2 : value >= 1e2 ? 1 : value >= 1e1 ? 0 : value >= 1 ? -1 : -2;
        const base = Math.round(value / 10 ** exponent);
        if (value === 0) {
            return [0, 0];
        }
        if (exponent < 0 && base % 10 === 0) {
            return [base / 10, exponent + 1];
        }
        return [Math.round(base % 100), exponent];
    }
    render() {
        const { value } = this;
        const numValue = parseFloat(value);
        const [base, exponent] = this.breakValue(numValue);
        const band1Color = bandColors[Math.floor(base / 10)];
        const band2Color = bandColors[base % 10];
        const band3Color = bandColors[exponent];
        return _litElement.html`
      <svg
        width="15.645mm"
        height="3mm"
        version="1.1"
        viewBox="0 0 15.645 3"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient
            id="a"
            x2="0"
            y1="22.332"
            y2="38.348"
            gradientTransform="matrix(.14479 0 0 .14479 -23.155 -4.0573)"
            gradientUnits="userSpaceOnUse"
            spreadMethod="reflect"
          >
            <stop stop-color="#323232" offset="0" />
            <stop stop-color="#fff" stop-opacity=".42268" offset="1" />
          </linearGradient>
        </defs>
        <rect y="1.1759" width="15.645" height=".63826" fill="#eaeaea" />
        <g stroke-width=".14479">
          <path
            d="m4.6918 0c-1.0586 0-1.9185 0.67468-1.9185 1.5022 0 0.82756 0.85995 1.4978 1.9185 1.4978 0.4241 0 0.81356-0.11167 1.1312-0.29411h4.0949c0.31802 0.18313 0.71075 0.29411 1.1357 0.29411 1.0586 0 1.9185-0.67015 1.9185-1.4978 0-0.8276-0.85995-1.5022-1.9185-1.5022-0.42499 0-0.81773 0.11098-1.1357 0.29411h-4.0949c-0.31765-0.18244-0.7071-0.29411-1.1312-0.29411z"
            fill="#d5b597"
          />
          <path
            d="m4.6918 0c-1.0586 0-1.9185 0.67468-1.9185 1.5022 0 0.82756 0.85995 1.4978 1.9185 1.4978 0.4241 0 0.81356-0.11167 1.1312-0.29411h4.0949c0.31802 0.18313 0.71075 0.29411 1.1357 0.29411 1.0586 0 1.9185-0.67015 1.9185-1.4978 0-0.8276-0.85995-1.5022-1.9185-1.5022-0.42499 0-0.81773 0.11098-1.1357 0.29411h-4.0949c-0.31765-0.18244-0.7071-0.29411-1.1312-0.29411z"
            fill="url(#a)"
            opacity=".44886"
          />
          <path
            d="m4.6917 0c-0.10922 0-0.21558 0.00884-0.31985 0.022624v2.955c0.10426 0.013705 0.21063 0.02234 0.31985 0.02234 0.15603 0 0.3074-0.015363 0.4522-0.043551v-2.9129c-0.1448-0.028193-0.29617-0.043551-0.4522-0.043552z"
            fill="${band1Color}"
          />
          <path d="m6.4482 0.29411v2.4117h0.77205v-2.4117z" fill="${band2Color}" />
          <path d="m8.5245 0.29411v2.4117h0.77205v-2.4117z" fill="${band3Color}" />
          <path
            d="m11.054 0c-0.15608 0-0.30749 0.015253-0.45277 0.043268v2.9134c0.14527 0.028012 0.29669 0.043268 0.45277 0.043268 0.10912 0 0.21539-0.00867 0.31957-0.02234v-2.955c-0.10418-0.013767-0.21044-0.022624-0.31957-0.022624z"
            fill="#c4a000"
          />
        </g>
      </svg>
    `;
    }
};
__decorate([(0, _litElement.property)()], ResistorElement.prototype, "value", void 0);
exports.ResistorElement = ResistorElement = __decorate([(0, _litElement.customElement)('wokwi-resistor')], ResistorElement);
exports.ResistorElement = ResistorElement;
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/@wokwi/elements/dist/esm/7segment-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SevenSegmentElement = undefined;

var _litElement = require("lit-element");

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let SevenSegmentElement = class SevenSegmentElement extends _litElement.LitElement {
    constructor() {
        super(...arguments);
        this.color = 'red';
        this.values = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    static get styles() {
        return _litElement.css`
      polygon {
        transform: scale(0.9);
        transform-origin: 50% 50%;
        transform-box: fill-box;
      }
    `;
    }
    render() {
        const { color, values } = this;
        const fill = index => values[index] ? color : '#ddd';
        return _litElement.html`
      <svg
        width="12mm"
        height="18.5mm"
        version="1.1"
        viewBox="0 0 12 18.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="skewX(-8) translate(2, 0)">
          <polygon points="2 0 8 0 9 1 8 2 2 2 1 1" fill="${fill(0)}" />
          <polygon points="10 2 10 8 9 9 8 8 8 2 9 1" fill="${fill(1)}" />
          <polygon points="10 10 10 16 9 17 8 16 8 10 9 9" fill="${fill(2)}" />
          <polygon points="8 18 2 18 1 17 2 16 8 16 9 17" fill="${fill(3)}" />
          <polygon points="0 16 0 10 1 9 2 10 2 16 1 17" fill="${fill(4)}" />
          <polygon points="0 8 0 2 1 1 2 2 2 8 1 9" fill=${fill(5)} />
          <polygon points="2 8 8 8 9 9 8 10 2 10 1 9" fill=${fill(6)} />
        </g>
        <circle cx="11" cy="17" r="1.1" fill="${fill(7)}" />
      </svg>
    `;
    }
};
__decorate([(0, _litElement.property)()], SevenSegmentElement.prototype, "color", void 0);
__decorate([(0, _litElement.property)({ type: Array })], SevenSegmentElement.prototype, "values", void 0);
exports.SevenSegmentElement = SevenSegmentElement = __decorate([(0, _litElement.customElement)('wokwi-7segment')], SevenSegmentElement);
exports.SevenSegmentElement = SevenSegmentElement;
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/@wokwi/elements/dist/esm/lcd1602-font-a00.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Font rasterized from datasheet: https://www.sparkfun.com/datasheets/LCD/HD44780.pdf
// prettier-ignore
const fontA00 = exports.fontA00 = new Uint8Array([
/* 0 */0, 0, 0, 0, 0, 0, 0, 0,
/* 1 */0, 0, 0, 0, 0, 0, 0, 0,
/* 2 */0, 0, 0, 0, 0, 0, 0, 0,
/* 3 */0, 0, 0, 0, 0, 0, 0, 0,
/* 4 */0, 0, 0, 0, 0, 0, 0, 0,
/* 5 */0, 0, 0, 0, 0, 0, 0, 0,
/* 6 */0, 0, 0, 0, 0, 0, 0, 0,
/* 7 */0, 0, 0, 0, 0, 0, 0, 0,
/* 8 */0, 0, 0, 0, 0, 0, 0, 0,
/* 9 */0, 0, 0, 0, 0, 0, 0, 0,
/* 10 */0, 0, 0, 0, 0, 0, 0, 0,
/* 11 */0, 0, 0, 0, 0, 0, 0, 0,
/* 12 */0, 0, 0, 0, 0, 0, 0, 0,
/* 13 */0, 0, 0, 0, 0, 0, 0, 0,
/* 14 */0, 0, 0, 0, 0, 0, 0, 0,
/* 15 */0, 0, 0, 0, 0, 0, 0, 0,
/* 16 */0, 0, 0, 0, 0, 0, 0, 0,
/* 17 */0, 0, 0, 0, 0, 0, 0, 0,
/* 18 */0, 0, 0, 0, 0, 0, 0, 0,
/* 19 */0, 0, 0, 0, 0, 0, 0, 0,
/* 20 */0, 0, 0, 0, 0, 0, 0, 0,
/* 21 */0, 0, 0, 0, 0, 0, 0, 0,
/* 22 */0, 0, 0, 0, 0, 0, 0, 0,
/* 23 */0, 0, 0, 0, 0, 0, 0, 0,
/* 24 */0, 0, 0, 0, 0, 0, 0, 0,
/* 25 */0, 0, 0, 0, 0, 0, 0, 0,
/* 26 */0, 0, 0, 0, 0, 0, 0, 0,
/* 27 */0, 0, 0, 0, 0, 0, 0, 0,
/* 28 */0, 0, 0, 0, 0, 0, 0, 0,
/* 29 */0, 0, 0, 0, 0, 0, 0, 0,
/* 30 */0, 0, 0, 0, 0, 0, 0, 0,
/* 31 */0, 0, 0, 0, 0, 0, 0, 0,
/* 32 */0, 0, 0, 0, 0, 0, 0, 0,
/* 33 */4, 4, 4, 4, 0, 0, 4, 0,
/* 34 */10, 10, 10, 0, 0, 0, 0, 0,
/* 35 */10, 10, 31, 10, 31, 10, 10, 0,
/* 36 */4, 30, 5, 14, 20, 15, 4, 0,
/* 37 */3, 19, 8, 4, 2, 25, 24, 0,
/* 38 */6, 9, 5, 2, 21, 9, 22, 0,
/* 39 */6, 4, 2, 0, 0, 0, 0, 0,
/* 40 */8, 4, 2, 2, 2, 4, 8, 0,
/* 41 */2, 4, 8, 8, 8, 4, 2, 0,
/* 42 */0, 4, 21, 14, 21, 4, 0, 0,
/* 43 */0, 4, 4, 31, 4, 4, 0, 0,
/* 44 */0, 0, 0, 0, 6, 4, 2, 0,
/* 45 */0, 0, 0, 31, 0, 0, 0, 0,
/* 46 */0, 0, 0, 0, 0, 6, 6, 0,
/* 47 */0, 16, 8, 4, 2, 1, 0, 0,
/* 48 */14, 17, 25, 21, 19, 17, 14, 0,
/* 49 */4, 6, 4, 4, 4, 4, 14, 0,
/* 50 */14, 17, 16, 8, 4, 2, 31, 0,
/* 51 */31, 8, 4, 8, 16, 17, 14, 0,
/* 52 */8, 12, 10, 9, 31, 8, 8, 0,
/* 53 */31, 1, 15, 16, 16, 17, 14, 0,
/* 54 */12, 2, 1, 15, 17, 17, 14, 0,
/* 55 */31, 17, 16, 8, 4, 4, 4, 0,
/* 56 */14, 17, 17, 14, 17, 17, 14, 0,
/* 57 */14, 17, 17, 30, 16, 8, 6, 0,
/* 58 */0, 6, 6, 0, 6, 6, 0, 0,
/* 59 */0, 6, 6, 0, 6, 4, 2, 0,
/* 60 */8, 4, 2, 1, 2, 4, 8, 0,
/* 61 */0, 0, 31, 0, 31, 0, 0, 0,
/* 62 */2, 4, 8, 16, 8, 4, 2, 0,
/* 63 */14, 17, 16, 8, 4, 0, 4, 0,
/* 64 */14, 17, 16, 22, 21, 21, 14, 0,
/* 65 */14, 17, 17, 17, 31, 17, 17, 0,
/* 66 */15, 17, 17, 15, 17, 17, 15, 0,
/* 67 */14, 17, 1, 1, 1, 17, 14, 0,
/* 68 */7, 9, 17, 17, 17, 9, 7, 0,
/* 69 */31, 1, 1, 15, 1, 1, 31, 0,
/* 70 */31, 1, 1, 15, 1, 1, 1, 0,
/* 71 */14, 17, 1, 29, 17, 17, 30, 0,
/* 72 */17, 17, 17, 31, 17, 17, 17, 0,
/* 73 */14, 4, 4, 4, 4, 4, 14, 0,
/* 74 */28, 8, 8, 8, 8, 9, 6, 0,
/* 75 */17, 9, 5, 3, 5, 9, 17, 0,
/* 76 */1, 1, 1, 1, 1, 1, 31, 0,
/* 77 */17, 27, 21, 21, 17, 17, 17, 0,
/* 78 */17, 17, 19, 21, 25, 17, 17, 0,
/* 79 */14, 17, 17, 17, 17, 17, 14, 0,
/* 80 */15, 17, 17, 15, 1, 1, 1, 0,
/* 81 */14, 17, 17, 17, 21, 9, 22, 0,
/* 82 */15, 17, 17, 15, 5, 9, 17, 0,
/* 83 */30, 1, 1, 14, 16, 16, 15, 0,
/* 84 */31, 4, 4, 4, 4, 4, 4, 0,
/* 85 */17, 17, 17, 17, 17, 17, 14, 0,
/* 86 */17, 17, 17, 17, 17, 10, 4, 0,
/* 87 */17, 17, 17, 21, 21, 21, 10, 0,
/* 88 */17, 17, 10, 4, 10, 17, 17, 0,
/* 89 */17, 17, 17, 10, 4, 4, 4, 0,
/* 90 */31, 16, 8, 4, 2, 1, 31, 0,
/* 91 */7, 1, 1, 1, 1, 1, 7, 0,
/* 92 */17, 10, 31, 4, 31, 4, 4, 0,
/* 93 */14, 8, 8, 8, 8, 8, 14, 0,
/* 94 */4, 10, 17, 0, 0, 0, 0, 0,
/* 95 */0, 0, 0, 0, 0, 0, 31, 0,
/* 96 */2, 4, 8, 0, 0, 0, 0, 0,
/* 97 */0, 0, 14, 16, 30, 17, 30, 0,
/* 98 */1, 1, 13, 19, 17, 17, 15, 0,
/* 99 */0, 0, 14, 1, 1, 17, 14, 0,
/* 100 */16, 16, 22, 25, 17, 17, 30, 0,
/* 101 */0, 0, 14, 17, 31, 1, 14, 0,
/* 102 */12, 18, 2, 7, 2, 2, 2, 0,
/* 103 */0, 30, 17, 17, 30, 16, 14, 0,
/* 104 */1, 1, 13, 19, 17, 17, 17, 0,
/* 105 */4, 0, 6, 4, 4, 4, 14, 0,
/* 106 */8, 0, 12, 8, 8, 9, 6, 0,
/* 107 */1, 1, 9, 5, 3, 5, 9, 0,
/* 108 */6, 4, 4, 4, 4, 4, 14, 0,
/* 109 */0, 0, 11, 21, 21, 17, 17, 0,
/* 110 */0, 0, 13, 19, 17, 17, 17, 0,
/* 111 */0, 0, 14, 17, 17, 17, 14, 0,
/* 112 */0, 0, 15, 17, 15, 1, 1, 0,
/* 113 */0, 0, 22, 25, 30, 16, 16, 0,
/* 114 */0, 0, 13, 19, 1, 1, 1, 0,
/* 115 */0, 0, 14, 1, 14, 16, 15, 0,
/* 116 */2, 2, 7, 2, 2, 18, 12, 0,
/* 117 */0, 0, 17, 17, 17, 25, 22, 0,
/* 118 */0, 0, 17, 17, 17, 10, 4, 0,
/* 119 */0, 0, 17, 21, 21, 21, 10, 0,
/* 120 */0, 0, 17, 10, 4, 10, 17, 0,
/* 121 */0, 0, 17, 17, 30, 16, 14, 0,
/* 122 */0, 0, 31, 8, 4, 2, 31, 0,
/* 123 */8, 4, 4, 2, 4, 4, 8, 0,
/* 124 */4, 4, 4, 4, 4, 4, 4, 0,
/* 125 */2, 4, 4, 8, 4, 4, 2, 0,
/* 126 */0, 4, 8, 31, 8, 4, 0, 0,
/* 127 */0, 4, 2, 31, 2, 4, 0, 0,
/* 128 */0, 0, 0, 0, 0, 0, 0, 0,
/* 129 */0, 0, 0, 0, 0, 0, 0, 0,
/* 130 */0, 0, 0, 0, 0, 0, 0, 0,
/* 131 */0, 0, 0, 0, 0, 0, 0, 0,
/* 132 */0, 0, 0, 0, 0, 0, 0, 0,
/* 133 */0, 0, 0, 0, 0, 0, 0, 0,
/* 134 */0, 0, 0, 0, 0, 0, 0, 0,
/* 135 */0, 0, 0, 0, 0, 0, 0, 0,
/* 136 */0, 0, 0, 0, 0, 0, 0, 0,
/* 137 */0, 0, 0, 0, 0, 0, 0, 0,
/* 138 */0, 0, 0, 0, 0, 0, 0, 0,
/* 139 */0, 0, 0, 0, 0, 0, 0, 0,
/* 140 */0, 0, 0, 0, 0, 0, 0, 0,
/* 141 */0, 0, 0, 0, 0, 0, 0, 0,
/* 142 */0, 0, 0, 0, 0, 0, 0, 0,
/* 143 */0, 0, 0, 0, 0, 0, 0, 0,
/* 144 */0, 0, 0, 0, 0, 0, 0, 0,
/* 145 */0, 0, 0, 0, 0, 0, 0, 0,
/* 146 */0, 0, 0, 0, 0, 0, 0, 0,
/* 147 */0, 0, 0, 0, 0, 0, 0, 0,
/* 148 */0, 0, 0, 0, 0, 0, 0, 0,
/* 149 */0, 0, 0, 0, 0, 0, 0, 0,
/* 150 */0, 0, 0, 0, 0, 0, 0, 0,
/* 151 */0, 0, 0, 0, 0, 0, 0, 0,
/* 152 */0, 0, 0, 0, 0, 0, 0, 0,
/* 153 */0, 0, 0, 0, 0, 0, 0, 0,
/* 154 */0, 0, 0, 0, 0, 0, 0, 0,
/* 155 */0, 0, 0, 0, 0, 0, 0, 0,
/* 156 */0, 0, 0, 0, 0, 0, 0, 0,
/* 157 */0, 0, 0, 0, 0, 0, 0, 0,
/* 158 */0, 0, 0, 0, 0, 0, 0, 0,
/* 159 */0, 0, 0, 0, 0, 0, 0, 0,
/* 160 */0, 0, 0, 0, 0, 0, 0, 0,
/* 161 */0, 0, 0, 0, 7, 5, 7, 0,
/* 162 */28, 4, 4, 4, 0, 0, 0, 0,
/* 163 */0, 0, 0, 4, 4, 4, 7, 0,
/* 164 */0, 0, 0, 0, 1, 2, 4, 0,
/* 165 */0, 0, 0, 6, 6, 0, 0, 0,
/* 166 */0, 31, 16, 31, 16, 8, 4, 0,
/* 167 */0, 0, 31, 16, 12, 4, 2, 0,
/* 168 */0, 0, 8, 4, 6, 5, 4, 0,
/* 169 */0, 0, 4, 31, 17, 16, 12, 0,
/* 170 */0, 0, 31, 4, 4, 4, 31, 0,
/* 171 */0, 0, 8, 31, 12, 10, 9, 0,
/* 172 */0, 0, 2, 31, 18, 10, 2, 0,
/* 173 */0, 0, 0, 14, 8, 8, 31, 0,
/* 174 */0, 0, 15, 8, 15, 8, 15, 0,
/* 175 */0, 0, 0, 21, 21, 16, 12, 0,
/* 176 */0, 0, 0, 31, 0, 0, 0, 0,
/* 177 */31, 16, 20, 12, 4, 4, 2, 0,
/* 178 */16, 8, 4, 6, 5, 4, 4, 0,
/* 179 */4, 31, 17, 17, 16, 8, 4, 0,
/* 180 */0, 31, 4, 4, 4, 4, 31, 0,
/* 181 */8, 31, 8, 12, 10, 9, 8, 0,
/* 182 */2, 31, 18, 18, 18, 18, 9, 0,
/* 183 */4, 31, 4, 31, 4, 4, 4, 0,
/* 184 */0, 30, 18, 17, 16, 8, 6, 0,
/* 185 */2, 30, 9, 8, 8, 8, 4, 0,
/* 186 */0, 31, 16, 16, 16, 16, 31, 0,
/* 187 */10, 31, 10, 10, 8, 4, 2, 0,
/* 188 */0, 3, 16, 19, 16, 8, 7, 0,
/* 189 */0, 31, 16, 8, 4, 10, 17, 0,
/* 190 */2, 31, 18, 10, 2, 2, 28, 0,
/* 191 */0, 17, 17, 18, 16, 8, 6, 0,
/* 192 */0, 30, 18, 21, 24, 8, 6, 0,
/* 193 */8, 7, 4, 31, 4, 4, 2, 0,
/* 194 */0, 21, 21, 21, 16, 8, 4, 0,
/* 195 */14, 0, 31, 4, 4, 4, 2, 0,
/* 196 */2, 2, 2, 6, 10, 2, 2, 0,
/* 197 */4, 4, 31, 4, 4, 2, 1, 0,
/* 198 */0, 14, 0, 0, 0, 0, 31, 0,
/* 199 */0, 31, 16, 10, 4, 10, 1, 0,
/* 200 */4, 31, 8, 4, 14, 21, 4, 0,
/* 201 */8, 8, 8, 8, 8, 4, 2, 0,
/* 202 */0, 4, 8, 17, 17, 17, 17, 0,
/* 203 */1, 1, 31, 1, 1, 1, 30, 0,
/* 204 */0, 31, 16, 16, 16, 8, 6, 0,
/* 205 */0, 2, 5, 8, 16, 16, 0, 0,
/* 206 */4, 31, 4, 4, 21, 21, 4, 0,
/* 207 */0, 31, 16, 16, 10, 4, 8, 0,
/* 208 */0, 14, 0, 14, 0, 14, 16, 0,
/* 209 */0, 4, 2, 1, 17, 31, 16, 0,
/* 210 */0, 16, 16, 10, 4, 10, 1, 0,
/* 211 */0, 31, 2, 31, 2, 2, 28, 0,
/* 212 */2, 2, 31, 18, 10, 2, 2, 0,
/* 213 */0, 14, 8, 8, 8, 8, 31, 0,
/* 214 */0, 31, 16, 31, 16, 16, 31, 0,
/* 215 */14, 0, 31, 16, 16, 8, 4, 0,
/* 216 */9, 9, 9, 9, 8, 4, 2, 0,
/* 217 */0, 4, 5, 5, 21, 21, 13, 0,
/* 218 */0, 1, 1, 17, 9, 5, 3, 0,
/* 219 */0, 31, 17, 17, 17, 17, 31, 0,
/* 220 */0, 31, 17, 17, 16, 8, 4, 0,
/* 221 */0, 3, 0, 16, 16, 8, 7, 0,
/* 222 */4, 9, 2, 0, 0, 0, 0, 0,
/* 223 */7, 5, 7, 0, 0, 0, 0, 0,
/* 224 */0, 0, 18, 21, 9, 9, 22, 0,
/* 225 */10, 0, 14, 16, 30, 17, 30, 0,
/* 226 */0, 0, 14, 17, 15, 17, 15, 1,
/* 227 */0, 0, 14, 1, 6, 17, 14, 0,
/* 228 */0, 0, 17, 17, 17, 25, 23, 1,
/* 229 */0, 0, 30, 5, 9, 17, 14, 0,
/* 230 */0, 0, 12, 18, 17, 17, 15, 1,
/* 231 */0, 0, 30, 17, 17, 17, 30, 16,
/* 232 */0, 0, 28, 4, 4, 5, 2, 0,
/* 233 */0, 8, 11, 8, 0, 0, 0, 0,
/* 234 */8, 0, 12, 8, 8, 8, 8, 8,
/* 235 */0, 5, 2, 5, 0, 0, 0, 0,
/* 236 */0, 4, 14, 5, 21, 14, 4, 0,
/* 237 */2, 2, 7, 2, 7, 2, 30, 0,
/* 238 */14, 0, 13, 19, 17, 17, 17, 0,
/* 239 */10, 0, 14, 17, 17, 17, 14, 0,
/* 240 */0, 0, 13, 19, 17, 17, 15, 1,
/* 241 */0, 0, 22, 25, 17, 17, 30, 16,
/* 242 */0, 14, 17, 31, 17, 17, 14, 0,
/* 243 */0, 0, 0, 26, 21, 11, 0, 0,
/* 244 */0, 0, 14, 17, 17, 10, 27, 0,
/* 245 */10, 0, 17, 17, 17, 17, 25, 22,
/* 246 */31, 1, 2, 4, 2, 1, 31, 0,
/* 247 */0, 0, 31, 10, 10, 10, 25, 0,
/* 248 */31, 0, 17, 10, 4, 10, 17, 0,
/* 249 */0, 0, 17, 17, 17, 17, 30, 16,
/* 250 */0, 16, 15, 4, 31, 4, 4, 0,
/* 251 */0, 0, 31, 2, 30, 18, 17, 0,
/* 252 */0, 0, 31, 21, 31, 17, 17, 0,
/* 253 */0, 4, 0, 31, 0, 4, 0, 0,
/* 254 */0, 0, 0, 0, 0, 0, 0, 0,
/* 255 */31, 31, 31, 31, 31, 31, 31, 31]);
},{}],"../node_modules/@wokwi/elements/dist/esm/lcd1602-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LCD1602Element = undefined;

var _litElement = require("lit-element");

var _lcd1602FontA = require("./lcd1602-font-a00");

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const ROWS = 2;
const COLS = 16;
const charXSpacing = 3.55;
const charYSpacing = 5.95;
const backgroundColors = {
    green: '#6cb201',
    blue: '#000eff'
};
let LCD1602Element = class LCD1602Element extends _litElement.LitElement {
    constructor() {
        super(...arguments);
        this.color = 'black';
        this.background = 'green';
        this.characters = new Uint8Array(32);
        this.font = _lcd1602FontA.fontA00;
        this.cursor = false;
        this.blink = false;
        this.cursorX = 0;
        this.cursorY = 0;
        this.backlight = true;
    }
    static get styles() {
        return _litElement.css`
      .cursor-blink {
        animation: cursor-blink;
      }

      @keyframes cursor-blink {
        from {
          opacity: 0;
        }
        25% {
          opacity: 1;
        }
        75% {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    }
    path(characters) {
        const xSpacing = 0.6;
        const ySpacing = 0.7;
        const result = [];
        for (let i = 0; i < characters.length; i++) {
            const charX = i % COLS * charXSpacing;
            const charY = Math.floor(i / COLS) * charYSpacing;
            for (let py = 0; py < 8; py++) {
                const row = this.font[characters[i] * 8 + py];
                for (let px = 0; px < 5; px++) {
                    if (row & 1 << px) {
                        const x = (charX + px * xSpacing).toFixed(2);
                        const y = (charY + py * ySpacing).toFixed(2);
                        result.push(`M ${x} ${y}h0.55v0.65h-0.55Z`);
                    }
                }
            }
        }
        return result.join(' ');
    }
    renderCursor() {
        const xOffset = 12.45 + this.cursorX * charXSpacing;
        const yOffset = 12.55 + this.cursorY * charYSpacing;
        if (this.cursorX < 0 || this.cursorX >= COLS || this.cursorY < 0 || this.cursorY >= ROWS) {
            return null;
        }
        const result = [];
        if (this.blink) {
            result.push(_litElement.svg`
        <rect x="${xOffset}" y="${yOffset}" width="2.95" height="5.55" fill="${this.color}">
          <animate
            attributeName="opacity"
            values="0;0;0;0;1;1;0;0;0;0"
            dur="1s"
            fill="freeze"
            repeatCount="indefinite"
          />
        </rect>
      `);
        }
        if (this.cursor) {
            const y = yOffset + 0.7 * 7;
            result.push(_litElement.svg`<rect x="${xOffset}" y="${y}" width="2.95" height="0.65" fill="${this.color}" />`);
        }
        return result;
    }
    render() {
        const { color, characters, background } = this;
        const darken = this.backlight ? 0 : 0.5;
        const actualBgColor = background in backgroundColors ? backgroundColors[background] : backgroundColors;
        // Dimensions according to:
        // https://www.winstar.com.tw/products/character-lcd-display-module/16x2-lcd.html
        return _litElement.html`
      <svg
        width="80mm"
        height="36mm"
        version="1.1"
        viewBox="0 0 80 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="characters"
            width="3.55"
            height="5.95"
            patternUnits="userSpaceOnUse"
            x="12.45"
            y="12.55"
          >
            <rect width="2.95" height="5.55" fill-opacity="0.05" />
          </pattern>
        </defs>
        <rect width="80" height="36" fill="#087f45" />
        <rect x="4.95" y="5.7" width="71.2" height="25.2" />
        <rect x="7.55" y="10.3" width="66" height="16" rx="1.5" ry="1.5" fill="${actualBgColor}" />
        <rect x="7.55" y="10.3" width="66" height="16" rx="1.5" ry="1.5" opacity="${darken}" />
        <rect x="12.45" y="12.55" width="56.2" height="11.5" fill="url(#characters)" />
        <path d="${this.path(characters)}" transform="translate(12.45, 12.55)" fill="${color}" />
        ${this.renderCursor()}
      </svg>
    `;
    }
};
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "color", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "background", void 0);
__decorate([(0, _litElement.property)({ type: Array })], LCD1602Element.prototype, "characters", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "font", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "cursor", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "blink", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "cursorX", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "cursorY", void 0);
__decorate([(0, _litElement.property)()], LCD1602Element.prototype, "backlight", void 0);
exports.LCD1602Element = LCD1602Element = __decorate([(0, _litElement.customElement)('wokwi-lcd1602')], LCD1602Element);
exports.LCD1602Element = LCD1602Element;
},{"lit-element":"../node_modules/lit-element/lit-element.js","./lcd1602-font-a00":"../node_modules/@wokwi/elements/dist/esm/lcd1602-font-a00.js"}],"../node_modules/@wokwi/elements/dist/esm/lcd1602-font-a02.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Font rasterized from datasheet: https://www.sparkfun.com/datasheets/LCD/HD44780.pdf
// prettier-ignore
const fontA02 = exports.fontA02 = new Uint8Array([
/* 0 */0, 0, 0, 0, 0, 0, 0, 0,
/* 1 */0, 0, 0, 0, 0, 0, 0, 0,
/* 2 */0, 0, 0, 0, 0, 0, 0, 0,
/* 3 */0, 0, 0, 0, 0, 0, 0, 0,
/* 4 */0, 0, 0, 0, 0, 0, 0, 0,
/* 5 */0, 0, 0, 0, 0, 0, 0, 0,
/* 6 */0, 0, 0, 0, 0, 0, 0, 0,
/* 7 */0, 0, 0, 0, 0, 0, 0, 0,
/* 8 */0, 0, 0, 0, 0, 0, 0, 0,
/* 9 */0, 0, 0, 0, 0, 0, 0, 0,
/* 10 */0, 0, 0, 0, 0, 0, 0, 0,
/* 11 */0, 0, 0, 0, 0, 0, 0, 0,
/* 12 */0, 0, 0, 0, 0, 0, 0, 0,
/* 13 */0, 0, 0, 0, 0, 0, 0, 0,
/* 14 */0, 0, 0, 0, 0, 0, 0, 0,
/* 15 */0, 0, 0, 0, 0, 0, 0, 0,
/* 32 */0, 2, 6, 14, 30, 14, 6, 2,
/* 33 */0, 8, 12, 14, 15, 14, 12, 8,
/* 34 */0, 18, 9, 27, 0, 0, 0, 0,
/* 35 */0, 27, 18, 9, 0, 0, 0, 0,
/* 36 */0, 4, 14, 31, 0, 4, 14, 31,
/* 37 */0, 31, 14, 4, 0, 31, 14, 4,
/* 38 */0, 0, 14, 31, 31, 31, 14, 0,
/* 39 */0, 16, 16, 20, 18, 31, 2, 4,
/* 40 */0, 4, 14, 21, 4, 4, 4, 4,
/* 41 */0, 4, 4, 4, 4, 21, 14, 4,
/* 42 */0, 0, 4, 8, 31, 8, 4, 0,
/* 43 */0, 0, 4, 2, 31, 2, 4, 0,
/* 44 */0, 8, 4, 2, 4, 8, 0, 31,
/* 45 */0, 2, 4, 8, 4, 2, 0, 31,
/* 46 */0, 0, 4, 4, 14, 14, 31, 0,
/* 47 */0, 0, 31, 14, 14, 4, 4, 0,
/* 48 */0, 0, 0, 0, 0, 0, 0, 0,
/* 49 */0, 4, 4, 4, 4, 0, 0, 4,
/* 50 */0, 10, 10, 10, 0, 0, 0, 0,
/* 51 */0, 10, 10, 31, 10, 31, 10, 10,
/* 52 */0, 4, 30, 5, 14, 20, 15, 4,
/* 53 */0, 3, 19, 8, 4, 2, 25, 24,
/* 54 */0, 6, 9, 5, 2, 21, 9, 22,
/* 55 */0, 6, 4, 2, 0, 0, 0, 0,
/* 56 */0, 8, 4, 2, 2, 2, 4, 8,
/* 57 */0, 2, 4, 8, 8, 8, 4, 2,
/* 58 */0, 0, 4, 21, 14, 21, 4, 0,
/* 59 */0, 0, 4, 4, 31, 4, 4, 0,
/* 60 */0, 0, 0, 0, 0, 6, 4, 2,
/* 61 */0, 0, 0, 0, 31, 0, 0, 0,
/* 62 */0, 0, 0, 0, 0, 0, 6, 6,
/* 63 */0, 0, 16, 8, 4, 2, 1, 0,
/* 64 */0, 14, 17, 25, 21, 19, 17, 14,
/* 65 */0, 4, 6, 4, 4, 4, 4, 14,
/* 66 */0, 14, 17, 16, 8, 4, 2, 31,
/* 67 */0, 31, 8, 4, 8, 16, 17, 14,
/* 68 */0, 8, 12, 10, 9, 31, 8, 8,
/* 69 */0, 31, 1, 15, 16, 16, 17, 14,
/* 70 */0, 12, 2, 1, 15, 17, 17, 14,
/* 71 */0, 31, 17, 16, 8, 4, 4, 4,
/* 72 */0, 14, 17, 17, 14, 17, 17, 14,
/* 73 */0, 14, 17, 17, 30, 16, 8, 6,
/* 74 */0, 0, 6, 6, 0, 6, 6, 0,
/* 75 */0, 0, 6, 6, 0, 6, 4, 2,
/* 76 */0, 8, 4, 2, 1, 2, 4, 8,
/* 77 */0, 0, 0, 31, 0, 31, 0, 0,
/* 78 */0, 2, 4, 8, 16, 8, 4, 2,
/* 79 */0, 14, 17, 16, 8, 4, 0, 4,
/* 80 */0, 14, 17, 16, 22, 21, 21, 14,
/* 81 */0, 4, 10, 17, 17, 31, 17, 17,
/* 82 */0, 15, 17, 17, 15, 17, 17, 15,
/* 83 */0, 14, 17, 1, 1, 1, 17, 14,
/* 84 */0, 7, 9, 17, 17, 17, 9, 7,
/* 85 */0, 31, 1, 1, 15, 1, 1, 31,
/* 86 */0, 31, 1, 1, 15, 1, 1, 1,
/* 87 */0, 14, 17, 1, 29, 17, 17, 30,
/* 88 */0, 17, 17, 17, 31, 17, 17, 17,
/* 89 */0, 14, 4, 4, 4, 4, 4, 14,
/* 90 */0, 28, 8, 8, 8, 8, 9, 6,
/* 91 */0, 17, 9, 5, 3, 5, 9, 17,
/* 92 */0, 1, 1, 1, 1, 1, 1, 31,
/* 93 */0, 17, 27, 21, 21, 17, 17, 17,
/* 94 */0, 17, 17, 19, 21, 25, 17, 17,
/* 95 */0, 14, 17, 17, 17, 17, 17, 14,
/* 96 */0, 15, 17, 17, 15, 1, 1, 1,
/* 97 */0, 14, 17, 17, 17, 21, 9, 22,
/* 98 */0, 15, 17, 17, 15, 5, 9, 17,
/* 99 */0, 14, 17, 1, 14, 16, 17, 14,
/* 100 */0, 31, 4, 4, 4, 4, 4, 4,
/* 101 */0, 17, 17, 17, 17, 17, 17, 14,
/* 102 */0, 17, 17, 17, 17, 17, 10, 4,
/* 103 */0, 17, 17, 17, 21, 21, 21, 10,
/* 104 */0, 17, 17, 10, 4, 10, 17, 17,
/* 105 */0, 17, 17, 17, 10, 4, 4, 4,
/* 106 */0, 31, 16, 8, 4, 2, 1, 31,
/* 107 */0, 14, 2, 2, 2, 2, 2, 14,
/* 108 */0, 0, 1, 2, 4, 8, 16, 0,
/* 109 */0, 14, 8, 8, 8, 8, 8, 14,
/* 110 */0, 4, 10, 17, 0, 0, 0, 0,
/* 111 */0, 0, 0, 0, 0, 0, 0, 31,
/* 112 */0, 2, 4, 8, 0, 0, 0, 0,
/* 113 */0, 0, 0, 14, 16, 30, 17, 30,
/* 114 */0, 1, 1, 13, 19, 17, 17, 15,
/* 115 */0, 0, 0, 14, 1, 1, 17, 14,
/* 116 */0, 16, 16, 22, 25, 17, 17, 30,
/* 117 */0, 0, 0, 14, 17, 31, 1, 14,
/* 118 */0, 12, 18, 2, 7, 2, 2, 2,
/* 119 */0, 0, 0, 30, 17, 30, 16, 14,
/* 120 */0, 1, 1, 13, 19, 17, 17, 17,
/* 121 */0, 4, 0, 4, 6, 4, 4, 14,
/* 122 */0, 8, 0, 12, 8, 8, 9, 6,
/* 123 */0, 1, 1, 9, 5, 3, 5, 9,
/* 124 */0, 6, 4, 4, 4, 4, 4, 14,
/* 125 */0, 0, 0, 11, 21, 21, 21, 21,
/* 126 */0, 0, 0, 13, 19, 17, 17, 17,
/* 127 */0, 0, 0, 14, 17, 17, 17, 14,
/* 128 */0, 0, 0, 15, 17, 15, 1, 1,
/* 129 */0, 0, 0, 22, 25, 30, 16, 16,
/* 130 */0, 0, 0, 13, 19, 1, 1, 1,
/* 131 */0, 0, 0, 14, 1, 14, 16, 15,
/* 132 */0, 2, 2, 7, 2, 2, 18, 12,
/* 133 */0, 0, 0, 17, 17, 17, 25, 22,
/* 134 */0, 0, 0, 17, 17, 17, 10, 4,
/* 135 */0, 0, 0, 17, 17, 21, 21, 10,
/* 136 */0, 0, 0, 17, 10, 4, 10, 17,
/* 137 */0, 0, 0, 17, 17, 30, 16, 14,
/* 138 */0, 0, 0, 31, 8, 4, 2, 31,
/* 139 */0, 8, 4, 4, 2, 4, 4, 8,
/* 140 */0, 4, 4, 4, 4, 4, 4, 4,
/* 141 */0, 2, 4, 4, 8, 4, 4, 2,
/* 142 */0, 0, 0, 0, 22, 9, 0, 0,
/* 143 */0, 4, 10, 17, 17, 17, 31, 0,
/* 144 */0, 31, 17, 1, 15, 17, 17, 15,
/* 145 */30, 20, 20, 18, 17, 31, 17, 17,
/* 146 */0, 21, 21, 21, 14, 21, 21, 21,
/* 147 */0, 15, 16, 16, 12, 16, 16, 15,
/* 148 */0, 17, 17, 25, 21, 19, 17, 17,
/* 149 */10, 4, 17, 17, 25, 21, 19, 17,
/* 150 */0, 30, 20, 20, 20, 20, 21, 18,
/* 151 */0, 31, 17, 17, 17, 17, 17, 17,
/* 152 */0, 17, 17, 17, 10, 4, 2, 1,
/* 153 */0, 17, 17, 17, 17, 17, 31, 16,
/* 154 */0, 17, 17, 17, 30, 16, 16, 16,
/* 155 */0, 0, 21, 21, 21, 21, 21, 31,
/* 156 */0, 21, 21, 21, 21, 21, 31, 16,
/* 157 */0, 3, 2, 2, 14, 18, 18, 14,
/* 158 */0, 17, 17, 17, 19, 21, 21, 19,
/* 159 */0, 14, 17, 20, 26, 16, 17, 14,
/* 160 */0, 0, 0, 18, 21, 9, 9, 22,
/* 161 */0, 4, 12, 20, 20, 4, 7, 7,
/* 162 */0, 31, 17, 1, 1, 1, 1, 1,
/* 163 */0, 0, 0, 31, 10, 10, 10, 25,
/* 164 */0, 31, 1, 2, 4, 2, 1, 31,
/* 165 */0, 0, 0, 30, 9, 9, 9, 6,
/* 166 */12, 20, 28, 20, 20, 23, 27, 24,
/* 167 */0, 0, 16, 14, 5, 4, 4, 8,
/* 168 */0, 4, 14, 14, 14, 31, 4, 0,
/* 169 */0, 14, 17, 17, 31, 17, 17, 14,
/* 170 */0, 0, 14, 17, 17, 17, 10, 27,
/* 171 */0, 12, 18, 4, 10, 17, 17, 14,
/* 172 */0, 0, 0, 26, 21, 11, 0, 0,
/* 173 */0, 0, 10, 31, 31, 31, 14, 4,
/* 174 */0, 0, 0, 14, 1, 6, 17, 14,
/* 175 */0, 14, 17, 17, 17, 17, 17, 17,
/* 176 */0, 27, 27, 27, 27, 27, 27, 27,
/* 177 */0, 4, 0, 0, 4, 4, 4, 4,
/* 178 */0, 4, 14, 5, 5, 21, 14, 4,
/* 179 */0, 12, 2, 2, 7, 2, 18, 13,
/* 180 */0, 0, 17, 14, 10, 14, 17, 0,
/* 181 */0, 17, 10, 31, 4, 31, 4, 4,
/* 182 */0, 4, 4, 4, 0, 4, 4, 4,
/* 183 */0, 12, 18, 4, 10, 4, 9, 6,
/* 184 */0, 8, 20, 4, 31, 4, 5, 2,
/* 185 */0, 31, 17, 21, 29, 21, 17, 31,
/* 186 */0, 14, 16, 30, 17, 30, 0, 31,
/* 187 */0, 0, 20, 10, 5, 10, 20, 0,
/* 188 */0, 9, 21, 21, 23, 21, 21, 9,
/* 189 */0, 30, 17, 17, 30, 20, 18, 17,
/* 190 */0, 31, 17, 21, 17, 25, 21, 31,
/* 191 */0, 4, 2, 6, 0, 0, 0, 0,
/* 192 */6, 9, 9, 9, 6, 0, 0, 0,
/* 193 */0, 4, 4, 31, 4, 4, 0, 31,
/* 194 */6, 9, 4, 2, 15, 0, 0, 0,
/* 195 */7, 8, 6, 8, 7, 0, 0, 0,
/* 196 */7, 9, 7, 1, 9, 29, 9, 24,
/* 197 */0, 17, 17, 17, 25, 23, 1, 1,
/* 198 */0, 30, 25, 25, 30, 24, 24, 24,
/* 199 */0, 0, 0, 0, 6, 6, 0, 0,
/* 200 */0, 0, 0, 10, 17, 21, 21, 10,
/* 201 */2, 3, 2, 2, 7, 0, 0, 0,
/* 202 */0, 14, 17, 17, 17, 14, 0, 31,
/* 203 */0, 0, 5, 10, 20, 10, 5, 0,
/* 204 */17, 9, 5, 10, 13, 10, 30, 8,
/* 205 */17, 9, 5, 10, 21, 16, 8, 28,
/* 206 */3, 2, 3, 18, 27, 20, 28, 16,
/* 207 */0, 4, 0, 4, 2, 1, 17, 14,
/* 208 */2, 4, 4, 10, 17, 31, 17, 17,
/* 209 */8, 4, 4, 10, 17, 31, 17, 17,
/* 210 */4, 10, 0, 14, 17, 31, 17, 17,
/* 211 */22, 9, 0, 14, 17, 31, 17, 17,
/* 212 */10, 0, 4, 10, 17, 31, 17, 17,
/* 213 */4, 10, 4, 14, 17, 31, 17, 17,
/* 214 */0, 28, 6, 5, 29, 7, 5, 29,
/* 215 */14, 17, 1, 1, 17, 14, 8, 12,
/* 216 */2, 4, 0, 31, 1, 15, 1, 31,
/* 217 */8, 4, 0, 31, 1, 15, 1, 31,
/* 218 */4, 10, 0, 31, 1, 15, 1, 31,
/* 219 */0, 10, 0, 31, 1, 15, 1, 31,
/* 220 */2, 4, 0, 14, 4, 4, 4, 14,
/* 221 */8, 4, 0, 14, 4, 4, 4, 14,
/* 222 */4, 10, 0, 14, 4, 4, 4, 14,
/* 223 */0, 10, 0, 14, 4, 4, 4, 14,
/* 224 */0, 14, 18, 18, 23, 18, 18, 14,
/* 225 */22, 9, 0, 17, 19, 21, 25, 17,
/* 226 */2, 4, 14, 17, 17, 17, 17, 14,
/* 227 */8, 4, 14, 17, 17, 17, 17, 14,
/* 228 */4, 10, 0, 14, 17, 17, 17, 14,
/* 229 */22, 9, 0, 14, 17, 17, 17, 14,
/* 230 */10, 0, 14, 17, 17, 17, 17, 14,
/* 231 */0, 0, 17, 10, 4, 10, 17, 0,
/* 232 */0, 14, 4, 14, 21, 14, 4, 14,
/* 233 */2, 4, 17, 17, 17, 17, 17, 14,
/* 234 */8, 4, 17, 17, 17, 17, 17, 14,
/* 235 */4, 10, 0, 17, 17, 17, 17, 14,
/* 236 */10, 0, 17, 17, 17, 17, 17, 14,
/* 237 */8, 4, 17, 10, 4, 4, 4, 4,
/* 238 */3, 2, 14, 18, 18, 14, 2, 7,
/* 239 */0, 12, 18, 18, 14, 18, 18, 13,
/* 240 */2, 4, 0, 14, 16, 30, 17, 30,
/* 241 */8, 4, 0, 14, 16, 30, 17, 30,
/* 242 */4, 10, 0, 14, 16, 30, 17, 30,
/* 243 */22, 9, 0, 14, 16, 30, 17, 30,
/* 244 */0, 10, 0, 14, 16, 30, 17, 30,
/* 245 */4, 10, 4, 14, 16, 30, 17, 30,
/* 246 */0, 0, 11, 20, 30, 5, 21, 10,
/* 247 */0, 0, 14, 1, 17, 14, 4, 6,
/* 248 */2, 4, 0, 14, 17, 31, 1, 14,
/* 249 */8, 4, 0, 14, 17, 31, 1, 14,
/* 250 */4, 10, 0, 14, 17, 31, 1, 14,
/* 251 */0, 10, 0, 14, 17, 31, 1, 14,
/* 252 */2, 4, 0, 4, 6, 4, 4, 14,
/* 253 */8, 4, 0, 4, 6, 4, 4, 14,
/* 254 */4, 10, 0, 4, 6, 4, 4, 14,
/* 255 */0, 10, 0, 4, 6, 4, 4, 14,
/* 256 */0, 5, 2, 5, 8, 30, 17, 14,
/* 257 */22, 9, 0, 13, 19, 17, 17, 17,
/* 258 */2, 4, 0, 14, 17, 17, 17, 14,
/* 259 */8, 4, 0, 14, 17, 17, 17, 14,
/* 260 */0, 4, 10, 0, 14, 17, 17, 14,
/* 261 */0, 22, 9, 0, 14, 17, 17, 14,
/* 262 */0, 10, 0, 14, 17, 17, 17, 14,
/* 263 */0, 0, 4, 0, 31, 0, 4, 0,
/* 264 */0, 8, 4, 14, 21, 14, 4, 2,
/* 265 */2, 4, 0, 17, 17, 17, 25, 22,
/* 266 */8, 4, 0, 17, 17, 17, 25, 22,
/* 267 */4, 10, 0, 17, 17, 17, 25, 22,
/* 268 */0, 10, 0, 17, 17, 17, 25, 22,
/* 269 */0, 8, 4, 17, 17, 30, 16, 14,
/* 270 */0, 6, 4, 12, 20, 12, 4, 14,
/* 271 */0, 10, 0, 17, 17, 30, 16, 14]);
},{}],"../node_modules/@wokwi/elements/dist/esm/neopixel-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NeoPixelElement = undefined;

var _litElement = require("lit-element");

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let NeoPixelElement = class NeoPixelElement extends _litElement.LitElement {
  constructor() {
    super(...arguments);
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }
  render() {
    const { r, g, b } = this;
    const spotOpacity = value => value > 0.001 ? 0.7 + value * 0.3 : 0;
    const maxOpacity = Math.max(r, g, b);
    const minOpacity = Math.min(r, g, b);
    const opacityDelta = maxOpacity - minOpacity;
    const multiplier = Math.max(1, 2 - opacityDelta * 20);
    const glowBase = 0.1 + Math.max(maxOpacity * 2 - opacityDelta * 5, 0);
    const glowColor = value => value > 0.005 ? 0.1 + value * 0.9 : 0;
    const glowOpacity = value => value > 0.005 ? glowBase + value * (1 - glowBase) : 0;
    const cssVal = value => maxOpacity ? Math.floor(Math.min(glowColor(value / maxOpacity) * multiplier, 1) * 255) : 255;
    const cssColor = `rgb(${cssVal(r)}, ${cssVal(g)}, ${cssVal(b)})`;
    const bkgWhite = 242 - (maxOpacity > 0.1 && opacityDelta < 0.2 ? Math.floor(maxOpacity * 50 * (1 - opacityDelta / 0.2)) : 0);
    const background = `rgb(${bkgWhite}, ${bkgWhite}, ${bkgWhite})`;
    return _litElement.html`
      <svg
        width="5.6631mm"
        height="5mm"
        version="1.1"
        viewBox="0 0 5.6631 5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="light1" x="-0.8" y="-0.8" height="2.8" width="2.8">
          <feGaussianBlur stdDeviation="${Math.max(0.1, maxOpacity)}" />
        </filter>
        <filter id="light2" x="-0.8" y="-0.8" height="2.2" width="2.8">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <rect x=".33308" y="0" width="5" height="5" fill="${background}" />
        <rect x=".016709" y=".4279" width=".35114" height=".9" fill="#eaeaea" />
        <rect x="0" y="3.6518" width=".35114" height=".9" fill="#eaeaea" />
        <rect x="5.312" y="3.6351" width=".35114" height=".9" fill="#eaeaea" />
        <rect x="5.312" y=".3945" width=".35114" height=".9" fill="#eaeaea" />
        <circle cx="2.8331" cy="2.5" r="2.1" fill="#ddd" />
        <circle cx="2.8331" cy="2.5" r="1.7325" fill="#e6e6e6" />
        <g fill="#bfbfbf">
          <path
            d="m4.3488 3.3308s-0.0889-0.087-0.0889-0.1341c0-0.047-6e-3 -1.1533-6e-3 -1.1533s-0.0591-0.1772-0.2008-0.1772c-0.14174 0-0.81501 0.012-0.81501 0.012s-0.24805 0.024-0.23624 0.3071c0.0118 0.2835 0.032 2.0345 0.032 2.0345 0.54707-0.046 1.0487-0.3494 1.3146-0.8888z"
          />
          <path
            d="m4.34 1.6405h-1.0805s-0.24325 0.019-0.26204-0.2423l6e-3 -0.6241c0.57782 0.075 1.0332 0.3696 1.3366 0.8706z"
          />
          <path
            d="m2.7778 2.6103-0.17127 0.124-0.8091-0.012c-0.17122-0.019-0.17062-0.2078-0.17062-0.2078-1e-3 -0.3746 1e-3 -0.2831-9e-3 -0.8122l-0.31248-0.018s0.43453-0.9216 1.4786-0.9174c-1.1e-4 0.6144-4e-3 1.2289-6e-3 1.8434z"
          />
          <path
            d="m2.7808 3.0828-0.0915-0.095h-0.96857l-0.0915 0.1447-3e-3 0.1127c0 0.065-0.12108 0.08-0.12108 0.08h-0.20909c0.55906 0.9376 1.4867 0.9155 1.4867 0.9155 1e-3 -0.3845-2e-3 -0.7692-2e-3 -1.1537z"
          />
        </g>
        <path
          d="m4.053 1.8619c-0.14174 0-0.81494 0.013-0.81494 0.013s-0.24797 0.024-0.23616 0.3084c3e-3 0.077 5e-3 0.3235 9e-3 0.5514h1.247c-2e-3 -0.33-4e-3 -0.6942-4e-3 -0.6942s-0.0593-0.1781-0.20102-0.1781z"
          fill="#666"
        />
        <ellipse
          cx="2.5"
          cy="2.3"
          rx="0.3"
          ry="0.3"
          fill="red"
          opacity=${spotOpacity(r)}
          filter="url(#light1)"
        ></ellipse>
        <ellipse
          cx="3.5"
          cy="3.2"
          rx="0.3"
          ry="0.3"
          fill="green"
          opacity=${spotOpacity(g)}
          filter="url(#light1)"
        ></ellipse>
        <ellipse
          cx="3.3"
          cy="1.45"
          rx="0.3"
          ry="0.3"
          fill="blue"
          opacity=${spotOpacity(b)}
          filter="url(#light1)"
        ></ellipse>
        <ellipse
          cx="3"
          cy="2.5"
          rx="2.2"
          ry="2.2"
          opacity="${glowOpacity(maxOpacity)}"
          fill="${cssColor}"
          filter="url(#light2)"
        ></ellipse>
      </svg>
    `;
  }
};
__decorate([(0, _litElement.property)()], NeoPixelElement.prototype, "r", void 0);
__decorate([(0, _litElement.property)()], NeoPixelElement.prototype, "g", void 0);
__decorate([(0, _litElement.property)()], NeoPixelElement.prototype, "b", void 0);
exports.NeoPixelElement = NeoPixelElement = __decorate([(0, _litElement.customElement)('wokwi-neopixel')], NeoPixelElement);
exports.NeoPixelElement = NeoPixelElement;
},{"lit-element":"../node_modules/lit-element/lit-element.js"}],"../node_modules/@wokwi/elements/dist/esm/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ledElement = require('./led-element');

Object.defineProperty(exports, 'LEDElement', {
  enumerable: true,
  get: function () {
    return _ledElement.LEDElement;
  }
});

var _pushbuttonElement = require('./pushbutton-element');

Object.defineProperty(exports, 'PushbuttonElement', {
  enumerable: true,
  get: function () {
    return _pushbuttonElement.PushbuttonElement;
  }
});

var _resistorElement = require('./resistor-element');

Object.defineProperty(exports, 'ResistorElement', {
  enumerable: true,
  get: function () {
    return _resistorElement.ResistorElement;
  }
});

var _segmentElement = require('./7segment-element');

Object.defineProperty(exports, 'SevenSegmentElement', {
  enumerable: true,
  get: function () {
    return _segmentElement.SevenSegmentElement;
  }
});

var _lcd1602Element = require('./lcd1602-element');

Object.defineProperty(exports, 'LCD1602Element', {
  enumerable: true,
  get: function () {
    return _lcd1602Element.LCD1602Element;
  }
});

var _lcd1602FontA = require('./lcd1602-font-a00');

Object.defineProperty(exports, 'fontA00', {
  enumerable: true,
  get: function () {
    return _lcd1602FontA.fontA00;
  }
});

var _lcd1602FontA2 = require('./lcd1602-font-a02');

Object.defineProperty(exports, 'fontA02', {
  enumerable: true,
  get: function () {
    return _lcd1602FontA2.fontA02;
  }
});

var _neopixelElement = require('./neopixel-element');

Object.defineProperty(exports, 'NeoPixelElement', {
  enumerable: true,
  get: function () {
    return _neopixelElement.NeoPixelElement;
  }
});
},{"./led-element":"../node_modules/@wokwi/elements/dist/esm/led-element.js","./pushbutton-element":"../node_modules/@wokwi/elements/dist/esm/pushbutton-element.js","./resistor-element":"../node_modules/@wokwi/elements/dist/esm/resistor-element.js","./7segment-element":"../node_modules/@wokwi/elements/dist/esm/7segment-element.js","./lcd1602-element":"../node_modules/@wokwi/elements/dist/esm/lcd1602-element.js","./lcd1602-font-a00":"../node_modules/@wokwi/elements/dist/esm/lcd1602-font-a00.js","./lcd1602-font-a02":"../node_modules/@wokwi/elements/dist/esm/lcd1602-font-a02.js","./neopixel-element":"../node_modules/@wokwi/elements/dist/esm/neopixel-element.js"}],"compile.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildHex = buildHex;
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = undefined && undefined.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var url = 'https://hexi.wokwi.com';
function buildHex(source) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, fetch(url + '/build', {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ sketch: source })
                    })];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    return [2 /*return*/, _a.sent()];
            }
        });
    });
}
},{}],"../node_modules/avr8js/dist/esm/cpu/cpu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AVR 8 CPU data structures
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */
var registerSpace = 0x100;

var CPU = exports.CPU = function () {
    function CPU(progMem) {
        var sramBytes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8192;

        _classCallCheck(this, CPU);

        this.progMem = progMem;
        this.sramBytes = sramBytes;
        this.data = new Uint8Array(this.sramBytes + registerSpace);
        this.data16 = new Uint16Array(this.data.buffer);
        this.dataView = new DataView(this.data.buffer);
        this.progBytes = new Uint8Array(this.progMem.buffer);
        this.writeHooks = [];
        this.pc = 0;
        this.cycles = 0;
        this.reset();
    }

    _createClass(CPU, [{
        key: "reset",
        value: function reset() {
            this.data.fill(0);
            this.SP = this.data.length - 1;
        }
    }, {
        key: "readData",
        value: function readData(addr) {
            return this.data[addr];
        }
    }, {
        key: "writeData",
        value: function writeData(addr, value) {
            var hook = this.writeHooks[addr];
            if (hook) {
                if (hook(value, this.data[addr], addr)) {
                    return;
                }
            }
            this.data[addr] = value;
        }
    }, {
        key: "SP",
        get: function get() {
            return this.dataView.getUint16(93, true);
        },
        set: function set(value) {
            this.dataView.setUint16(93, value, true);
        }
    }, {
        key: "SREG",
        get: function get() {
            return this.data[95];
        }
    }, {
        key: "interruptsEnabled",
        get: function get() {
            return this.SREG & 0x80 ? true : false;
        }
    }]);

    return CPU;
}();
},{}],"../node_modules/avr8js/dist/esm/cpu/instruction.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.avrInstruction = avrInstruction;
/**
 * AVR-8 Instruction Simulation
 * Part of AVR8js
 * Reference: http://ww1.microchip.com/downloads/en/devicedoc/atmel-0856-avr-instruction-set-manual.pdf
 *
 * Copyright (C) 2019, Uri Shaked
 */
function isTwoWordInstruction(opcode) {
    return (
        /* LDS */
        (opcode & 0xfe0f) === 0x9000 ||
        /* STS */
        (opcode & 0xfe0f) === 0x9200 ||
        /* CALL */
        (opcode & 0xfe0e) === 0x940e ||
        /* JMP */
        (opcode & 0xfe0e) === 0x940c
    );
}
function avrInstruction(cpu) {
    var opcode = cpu.progMem[cpu.pc];
    if ((opcode & 0xfc00) === 0x1c00) {
        /* ADC, 0001 11rd dddd rrrr */
        var d = cpu.data[(opcode & 0x1f0) >> 4];
        var r = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        var sum = d + r + (cpu.data[95] & 1);
        var R = sum & 255;
        cpu.data[(opcode & 0x1f0) >> 4] = R;
        var sreg = cpu.data[95] & 0xc0;
        sreg |= R ? 0 : 2;
        sreg |= 128 & R ? 4 : 0;
        sreg |= (R ^ r) & (d ^ R) & 128 ? 8 : 0;
        sreg |= sreg >> 2 & 1 ^ sreg >> 3 & 1 ? 0x10 : 0;
        sreg |= sum & 256 ? 1 : 0;
        sreg |= 1 & (d & r | r & ~R | ~R & d) ? 0x20 : 0;
        cpu.data[95] = sreg;
    } else if ((opcode & 0xfc00) === 0xc00) {
        /* ADD, 0000 11rd dddd rrrr */
        var _d = cpu.data[(opcode & 0x1f0) >> 4];
        var _r = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        var _R = _d + _r & 255;
        cpu.data[(opcode & 0x1f0) >> 4] = _R;
        var _sreg = cpu.data[95] & 0xc0;
        _sreg |= _R ? 0 : 2;
        _sreg |= 128 & _R ? 4 : 0;
        _sreg |= (_R ^ _r) & (_R ^ _d) & 128 ? 8 : 0;
        _sreg |= _sreg >> 2 & 1 ^ _sreg >> 3 & 1 ? 0x10 : 0;
        _sreg |= _d + _r & 256 ? 1 : 0;
        _sreg |= 1 & (_d & _r | _r & ~_R | ~_R & _d) ? 0x20 : 0;
        cpu.data[95] = _sreg;
    } else if ((opcode & 0xff00) === 0x9600) {
        /* ADIW, 1001 0110 KKdd KKKK */
        var addr = 2 * ((opcode & 0x30) >> 4) + 24;
        var value = cpu.dataView.getUint16(addr, true);
        var _R2 = value + (opcode & 0xf | (opcode & 0xc0) >> 2) & 0xffff;
        cpu.dataView.setUint16(addr, _R2, true);
        var _sreg2 = cpu.data[95] & 0xe0;
        _sreg2 |= _R2 ? 0 : 2;
        _sreg2 |= 0x8000 & _R2 ? 4 : 0;
        _sreg2 |= ~value & _R2 & 0x8000 ? 8 : 0;
        _sreg2 |= _sreg2 >> 2 & 1 ^ _sreg2 >> 3 & 1 ? 0x10 : 0;
        _sreg2 |= ~_R2 & value & 0x8000 ? 1 : 0;
        cpu.data[95] = _sreg2;
        cpu.cycles++;
    } else if ((opcode & 0xfc00) === 0x2000) {
        /* AND, 0010 00rd dddd rrrr */
        var _R3 = cpu.data[(opcode & 0x1f0) >> 4] & cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        cpu.data[(opcode & 0x1f0) >> 4] = _R3;
        var _sreg3 = cpu.data[95] & 0xe1;
        _sreg3 |= _R3 ? 0 : 2;
        _sreg3 |= 128 & _R3 ? 4 : 0;
        _sreg3 |= _sreg3 >> 2 & 1 ^ _sreg3 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg3;
    } else if ((opcode & 0xf000) === 0x7000) {
        /* ANDI, 0111 KKKK dddd KKKK */
        var _R4 = cpu.data[((opcode & 0xf0) >> 4) + 16] & (opcode & 0xf | (opcode & 0xf00) >> 4);
        cpu.data[((opcode & 0xf0) >> 4) + 16] = _R4;
        var _sreg4 = cpu.data[95] & 0xe1;
        _sreg4 |= _R4 ? 0 : 2;
        _sreg4 |= 128 & _R4 ? 4 : 0;
        _sreg4 |= _sreg4 >> 2 & 1 ^ _sreg4 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg4;
    } else if ((opcode & 0xfe0f) === 0x9405) {
        /* ASR, 1001 010d dddd 0101 */
        var _value = cpu.data[(opcode & 0x1f0) >> 4];
        var _R5 = _value >>> 1 | 128 & _value;
        cpu.data[(opcode & 0x1f0) >> 4] = _R5;
        var _sreg5 = cpu.data[95] & 0xe0;
        _sreg5 |= _R5 ? 0 : 2;
        _sreg5 |= 128 & _R5 ? 4 : 0;
        _sreg5 |= _value & 1;
        _sreg5 |= _sreg5 >> 2 & 1 ^ _sreg5 & 1 ? 8 : 0;
        _sreg5 |= _sreg5 >> 2 & 1 ^ _sreg5 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg5;
    } else if ((opcode & 0xff8f) === 0x9488) {
        /* BCLR, 1001 0100 1sss 1000 */
        cpu.data[95] &= ~(1 << ((opcode & 0x70) >> 4));
    } else if ((opcode & 0xfe08) === 0xf800) {
        /* BLD, 1111 100d dddd 0bbb */
        var b = opcode & 7;
        var _d2 = (opcode & 0x1f0) >> 4;
        cpu.data[_d2] = ~(1 << b) & cpu.data[_d2] | (cpu.data[95] >> 6 & 1) << b;
    } else if ((opcode & 0xfc00) === 0xf400) {
        /* BRBC, 1111 01kk kkkk ksss */
        if (!(cpu.data[95] & 1 << (opcode & 7))) {
            cpu.pc = cpu.pc + (((opcode & 0x1f8) >> 3) - (opcode & 0x200 ? 0x40 : 0));
            cpu.cycles++;
        }
    } else if ((opcode & 0xfc00) === 0xf000) {
        /* BRBS, 1111 00kk kkkk ksss */
        if (cpu.data[95] & 1 << (opcode & 7)) {
            cpu.pc = cpu.pc + (((opcode & 0x1f8) >> 3) - (opcode & 0x200 ? 0x40 : 0));
            cpu.cycles++;
        }
    } else if ((opcode & 0xff8f) === 0x9408) {
        /* BSET, 1001 0100 0sss 1000 */
        cpu.data[95] |= 1 << ((opcode & 0x70) >> 4);
    } else if ((opcode & 0xfe08) === 0xfa00) {
        /* BST, 1111 101d dddd 0bbb */
        var _d3 = cpu.data[(opcode & 0x1f0) >> 4];
        var _b = opcode & 7;
        cpu.data[95] = cpu.data[95] & 0xbf | (_d3 >> _b & 1 ? 0x40 : 0);
    } else if ((opcode & 0xfe0e) === 0x940e) {
        /* CALL, 1001 010k kkkk 111k kkkk kkkk kkkk kkkk */
        var k = cpu.progMem[cpu.pc + 1] | (opcode & 1) << 16 | (opcode & 0x1f0) << 13;
        var ret = cpu.pc + 2;
        var sp = cpu.dataView.getUint16(93, true);
        cpu.data[sp] = 255 & ret;
        cpu.data[sp - 1] = ret >> 8 & 255;
        cpu.dataView.setUint16(93, sp - 2, true);
        cpu.pc = k - 1;
        cpu.cycles += 4;
    } else if ((opcode & 0xff00) === 0x9800) {
        /* CBI, 1001 1000 AAAA Abbb */
        var A = opcode & 0xf8;
        var _b2 = opcode & 7;
        var _R6 = cpu.readData((A >> 3) + 32);
        cpu.writeData((A >> 3) + 32, _R6 & ~(1 << _b2));
    } else if ((opcode & 0xfe0f) === 0x9400) {
        /* COM, 1001 010d dddd 0000 */
        var _d4 = (opcode & 0x1f0) >> 4;
        var _R7 = 255 - cpu.data[_d4];
        cpu.data[_d4] = _R7;
        var _sreg6 = cpu.data[95] & 0xe1 | 1;
        _sreg6 |= _R7 ? 0 : 2;
        _sreg6 |= 128 & _R7 ? 4 : 0;
        _sreg6 |= _sreg6 >> 2 & 1 ^ _sreg6 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg6;
    } else if ((opcode & 0xfc00) === 0x1400) {
        /* CP, 0001 01rd dddd rrrr */
        var val1 = cpu.data[(opcode & 0x1f0) >> 4];
        var val2 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        var _R8 = val1 - val2;
        var _sreg7 = cpu.data[95] & 0xc0;
        _sreg7 |= _R8 ? 0 : 2;
        _sreg7 |= 128 & _R8 ? 4 : 0;
        _sreg7 |= 0 !== ((val1 ^ val2) & (val1 ^ _R8) & 128) ? 8 : 0;
        _sreg7 |= _sreg7 >> 2 & 1 ^ _sreg7 >> 3 & 1 ? 0x10 : 0;
        _sreg7 |= val2 > val1 ? 1 : 0;
        _sreg7 |= 1 & (~val1 & val2 | val2 & _R8 | _R8 & ~val1) ? 0x20 : 0;
        cpu.data[95] = _sreg7;
    } else if ((opcode & 0xfc00) === 0x400) {
        /* CPC, 0000 01rd dddd rrrr */
        var arg1 = cpu.data[(opcode & 0x1f0) >> 4];
        var arg2 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        var _sreg8 = cpu.data[95];
        var _r2 = arg1 - arg2 - (_sreg8 & 1);
        _sreg8 = _sreg8 & 0xc0 | (!_r2 && _sreg8 >> 1 & 1 ? 2 : 0) | (arg2 + (_sreg8 & 1) > arg1 ? 1 : 0);
        _sreg8 |= 128 & _r2 ? 4 : 0;
        _sreg8 |= (arg1 ^ arg2) & (arg1 ^ _r2) & 128 ? 8 : 0;
        _sreg8 |= _sreg8 >> 2 & 1 ^ _sreg8 >> 3 & 1 ? 0x10 : 0;
        _sreg8 |= 1 & (~arg1 & arg2 | arg2 & _r2 | _r2 & ~arg1) ? 0x20 : 0;
        cpu.data[95] = _sreg8;
    } else if ((opcode & 0xf000) === 0x3000) {
        /* CPI, 0011 KKKK dddd KKKK */
        var _arg = cpu.data[((opcode & 0xf0) >> 4) + 16];
        var _arg2 = opcode & 0xf | (opcode & 0xf00) >> 4;
        var _r3 = _arg - _arg2;
        var _sreg9 = cpu.data[95] & 0xc0;
        _sreg9 |= _r3 ? 0 : 2;
        _sreg9 |= 128 & _r3 ? 4 : 0;
        _sreg9 |= (_arg ^ _arg2) & (_arg ^ _r3) & 128 ? 8 : 0;
        _sreg9 |= _sreg9 >> 2 & 1 ^ _sreg9 >> 3 & 1 ? 0x10 : 0;
        _sreg9 |= _arg2 > _arg ? 1 : 0;
        _sreg9 |= 1 & (~_arg & _arg2 | _arg2 & _r3 | _r3 & ~_arg) ? 0x20 : 0;
        cpu.data[95] = _sreg9;
    } else if ((opcode & 0xfc00) === 0x1000) {
        /* CPSE, 0001 00rd dddd rrrr */
        if (cpu.data[(opcode & 0x1f0) >> 4] === cpu.data[opcode & 0xf | (opcode & 0x200) >> 5]) {
            var nextOpcode = cpu.progMem[cpu.pc + 1];
            var skipSize = isTwoWordInstruction(nextOpcode) ? 2 : 1;
            cpu.pc += skipSize;
            cpu.cycles += skipSize;
        }
    } else if ((opcode & 0xfe0f) === 0x940a) {
        /* DEC, 1001 010d dddd 1010 */
        var _value2 = cpu.data[(opcode & 0x1f0) >> 4];
        var _R9 = _value2 - 1;
        cpu.data[(opcode & 0x1f0) >> 4] = _R9;
        var _sreg10 = cpu.data[95] & 0xe1;
        _sreg10 |= _R9 ? 0 : 2;
        _sreg10 |= 128 & _R9 ? 4 : 0;
        _sreg10 |= 128 === _value2 ? 8 : 0;
        _sreg10 |= _sreg10 >> 2 & 1 ^ _sreg10 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg10;
    } else if ((opcode & 0xfc00) === 0x2400) {
        /* EOR, 0010 01rd dddd rrrr */
        var _R10 = cpu.data[(opcode & 0x1f0) >> 4] ^ cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        cpu.data[(opcode & 0x1f0) >> 4] = _R10;
        var _sreg11 = cpu.data[95] & 0xe1;
        _sreg11 |= _R10 ? 0 : 2;
        _sreg11 |= 128 & _R10 ? 4 : 0;
        _sreg11 |= _sreg11 >> 2 & 1 ^ _sreg11 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg11;
    } else if ((opcode & 0xff88) === 0x308) {
        /* FMUL, 0000 0011 0ddd 1rrr */
        var v1 = cpu.data[((opcode & 0x70) >> 4) + 16];
        var v2 = cpu.data[(opcode & 7) + 16];
        var _R11 = v1 * v2 << 1;
        cpu.dataView.setUint16(0, _R11, true);
        cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R11 ? 0 : 2) | (v1 * v2 & 0x8000 ? 1 : 0);
        cpu.cycles++;
    } else if ((opcode & 0xff88) === 0x380) {
        /* FMULS, 0000 0011 1ddd 0rrr */
        var _v = cpu.dataView.getInt8(((opcode & 0x70) >> 4) + 16);
        var _v2 = cpu.dataView.getInt8((opcode & 7) + 16);
        var _R12 = _v * _v2 << 1;
        cpu.dataView.setInt16(0, _R12, true);
        cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R12 ? 0 : 2) | (_v * _v2 & 0x8000 ? 1 : 0);
        cpu.cycles++;
    } else if ((opcode & 0xff88) === 0x388) {
        /* FMULSU, 0000 0011 1ddd 1rrr */
        var _v3 = cpu.dataView.getInt8(((opcode & 0x70) >> 4) + 16);
        var _v4 = cpu.data[(opcode & 7) + 16];
        var _R13 = _v3 * _v4 << 1;
        cpu.dataView.setInt16(0, _R13, true);
        cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R13 ? 2 : 0) | (_v3 * _v4 & 0x8000 ? 1 : 0);
        cpu.cycles++;
    } else if (opcode === 0x9509) {
        /* ICALL, 1001 0101 0000 1001 */
        var retAddr = cpu.pc + 1;
        var _sp = cpu.dataView.getUint16(93, true);
        cpu.data[_sp] = retAddr & 255;
        cpu.data[_sp - 1] = retAddr >> 8 & 255;
        cpu.dataView.setUint16(93, _sp - 2, true);
        cpu.pc = cpu.dataView.getUint16(30, true) - 1;
        cpu.cycles += 2;
    } else if (opcode === 0x9409) {
        /* IJMP, 1001 0100 0000 1001 */
        cpu.pc = cpu.dataView.getUint16(30, true) - 1;
        cpu.cycles++;
    } else if ((opcode & 0xf800) === 0xb000) {
        /* IN, 1011 0AAd dddd AAAA */
        var i = cpu.readData((opcode & 0xf | (opcode & 0x600) >> 5) + 32);
        cpu.data[(opcode & 0x1f0) >> 4] = i;
    } else if ((opcode & 0xfe0f) === 0x9403) {
        /* INC, 1001 010d dddd 0011 */
        var _d5 = cpu.data[(opcode & 0x1f0) >> 4];
        var _r4 = _d5 + 1 & 255;
        cpu.data[(opcode & 0x1f0) >> 4] = _r4;
        var _sreg12 = cpu.data[95] & 0xe1;
        _sreg12 |= _r4 ? 0 : 2;
        _sreg12 |= 128 & _r4 ? 4 : 0;
        _sreg12 |= 127 === _d5 ? 8 : 0;
        _sreg12 |= _sreg12 >> 2 & 1 ^ _sreg12 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg12;
    } else if ((opcode & 0xfe0e) === 0x940c) {
        /* JMP, 1001 010k kkkk 110k kkkk kkkk kkkk kkkk */
        cpu.pc = (cpu.progMem[cpu.pc + 1] | (opcode & 1) << 16 | (opcode & 0x1f0) << 13) - 1;
        cpu.cycles += 2;
    } else if ((opcode & 0xfe0f) === 0x9206) {
        /* LAC, 1001 001r rrrr 0110 */
        var _r5 = (opcode & 0x1f0) >> 4;
        var clear = cpu.data[_r5];
        var _value3 = cpu.readData(cpu.dataView.getUint16(30, true));
        cpu.writeData(cpu.dataView.getUint16(30, true), _value3 & 255 - clear);
        cpu.data[_r5] = _value3;
    } else if ((opcode & 0xfe0f) === 0x9205) {
        /* LAS, 1001 001r rrrr 0101 */
        var _r6 = (opcode & 0x1f0) >> 4;
        var set = cpu.data[_r6];
        var _value4 = cpu.readData(cpu.dataView.getUint16(30, true));
        cpu.writeData(cpu.dataView.getUint16(30, true), _value4 | set);
        cpu.data[_r6] = _value4;
    } else if ((opcode & 0xfe0f) === 0x9207) {
        /* LAT, 1001 001r rrrr 0111 */
        var _r7 = cpu.data[(opcode & 0x1f0) >> 4];
        var _R14 = cpu.readData(cpu.dataView.getUint16(30, true));
        cpu.writeData(cpu.dataView.getUint16(30, true), _r7 ^ _R14);
        cpu.data[(opcode & 0x1f0) >> 4] = _R14;
    } else if ((opcode & 0xf000) === 0xe000) {
        /* LDI, 1110 KKKK dddd KKKK */
        cpu.data[((opcode & 0xf0) >> 4) + 16] = opcode & 0xf | (opcode & 0xf00) >> 4;
    } else if ((opcode & 0xfe0f) === 0x9000) {
        /* LDS, 1001 000d dddd 0000 kkkk kkkk kkkk kkkk */
        var _value5 = cpu.readData(cpu.progMem[cpu.pc + 1]);
        cpu.data[(opcode & 0x1f0) >> 4] = _value5;
        cpu.pc++;
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x900c) {
        /* LDX, 1001 000d dddd 1100 */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(26, true));
    } else if ((opcode & 0xfe0f) === 0x900d) {
        /* LDX(INC), 1001 000d dddd 1101 */
        var x = cpu.dataView.getUint16(26, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(x);
        cpu.dataView.setUint16(26, x + 1, true);
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x900e) {
        /* LDX(DEC), 1001 000d dddd 1110 */
        var _x = cpu.dataView.getUint16(26, true) - 1;
        cpu.dataView.setUint16(26, _x, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(_x);
        cpu.cycles += 2;
    } else if ((opcode & 0xfe0f) === 0x8008) {
        /* LDY, 1000 000d dddd 1000 */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(28, true));
    } else if ((opcode & 0xfe0f) === 0x9009) {
        /* LDY(INC), 1001 000d dddd 1001 */
        var y = cpu.dataView.getUint16(28, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(y);
        cpu.dataView.setUint16(28, y + 1, true);
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x900a) {
        /* LDY(DEC), 1001 000d dddd 1010 */
        var _y = cpu.dataView.getUint16(28, true) - 1;
        cpu.dataView.setUint16(28, _y, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(_y);
        cpu.cycles += 2;
    } else if ((opcode & 0xd208) === 0x8008 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
        /* LDDY, 10q0 qq0d dddd 1qqq */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(28, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8));
        cpu.cycles += 2;
    } else if ((opcode & 0xfe0f) === 0x8000) {
        /* LDZ, 1000 000d dddd 0000 */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(30, true));
    } else if ((opcode & 0xfe0f) === 0x9001) {
        /* LDZ(INC), 1001 000d dddd 0001 */
        var z = cpu.dataView.getUint16(30, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(z);
        cpu.dataView.setUint16(30, z + 1, true);
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x9002) {
        /* LDZ(DEC), 1001 000d dddd 0010 */
        var _z = cpu.dataView.getUint16(30, true) - 1;
        cpu.dataView.setUint16(30, _z, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(_z);
        cpu.cycles += 2;
    } else if ((opcode & 0xd208) === 0x8000 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
        /* LDDZ, 10q0 qq0d dddd 0qqq */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(30, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8));
        cpu.cycles += 2;
    } else if (opcode === 0x95c8) {
        /* LPM, 1001 0101 1100 1000 */
        cpu.data[0] = cpu.progBytes[cpu.dataView.getUint16(30, true)];
        cpu.cycles += 2;
    } else if ((opcode & 0xfe0f) === 0x9004) {
        /* LPM(REG), 1001 000d dddd 0100 */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.progBytes[cpu.dataView.getUint16(30, true)];
        cpu.cycles += 2;
    } else if ((opcode & 0xfe0f) === 0x9005) {
        /* LPM(INC), 1001 000d dddd 0101 */
        var _i = cpu.dataView.getUint16(30, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.progBytes[_i];
        cpu.dataView.setUint16(30, _i + 1, true);
        cpu.cycles += 2;
    } else if ((opcode & 0xfe0f) === 0x9406) {
        /* LSR, 1001 010d dddd 0110 */
        var _value6 = cpu.data[(opcode & 0x1f0) >> 4];
        var _R15 = _value6 >>> 1;
        cpu.data[(opcode & 0x1f0) >> 4] = _R15;
        var _sreg13 = cpu.data[95] & 0xe0;
        _sreg13 |= _R15 ? 0 : 2;
        _sreg13 |= _value6 & 1;
        _sreg13 |= _sreg13 >> 2 & 1 ^ _sreg13 & 1 ? 8 : 0;
        _sreg13 |= _sreg13 >> 2 & 1 ^ _sreg13 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg13;
    } else if ((opcode & 0xfc00) === 0x2c00) {
        /* MOV, 0010 11rd dddd rrrr */
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
    } else if ((opcode & 0xff00) === 0x100) {
        /* MOVW, 0000 0001 dddd rrrr */
        var r2 = 2 * (opcode & 0xf);
        var d2 = 2 * ((opcode & 0xf0) >> 4);
        cpu.data[d2] = cpu.data[r2];
        cpu.data[d2 + 1] = cpu.data[r2 + 1];
    } else if ((opcode & 0xfc00) === 0x9c00) {
        /* MUL, 1001 11rd dddd rrrr */
        var _R16 = cpu.data[(opcode & 0x1f0) >> 4] * cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        cpu.dataView.setUint16(0, _R16, true);
        cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R16 ? 0 : 2) | (0x8000 & _R16 ? 1 : 0);
        cpu.cycles++;
    } else if ((opcode & 0xff00) === 0x200) {
        /* MULS, 0000 0010 dddd rrrr */
        var _R17 = cpu.dataView.getInt8(((opcode & 0xf0) >> 4) + 16) * cpu.dataView.getInt8((opcode & 0xf) + 16);
        cpu.dataView.setInt16(0, _R17, true);
        cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R17 ? 0 : 2) | (0x8000 & _R17 ? 1 : 0);
        cpu.cycles++;
    } else if ((opcode & 0xff88) === 0x300) {
        /* MULSU, 0000 0011 0ddd 0rrr */
        var _R18 = cpu.dataView.getInt8(((opcode & 0x70) >> 4) + 16) * cpu.data[(opcode & 7) + 16];
        cpu.dataView.setInt16(0, _R18, true);
        cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R18 ? 0 : 2) | (0x8000 & _R18 ? 1 : 0);
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x9401) {
        /* NEG, 1001 010d dddd 0001 */
        var _d6 = (opcode & 0x1f0) >> 4;
        var _value7 = cpu.data[_d6];
        var _R19 = 0 - _value7;
        cpu.data[_d6] = _R19;
        var _sreg14 = cpu.data[95] & 0xc0;
        _sreg14 |= _R19 ? 0 : 2;
        _sreg14 |= 128 & _R19 ? 4 : 0;
        _sreg14 |= 128 === _R19 ? 8 : 0;
        _sreg14 |= _sreg14 >> 2 & 1 ^ _sreg14 >> 3 & 1 ? 0x10 : 0;
        _sreg14 |= _R19 ? 1 : 0;
        _sreg14 |= 1 & (_R19 | _value7) ? 0x20 : 0;
        cpu.data[95] = _sreg14;
    } else if (opcode === 0) {
        /* NOP, 0000 0000 0000 0000 */
        /* NOP */
    } else if ((opcode & 0xfc00) === 0x2800) {
        /* OR, 0010 10rd dddd rrrr */
        var _R20 = cpu.data[(opcode & 0x1f0) >> 4] | cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        cpu.data[(opcode & 0x1f0) >> 4] = _R20;
        var _sreg15 = cpu.data[95] & 0xe1;
        _sreg15 |= _R20 ? 0 : 2;
        _sreg15 |= 128 & _R20 ? 4 : 0;
        _sreg15 |= _sreg15 >> 2 & 1 ^ _sreg15 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg15;
    } else if ((opcode & 0xf000) === 0x6000) {
        /* SBR, 0110 KKKK dddd KKKK */
        var _R21 = cpu.data[((opcode & 0xf0) >> 4) + 16] | (opcode & 0xf | (opcode & 0xf00) >> 4);
        cpu.data[((opcode & 0xf0) >> 4) + 16] = _R21;
        var _sreg16 = cpu.data[95] & 0xe1;
        _sreg16 |= _R21 ? 0 : 2;
        _sreg16 |= 128 & _R21 ? 4 : 0;
        _sreg16 |= _sreg16 >> 2 & 1 ^ _sreg16 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg16;
    } else if ((opcode & 0xf800) === 0xb800) {
        /* OUT, 1011 1AAr rrrr AAAA */
        cpu.writeData((opcode & 0xf | (opcode & 0x600) >> 5) + 32, cpu.data[(opcode & 0x1f0) >> 4]);
    } else if ((opcode & 0xfe0f) === 0x900f) {
        /* POP, 1001 000d dddd 1111 */
        var _value8 = cpu.dataView.getUint16(93, true) + 1;
        cpu.dataView.setUint16(93, _value8, true);
        cpu.data[(opcode & 0x1f0) >> 4] = cpu.data[_value8];
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x920f) {
        /* PUSH, 1001 001d dddd 1111 */
        var _value9 = cpu.dataView.getUint16(93, true);
        cpu.data[_value9] = cpu.data[(opcode & 0x1f0) >> 4];
        cpu.dataView.setUint16(93, _value9 - 1, true);
        cpu.cycles++;
    } else if ((opcode & 0xf000) === 0xd000) {
        /* RCALL, 1101 kkkk kkkk kkkk */
        var _k = (opcode & 0x7ff) - (opcode & 0x800 ? 0x800 : 0);
        var _retAddr = cpu.pc + 1;
        var _sp2 = cpu.dataView.getUint16(93, true);
        cpu.data[_sp2] = 255 & _retAddr;
        cpu.data[_sp2 - 1] = _retAddr >> 8 & 255;
        cpu.dataView.setUint16(93, _sp2 - 2, true);
        cpu.pc += _k;
        cpu.cycles += 3;
    } else if (opcode === 0x9508) {
        /* RET, 1001 0101 0000 1000 */
        var _i2 = cpu.dataView.getUint16(93, true) + 2;
        cpu.dataView.setUint16(93, _i2, true);
        cpu.pc = (cpu.data[_i2 - 1] << 8) + cpu.data[_i2] - 1;
        cpu.cycles += 4;
    } else if (opcode === 0x9518) {
        /* RETI, 1001 0101 0001 1000 */
        var _i3 = cpu.dataView.getUint16(93, true) + 2;
        cpu.dataView.setUint16(93, _i3, true);
        cpu.pc = (cpu.data[_i3 - 1] << 8) + cpu.data[_i3] - 1;
        cpu.cycles += 4;
        cpu.data[95] |= 0x80; // Enable interrupts
    } else if ((opcode & 0xf000) === 0xc000) {
        /* RJMP, 1100 kkkk kkkk kkkk */
        cpu.pc = cpu.pc + ((opcode & 0x7ff) - (opcode & 0x800 ? 0x800 : 0));
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x9407) {
        /* ROR, 1001 010d dddd 0111 */
        var _d7 = cpu.data[(opcode & 0x1f0) >> 4];
        var _r8 = _d7 >>> 1 | (cpu.data[95] & 1) << 7;
        cpu.data[(opcode & 0x1f0) >> 4] = _r8;
        var _sreg17 = cpu.data[95] & 0xe0;
        _sreg17 |= _r8 ? 0 : 2;
        _sreg17 |= 128 & _r8 ? 4 : 0;
        _sreg17 |= 1 & _d7 ? 1 : 0;
        _sreg17 |= _sreg17 >> 2 & 1 ^ _sreg17 & 1 ? 8 : 0;
        _sreg17 |= _sreg17 >> 2 & 1 ^ _sreg17 >> 3 & 1 ? 0x10 : 0;
        cpu.data[95] = _sreg17;
    } else if ((opcode & 0xfc00) === 0x800) {
        /* SBC, 0000 10rd dddd rrrr */
        var _val = cpu.data[(opcode & 0x1f0) >> 4];
        var _val2 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        var _sreg18 = cpu.data[95];
        var _R22 = _val - _val2 - (_sreg18 & 1);
        cpu.data[(opcode & 0x1f0) >> 4] = _R22;
        _sreg18 = _sreg18 & 0xc0 | (!_R22 && _sreg18 >> 1 & 1 ? 2 : 0) | (_val2 + (_sreg18 & 1) > _val ? 1 : 0);
        _sreg18 |= 128 & _R22 ? 4 : 0;
        _sreg18 |= (_val ^ _val2) & (_val ^ _R22) & 128 ? 8 : 0;
        _sreg18 |= _sreg18 >> 2 & 1 ^ _sreg18 >> 3 & 1 ? 0x10 : 0;
        _sreg18 |= 1 & (~_val & _val2 | _val2 & _R22 | _R22 & ~_val) ? 0x20 : 0;
        cpu.data[95] = _sreg18;
    } else if ((opcode & 0xf000) === 0x4000) {
        /* SBCI, 0100 KKKK dddd KKKK */
        var _val3 = cpu.data[((opcode & 0xf0) >> 4) + 16];
        var _val4 = opcode & 0xf | (opcode & 0xf00) >> 4;
        var _sreg19 = cpu.data[95];
        var _R23 = _val3 - _val4 - (_sreg19 & 1);
        cpu.data[((opcode & 0xf0) >> 4) + 16] = _R23;
        _sreg19 = _sreg19 & 0xc0 | (!_R23 && _sreg19 >> 1 & 1 ? 2 : 0) | (_val4 + (_sreg19 & 1) > _val3 ? 1 : 0);
        _sreg19 |= 128 & _R23 ? 4 : 0;
        _sreg19 |= (_val3 ^ _val4) & (_val3 ^ _R23) & 128 ? 8 : 0;
        _sreg19 |= _sreg19 >> 2 & 1 ^ _sreg19 >> 3 & 1 ? 0x10 : 0;
        _sreg19 |= 1 & (~_val3 & _val4 | _val4 & _R23 | _R23 & ~_val3) ? 0x20 : 0;
        cpu.data[95] = _sreg19;
    } else if ((opcode & 0xff00) === 0x9a00) {
        /* SBI, 1001 1010 AAAA Abbb */
        var target = ((opcode & 0xf8) >> 3) + 32;
        cpu.writeData(target, cpu.readData(target) | 1 << (opcode & 7));
        cpu.cycles++;
    } else if ((opcode & 0xff00) === 0x9900) {
        /* SBIC, 1001 1001 AAAA Abbb */
        var _value10 = cpu.readData(((opcode & 0xf8) >> 3) + 32);
        if (!(_value10 & 1 << (opcode & 7))) {
            var _nextOpcode = cpu.progMem[cpu.pc + 1];
            var _skipSize = isTwoWordInstruction(_nextOpcode) ? 2 : 1;
            cpu.cycles += _skipSize;
            cpu.pc += _skipSize;
        }
    } else if ((opcode & 0xff00) === 0x9b00) {
        /* SBIS, 1001 1011 AAAA Abbb */
        var _value11 = cpu.readData(((opcode & 0xf8) >> 3) + 32);
        if (_value11 & 1 << (opcode & 7)) {
            var _nextOpcode2 = cpu.progMem[cpu.pc + 1];
            var _skipSize2 = isTwoWordInstruction(_nextOpcode2) ? 2 : 1;
            cpu.cycles += _skipSize2;
            cpu.pc += _skipSize2;
        }
    } else if ((opcode & 0xff00) === 0x9700) {
        /* SBIW, 1001 0111 KKdd KKKK */
        var _i4 = 2 * ((opcode & 0x30) >> 4) + 24;
        var a = cpu.dataView.getUint16(_i4, true);
        var l = opcode & 0xf | (opcode & 0xc0) >> 2;
        var _R24 = a - l;
        cpu.dataView.setUint16(_i4, _R24, true);
        var _sreg20 = cpu.data[95] & 0xc0;
        _sreg20 |= _R24 ? 0 : 2;
        _sreg20 |= 0x8000 & _R24 ? 4 : 0;
        _sreg20 |= a & ~_R24 & 0x8000 ? 8 : 0;
        _sreg20 |= _sreg20 >> 2 & 1 ^ _sreg20 >> 3 & 1 ? 0x10 : 0;
        _sreg20 |= l > a ? 1 : 0;
        _sreg20 |= 1 & (~a & l | l & _R24 | _R24 & ~a) ? 0x20 : 0;
        cpu.data[95] = _sreg20;
        cpu.cycles++;
    } else if ((opcode & 0xfe08) === 0xfc00) {
        /* SBRC, 1111 110r rrrr 0bbb */
        if (!(cpu.data[(opcode & 0x1f0) >> 4] & 1 << (opcode & 7))) {
            var _nextOpcode3 = cpu.progMem[cpu.pc + 1];
            var _skipSize3 = isTwoWordInstruction(_nextOpcode3) ? 2 : 1;
            cpu.cycles += _skipSize3;
            cpu.pc += _skipSize3;
        }
    } else if ((opcode & 0xfe08) === 0xfe00) {
        /* SBRS, 1111 111r rrrr 0bbb */
        if (cpu.data[(opcode & 0x1f0) >> 4] & 1 << (opcode & 7)) {
            var _nextOpcode4 = cpu.progMem[cpu.pc + 1];
            var _skipSize4 = isTwoWordInstruction(_nextOpcode4) ? 2 : 1;
            cpu.cycles += _skipSize4;
            cpu.pc += _skipSize4;
        }
    } else if (opcode === 0x9588) {
        /* SLEEP, 1001 0101 1000 1000 */
        /* not implemented */
    } else if (opcode === 0x95e8) {
        /* SPM, 1001 0101 1110 1000 */
        /* not implemented */
    } else if (opcode === 0x95f8) {
        /* SPM(INC), 1001 0101 1111 1000 */
        /* not implemented */
    } else if ((opcode & 0xfe0f) === 0x9200) {
        /* STS, 1001 001d dddd 0000 kkkk kkkk kkkk kkkk */
        var _value12 = cpu.data[(opcode & 0x1f0) >> 4];
        var _addr = cpu.progMem[cpu.pc + 1];
        cpu.writeData(_addr, _value12);
        cpu.pc++;
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x920c) {
        /* STX, 1001 001r rrrr 1100 */
        cpu.writeData(cpu.dataView.getUint16(26, true), cpu.data[(opcode & 0x1f0) >> 4]);
    } else if ((opcode & 0xfe0f) === 0x920d) {
        /* STX(INC), 1001 001r rrrr 1101 */
        var _x2 = cpu.dataView.getUint16(26, true);
        cpu.writeData(_x2, cpu.data[(opcode & 0x1f0) >> 4]);
        cpu.dataView.setUint16(26, _x2 + 1, true);
    } else if ((opcode & 0xfe0f) === 0x920e) {
        /* STX(DEC), 1001 001r rrrr 1110 */
        var _i5 = cpu.data[(opcode & 0x1f0) >> 4];
        var _x3 = cpu.dataView.getUint16(26, true) - 1;
        cpu.dataView.setUint16(26, _x3, true);
        cpu.writeData(_x3, _i5);
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x8208) {
        /* STY, 1000 001r rrrr 1000 */
        cpu.writeData(cpu.dataView.getUint16(28, true), cpu.data[(opcode & 0x1f0) >> 4]);
    } else if ((opcode & 0xfe0f) === 0x9209) {
        /* STY(INC), 1001 001r rrrr 1001 */
        var _i6 = cpu.data[(opcode & 0x1f0) >> 4];
        var _y2 = cpu.dataView.getUint16(28, true);
        cpu.writeData(_y2, _i6);
        cpu.dataView.setUint16(28, _y2 + 1, true);
    } else if ((opcode & 0xfe0f) === 0x920a) {
        /* STY(DEC), 1001 001r rrrr 1010 */
        var _i7 = cpu.data[(opcode & 0x1f0) >> 4];
        var _y3 = cpu.dataView.getUint16(28, true) - 1;
        cpu.dataView.setUint16(28, _y3, true);
        cpu.writeData(_y3, _i7);
        cpu.cycles++;
    } else if ((opcode & 0xd208) === 0x8208 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
        /* STDY, 10q0 qq1r rrrr 1qqq */
        cpu.writeData(cpu.dataView.getUint16(28, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8), cpu.data[(opcode & 0x1f0) >> 4]);
        cpu.cycles++;
    } else if ((opcode & 0xfe0f) === 0x8200) {
        /* STZ, 1000 001r rrrr 0000 */
        cpu.writeData(cpu.dataView.getUint16(30, true), cpu.data[(opcode & 0x1f0) >> 4]);
    } else if ((opcode & 0xfe0f) === 0x9201) {
        /* STZ(INC), 1001 001r rrrr 0001 */
        var _z2 = cpu.dataView.getUint16(30, true);
        cpu.writeData(_z2, cpu.data[(opcode & 0x1f0) >> 4]);
        cpu.dataView.setUint16(30, _z2 + 1, true);
    } else if ((opcode & 0xfe0f) === 0x9202) {
        /* STZ(DEC), 1001 001r rrrr 0010 */
        var _i8 = cpu.data[(opcode & 0x1f0) >> 4];
        var _z3 = cpu.dataView.getUint16(30, true) - 1;
        cpu.dataView.setUint16(30, _z3, true);
        cpu.writeData(_z3, _i8);
        cpu.cycles++;
    } else if ((opcode & 0xd208) === 0x8200 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
        /* STDZ, 10q0 qq1r rrrr 0qqq */
        cpu.writeData(cpu.dataView.getUint16(30, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8), cpu.data[(opcode & 0x1f0) >> 4]);
        cpu.cycles++;
    } else if ((opcode & 0xfc00) === 0x1800) {
        /* SUB, 0001 10rd dddd rrrr */
        var _val5 = cpu.data[(opcode & 0x1f0) >> 4];
        var _val6 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
        var _R25 = _val5 - _val6;
        cpu.data[(opcode & 0x1f0) >> 4] = _R25;
        var _sreg21 = cpu.data[95] & 0xc0;
        _sreg21 |= _R25 ? 0 : 2;
        _sreg21 |= 128 & _R25 ? 4 : 0;
        _sreg21 |= (_val5 ^ _val6) & (_val5 ^ _R25) & 128 ? 8 : 0;
        _sreg21 |= _sreg21 >> 2 & 1 ^ _sreg21 >> 3 & 1 ? 0x10 : 0;
        _sreg21 |= _val6 > _val5 ? 1 : 0;
        _sreg21 |= 1 & (~_val5 & _val6 | _val6 & _R25 | _R25 & ~_val5) ? 0x20 : 0;
        cpu.data[95] = _sreg21;
    } else if ((opcode & 0xf000) === 0x5000) {
        /* SUBI, 0101 KKKK dddd KKKK */
        var _val7 = cpu.data[((opcode & 0xf0) >> 4) + 16];
        var _val8 = opcode & 0xf | (opcode & 0xf00) >> 4;
        var _R26 = _val7 - _val8;
        cpu.data[((opcode & 0xf0) >> 4) + 16] = _R26;
        var _sreg22 = cpu.data[95] & 0xc0;
        _sreg22 |= _R26 ? 0 : 2;
        _sreg22 |= 128 & _R26 ? 4 : 0;
        _sreg22 |= (_val7 ^ _val8) & (_val7 ^ _R26) & 128 ? 8 : 0;
        _sreg22 |= _sreg22 >> 2 & 1 ^ _sreg22 >> 3 & 1 ? 0x10 : 0;
        _sreg22 |= _val8 > _val7 ? 1 : 0;
        _sreg22 |= 1 & (~_val7 & _val8 | _val8 & _R26 | _R26 & ~_val7) ? 0x20 : 0;
        cpu.data[95] = _sreg22;
    } else if ((opcode & 0xfe0f) === 0x9402) {
        /* SWAP, 1001 010d dddd 0010 */
        var _d8 = (opcode & 0x1f0) >> 4;
        var _i9 = cpu.data[_d8];
        cpu.data[_d8] = (15 & _i9) << 4 | (240 & _i9) >>> 4;
    } else if (opcode === 0x95a8) {
        /* WDR, 1001 0101 1010 1000 */
        /* not implemented */
    } else if ((opcode & 0xfe0f) === 0x9204) {
        /* XCH, 1001 001r rrrr 0100 */
        var _r9 = (opcode & 0x1f0) >> 4;
        var _val9 = cpu.data[_r9];
        var _val10 = cpu.data[cpu.dataView.getUint16(30, true)];
        cpu.data[cpu.dataView.getUint16(30, true)] = _val9;
        cpu.data[_r9] = _val10;
    }
    cpu.pc = (cpu.pc + 1) % cpu.progMem.length;
    cpu.cycles++;
}
},{}],"../node_modules/avr8js/dist/esm/cpu/interrupt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.avrInterrupt = avrInterrupt;
/**
 * AVR-8 Interrupt Handling
 * Part of AVR8js
 * Reference: http://ww1.microchip.com/downloads/en/devicedoc/atmel-0856-avr-instruction-set-manual.pdf
 *
 * Copyright (C) 2019, Uri Shaked
 */
function avrInterrupt(cpu, addr) {
    var sp = cpu.dataView.getUint16(93, true);
    cpu.data[sp] = cpu.pc & 0xff;
    cpu.data[sp - 1] = cpu.pc >> 8 & 0xff;
    cpu.dataView.setUint16(93, sp - 2, true);
    cpu.data[95] &= 0x7f; // clear global interrupt flag
    cpu.cycles += 2;
    cpu.pc = addr;
}
},{}],"../node_modules/avr8js/dist/esm/peripherals/timer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AVRTimer = exports.timer2Config = exports.timer1Config = exports.timer0Config = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interrupt = require('../cpu/interrupt');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * AVR-8 Timers
                                                                                                                                                           * Part of AVR8js
                                                                                                                                                           * Reference: http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061A.pdf
                                                                                                                                                           *
                                                                                                                                                           * Copyright (C) 2019, Uri Shaked
                                                                                                                                                           */


var timer01Dividers = {
    0: 0,
    1: 1,
    2: 8,
    3: 64,
    4: 256,
    5: 1024,
    6: 0,
    7: 0 // TODO: External clock source on T0 pin. Clock on rising edge.
};
var WGM_NORMAL = 0;
var WGM_PWM_PHASE_CORRECT = 1;
var WGM_CTC = 2;
var WGM_FASTPWM = 3;
var TOV = 1;
var OCFA = 2;
var OCFB = 4;
var TOIE = 1;
var OCIEA = 2;
var OCIEB = 4;
var timer0Config = exports.timer0Config = {
    bits: 8,
    captureInterrupt: 0,
    compAInterrupt: 0x1c,
    compBInterrupt: 0x1e,
    ovfInterrupt: 0x20,
    TIFR: 0x35,
    OCRA: 0x47,
    OCRB: 0x48,
    ICR: 0,
    TCNT: 0x46,
    TCCRA: 0x44,
    TCCRB: 0x45,
    TCCRC: 0,
    TIMSK: 0x6e,
    dividers: timer01Dividers
};
var timer1Config = exports.timer1Config = {
    bits: 16,
    captureInterrupt: 0x14,
    compAInterrupt: 0x16,
    compBInterrupt: 0x18,
    ovfInterrupt: 0x1a,
    TIFR: 0x36,
    OCRA: 0x88,
    OCRB: 0x8a,
    ICR: 0x86,
    TCNT: 0x84,
    TCCRA: 0x80,
    TCCRB: 0x81,
    TCCRC: 0x82,
    TIMSK: 0x6f,
    dividers: timer01Dividers
};
var timer2Config = exports.timer2Config = {
    bits: 8,
    captureInterrupt: 0,
    compAInterrupt: 0x0e,
    compBInterrupt: 0x10,
    ovfInterrupt: 0x12,
    TIFR: 0x37,
    OCRA: 0xb3,
    OCRB: 0xb4,
    ICR: 0,
    TCNT: 0xb2,
    TCCRA: 0xb0,
    TCCRB: 0xb1,
    TCCRC: 0,
    TIMSK: 0x70,
    dividers: {
        0: 1,
        1: 1,
        2: 8,
        3: 32,
        4: 64,
        5: 128,
        6: 256,
        7: 1024
    }
};

var AVRTimer = exports.AVRTimer = function () {
    function AVRTimer(cpu, config) {
        var _this = this;

        _classCallCheck(this, AVRTimer);

        this.cpu = cpu;
        this.config = config;
        this.mask = (1 << this.config.bits) - 1;
        this.lastCycle = 0;
        this.ocrA = 0;
        this.ocrB = 0;
        cpu.writeHooks[config.TCNT] = function (value) {
            _this.TCNT = value;
            _this.timerUpdated(value);
            return true;
        };
        cpu.writeHooks[config.OCRA] = function (value) {
            // TODO implement buffering when timer running in PWM mode
            _this.ocrA = value;
        };
        cpu.writeHooks[config.OCRB] = function (value) {
            _this.ocrB = value;
        };
    }

    _createClass(AVRTimer, [{
        key: 'reset',
        value: function reset() {
            this.lastCycle = 0;
            this.ocrA = 0;
            this.ocrB = 0;
        }
    }, {
        key: 'tick',
        value: function tick() {
            var divider = this.config.dividers[this.CS];
            var delta = this.cpu.cycles - this.lastCycle;
            if (divider && delta >= divider) {
                var counterDelta = Math.floor(delta / divider);
                this.lastCycle += counterDelta * divider;
                var val = this.TCNT;
                var newVal = val + counterDelta & this.mask;
                this.TCNT = newVal;
                this.timerUpdated(newVal);
                if ((this.WGM === WGM_NORMAL || this.WGM === WGM_PWM_PHASE_CORRECT || this.WGM === WGM_FASTPWM) && val > newVal) {
                    this.TIFR |= TOV;
                }
            }
            if (this.cpu.interruptsEnabled) {
                if (this.TIFR & TOV && this.TIMSK & TOIE) {
                    (0, _interrupt.avrInterrupt)(this.cpu, this.config.ovfInterrupt);
                    this.TIFR &= ~TOV;
                }
                if (this.TIFR & OCFA && this.TIMSK & OCIEA) {
                    (0, _interrupt.avrInterrupt)(this.cpu, this.config.compAInterrupt);
                    this.TIFR &= ~OCFA;
                }
                if (this.TIFR & OCFB && this.TIMSK & OCIEB) {
                    (0, _interrupt.avrInterrupt)(this.cpu, this.config.compBInterrupt);
                    this.TIFR &= ~OCFB;
                }
            }
        }
    }, {
        key: 'timerUpdated',
        value: function timerUpdated(value) {
            if (this.ocrA && value === this.ocrA) {
                this.TIFR |= OCFA;
                if (this.WGM === WGM_CTC) {
                    // Clear Timer on Compare Match (CTC) Mode
                    this.TCNT = 0;
                    this.TIFR |= TOV;
                }
            }
            if (this.ocrB && value === this.ocrB) {
                this.TIFR |= OCFB;
            }
        }
    }, {
        key: 'TIFR',
        get: function get() {
            return this.cpu.data[this.config.TIFR];
        },
        set: function set(value) {
            this.cpu.data[this.config.TIFR] = value;
        }
    }, {
        key: 'TCNT',
        get: function get() {
            return this.cpu.data[this.config.TCNT];
        },
        set: function set(value) {
            this.cpu.data[this.config.TCNT] = value;
        }
    }, {
        key: 'TCCRA',
        get: function get() {
            return this.cpu.data[this.config.TCCRA];
        }
    }, {
        key: 'TCCRB',
        get: function get() {
            return this.cpu.data[this.config.TCCRB];
        }
    }, {
        key: 'TIMSK',
        get: function get() {
            return this.cpu.data[this.config.TIMSK];
        }
    }, {
        key: 'CS',
        get: function get() {
            return this.TCCRB & 0x7;
        }
    }, {
        key: 'WGM',
        get: function get() {
            return (this.TCCRB & 0x8) >> 1 | this.TCCRA & 0x3;
        }
    }]);

    return AVRTimer;
}();
},{"../cpu/interrupt":"../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../node_modules/avr8js/dist/esm/peripherals/gpio.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var portAConfig = exports.portAConfig = {
    PIN: 0x20,
    DDR: 0x21,
    PORT: 0x22
};
var portBConfig = exports.portBConfig = {
    PIN: 0x23,
    DDR: 0x24,
    PORT: 0x25
};
var portCConfig = exports.portCConfig = {
    PIN: 0x26,
    DDR: 0x27,
    PORT: 0x28
};
var portDConfig = exports.portDConfig = {
    PIN: 0x29,
    DDR: 0x2a,
    PORT: 0x2b
};
var portEConfig = exports.portEConfig = {
    PIN: 0x2c,
    DDR: 0x2d,
    PORT: 0x2e
};
var portFConfig = exports.portFConfig = {
    PIN: 0x2f,
    DDR: 0x30,
    PORT: 0x31
};
var portGConfig = exports.portGConfig = {
    PIN: 0x32,
    DDR: 0x33,
    PORT: 0x34
};
var portHConfig = exports.portHConfig = {
    PIN: 0x100,
    DDR: 0x101,
    PORT: 0x102
};
var portJConfig = exports.portJConfig = {
    PIN: 0x103,
    DDR: 0x104,
    PORT: 0x105
};
var portKConfig = exports.portKConfig = {
    PIN: 0x106,
    DDR: 0x107,
    PORT: 0x108
};
var portLConfig = exports.portLConfig = {
    PIN: 0x109,
    DDR: 0x10a,
    PORT: 0x10b
};
var PinState = exports.PinState = undefined;
(function (PinState) {
    PinState[PinState["Low"] = 0] = "Low";
    PinState[PinState["High"] = 1] = "High";
    PinState[PinState["Input"] = 2] = "Input";
    PinState[PinState["InputPullUp"] = 3] = "InputPullUp";
})(PinState || (exports.PinState = PinState = {}));

var AVRIOPort = exports.AVRIOPort = function () {
    function AVRIOPort(cpu, portConfig) {
        var _this = this;

        _classCallCheck(this, AVRIOPort);

        this.cpu = cpu;
        this.portConfig = portConfig;
        this.listeners = [];
        cpu.writeHooks[portConfig.DDR] = function (value, oldValue) {
            var portValue = cpu.data[portConfig.PORT];
            _this.writeGpio(value & portValue, oldValue & oldValue);
        };
        cpu.writeHooks[portConfig.PORT] = function (value, oldValue) {
            var ddrMask = cpu.data[portConfig.DDR];
            cpu.data[portConfig.PORT] = value;
            value &= ddrMask;
            cpu.data[portConfig.PIN] = cpu.data[portConfig.PIN] & ~ddrMask | value;
            _this.writeGpio(value, oldValue & ddrMask);
            return true;
        };
        cpu.writeHooks[portConfig.PIN] = function (value) {
            // Writing to 1 PIN toggles PORT bits
            var oldPortValue = cpu.data[portConfig.PORT];
            var ddrMask = cpu.data[portConfig.DDR];
            var portValue = oldPortValue ^ value;
            cpu.data[portConfig.PORT] = portValue;
            cpu.data[portConfig.PIN] = cpu.data[portConfig.PIN] & ~ddrMask | portValue & ddrMask;
            _this.writeGpio(portValue & ddrMask, oldPortValue & ddrMask);
            return true;
        };
    }

    _createClass(AVRIOPort, [{
        key: "addListener",
        value: function addListener(listener) {
            this.listeners.push(listener);
        }
    }, {
        key: "removeListener",
        value: function removeListener(listener) {
            this.listeners = this.listeners.filter(function (l) {
                return l !== listener;
            });
        }
        /**
         * Get the state of a given GPIO pin
         *
         * @param index Pin index to return from 0 to 7
         * @returns PinState.Low or PinState.High if the pin is set to output, PinState.Input if the pin is set
         *   to input, and PinState.InputPullUp if the pin is set to input and the internal pull-up resistor has
         *   been enabled.
         */

    }, {
        key: "pinState",
        value: function pinState(index) {
            var ddr = this.cpu.data[this.portConfig.DDR];
            var port = this.cpu.data[this.portConfig.PORT];
            var bitMask = 1 << index;
            if (ddr & bitMask) {
                return port & bitMask ? PinState.High : PinState.Low;
            } else {
                return port & bitMask ? PinState.InputPullUp : PinState.Input;
            }
        }
    }, {
        key: "writeGpio",
        value: function writeGpio(value, oldValue) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var listener = _step.value;

                    listener(value, oldValue);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return AVRIOPort;
}();
},{}],"../node_modules/avr8js/dist/esm/peripherals/usart.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AVRUSART = exports.usart0Config = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interrupt = require('../cpu/interrupt');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var usart0Config = exports.usart0Config = {
    rxCompleteInterrupt: 0x24,
    dataRegisterEmptyInterrupt: 0x26,
    txCompleteInterrupt: 0x28,
    UCSRA: 0xc0,
    UCSRB: 0xc1,
    UCSRC: 0xc2,
    UBRRL: 0xc4,
    UBRRH: 0xc5,
    UDR: 0xc6
};
/* eslint-disable @typescript-eslint/no-unused-vars */
// Register bits:
var UCSRA_RXC = 0x80; // USART Receive Complete
var UCSRA_TXC = 0x40; // USART Transmit Complete
var UCSRA_UDRE = 0x20; // USART Data Register Empty
var UCSRA_FE = 0x10; // Frame Error
var UCSRA_DOR = 0x8; // Data OverRun
var UCSRA_UPE = 0x4; // USART Parity Error
var UCSRA_U2X = 0x2; // Double the USART Transmission Speed
var UCSRA_MPCM = 0x1; // Multi-processor Communication Mode
var UCSRB_RXCIE = 0x80; // RX Complete Interrupt Enable
var UCSRB_TXCIE = 0x40; // TX Complete Interrupt Enable
var UCSRB_UDRIE = 0x20; // USART Data Register Empty Interrupt Enable
var UCSRB_RXEN = 0x10; // Receiver Enable
var UCSRB_TXEN = 0x8; // Transmitter Enable
var UCSRB_UCSZ2 = 0x4; // Character Size 2
var UCSRB_RXB8 = 0x2; // Receive Data Bit 8
var UCSRB_TXB8 = 0x1; // Transmit Data Bit 8
var UCSRC_UMSEL1 = 0x80; // USART Mode Select 1
var UCSRC_UMSEL0 = 0x40; // USART Mode Select 0
var UCSRC_UPM1 = 0x20; // Parity Mode 1
var UCSRC_UPM0 = 0x10; // Parity Mode 0
var UCSRC_USBS = 0x8; // Stop Bit Select
var UCSRC_UCSZ1 = 0x4; // Character Size 1
var UCSRC_UCSZ0 = 0x2; // Character Size 0
var UCSRC_UCPOL = 0x1; // Clock Polarity
/* eslint-enable @typescript-eslint/no-unused-vars */

var AVRUSART = exports.AVRUSART = function () {
    function AVRUSART(cpu, config, freqMHz) {
        var _this = this;

        _classCallCheck(this, AVRUSART);

        this.cpu = cpu;
        this.config = config;
        this.freqMHz = freqMHz;
        this.onByteTransmit = null;
        this.onLineTransmit = null;
        this.lineBuffer = '';
        this.cpu.writeHooks[config.UCSRA] = function (value) {
            _this.cpu.data[config.UCSRA] = value | UCSRA_UDRE | UCSRA_TXC;
            return true;
        };
        this.cpu.writeHooks[config.UCSRB] = function (value, oldValue) {
            if (value & UCSRB_TXEN && !(oldValue & UCSRB_TXEN)) {
                // Enabling the transmission - mark UDR as empty
                _this.cpu.data[config.UCSRA] |= UCSRA_UDRE;
            }
        };
        this.cpu.writeHooks[config.UDR] = function (value) {
            if (_this.onByteTransmit) {
                _this.onByteTransmit(value);
            }
            if (_this.onLineTransmit) {
                var ch = String.fromCharCode(value);
                if (ch === '\n') {
                    _this.onLineTransmit(_this.lineBuffer);
                    _this.lineBuffer = '';
                } else {
                    _this.lineBuffer += ch;
                }
            }
            _this.cpu.data[config.UCSRA] |= UCSRA_UDRE | UCSRA_TXC;
        };
    }

    _createClass(AVRUSART, [{
        key: 'tick',
        value: function tick() {
            if (this.cpu.interruptsEnabled) {
                var ucsra = this.cpu.data[this.config.UCSRA];
                var ucsrb = this.cpu.data[this.config.UCSRB];
                if (ucsra & UCSRA_UDRE && ucsrb & UCSRB_UDRIE) {
                    (0, _interrupt.avrInterrupt)(this.cpu, this.config.dataRegisterEmptyInterrupt);
                    this.cpu.data[this.config.UCSRA] &= ~UCSRA_UDRE;
                }
                if (ucsrb & UCSRA_TXC && ucsrb & UCSRB_TXCIE) {
                    (0, _interrupt.avrInterrupt)(this.cpu, this.config.txCompleteInterrupt);
                    this.cpu.data[this.config.UCSRA] &= ~UCSRA_TXC;
                }
            }
        }
    }, {
        key: 'baudRate',
        get: function get() {
            var UBRR = this.cpu.data[this.config.UBRRH] << 8 | this.cpu.data[this.config.UBRRL];
            var multiplier = this.cpu.data[this.config.UCSRA] & UCSRA_U2X ? 8 : 16;
            return Math.floor(this.freqMHz / (multiplier * (1 + UBRR)));
        }
    }, {
        key: 'bitsPerChar',
        get: function get() {
            var ucsz = (this.cpu.data[this.config.UCSRA] & (UCSRC_UCSZ1 | UCSRC_UCSZ0)) >> 1 | this.cpu.data[this.config.UCSRB] & UCSRB_UCSZ2;
            switch (ucsz) {
                case 0:
                    return 5;
                case 1:
                    return 6;
                case 2:
                    return 7;
                case 3:
                    return 8;
                default: // 4..6 are reserved
                case 7:
                    return 9;
            }
        }
    }]);

    return AVRUSART;
}();
},{"../cpu/interrupt":"../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../node_modules/avr8js/dist/esm/peripherals/twi.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AVRTWI = exports.NoopTWIEventHandler = exports.twiConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interrupt = require('../cpu/interrupt');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable @typescript-eslint/no-unused-vars */
// Register bits:
var TWCR_TWINT = 0x80; // TWI Interrupt Flag
var TWCR_TWEA = 0x40; // TWI Enable Acknowledge Bit
var TWCR_TWSTA = 0x20; // TWI START Condition Bit
var TWCR_TWSTO = 0x10; // TWI STOP Condition Bit
var TWCR_TWWC = 0x8; //TWI Write Collision Flag
var TWCR_TWEN = 0x4; //  TWI Enable Bit
var TWCR_TWIE = 0x1; // TWI Interrupt Enable
var TWSR_TWS_MASK = 0xf8; // TWI Status
var TWSR_TWPS1 = 0x2; // TWI Prescaler Bits
var TWSR_TWPS0 = 0x1; // TWI Prescaler Bits
var TWSR_TWPS_MASK = TWSR_TWPS1 | TWSR_TWPS0; // TWI Prescaler mask
var TWAR_TWA_MASK = 0xfe; //  TWI (Slave) Address Register
var TWAR_TWGCE = 0x1; // TWI General Call Recognition Enable Bit
var STATUS_BUS_ERROR = 0x0;
var STATUS_TWI_IDLE = 0xf8;
// Master states
var STATUS_START = 0x08;
var STATUS_REPEATED_START = 0x10;
var STATUS_SLAW_ACK = 0x18;
var STATUS_SLAW_NACK = 0x20;
var STATUS_DATA_SENT_ACK = 0x28;
var STATUS_DATA_SENT_NACK = 0x30;
var STATUS_DATA_LOST_ARBITRATION = 0x38;
var STATUS_SLAR_ACK = 0x40;
var STATUS_SLAR_NACK = 0x48;
var STATUS_DATA_RECEIVED_ACK = 0x50;
var STATUS_DATA_RECEIVED_NACK = 0x58;
// TODO: add slave states
/* eslint-enable @typescript-eslint/no-unused-vars */
var twiConfig = exports.twiConfig = {
    twiInterrupt: 0x30,
    TWBR: 0xb8,
    TWSR: 0xb9,
    TWAR: 0xba,
    TWDR: 0xbb,
    TWCR: 0xbc,
    TWAMR: 0xbd
};
// A simple TWI Event Handler that sends a NACK for all events

var NoopTWIEventHandler = exports.NoopTWIEventHandler = function () {
    function NoopTWIEventHandler(twi) {
        _classCallCheck(this, NoopTWIEventHandler);

        this.twi = twi;
    }

    _createClass(NoopTWIEventHandler, [{
        key: 'start',
        value: function start() {
            this.twi.completeStart();
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.twi.completeStop();
        }
    }, {
        key: 'connectToSlave',
        value: function connectToSlave() {
            this.twi.completeConnect(false);
        }
    }, {
        key: 'writeByte',
        value: function writeByte() {
            this.twi.completeWrite(false);
        }
    }, {
        key: 'readByte',
        value: function readByte() {
            this.twi.completeRead(0xff);
        }
    }]);

    return NoopTWIEventHandler;
}();

var AVRTWI = exports.AVRTWI = function () {
    function AVRTWI(cpu, config, freqMHz) {
        var _this = this;

        _classCallCheck(this, AVRTWI);

        this.cpu = cpu;
        this.config = config;
        this.freqMHz = freqMHz;
        this.eventHandler = new NoopTWIEventHandler(this);
        this.nextTick = null;
        this.updateStatus(STATUS_TWI_IDLE);
        this.cpu.writeHooks[config.TWCR] = function (value) {
            var clearInt = value & TWCR_TWINT;
            if (clearInt) {
                value &= ~TWCR_TWINT;
            }
            var status = _this.status;

            if (clearInt && value & TWCR_TWEN) {
                var twdrValue = _this.cpu.data[_this.config.TWDR];
                _this.nextTick = function () {
                    if (value & TWCR_TWSTA) {
                        _this.eventHandler.start(status !== STATUS_TWI_IDLE);
                    } else if (value & TWCR_TWSTO) {
                        _this.eventHandler.stop();
                    } else if (status === STATUS_START) {
                        _this.eventHandler.connectToSlave(twdrValue >> 1, twdrValue & 0x1 ? false : true);
                    } else if (status === STATUS_SLAW_ACK || status === STATUS_DATA_SENT_ACK) {
                        _this.eventHandler.writeByte(twdrValue);
                    } else if (status === STATUS_SLAR_ACK || status === STATUS_DATA_RECEIVED_ACK) {
                        var ack = !!(value & TWCR_TWEA);
                        _this.eventHandler.readByte(ack);
                    }
                };
                _this.cpu.data[config.TWCR] = value;
                return true;
            }
        };
    }

    _createClass(AVRTWI, [{
        key: 'tick',
        value: function tick() {
            if (this.nextTick) {
                this.nextTick();
                this.nextTick = null;
            }
            if (this.cpu.interruptsEnabled) {
                var _config = this.config,
                    TWCR = _config.TWCR,
                    twiInterrupt = _config.twiInterrupt;

                if (this.cpu.data[TWCR] & TWCR_TWIE && this.cpu.data[TWCR] & TWCR_TWINT) {
                    (0, _interrupt.avrInterrupt)(this.cpu, twiInterrupt);
                    this.cpu.data[TWCR] &= ~TWCR_TWINT;
                }
            }
        }
    }, {
        key: 'completeStart',
        value: function completeStart() {
            this.updateStatus(this.status === STATUS_TWI_IDLE ? STATUS_START : STATUS_REPEATED_START);
        }
    }, {
        key: 'completeStop',
        value: function completeStop() {
            this.cpu.data[this.config.TWCR] &= ~TWCR_TWSTO;
            this.updateStatus(STATUS_TWI_IDLE);
        }
    }, {
        key: 'completeConnect',
        value: function completeConnect(ack) {
            if (this.cpu.data[this.config.TWDR] & 0x1) {
                this.updateStatus(ack ? STATUS_SLAR_ACK : STATUS_SLAR_NACK);
            } else {
                this.updateStatus(ack ? STATUS_SLAW_ACK : STATUS_SLAW_NACK);
            }
        }
    }, {
        key: 'completeWrite',
        value: function completeWrite(ack) {
            this.updateStatus(ack ? STATUS_DATA_SENT_ACK : STATUS_DATA_SENT_NACK);
        }
    }, {
        key: 'completeRead',
        value: function completeRead(value) {
            var ack = !!(this.cpu.data[this.config.TWCR] & TWCR_TWEA);
            this.cpu.data[this.config.TWDR] = value;
            this.updateStatus(ack ? STATUS_DATA_RECEIVED_ACK : STATUS_DATA_RECEIVED_NACK);
        }
    }, {
        key: 'updateStatus',
        value: function updateStatus(value) {
            var _config2 = this.config,
                TWCR = _config2.TWCR,
                TWSR = _config2.TWSR;

            this.cpu.data[TWSR] = this.cpu.data[TWSR] & ~TWSR_TWS_MASK | value;
            this.cpu.data[TWCR] |= TWCR_TWINT;
        }
    }, {
        key: 'prescaler',
        get: function get() {
            switch (this.cpu.data[this.config.TWSR] & TWSR_TWPS_MASK) {
                case 0:
                    return 1;
                case 1:
                    return 4;
                case 2:
                    return 16;
                case 3:
                    return 64;
            }
            // We should never get here:
            throw new Error('Invalid prescaler value!');
        }
    }, {
        key: 'sclFrequency',
        get: function get() {
            return this.freqMHz / (16 + 2 * this.cpu.data[this.config.TWBR] * this.prescaler);
        }
    }, {
        key: 'status',
        get: function get() {
            return this.cpu.data[this.config.TWSR] & TWSR_TWS_MASK;
        }
    }]);

    return AVRTWI;
}();
},{"../cpu/interrupt":"../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../node_modules/avr8js/dist/esm/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cpu = require('./cpu/cpu');

Object.defineProperty(exports, 'CPU', {
  enumerable: true,
  get: function () {
    return _cpu.CPU;
  }
});

var _instruction = require('./cpu/instruction');

Object.defineProperty(exports, 'avrInstruction', {
  enumerable: true,
  get: function () {
    return _instruction.avrInstruction;
  }
});

var _interrupt = require('./cpu/interrupt');

Object.defineProperty(exports, 'avrInterrupt', {
  enumerable: true,
  get: function () {
    return _interrupt.avrInterrupt;
  }
});

var _timer = require('./peripherals/timer');

Object.defineProperty(exports, 'AVRTimer', {
  enumerable: true,
  get: function () {
    return _timer.AVRTimer;
  }
});
Object.defineProperty(exports, 'timer0Config', {
  enumerable: true,
  get: function () {
    return _timer.timer0Config;
  }
});
Object.defineProperty(exports, 'timer1Config', {
  enumerable: true,
  get: function () {
    return _timer.timer1Config;
  }
});
Object.defineProperty(exports, 'timer2Config', {
  enumerable: true,
  get: function () {
    return _timer.timer2Config;
  }
});

var _gpio = require('./peripherals/gpio');

Object.defineProperty(exports, 'AVRIOPort', {
  enumerable: true,
  get: function () {
    return _gpio.AVRIOPort;
  }
});
Object.defineProperty(exports, 'portAConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portAConfig;
  }
});
Object.defineProperty(exports, 'portBConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portBConfig;
  }
});
Object.defineProperty(exports, 'portCConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portCConfig;
  }
});
Object.defineProperty(exports, 'portDConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portDConfig;
  }
});
Object.defineProperty(exports, 'portEConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portEConfig;
  }
});
Object.defineProperty(exports, 'portFConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portFConfig;
  }
});
Object.defineProperty(exports, 'portGConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portGConfig;
  }
});
Object.defineProperty(exports, 'portHConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portHConfig;
  }
});
Object.defineProperty(exports, 'portJConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portJConfig;
  }
});
Object.defineProperty(exports, 'portKConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portKConfig;
  }
});
Object.defineProperty(exports, 'portLConfig', {
  enumerable: true,
  get: function () {
    return _gpio.portLConfig;
  }
});
Object.defineProperty(exports, 'PinState', {
  enumerable: true,
  get: function () {
    return _gpio.PinState;
  }
});

var _usart = require('./peripherals/usart');

Object.defineProperty(exports, 'AVRUSART', {
  enumerable: true,
  get: function () {
    return _usart.AVRUSART;
  }
});
Object.defineProperty(exports, 'usart0Config', {
  enumerable: true,
  get: function () {
    return _usart.usart0Config;
  }
});

var _twi = require('./peripherals/twi');

Object.keys(_twi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _twi[key];
    }
  });
});
},{"./cpu/cpu":"../node_modules/avr8js/dist/esm/cpu/cpu.js","./cpu/instruction":"../node_modules/avr8js/dist/esm/cpu/instruction.js","./cpu/interrupt":"../node_modules/avr8js/dist/esm/cpu/interrupt.js","./peripherals/timer":"../node_modules/avr8js/dist/esm/peripherals/timer.js","./peripherals/gpio":"../node_modules/avr8js/dist/esm/peripherals/gpio.js","./peripherals/usart":"../node_modules/avr8js/dist/esm/peripherals/usart.js","./peripherals/twi":"../node_modules/avr8js/dist/esm/peripherals/twi.js"}],"intelhex.ts":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadHex = loadHex;
/**
 * Minimal Intel HEX loader
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */
function loadHex(source, target) {
    for (var _i = 0, _a = source.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        if (line[0] === ':' && line.substr(7, 2) === '00') {
            var bytes = parseInt(line.substr(1, 2), 16);
            var addr = parseInt(line.substr(3, 4), 16);
            for (var i = 0; i < bytes; i++) {
                target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
            }
        }
    }
}
},{}],"task-scheduler.ts":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var MicroTaskScheduler = /** @class */function () {
    function MicroTaskScheduler() {
        var _this = this;
        this.messageName = 'zero-timeout-message';
        this.executionQueue = [];
        this.stopped = true;
        this.handleMessage = function (event) {
            if (event.data === _this.messageName) {
                event.stopPropagation();
                var executeJob = _this.executionQueue.shift();
                if (executeJob !== undefined) {
                    executeJob();
                }
            }
        };
    }
    MicroTaskScheduler.prototype.start = function () {
        if (this.stopped) {
            this.stopped = false;
            window.addEventListener('message', this.handleMessage, true);
        }
    };
    MicroTaskScheduler.prototype.stop = function () {
        this.stopped = true;
        window.removeEventListener('message', this.handleMessage, true);
    };
    MicroTaskScheduler.prototype.postTask = function (fn) {
        if (!this.stopped) {
            this.executionQueue.push(fn);
            window.postMessage(this.messageName, '*');
        }
    };
    return MicroTaskScheduler;
}();
exports.MicroTaskScheduler = MicroTaskScheduler;
},{}],"execute.ts":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AVRRunner = undefined;

var _avr8js = require('avr8js');

var _intelhex = require('./intelhex');

var _taskScheduler = require('./task-scheduler');

// ATmega328p params
var FLASH = 0x8000;
var AVRRunner = /** @class */function () {
    function AVRRunner(hex) {
        this.program = new Uint16Array(FLASH);
        this.speed = 16e6; // 16 MHZ
        this.workUnitCycles = 500000;
        this.taskScheduler = new _taskScheduler.MicroTaskScheduler();
        (0, _intelhex.loadHex)(hex, new Uint8Array(this.program.buffer));
        this.cpu = new _avr8js.CPU(this.program);
        this.timer = new _avr8js.AVRTimer(this.cpu, _avr8js.timer0Config);
        this.portB = new _avr8js.AVRIOPort(this.cpu, _avr8js.portBConfig);
        this.portC = new _avr8js.AVRIOPort(this.cpu, _avr8js.portCConfig);
        this.portD = new _avr8js.AVRIOPort(this.cpu, _avr8js.portDConfig);
        this.usart = new _avr8js.AVRUSART(this.cpu, _avr8js.usart0Config, this.speed);
        this.taskScheduler.start();
    }
    // CPU main loop
    AVRRunner.prototype.execute = function (callback) {
        var _this = this;
        var cyclesToRun = this.cpu.cycles + this.workUnitCycles;
        while (this.cpu.cycles < cyclesToRun) {
            (0, _avr8js.avrInstruction)(this.cpu);
            this.timer.tick();
            this.usart.tick();
        }
        callback(this.cpu);
        this.taskScheduler.postTask(function () {
            return _this.execute(callback);
        });
    };
    AVRRunner.prototype.stop = function () {
        this.taskScheduler.stop();
    };
    return AVRRunner;
}();
exports.AVRRunner = AVRRunner;
},{"avr8js":"../node_modules/avr8js/dist/esm/index.js","./intelhex":"intelhex.ts","./task-scheduler":"task-scheduler.ts"}],"format-time.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatTime = formatTime;
function zeroPad(value, length) {
    var sval = value.toString();
    while (sval.length < length) {
        sval = '0' + sval;
    }
    return sval;
}
function formatTime(seconds) {
    var ms = Math.floor(seconds * 1000) % 1000;
    var secs = Math.floor(seconds % 60);
    var mins = Math.floor(seconds / 60);
    return zeroPad(mins, 2) + ":" + zeroPad(secs, 2) + "." + zeroPad(ms, 3);
}
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"index.css":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"cpu-performance.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CPUPerformance = /** @class */function () {
    function CPUPerformance(cpu, MHZ) {
        this.cpu = cpu;
        this.MHZ = MHZ;
        this.prevTime = 0;
        this.prevCycles = 0;
        this.samples = new Float32Array(64);
        this.sampleIndex = 0;
    }
    CPUPerformance.prototype.reset = function () {
        this.prevTime = 0;
        this.prevCycles = 0;
        this.sampleIndex = 0;
    };
    CPUPerformance.prototype.update = function () {
        if (this.prevTime) {
            var delta = performance.now() - this.prevTime;
            var deltaCycles = this.cpu.cycles - this.prevCycles;
            var deltaCpuMillis = 1000 * (deltaCycles / this.MHZ);
            var factor = deltaCpuMillis / delta;
            if (!this.sampleIndex) {
                this.samples.fill(factor);
            }
            this.samples[this.sampleIndex++ % this.samples.length] = factor;
        }
        this.prevCycles = this.cpu.cycles;
        this.prevTime = performance.now();
        var avg = this.samples.reduce(function (x, y) {
            return x + y;
        }) / this.samples.length;
        return avg;
    };
    return CPUPerformance;
}();
exports.CPUPerformance = CPUPerformance;
},{}],"utils/editor-history.util.ts":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var AVRJS8_EDITOR_HISTORY = 'AVRJS8_EDITOR_HISTORY';
var EditorHistoryUtil = /** @class */function () {
    function EditorHistoryUtil() {}
    EditorHistoryUtil.storeSnippet = function (codeSnippet) {
        if (!EditorHistoryUtil.hasLocalStorage) {
            return;
        }
        window.localStorage.setItem(AVRJS8_EDITOR_HISTORY, codeSnippet);
    };
    EditorHistoryUtil.clearSnippet = function () {
        if (!EditorHistoryUtil.hasLocalStorage) {
            return;
        }
        localStorage.removeItem(AVRJS8_EDITOR_HISTORY);
    };
    EditorHistoryUtil.getValue = function () {
        if (!EditorHistoryUtil.hasLocalStorage) {
            return;
        }
        return localStorage.getItem(AVRJS8_EDITOR_HISTORY);
    };
    EditorHistoryUtil.hasLocalStorage = !!window.localStorage;
    return EditorHistoryUtil;
}();
exports.EditorHistoryUtil = EditorHistoryUtil;
},{}],"../node_modules/matter-js/build/matter.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/**
* matter-js 0.14.2 by @liabru 2018-06-11
* http://brm.io/matter-js/
* License MIT
*/

/**
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Matter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
/**
* The `Matter.Body` module contains methods for creating and manipulating body models.
* A `Matter.Body` is a rigid body that can be simulated by a `Matter.Engine`.
* Factories for commonly used body configurations (such as rectangles, circles and other polygons) can be found in the module `Matter.Bodies`.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).

* @class Body
*/

var Body = {};

module.exports = Body;

var Vertices = _dereq_('../geometry/Vertices');
var Vector = _dereq_('../geometry/Vector');
var Sleeping = _dereq_('../core/Sleeping');
var Render = _dereq_('../render/Render');
var Common = _dereq_('../core/Common');
var Bounds = _dereq_('../geometry/Bounds');
var Axes = _dereq_('../geometry/Axes');

(function() {

    Body._inertiaScale = 4;
    Body._nextCollidingGroupId = 1;
    Body._nextNonCollidingGroupId = -1;
    Body._nextCategory = 0x0001;

    /**
     * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * Vertices must be specified in clockwise order.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {} options
     * @return {body} body
     */
    Body.create = function(options) {
        var defaults = {
            id: Common.nextId(),
            type: 'body',
            label: 'Body',
            parts: [],
            plugin: {},
            angle: 0,
            vertices: Vertices.fromPath('L 0 0 L 40 0 L 40 40 L 0 40'),
            position: { x: 0, y: 0 },
            force: { x: 0, y: 0 },
            torque: 0,
            positionImpulse: { x: 0, y: 0 },
            constraintImpulse: { x: 0, y: 0, angle: 0 },
            totalContacts: 0,
            speed: 0,
            angularSpeed: 0,
            velocity: { x: 0, y: 0 },
            angularVelocity: 0,
            isSensor: false,
            isStatic: false,
            isSleeping: false,
            motion: 0,
            sleepThreshold: 60,
            density: 0.001,
            restitution: 0,
            friction: 0.1,
            frictionStatic: 0.5,
            frictionAir: 0.01,
            collisionFilter: {
                category: 0x0001,
                mask: 0xFFFFFFFF,
                group: 0
            },
            slop: 0.05,
            timeScale: 1,
            render: {
                visible: true,
                opacity: 1,
                sprite: {
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0
                },
                lineWidth: 0
            }
        };

        var body = Common.extend(defaults, options);

        _initProperties(body, options);

        return body;
    };

    /**
     * Returns the next unique group index for which bodies will collide.
     * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
     * See `body.collisionFilter` for more information.
     * @method nextGroup
     * @param {bool} [isNonColliding=false]
     * @return {Number} Unique group index
     */
    Body.nextGroup = function(isNonColliding) {
        if (isNonColliding)
            return Body._nextNonCollidingGroupId--;

        return Body._nextCollidingGroupId++;
    };

    /**
     * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
     * There are 32 available. See `body.collisionFilter` for more information.
     * @method nextCategory
     * @return {Number} Unique category bitfield
     */
    Body.nextCategory = function() {
        Body._nextCategory = Body._nextCategory << 1;
        return Body._nextCategory;
    };

    /**
     * Initialises body properties.
     * @method _initProperties
     * @private
     * @param {body} body
     * @param {} [options]
     */
    var _initProperties = function(body, options) {
        options = options || {};

        // init required properties (order is important)
        Body.set(body, {
            bounds: body.bounds || Bounds.create(body.vertices),
            positionPrev: body.positionPrev || Vector.clone(body.position),
            anglePrev: body.anglePrev || body.angle,
            vertices: body.vertices,
            parts: body.parts || [body],
            isStatic: body.isStatic,
            isSleeping: body.isSleeping,
            parent: body.parent || body
        });

        Vertices.rotate(body.vertices, body.angle, body.position);
        Axes.rotate(body.axes, body.angle);
        Bounds.update(body.bounds, body.vertices, body.velocity);

        // allow options to override the automatically calculated properties
        Body.set(body, {
            axes: options.axes || body.axes,
            area: options.area || body.area,
            mass: options.mass || body.mass,
            inertia: options.inertia || body.inertia
        });

        // render properties
        var defaultFillStyle = (body.isStatic ? '#2e2b44' : Common.choose(['#006BA6', '#0496FF', '#FFBC42', '#D81159', '#8F2D56'])),
            defaultStrokeStyle = '#000';
        body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
        body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
        body.render.sprite.xOffset += -(body.bounds.min.x - body.position.x) / (body.bounds.max.x - body.bounds.min.x);
        body.render.sprite.yOffset += -(body.bounds.min.y - body.position.y) / (body.bounds.max.y - body.bounds.min.y);
    };

    /**
     * Given a property and a value (or map of), sets the property(s) on the body, using the appropriate setter functions if they exist.
     * Prefer to use the actual setter functions in performance critical situations.
     * @method set
     * @param {body} body
     * @param {} settings A property name (or map of properties and values) to set on the body.
     * @param {} value The value to set if `settings` is a single property name.
     */
    Body.set = function(body, settings, value) {
        var property;

        if (typeof settings === 'string') {
            property = settings;
            settings = {};
            settings[property] = value;
        }

        for (property in settings) {
            value = settings[property];

            if (!settings.hasOwnProperty(property))
                continue;

            switch (property) {

            case 'isStatic':
                Body.setStatic(body, value);
                break;
            case 'isSleeping':
                Sleeping.set(body, value);
                break;
            case 'mass':
                Body.setMass(body, value);
                break;
            case 'density':
                Body.setDensity(body, value);
                break;
            case 'inertia':
                Body.setInertia(body, value);
                break;
            case 'vertices':
                Body.setVertices(body, value);
                break;
            case 'position':
                Body.setPosition(body, value);
                break;
            case 'angle':
                Body.setAngle(body, value);
                break;
            case 'velocity':
                Body.setVelocity(body, value);
                break;
            case 'angularVelocity':
                Body.setAngularVelocity(body, value);
                break;
            case 'parts':
                Body.setParts(body, value);
                break;
            default:
                body[property] = value;

            }
        }
    };

    /**
     * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
     * @method setStatic
     * @param {body} body
     * @param {bool} isStatic
     */
    Body.setStatic = function(body, isStatic) {
        for (var i = 0; i < body.parts.length; i++) {
            var part = body.parts[i];
            part.isStatic = isStatic;

            if (isStatic) {
                part._original = {
                    restitution: part.restitution,
                    friction: part.friction,
                    mass: part.mass,
                    inertia: part.inertia,
                    density: part.density,
                    inverseMass: part.inverseMass,
                    inverseInertia: part.inverseInertia
                };

                part.restitution = 0;
                part.friction = 1;
                part.mass = part.inertia = part.density = Infinity;
                part.inverseMass = part.inverseInertia = 0;

                part.positionPrev.x = part.position.x;
                part.positionPrev.y = part.position.y;
                part.anglePrev = part.angle;
                part.angularVelocity = 0;
                part.speed = 0;
                part.angularSpeed = 0;
                part.motion = 0;
            } else if (part._original) {
                part.restitution = part._original.restitution;
                part.friction = part._original.friction;
                part.mass = part._original.mass;
                part.inertia = part._original.inertia;
                part.density = part._original.density;
                part.inverseMass = part._original.inverseMass;
                part.inverseInertia = part._original.inverseInertia;

                delete part._original;
            }
        }
    };

    /**
     * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
     * @method setMass
     * @param {body} body
     * @param {number} mass
     */
    Body.setMass = function(body, mass) {
        var moment = body.inertia / (body.mass / 6);
        body.inertia = moment * (mass / 6);
        body.inverseInertia = 1 / body.inertia;

        body.mass = mass;
        body.inverseMass = 1 / body.mass;
        body.density = body.mass / body.area;
    };

    /**
     * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
     * @method setDensity
     * @param {body} body
     * @param {number} density
     */
    Body.setDensity = function(body, density) {
        Body.setMass(body, density * body.area);
        body.density = density;
    };

    /**
     * Sets the moment of inertia (i.e. second moment of area) of the body of the body. 
     * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
     * @method setInertia
     * @param {body} body
     * @param {number} inertia
     */
    Body.setInertia = function(body, inertia) {
        body.inertia = inertia;
        body.inverseInertia = 1 / body.inertia;
    };

    /**
     * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
     * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
     * They are then automatically translated to world space based on `body.position`.
     *
     * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
     * Vertices must form a convex hull, concave hulls are not supported.
     *
     * @method setVertices
     * @param {body} body
     * @param {vector[]} vertices
     */
    Body.setVertices = function(body, vertices) {
        // change vertices
        if (vertices[0].body === body) {
            body.vertices = vertices;
        } else {
            body.vertices = Vertices.create(vertices, body);
        }

        // update properties
        body.axes = Axes.fromVertices(body.vertices);
        body.area = Vertices.area(body.vertices);
        Body.setMass(body, body.density * body.area);

        // orient vertices around the centre of mass at origin (0, 0)
        var centre = Vertices.centre(body.vertices);
        Vertices.translate(body.vertices, centre, -1);

        // update inertia while vertices are at origin (0, 0)
        Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));

        // update geometry
        Vertices.translate(body.vertices, body.position);
        Bounds.update(body.bounds, body.vertices, body.velocity);
    };

    /**
     * Sets the parts of the `body` and updates mass, inertia and centroid.
     * Each part will have its parent set to `body`.
     * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
     * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
     * @method setParts
     * @param {body} body
     * @param [body] parts
     * @param {bool} [autoHull=true]
     */
    Body.setParts = function(body, parts, autoHull) {
        var i;

        // add all the parts, ensuring that the first part is always the parent body
        parts = parts.slice(0);
        body.parts.length = 0;
        body.parts.push(body);
        body.parent = body;

        for (i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part !== body) {
                part.parent = body;
                body.parts.push(part);
            }
        }

        if (body.parts.length === 1)
            return;

        autoHull = typeof autoHull !== 'undefined' ? autoHull : true;

        // find the convex hull of all parts to set on the parent body
        if (autoHull) {
            var vertices = [];
            for (i = 0; i < parts.length; i++) {
                vertices = vertices.concat(parts[i].vertices);
            }

            Vertices.clockwiseSort(vertices);

            var hull = Vertices.hull(vertices),
                hullCentre = Vertices.centre(hull);

            Body.setVertices(body, hull);
            Vertices.translate(body.vertices, hullCentre);
        }

        // sum the properties of all compound parts of the parent body
        var total = Body._totalProperties(body);

        body.area = total.area;
        body.parent = body;
        body.position.x = total.centre.x;
        body.position.y = total.centre.y;
        body.positionPrev.x = total.centre.x;
        body.positionPrev.y = total.centre.y;

        Body.setMass(body, total.mass);
        Body.setInertia(body, total.inertia);
        Body.setPosition(body, total.centre);
    };

    /**
     * Sets the position of the body instantly. Velocity, angle, force etc. are unchanged.
     * @method setPosition
     * @param {body} body
     * @param {vector} position
     */
    Body.setPosition = function(body, position) {
        var delta = Vector.sub(position, body.position);
        body.positionPrev.x += delta.x;
        body.positionPrev.y += delta.y;

        for (var i = 0; i < body.parts.length; i++) {
            var part = body.parts[i];
            part.position.x += delta.x;
            part.position.y += delta.y;
            Vertices.translate(part.vertices, delta);
            Bounds.update(part.bounds, part.vertices, body.velocity);
        }
    };

    /**
     * Sets the angle of the body instantly. Angular velocity, position, force etc. are unchanged.
     * @method setAngle
     * @param {body} body
     * @param {number} angle
     */
    Body.setAngle = function(body, angle) {
        var delta = angle - body.angle;
        body.anglePrev += delta;

        for (var i = 0; i < body.parts.length; i++) {
            var part = body.parts[i];
            part.angle += delta;
            Vertices.rotate(part.vertices, delta, body.position);
            Axes.rotate(part.axes, delta);
            Bounds.update(part.bounds, part.vertices, body.velocity);
            if (i > 0) {
                Vector.rotateAbout(part.position, delta, body.position, part.position);
            }
        }
    };

    /**
     * Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
     * @method setVelocity
     * @param {body} body
     * @param {vector} velocity
     */
    Body.setVelocity = function(body, velocity) {
        body.positionPrev.x = body.position.x - velocity.x;
        body.positionPrev.y = body.position.y - velocity.y;
        body.velocity.x = velocity.x;
        body.velocity.y = velocity.y;
        body.speed = Vector.magnitude(body.velocity);
    };

    /**
     * Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
     * @method setAngularVelocity
     * @param {body} body
     * @param {number} velocity
     */
    Body.setAngularVelocity = function(body, velocity) {
        body.anglePrev = body.angle - velocity;
        body.angularVelocity = velocity;
        body.angularSpeed = Math.abs(body.angularVelocity);
    };

    /**
     * Moves a body by a given vector relative to its current position, without imparting any velocity.
     * @method translate
     * @param {body} body
     * @param {vector} translation
     */
    Body.translate = function(body, translation) {
        Body.setPosition(body, Vector.add(body.position, translation));
    };

    /**
     * Rotates a body by a given angle relative to its current angle, without imparting any angular velocity.
     * @method rotate
     * @param {body} body
     * @param {number} rotation
     * @param {vector} [point]
     */
    Body.rotate = function(body, rotation, point) {
        if (!point) {
            Body.setAngle(body, body.angle + rotation);
        } else {
            var cos = Math.cos(rotation),
                sin = Math.sin(rotation),
                dx = body.position.x - point.x,
                dy = body.position.y - point.y;
                
            Body.setPosition(body, {
                x: point.x + (dx * cos - dy * sin),
                y: point.y + (dx * sin + dy * cos)
            });

            Body.setAngle(body, body.angle + rotation);
        }
    };

    /**
     * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
     * @method scale
     * @param {body} body
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {vector} [point]
     */
    Body.scale = function(body, scaleX, scaleY, point) {
        var totalArea = 0,
            totalInertia = 0;

        point = point || body.position;

        for (var i = 0; i < body.parts.length; i++) {
            var part = body.parts[i];

            // scale vertices
            Vertices.scale(part.vertices, scaleX, scaleY, point);

            // update properties
            part.axes = Axes.fromVertices(part.vertices);
            part.area = Vertices.area(part.vertices);
            Body.setMass(part, body.density * part.area);

            // update inertia (requires vertices to be at origin)
            Vertices.translate(part.vertices, { x: -part.position.x, y: -part.position.y });
            Body.setInertia(part, Body._inertiaScale * Vertices.inertia(part.vertices, part.mass));
            Vertices.translate(part.vertices, { x: part.position.x, y: part.position.y });

            if (i > 0) {
                totalArea += part.area;
                totalInertia += part.inertia;
            }

            // scale position
            part.position.x = point.x + (part.position.x - point.x) * scaleX;
            part.position.y = point.y + (part.position.y - point.y) * scaleY;

            // update bounds
            Bounds.update(part.bounds, part.vertices, body.velocity);
        }

        // handle parent body
        if (body.parts.length > 1) {
            body.area = totalArea;

            if (!body.isStatic) {
                Body.setMass(body, body.density * totalArea);
                Body.setInertia(body, totalInertia);
            }
        }

        // handle circles
        if (body.circleRadius) { 
            if (scaleX === scaleY) {
                body.circleRadius *= scaleX;
            } else {
                // body is no longer a circle
                body.circleRadius = null;
            }
        }
    };

    /**
     * Performs a simulation step for the given `body`, including updating position and angle using Verlet integration.
     * @method update
     * @param {body} body
     * @param {number} deltaTime
     * @param {number} timeScale
     * @param {number} correction
     */
    Body.update = function(body, deltaTime, timeScale, correction) {
        var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);

        // from the previous step
        var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
            velocityPrevX = body.position.x - body.positionPrev.x,
            velocityPrevY = body.position.y - body.positionPrev.y;

        // update velocity with Verlet integration
        body.velocity.x = (velocityPrevX * frictionAir * correction) + (body.force.x / body.mass) * deltaTimeSquared;
        body.velocity.y = (velocityPrevY * frictionAir * correction) + (body.force.y / body.mass) * deltaTimeSquared;

        body.positionPrev.x = body.position.x;
        body.positionPrev.y = body.position.y;
        body.position.x += body.velocity.x;
        body.position.y += body.velocity.y;

        // update angular velocity with Verlet integration
        body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
        body.anglePrev = body.angle;
        body.angle += body.angularVelocity;

        // track speed and acceleration
        body.speed = Vector.magnitude(body.velocity);
        body.angularSpeed = Math.abs(body.angularVelocity);

        // transform the body geometry
        for (var i = 0; i < body.parts.length; i++) {
            var part = body.parts[i];

            Vertices.translate(part.vertices, body.velocity);
            
            if (i > 0) {
                part.position.x += body.velocity.x;
                part.position.y += body.velocity.y;
            }

            if (body.angularVelocity !== 0) {
                Vertices.rotate(part.vertices, body.angularVelocity, body.position);
                Axes.rotate(part.axes, body.angularVelocity);
                if (i > 0) {
                    Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
                }
            }

            Bounds.update(part.bounds, part.vertices, body.velocity);
        }
    };

    /**
     * Applies a force to a body from a given world-space position, including resulting torque.
     * @method applyForce
     * @param {body} body
     * @param {vector} position
     * @param {vector} force
     */
    Body.applyForce = function(body, position, force) {
        body.force.x += force.x;
        body.force.y += force.y;
        var offset = { x: position.x - body.position.x, y: position.y - body.position.y };
        body.torque += offset.x * force.y - offset.y * force.x;
    };

    /**
     * Returns the sums of the properties of all compound parts of the parent body.
     * @method _totalProperties
     * @private
     * @param {body} body
     * @return {}
     */
    Body._totalProperties = function(body) {
        // from equations at:
        // https://ecourses.ou.edu/cgi-bin/ebook.cgi?doc=&topic=st&chap_sec=07.2&page=theory
        // http://output.to/sideway/default.asp?qno=121100087

        var properties = {
            mass: 0,
            area: 0,
            inertia: 0,
            centre: { x: 0, y: 0 }
        };

        // sum the properties of all compound parts of the parent body
        for (var i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
            var part = body.parts[i],
                mass = part.mass !== Infinity ? part.mass : 1;

            properties.mass += mass;
            properties.area += part.area;
            properties.inertia += part.inertia;
            properties.centre = Vector.add(properties.centre, Vector.mult(part.position, mass));
        }

        properties.centre = Vector.div(properties.centre, properties.mass);

        return properties;
    };

    /*
    *
    *  Events Documentation
    *
    */

    /**
    * Fired when a body starts sleeping (where `this` is the body).
    *
    * @event sleepStart
    * @this {body} The body that has started sleeping
    * @param {} event An event object
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when a body ends sleeping (where `this` is the body).
    *
    * @event sleepEnd
    * @this {body} The body that has ended sleeping
    * @param {} event An event object
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * An integer `Number` uniquely identifying number generated in `Body.create` by `Common.nextId`.
     *
     * @property id
     * @type number
     */

    /**
     * A `String` denoting the type of object.
     *
     * @property type
     * @type string
     * @default "body"
     * @readOnly
     */

    /**
     * An arbitrary `String` name to help the user identify and manage bodies.
     *
     * @property label
     * @type string
     * @default "Body"
     */

    /**
     * An array of bodies that make up this body. 
     * The first body in the array must always be a self reference to the current body instance.
     * All bodies in the `parts` array together form a single rigid compound body.
     * Parts are allowed to overlap, have gaps or holes or even form concave bodies.
     * Parts themselves should never be added to a `World`, only the parent body should be.
     * Use `Body.setParts` when setting parts to ensure correct updates of all properties.
     *
     * @property parts
     * @type body[]
     */

    /**
     * An object reserved for storing plugin-specific properties.
     *
     * @property plugin
     * @type {}
     */

    /**
     * A self reference if the body is _not_ a part of another body.
     * Otherwise this is a reference to the body that this is a part of.
     * See `body.parts`.
     *
     * @property parent
     * @type body
     */

    /**
     * A `Number` specifying the angle of the body, in radians.
     *
     * @property angle
     * @type number
     * @default 0
     */

    /**
     * An array of `Vector` objects that specify the convex hull of the rigid body.
     * These should be provided about the origin `(0, 0)`. E.g.
     *
     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
     *
     * When passed via `Body.create`, the vertices are translated relative to `body.position` (i.e. world-space, and constantly updated by `Body.update` during simulation).
     * The `Vector` objects are also augmented with additional properties required for efficient collision detection. 
     *
     * Other properties such as `inertia` and `bounds` are automatically calculated from the passed vertices (unless provided via `options`).
     * Concave hulls are not currently supported. The module `Matter.Vertices` contains useful methods for working with vertices.
     *
     * @property vertices
     * @type vector[]
     */

    /**
     * A `Vector` that specifies the current world-space position of the body.
     *
     * @property position
     * @type vector
     * @default { x: 0, y: 0 }
     */

    /**
     * A `Vector` that specifies the force to apply in the current step. It is zeroed after every `Body.update`. See also `Body.applyForce`.
     *
     * @property force
     * @type vector
     * @default { x: 0, y: 0 }
     */

    /**
     * A `Number` that specifies the torque (turning force) to apply in the current step. It is zeroed after every `Body.update`.
     *
     * @property torque
     * @type number
     * @default 0
     */

    /**
     * A `Number` that _measures_ the current speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.velocity`).
     *
     * @readOnly
     * @property speed
     * @type number
     * @default 0
     */

    /**
     * A `Number` that _measures_ the current angular speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.angularVelocity`).
     *
     * @readOnly
     * @property angularSpeed
     * @type number
     * @default 0
     */

    /**
     * A `Vector` that _measures_ the current velocity of the body after the last `Body.update`. It is read-only. 
     * If you need to modify a body's velocity directly, you should either apply a force or simply change the body's `position` (as the engine uses position-Verlet integration).
     *
     * @readOnly
     * @property velocity
     * @type vector
     * @default { x: 0, y: 0 }
     */

    /**
     * A `Number` that _measures_ the current angular velocity of the body after the last `Body.update`. It is read-only. 
     * If you need to modify a body's angular velocity directly, you should apply a torque or simply change the body's `angle` (as the engine uses position-Verlet integration).
     *
     * @readOnly
     * @property angularVelocity
     * @type number
     * @default 0
     */

    /**
     * A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
     * If you need to set a body as static after its creation, you should use `Body.setStatic` as this requires more than just setting this flag.
     *
     * @property isStatic
     * @type boolean
     * @default false
     */

    /**
     * A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
     *
     * @property isSensor
     * @type boolean
     * @default false
     */

    /**
     * A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
     * If you need to set a body as sleeping, you should use `Sleeping.set` as this requires more than just setting this flag.
     *
     * @property isSleeping
     * @type boolean
     * @default false
     */

    /**
     * A `Number` that _measures_ the amount of movement a body currently has (a combination of `speed` and `angularSpeed`). It is read-only and always positive.
     * It is used and updated by the `Matter.Sleeping` module during simulation to decide if a body has come to rest.
     *
     * @readOnly
     * @property motion
     * @type number
     * @default 0
     */

    /**
     * A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
     *
     * @property sleepThreshold
     * @type number
     * @default 60
     */

    /**
     * A `Number` that defines the density of the body, that is its mass per unit area.
     * If you pass the density via `Body.create` the `mass` property is automatically calculated for you based on the size (area) of the object.
     * This is generally preferable to simply setting mass and allows for more intuitive definition of materials (e.g. rock has a higher density than wood).
     *
     * @property density
     * @type number
     * @default 0.001
     */

    /**
     * A `Number` that defines the mass of the body, although it may be more appropriate to specify the `density` property instead.
     * If you modify this value, you must also modify the `body.inverseMass` property (`1 / mass`).
     *
     * @property mass
     * @type number
     */

    /**
     * A `Number` that defines the inverse mass of the body (`1 / mass`).
     * If you modify this value, you must also modify the `body.mass` property.
     *
     * @property inverseMass
     * @type number
     */

    /**
     * A `Number` that defines the moment of inertia (i.e. second moment of area) of the body.
     * It is automatically calculated from the given convex hull (`vertices` array) and density in `Body.create`.
     * If you modify this value, you must also modify the `body.inverseInertia` property (`1 / inertia`).
     *
     * @property inertia
     * @type number
     */

    /**
     * A `Number` that defines the inverse moment of inertia of the body (`1 / inertia`).
     * If you modify this value, you must also modify the `body.inertia` property.
     *
     * @property inverseInertia
     * @type number
     */

    /**
     * A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
     * A value of `0` means collisions may be perfectly inelastic and no bouncing may occur. 
     * A value of `0.8` means the body may bounce back with approximately 80% of its kinetic energy.
     * Note that collision response is based on _pairs_ of bodies, and that `restitution` values are _combined_ with the following formula:
     *
     *     Math.max(bodyA.restitution, bodyB.restitution)
     *
     * @property restitution
     * @type number
     * @default 0
     */

    /**
     * A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`.
     * A value of `0` means that the body may slide indefinitely.
     * A value of `1` means the body may come to a stop almost instantly after a force is applied.
     *
     * The effects of the value may be non-linear. 
     * High values may be unstable depending on the body.
     * The engine uses a Coulomb friction model including static and kinetic friction.
     * Note that collision response is based on _pairs_ of bodies, and that `friction` values are _combined_ with the following formula:
     *
     *     Math.min(bodyA.friction, bodyB.friction)
     *
     * @property friction
     * @type number
     * @default 0.1
     */

    /**
     * A `Number` that defines the static friction of the body (in the Coulomb friction model). 
     * A value of `0` means the body will never 'stick' when it is nearly stationary and only dynamic `friction` is used.
     * The higher the value (e.g. `10`), the more force it will take to initially get the body moving when nearly stationary.
     * This value is multiplied with the `friction` property to make it easier to change `friction` and maintain an appropriate amount of static friction.
     *
     * @property frictionStatic
     * @type number
     * @default 0.5
     */

    /**
     * A `Number` that defines the air friction of the body (air resistance). 
     * A value of `0` means the body will never slow as it moves through space.
     * The higher the value, the faster a body slows when moving through space.
     * The effects of the value are non-linear. 
     *
     * @property frictionAir
     * @type number
     * @default 0.01
     */

    /**
     * An `Object` that specifies the collision filtering properties of this body.
     *
     * Collisions between two bodies will obey the following rules:
     * - If the two bodies have the same non-zero value of `collisionFilter.group`,
     *   they will always collide if the value is positive, and they will never collide
     *   if the value is negative.
     * - If the two bodies have different values of `collisionFilter.group` or if one
     *   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
     *
     * Each body belongs to a collision category, given by `collisionFilter.category`. This
     * value is used as a bit field and the category should have only one bit set, meaning that
     * the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
     * different collision categories available.
     *
     * Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
     * the categories it collides with (the value is the bitwise AND value of all these categories).
     *
     * Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
     * category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
     * are both true.
     *
     * @property collisionFilter
     * @type object
     */

    /**
     * An Integer `Number`, that specifies the collision group this body belongs to.
     * See `body.collisionFilter` for more information.
     *
     * @property collisionFilter.group
     * @type object
     * @default 0
     */

    /**
     * A bit field that specifies the collision category this body belongs to.
     * The category value should have only one bit set, for example `0x0001`.
     * This means there are up to 32 unique collision categories available.
     * See `body.collisionFilter` for more information.
     *
     * @property collisionFilter.category
     * @type object
     * @default 1
     */

    /**
     * A bit mask that specifies the collision categories this body may collide with.
     * See `body.collisionFilter` for more information.
     *
     * @property collisionFilter.mask
     * @type object
     * @default -1
     */

    /**
     * A `Number` that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies.
     * Avoid changing this value unless you understand the purpose of `slop` in physics engines.
     * The default should generally suffice, although very large bodies may require larger values for stable stacking.
     *
     * @property slop
     * @type number
     * @default 0.05
     */

    /**
     * A `Number` that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
     *
     * @property timeScale
     * @type number
     * @default 1
     */

    /**
     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
     *
     * @property render
     * @type object
     */

    /**
     * A flag that indicates if the body should be rendered.
     *
     * @property render.visible
     * @type boolean
     * @default true
     */

    /**
     * Sets the opacity to use when rendering.
     *
     * @property render.opacity
     * @type number
     * @default 1
    */

    /**
     * An `Object` that defines the sprite properties to use when rendering, if any.
     *
     * @property render.sprite
     * @type object
     */

    /**
     * An `String` that defines the path to the image to use as the sprite texture, if any.
     *
     * @property render.sprite.texture
     * @type string
     */
     
    /**
     * A `Number` that defines the scaling in the x-axis for the sprite, if any.
     *
     * @property render.sprite.xScale
     * @type number
     * @default 1
     */

    /**
     * A `Number` that defines the scaling in the y-axis for the sprite, if any.
     *
     * @property render.sprite.yScale
     * @type number
     * @default 1
     */

     /**
      * A `Number` that defines the offset in the x-axis for the sprite (normalised by texture width).
      *
      * @property render.sprite.xOffset
      * @type number
      * @default 0
      */

     /**
      * A `Number` that defines the offset in the y-axis for the sprite (normalised by texture height).
      *
      * @property render.sprite.yOffset
      * @type number
      * @default 0
      */

    /**
     * A `Number` that defines the line width to use when rendering the body outline (if a sprite is not defined).
     * A value of `0` means no outline will be rendered.
     *
     * @property render.lineWidth
     * @type number
     * @default 0
     */

    /**
     * A `String` that defines the fill style to use when rendering the body (if a sprite is not defined).
     * It is the same as when using a canvas, so it accepts CSS style property values.
     *
     * @property render.fillStyle
     * @type string
     * @default a random colour
     */

    /**
     * A `String` that defines the stroke style to use when rendering the body outline (if a sprite is not defined).
     * It is the same as when using a canvas, so it accepts CSS style property values.
     *
     * @property render.strokeStyle
     * @type string
     * @default a random colour
     */

    /**
     * An array of unique axis vectors (edge normals) used for collision detection.
     * These are automatically calculated from the given convex hull (`vertices` array) in `Body.create`.
     * They are constantly updated by `Body.update` during the simulation.
     *
     * @property axes
     * @type vector[]
     */
     
    /**
     * A `Number` that _measures_ the area of the body's convex hull, calculated at creation by `Body.create`.
     *
     * @property area
     * @type string
     * @default 
     */

    /**
     * A `Bounds` object that defines the AABB region for the body.
     * It is automatically calculated from the given convex hull (`vertices` array) in `Body.create` and constantly updated by `Body.update` during simulation.
     *
     * @property bounds
     * @type bounds
     */

})();

},{"../core/Common":14,"../core/Sleeping":22,"../geometry/Axes":25,"../geometry/Bounds":26,"../geometry/Vector":28,"../geometry/Vertices":29,"../render/Render":31}],2:[function(_dereq_,module,exports){
/**
* The `Matter.Composite` module contains methods for creating and manipulating composite bodies.
* A composite body is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`, therefore composites form a tree structure.
* It is important to use the functions in this module to modify composites, rather than directly modifying their properties.
* Note that the `Matter.World` object is also a type of `Matter.Composite` and as such all composite methods here can also operate on a `Matter.World`.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Composite
*/

var Composite = {};

module.exports = Composite;

var Events = _dereq_('../core/Events');
var Common = _dereq_('../core/Common');
var Bounds = _dereq_('../geometry/Bounds');
var Body = _dereq_('./Body');

(function() {

    /**
     * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properites section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {} [options]
     * @return {composite} A new composite
     */
    Composite.create = function(options) {
        return Common.extend({ 
            id: Common.nextId(),
            type: 'composite',
            parent: null,
            isModified: false,
            bodies: [], 
            constraints: [], 
            composites: [],
            label: 'Composite',
            plugin: {}
        }, options);
    };

    /**
     * Sets the composite's `isModified` flag. 
     * If `updateParents` is true, all parents will be set (default: false).
     * If `updateChildren` is true, all children will be set (default: false).
     * @method setModified
     * @param {composite} composite
     * @param {boolean} isModified
     * @param {boolean} [updateParents=false]
     * @param {boolean} [updateChildren=false]
     */
    Composite.setModified = function(composite, isModified, updateParents, updateChildren) {
        composite.isModified = isModified;

        if (updateParents && composite.parent) {
            Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
        }

        if (updateChildren) {
            for(var i = 0; i < composite.composites.length; i++) {
                var childComposite = composite.composites[i];
                Composite.setModified(childComposite, isModified, updateParents, updateChildren);
            }
        }
    };

    /**
     * Generic add function. Adds one or many body(s), constraint(s) or a composite(s) to the given composite.
     * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
     * @method add
     * @param {composite} composite
     * @param {} object
     * @return {composite} The original composite with the objects added
     */
    Composite.add = function(composite, object) {
        var objects = [].concat(object);

        Events.trigger(composite, 'beforeAdd', { object: object });

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];

            switch (obj.type) {

            case 'body':
                // skip adding compound parts
                if (obj.parent !== obj) {
                    Common.warn('Composite.add: skipped adding a compound body part (you must add its parent instead)');
                    break;
                }

                Composite.addBody(composite, obj);
                break;
            case 'constraint':
                Composite.addConstraint(composite, obj);
                break;
            case 'composite':
                Composite.addComposite(composite, obj);
                break;
            case 'mouseConstraint':
                Composite.addConstraint(composite, obj.constraint);
                break;

            }
        }

        Events.trigger(composite, 'afterAdd', { object: object });

        return composite;
    };

    /**
     * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
     * Optionally searching its children recursively.
     * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
     * @method remove
     * @param {composite} composite
     * @param {} object
     * @param {boolean} [deep=false]
     * @return {composite} The original composite with the objects removed
     */
    Composite.remove = function(composite, object, deep) {
        var objects = [].concat(object);

        Events.trigger(composite, 'beforeRemove', { object: object });

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];

            switch (obj.type) {

            case 'body':
                Composite.removeBody(composite, obj, deep);
                break;
            case 'constraint':
                Composite.removeConstraint(composite, obj, deep);
                break;
            case 'composite':
                Composite.removeComposite(composite, obj, deep);
                break;
            case 'mouseConstraint':
                Composite.removeConstraint(composite, obj.constraint);
                break;

            }
        }

        Events.trigger(composite, 'afterRemove', { object: object });

        return composite;
    };

    /**
     * Adds a composite to the given composite.
     * @private
     * @method addComposite
     * @param {composite} compositeA
     * @param {composite} compositeB
     * @return {composite} The original compositeA with the objects from compositeB added
     */
    Composite.addComposite = function(compositeA, compositeB) {
        compositeA.composites.push(compositeB);
        compositeB.parent = compositeA;
        Composite.setModified(compositeA, true, true, false);
        return compositeA;
    };

    /**
     * Removes a composite from the given composite, and optionally searching its children recursively.
     * @private
     * @method removeComposite
     * @param {composite} compositeA
     * @param {composite} compositeB
     * @param {boolean} [deep=false]
     * @return {composite} The original compositeA with the composite removed
     */
    Composite.removeComposite = function(compositeA, compositeB, deep) {
        var position = Common.indexOf(compositeA.composites, compositeB);
        if (position !== -1) {
            Composite.removeCompositeAt(compositeA, position);
            Composite.setModified(compositeA, true, true, false);
        }

        if (deep) {
            for (var i = 0; i < compositeA.composites.length; i++){
                Composite.removeComposite(compositeA.composites[i], compositeB, true);
            }
        }

        return compositeA;
    };

    /**
     * Removes a composite from the given composite.
     * @private
     * @method removeCompositeAt
     * @param {composite} composite
     * @param {number} position
     * @return {composite} The original composite with the composite removed
     */
    Composite.removeCompositeAt = function(composite, position) {
        composite.composites.splice(position, 1);
        Composite.setModified(composite, true, true, false);
        return composite;
    };

    /**
     * Adds a body to the given composite.
     * @private
     * @method addBody
     * @param {composite} composite
     * @param {body} body
     * @return {composite} The original composite with the body added
     */
    Composite.addBody = function(composite, body) {
        composite.bodies.push(body);
        Composite.setModified(composite, true, true, false);
        return composite;
    };

    /**
     * Removes a body from the given composite, and optionally searching its children recursively.
     * @private
     * @method removeBody
     * @param {composite} composite
     * @param {body} body
     * @param {boolean} [deep=false]
     * @return {composite} The original composite with the body removed
     */
    Composite.removeBody = function(composite, body, deep) {
        var position = Common.indexOf(composite.bodies, body);
        if (position !== -1) {
            Composite.removeBodyAt(composite, position);
            Composite.setModified(composite, true, true, false);
        }

        if (deep) {
            for (var i = 0; i < composite.composites.length; i++){
                Composite.removeBody(composite.composites[i], body, true);
            }
        }

        return composite;
    };

    /**
     * Removes a body from the given composite.
     * @private
     * @method removeBodyAt
     * @param {composite} composite
     * @param {number} position
     * @return {composite} The original composite with the body removed
     */
    Composite.removeBodyAt = function(composite, position) {
        composite.bodies.splice(position, 1);
        Composite.setModified(composite, true, true, false);
        return composite;
    };

    /**
     * Adds a constraint to the given composite.
     * @private
     * @method addConstraint
     * @param {composite} composite
     * @param {constraint} constraint
     * @return {composite} The original composite with the constraint added
     */
    Composite.addConstraint = function(composite, constraint) {
        composite.constraints.push(constraint);
        Composite.setModified(composite, true, true, false);
        return composite;
    };

    /**
     * Removes a constraint from the given composite, and optionally searching its children recursively.
     * @private
     * @method removeConstraint
     * @param {composite} composite
     * @param {constraint} constraint
     * @param {boolean} [deep=false]
     * @return {composite} The original composite with the constraint removed
     */
    Composite.removeConstraint = function(composite, constraint, deep) {
        var position = Common.indexOf(composite.constraints, constraint);
        if (position !== -1) {
            Composite.removeConstraintAt(composite, position);
        }

        if (deep) {
            for (var i = 0; i < composite.composites.length; i++){
                Composite.removeConstraint(composite.composites[i], constraint, true);
            }
        }

        return composite;
    };

    /**
     * Removes a body from the given composite.
     * @private
     * @method removeConstraintAt
     * @param {composite} composite
     * @param {number} position
     * @return {composite} The original composite with the constraint removed
     */
    Composite.removeConstraintAt = function(composite, position) {
        composite.constraints.splice(position, 1);
        Composite.setModified(composite, true, true, false);
        return composite;
    };

    /**
     * Removes all bodies, constraints and composites from the given composite.
     * Optionally clearing its children recursively.
     * @method clear
     * @param {composite} composite
     * @param {boolean} keepStatic
     * @param {boolean} [deep=false]
     */
    Composite.clear = function(composite, keepStatic, deep) {
        if (deep) {
            for (var i = 0; i < composite.composites.length; i++){
                Composite.clear(composite.composites[i], keepStatic, true);
            }
        }
        
        if (keepStatic) {
            composite.bodies = composite.bodies.filter(function(body) { return body.isStatic; });
        } else {
            composite.bodies.length = 0;
        }

        composite.constraints.length = 0;
        composite.composites.length = 0;
        Composite.setModified(composite, true, true, false);

        return composite;
    };

    /**
     * Returns all bodies in the given composite, including all bodies in its children, recursively.
     * @method allBodies
     * @param {composite} composite
     * @return {body[]} All the bodies
     */
    Composite.allBodies = function(composite) {
        var bodies = [].concat(composite.bodies);

        for (var i = 0; i < composite.composites.length; i++)
            bodies = bodies.concat(Composite.allBodies(composite.composites[i]));

        return bodies;
    };

    /**
     * Returns all constraints in the given composite, including all constraints in its children, recursively.
     * @method allConstraints
     * @param {composite} composite
     * @return {constraint[]} All the constraints
     */
    Composite.allConstraints = function(composite) {
        var constraints = [].concat(composite.constraints);

        for (var i = 0; i < composite.composites.length; i++)
            constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));

        return constraints;
    };

    /**
     * Returns all composites in the given composite, including all composites in its children, recursively.
     * @method allComposites
     * @param {composite} composite
     * @return {composite[]} All the composites
     */
    Composite.allComposites = function(composite) {
        var composites = [].concat(composite.composites);

        for (var i = 0; i < composite.composites.length; i++)
            composites = composites.concat(Composite.allComposites(composite.composites[i]));

        return composites;
    };

    /**
     * Searches the composite recursively for an object matching the type and id supplied, null if not found.
     * @method get
     * @param {composite} composite
     * @param {number} id
     * @param {string} type
     * @return {object} The requested object, if found
     */
    Composite.get = function(composite, id, type) {
        var objects,
            object;

        switch (type) {
        case 'body':
            objects = Composite.allBodies(composite);
            break;
        case 'constraint':
            objects = Composite.allConstraints(composite);
            break;
        case 'composite':
            objects = Composite.allComposites(composite).concat(composite);
            break;
        }

        if (!objects)
            return null;

        object = objects.filter(function(object) { 
            return object.id.toString() === id.toString(); 
        });

        return object.length === 0 ? null : object[0];
    };

    /**
     * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
     * @method move
     * @param {compositeA} compositeA
     * @param {object[]} objects
     * @param {compositeB} compositeB
     * @return {composite} Returns compositeA
     */
    Composite.move = function(compositeA, objects, compositeB) {
        Composite.remove(compositeA, objects);
        Composite.add(compositeB, objects);
        return compositeA;
    };

    /**
     * Assigns new ids for all objects in the composite, recursively.
     * @method rebase
     * @param {composite} composite
     * @return {composite} Returns composite
     */
    Composite.rebase = function(composite) {
        var objects = Composite.allBodies(composite)
                        .concat(Composite.allConstraints(composite))
                        .concat(Composite.allComposites(composite));

        for (var i = 0; i < objects.length; i++) {
            objects[i].id = Common.nextId();
        }

        Composite.setModified(composite, true, true, false);

        return composite;
    };

    /**
     * Translates all children in the composite by a given vector relative to their current positions, 
     * without imparting any velocity.
     * @method translate
     * @param {composite} composite
     * @param {vector} translation
     * @param {bool} [recursive=true]
     */
    Composite.translate = function(composite, translation, recursive) {
        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;

        for (var i = 0; i < bodies.length; i++) {
            Body.translate(bodies[i], translation);
        }

        Composite.setModified(composite, true, true, false);

        return composite;
    };

    /**
     * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
     * @method rotate
     * @param {composite} composite
     * @param {number} rotation
     * @param {vector} point
     * @param {bool} [recursive=true]
     */
    Composite.rotate = function(composite, rotation, point, recursive) {
        var cos = Math.cos(rotation),
            sin = Math.sin(rotation),
            bodies = recursive ? Composite.allBodies(composite) : composite.bodies;

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i],
                dx = body.position.x - point.x,
                dy = body.position.y - point.y;
                
            Body.setPosition(body, {
                x: point.x + (dx * cos - dy * sin),
                y: point.y + (dx * sin + dy * cos)
            });

            Body.rotate(body, rotation);
        }

        Composite.setModified(composite, true, true, false);

        return composite;
    };

    /**
     * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
     * @method scale
     * @param {composite} composite
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {vector} point
     * @param {bool} [recursive=true]
     */
    Composite.scale = function(composite, scaleX, scaleY, point, recursive) {
        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i],
                dx = body.position.x - point.x,
                dy = body.position.y - point.y;
                
            Body.setPosition(body, {
                x: point.x + dx * scaleX,
                y: point.y + dy * scaleY
            });

            Body.scale(body, scaleX, scaleY);
        }

        Composite.setModified(composite, true, true, false);

        return composite;
    };

    /**
     * Returns the union of the bounds of all of the composite's bodies.
     * @method bounds
     * @param {composite} composite The composite.
     * @returns {bounds} The composite bounds.
     */
    Composite.bounds = function(composite) {
        var bodies = Composite.allBodies(composite),
            vertices = [];

        for (var i = 0; i < bodies.length; i += 1) {
            var body = bodies[i];
            vertices.push(body.bounds.min, body.bounds.max);
        }

        return Bounds.create(vertices);
    };

    /*
    *
    *  Events Documentation
    *
    */

    /**
    * Fired when a call to `Composite.add` is made, before objects have been added.
    *
    * @event beforeAdd
    * @param {} event An event object
    * @param {} event.object The object(s) to be added (may be a single body, constraint, composite or a mixed array of these)
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when a call to `Composite.add` is made, after objects have been added.
    *
    * @event afterAdd
    * @param {} event An event object
    * @param {} event.object The object(s) that have been added (may be a single body, constraint, composite or a mixed array of these)
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when a call to `Composite.remove` is made, before objects have been removed.
    *
    * @event beforeRemove
    * @param {} event An event object
    * @param {} event.object The object(s) to be removed (may be a single body, constraint, composite or a mixed array of these)
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when a call to `Composite.remove` is made, after objects have been removed.
    *
    * @event afterRemove
    * @param {} event An event object
    * @param {} event.object The object(s) that have been removed (may be a single body, constraint, composite or a mixed array of these)
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
     *
     * @property id
     * @type number
     */

    /**
     * A `String` denoting the type of object.
     *
     * @property type
     * @type string
     * @default "composite"
     * @readOnly
     */

    /**
     * An arbitrary `String` name to help the user identify and manage composites.
     *
     * @property label
     * @type string
     * @default "Composite"
     */

    /**
     * A flag that specifies whether the composite has been modified during the current step.
     * Most `Matter.Composite` methods will automatically set this flag to `true` to inform the engine of changes to be handled.
     * If you need to change it manually, you should use the `Composite.setModified` method.
     *
     * @property isModified
     * @type boolean
     * @default false
     */

    /**
     * The `Composite` that is the parent of this composite. It is automatically managed by the `Matter.Composite` methods.
     *
     * @property parent
     * @type composite
     * @default null
     */

    /**
     * An array of `Body` that are _direct_ children of this composite.
     * To add or remove bodies you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
     * If you wish to recursively find all descendants, you should use the `Composite.allBodies` method.
     *
     * @property bodies
     * @type body[]
     * @default []
     */

    /**
     * An array of `Constraint` that are _direct_ children of this composite.
     * To add or remove constraints you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
     * If you wish to recursively find all descendants, you should use the `Composite.allConstraints` method.
     *
     * @property constraints
     * @type constraint[]
     * @default []
     */

    /**
     * An array of `Composite` that are _direct_ children of this composite.
     * To add or remove composites you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
     * If you wish to recursively find all descendants, you should use the `Composite.allComposites` method.
     *
     * @property composites
     * @type composite[]
     * @default []
     */

    /**
     * An object reserved for storing plugin-specific properties.
     *
     * @property plugin
     * @type {}
     */

})();

},{"../core/Common":14,"../core/Events":16,"../geometry/Bounds":26,"./Body":1}],3:[function(_dereq_,module,exports){
/**
* The `Matter.World` module contains methods for creating and manipulating the world composite.
* A `Matter.World` is a `Matter.Composite` body, which is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`.
* A `Matter.World` has a few additional properties including `gravity` and `bounds`.
* It is important to use the functions in the `Matter.Composite` module to modify the world composite, rather than directly modifying its properties.
* There are also a few methods here that alias those in `Matter.Composite` for easier readability.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class World
* @extends Composite
*/

var World = {};

module.exports = World;

var Composite = _dereq_('./Composite');
var Constraint = _dereq_('../constraint/Constraint');
var Common = _dereq_('../core/Common');

(function() {

    /**
     * Creates a new world composite. The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @constructor
     * @param {} options
     * @return {world} A new world
     */
    World.create = function(options) {
        var composite = Composite.create();

        var defaults = {
            label: 'World',
            gravity: {
                x: 0,
                y: 1,
                scale: 0.001
            },
            bounds: { 
                min: { x: -Infinity, y: -Infinity }, 
                max: { x: Infinity, y: Infinity } 
            }
        };
        
        return Common.extend(composite, defaults, options);
    };

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * The gravity to apply on the world.
     *
     * @property gravity
     * @type object
     */

    /**
     * The gravity x component.
     *
     * @property gravity.x
     * @type object
     * @default 0
     */

    /**
     * The gravity y component.
     *
     * @property gravity.y
     * @type object
     * @default 1
     */

    /**
     * The gravity scale factor.
     *
     * @property gravity.scale
     * @type object
     * @default 0.001
     */

    /**
     * A `Bounds` object that defines the world bounds for collision detection.
     *
     * @property bounds
     * @type bounds
     * @default { min: { x: -Infinity, y: -Infinity }, max: { x: Infinity, y: Infinity } }
     */

    // World is a Composite body
    // see src/module/Outro.js for these aliases:
    
    /**
     * An alias for Composite.add
     * @method add
     * @param {world} world
     * @param {} object
     * @return {composite} The original world with the objects added
     */

    /**
     * An alias for Composite.remove
     * @method remove
     * @param {world} world
     * @param {} object
     * @param {boolean} [deep=false]
     * @return {composite} The original world with the objects removed
     */

    /**
     * An alias for Composite.clear
     * @method clear
     * @param {world} world
     * @param {boolean} keepStatic
     */

    /**
     * An alias for Composite.addComposite
     * @method addComposite
     * @param {world} world
     * @param {composite} composite
     * @return {world} The original world with the objects from composite added
     */
    
     /**
      * An alias for Composite.addBody
      * @method addBody
      * @param {world} world
      * @param {body} body
      * @return {world} The original world with the body added
      */

     /**
      * An alias for Composite.addConstraint
      * @method addConstraint
      * @param {world} world
      * @param {constraint} constraint
      * @return {world} The original world with the constraint added
      */

})();

},{"../constraint/Constraint":12,"../core/Common":14,"./Composite":2}],4:[function(_dereq_,module,exports){
/**
* The `Matter.Contact` module contains methods for creating and manipulating collision contacts.
*
* @class Contact
*/

var Contact = {};

module.exports = Contact;

(function() {

    /**
     * Creates a new contact.
     * @method create
     * @param {vertex} vertex
     * @return {contact} A new contact
     */
    Contact.create = function(vertex) {
        return {
            id: Contact.id(vertex),
            vertex: vertex,
            normalImpulse: 0,
            tangentImpulse: 0
        };
    };
    
    /**
     * Generates a contact id.
     * @method id
     * @param {vertex} vertex
     * @return {string} Unique contactID
     */
    Contact.id = function(vertex) {
        return vertex.body.id + '_' + vertex.index;
    };

})();

},{}],5:[function(_dereq_,module,exports){
/**
* The `Matter.Detector` module contains methods for detecting collisions given a set of pairs.
*
* @class Detector
*/

// TODO: speculative contacts

var Detector = {};

module.exports = Detector;

var SAT = _dereq_('./SAT');
var Pair = _dereq_('./Pair');
var Bounds = _dereq_('../geometry/Bounds');

(function() {

    /**
     * Finds all collisions given a list of pairs.
     * @method collisions
     * @param {pair[]} broadphasePairs
     * @param {engine} engine
     * @return {array} collisions
     */
    Detector.collisions = function(broadphasePairs, engine) {
        var collisions = [],
            pairsTable = engine.pairs.table;

        
        for (var i = 0; i < broadphasePairs.length; i++) {
            var bodyA = broadphasePairs[i][0], 
                bodyB = broadphasePairs[i][1];

            if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
                continue;
            
            if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
                continue;


            // mid phase
            if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
                for (var j = bodyA.parts.length > 1 ? 1 : 0; j < bodyA.parts.length; j++) {
                    var partA = bodyA.parts[j];

                    for (var k = bodyB.parts.length > 1 ? 1 : 0; k < bodyB.parts.length; k++) {
                        var partB = bodyB.parts[k];

                        if ((partA === bodyA && partB === bodyB) || Bounds.overlaps(partA.bounds, partB.bounds)) {
                            // find a previous collision we could reuse
                            var pairId = Pair.id(partA, partB),
                                pair = pairsTable[pairId],
                                previousCollision;

                            if (pair && pair.isActive) {
                                previousCollision = pair.collision;
                            } else {
                                previousCollision = null;
                            }

                            // narrow phase
                            var collision = SAT.collides(partA, partB, previousCollision);


                            if (collision.collided) {
                                collisions.push(collision);
                            }
                        }
                    }
                }
            }
        }

        return collisions;
    };

    /**
     * Returns `true` if both supplied collision filters will allow a collision to occur.
     * See `body.collisionFilter` for more information.
     * @method canCollide
     * @param {} filterA
     * @param {} filterB
     * @return {bool} `true` if collision can occur
     */
    Detector.canCollide = function(filterA, filterB) {
        if (filterA.group === filterB.group && filterA.group !== 0)
            return filterA.group > 0;

        return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
    };

})();

},{"../geometry/Bounds":26,"./Pair":7,"./SAT":11}],6:[function(_dereq_,module,exports){
/**
* The `Matter.Grid` module contains methods for creating and manipulating collision broadphase grid structures.
*
* @class Grid
*/

var Grid = {};

module.exports = Grid;

var Pair = _dereq_('./Pair');
var Detector = _dereq_('./Detector');
var Common = _dereq_('../core/Common');

(function() {

    /**
     * Creates a new grid.
     * @method create
     * @param {} options
     * @return {grid} A new grid
     */
    Grid.create = function(options) {
        var defaults = {
            controller: Grid,
            detector: Detector.collisions,
            buckets: {},
            pairs: {},
            pairsList: [],
            bucketWidth: 48,
            bucketHeight: 48
        };

        return Common.extend(defaults, options);
    };

    /**
     * The width of a single grid bucket.
     *
     * @property bucketWidth
     * @type number
     * @default 48
     */

    /**
     * The height of a single grid bucket.
     *
     * @property bucketHeight
     * @type number
     * @default 48
     */

    /**
     * Updates the grid.
     * @method update
     * @param {grid} grid
     * @param {body[]} bodies
     * @param {engine} engine
     * @param {boolean} forceUpdate
     */
    Grid.update = function(grid, bodies, engine, forceUpdate) {
        var i, col, row,
            world = engine.world,
            buckets = grid.buckets,
            bucket,
            bucketId,
            gridChanged = false;


        for (i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (body.isSleeping && !forceUpdate)
                continue;

            // don't update out of world bodies
            if (body.bounds.max.x < world.bounds.min.x || body.bounds.min.x > world.bounds.max.x
                || body.bounds.max.y < world.bounds.min.y || body.bounds.min.y > world.bounds.max.y)
                continue;

            var newRegion = Grid._getRegion(grid, body);

            // if the body has changed grid region
            if (!body.region || newRegion.id !== body.region.id || forceUpdate) {


                if (!body.region || forceUpdate)
                    body.region = newRegion;

                var union = Grid._regionUnion(newRegion, body.region);

                // update grid buckets affected by region change
                // iterate over the union of both regions
                for (col = union.startCol; col <= union.endCol; col++) {
                    for (row = union.startRow; row <= union.endRow; row++) {
                        bucketId = Grid._getBucketId(col, row);
                        bucket = buckets[bucketId];

                        var isInsideNewRegion = (col >= newRegion.startCol && col <= newRegion.endCol
                                                && row >= newRegion.startRow && row <= newRegion.endRow);

                        var isInsideOldRegion = (col >= body.region.startCol && col <= body.region.endCol
                                                && row >= body.region.startRow && row <= body.region.endRow);

                        // remove from old region buckets
                        if (!isInsideNewRegion && isInsideOldRegion) {
                            if (isInsideOldRegion) {
                                if (bucket)
                                    Grid._bucketRemoveBody(grid, bucket, body);
                            }
                        }

                        // add to new region buckets
                        if (body.region === newRegion || (isInsideNewRegion && !isInsideOldRegion) || forceUpdate) {
                            if (!bucket)
                                bucket = Grid._createBucket(buckets, bucketId);
                            Grid._bucketAddBody(grid, bucket, body);
                        }
                    }
                }

                // set the new region
                body.region = newRegion;

                // flag changes so we can update pairs
                gridChanged = true;
            }
        }

        // update pairs list only if pairs changed (i.e. a body changed region)
        if (gridChanged)
            grid.pairsList = Grid._createActivePairsList(grid);
    };

    /**
     * Clears the grid.
     * @method clear
     * @param {grid} grid
     */
    Grid.clear = function(grid) {
        grid.buckets = {};
        grid.pairs = {};
        grid.pairsList = [];
    };

    /**
     * Finds the union of two regions.
     * @method _regionUnion
     * @private
     * @param {} regionA
     * @param {} regionB
     * @return {} region
     */
    Grid._regionUnion = function(regionA, regionB) {
        var startCol = Math.min(regionA.startCol, regionB.startCol),
            endCol = Math.max(regionA.endCol, regionB.endCol),
            startRow = Math.min(regionA.startRow, regionB.startRow),
            endRow = Math.max(regionA.endRow, regionB.endRow);

        return Grid._createRegion(startCol, endCol, startRow, endRow);
    };

    /**
     * Gets the region a given body falls in for a given grid.
     * @method _getRegion
     * @private
     * @param {} grid
     * @param {} body
     * @return {} region
     */
    Grid._getRegion = function(grid, body) {
        var bounds = body.bounds,
            startCol = Math.floor(bounds.min.x / grid.bucketWidth),
            endCol = Math.floor(bounds.max.x / grid.bucketWidth),
            startRow = Math.floor(bounds.min.y / grid.bucketHeight),
            endRow = Math.floor(bounds.max.y / grid.bucketHeight);

        return Grid._createRegion(startCol, endCol, startRow, endRow);
    };

    /**
     * Creates a region.
     * @method _createRegion
     * @private
     * @param {} startCol
     * @param {} endCol
     * @param {} startRow
     * @param {} endRow
     * @return {} region
     */
    Grid._createRegion = function(startCol, endCol, startRow, endRow) {
        return { 
            id: startCol + ',' + endCol + ',' + startRow + ',' + endRow,
            startCol: startCol, 
            endCol: endCol, 
            startRow: startRow, 
            endRow: endRow 
        };
    };

    /**
     * Gets the bucket id at the given position.
     * @method _getBucketId
     * @private
     * @param {} column
     * @param {} row
     * @return {string} bucket id
     */
    Grid._getBucketId = function(column, row) {
        return 'C' + column + 'R' + row;
    };

    /**
     * Creates a bucket.
     * @method _createBucket
     * @private
     * @param {} buckets
     * @param {} bucketId
     * @return {} bucket
     */
    Grid._createBucket = function(buckets, bucketId) {
        var bucket = buckets[bucketId] = [];
        return bucket;
    };

    /**
     * Adds a body to a bucket.
     * @method _bucketAddBody
     * @private
     * @param {} grid
     * @param {} bucket
     * @param {} body
     */
    Grid._bucketAddBody = function(grid, bucket, body) {
        // add new pairs
        for (var i = 0; i < bucket.length; i++) {
            var bodyB = bucket[i];

            if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic))
                continue;

            // keep track of the number of buckets the pair exists in
            // important for Grid.update to work
            var pairId = Pair.id(body, bodyB),
                pair = grid.pairs[pairId];

            if (pair) {
                pair[2] += 1;
            } else {
                grid.pairs[pairId] = [body, bodyB, 1];
            }
        }

        // add to bodies (after pairs, otherwise pairs with self)
        bucket.push(body);
    };

    /**
     * Removes a body from a bucket.
     * @method _bucketRemoveBody
     * @private
     * @param {} grid
     * @param {} bucket
     * @param {} body
     */
    Grid._bucketRemoveBody = function(grid, bucket, body) {
        // remove from bucket
        bucket.splice(Common.indexOf(bucket, body), 1);

        // update pair counts
        for (var i = 0; i < bucket.length; i++) {
            // keep track of the number of buckets the pair exists in
            // important for _createActivePairsList to work
            var bodyB = bucket[i],
                pairId = Pair.id(body, bodyB),
                pair = grid.pairs[pairId];

            if (pair)
                pair[2] -= 1;
        }
    };

    /**
     * Generates a list of the active pairs in the grid.
     * @method _createActivePairsList
     * @private
     * @param {} grid
     * @return [] pairs
     */
    Grid._createActivePairsList = function(grid) {
        var pairKeys,
            pair,
            pairs = [];

        // grid.pairs is used as a hashmap
        pairKeys = Common.keys(grid.pairs);

        // iterate over grid.pairs
        for (var k = 0; k < pairKeys.length; k++) {
            pair = grid.pairs[pairKeys[k]];

            // if pair exists in at least one bucket
            // it is a pair that needs further collision testing so push it
            if (pair[2] > 0) {
                pairs.push(pair);
            } else {
                delete grid.pairs[pairKeys[k]];
            }
        }

        return pairs;
    };
    
})();

},{"../core/Common":14,"./Detector":5,"./Pair":7}],7:[function(_dereq_,module,exports){
/**
* The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
*
* @class Pair
*/

var Pair = {};

module.exports = Pair;

var Contact = _dereq_('./Contact');

(function() {
    
    /**
     * Creates a pair.
     * @method create
     * @param {collision} collision
     * @param {number} timestamp
     * @return {pair} A new pair
     */
    Pair.create = function(collision, timestamp) {
        var bodyA = collision.bodyA,
            bodyB = collision.bodyB,
            parentA = collision.parentA,
            parentB = collision.parentB;

        var pair = {
            id: Pair.id(bodyA, bodyB),
            bodyA: bodyA,
            bodyB: bodyB,
            contacts: {},
            activeContacts: [],
            separation: 0,
            isActive: true,
            isSensor: bodyA.isSensor || bodyB.isSensor,
            timeCreated: timestamp,
            timeUpdated: timestamp,
            inverseMass: parentA.inverseMass + parentB.inverseMass,
            friction: Math.min(parentA.friction, parentB.friction),
            frictionStatic: Math.max(parentA.frictionStatic, parentB.frictionStatic),
            restitution: Math.max(parentA.restitution, parentB.restitution),
            slop: Math.max(parentA.slop, parentB.slop)
        };

        Pair.update(pair, collision, timestamp);

        return pair;
    };

    /**
     * Updates a pair given a collision.
     * @method update
     * @param {pair} pair
     * @param {collision} collision
     * @param {number} timestamp
     */
    Pair.update = function(pair, collision, timestamp) {
        var contacts = pair.contacts,
            supports = collision.supports,
            activeContacts = pair.activeContacts,
            parentA = collision.parentA,
            parentB = collision.parentB;
        
        pair.collision = collision;
        pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
        pair.friction = Math.min(parentA.friction, parentB.friction);
        pair.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
        pair.restitution = Math.max(parentA.restitution, parentB.restitution);
        pair.slop = Math.max(parentA.slop, parentB.slop);
        activeContacts.length = 0;
        
        if (collision.collided) {
            for (var i = 0; i < supports.length; i++) {
                var support = supports[i],
                    contactId = Contact.id(support),
                    contact = contacts[contactId];

                if (contact) {
                    activeContacts.push(contact);
                } else {
                    activeContacts.push(contacts[contactId] = Contact.create(support));
                }
            }

            pair.separation = collision.depth;
            Pair.setActive(pair, true, timestamp);
        } else {
            if (pair.isActive === true)
                Pair.setActive(pair, false, timestamp);
        }
    };
    
    /**
     * Set a pair as active or inactive.
     * @method setActive
     * @param {pair} pair
     * @param {bool} isActive
     * @param {number} timestamp
     */
    Pair.setActive = function(pair, isActive, timestamp) {
        if (isActive) {
            pair.isActive = true;
            pair.timeUpdated = timestamp;
        } else {
            pair.isActive = false;
            pair.activeContacts.length = 0;
        }
    };

    /**
     * Get the id for the given pair.
     * @method id
     * @param {body} bodyA
     * @param {body} bodyB
     * @return {string} Unique pairId
     */
    Pair.id = function(bodyA, bodyB) {
        if (bodyA.id < bodyB.id) {
            return 'A' + bodyA.id + 'B' + bodyB.id;
        } else {
            return 'A' + bodyB.id + 'B' + bodyA.id;
        }
    };

})();

},{"./Contact":4}],8:[function(_dereq_,module,exports){
/**
* The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
*
* @class Pairs
*/

var Pairs = {};

module.exports = Pairs;

var Pair = _dereq_('./Pair');
var Common = _dereq_('../core/Common');

(function() {
    
    Pairs._pairMaxIdleLife = 1000;

    /**
     * Creates a new pairs structure.
     * @method create
     * @param {object} options
     * @return {pairs} A new pairs structure
     */
    Pairs.create = function(options) {
        return Common.extend({ 
            table: {},
            list: [],
            collisionStart: [],
            collisionActive: [],
            collisionEnd: []
        }, options);
    };

    /**
     * Updates pairs given a list of collisions.
     * @method update
     * @param {object} pairs
     * @param {collision[]} collisions
     * @param {number} timestamp
     */
    Pairs.update = function(pairs, collisions, timestamp) {
        var pairsList = pairs.list,
            pairsTable = pairs.table,
            collisionStart = pairs.collisionStart,
            collisionEnd = pairs.collisionEnd,
            collisionActive = pairs.collisionActive,
            activePairIds = [],
            collision,
            pairId,
            pair,
            i;

        // clear collision state arrays, but maintain old reference
        collisionStart.length = 0;
        collisionEnd.length = 0;
        collisionActive.length = 0;

        for (i = 0; i < collisions.length; i++) {
            collision = collisions[i];

            if (collision.collided) {
                pairId = Pair.id(collision.bodyA, collision.bodyB);
                activePairIds.push(pairId);

                pair = pairsTable[pairId];
                
                if (pair) {
                    // pair already exists (but may or may not be active)
                    if (pair.isActive) {
                        // pair exists and is active
                        collisionActive.push(pair);
                    } else {
                        // pair exists but was inactive, so a collision has just started again
                        collisionStart.push(pair);
                    }

                    // update the pair
                    Pair.update(pair, collision, timestamp);
                } else {
                    // pair did not exist, create a new pair
                    pair = Pair.create(collision, timestamp);
                    pairsTable[pairId] = pair;

                    // push the new pair
                    collisionStart.push(pair);
                    pairsList.push(pair);
                }
            }
        }

        // deactivate previously active pairs that are now inactive
        for (i = 0; i < pairsList.length; i++) {
            pair = pairsList[i];
            if (pair.isActive && Common.indexOf(activePairIds, pair.id) === -1) {
                Pair.setActive(pair, false, timestamp);
                collisionEnd.push(pair);
            }
        }
    };
    
    /**
     * Finds and removes pairs that have been inactive for a set amount of time.
     * @method removeOld
     * @param {object} pairs
     * @param {number} timestamp
     */
    Pairs.removeOld = function(pairs, timestamp) {
        var pairsList = pairs.list,
            pairsTable = pairs.table,
            indexesToRemove = [],
            pair,
            collision,
            pairIndex,
            i;

        for (i = 0; i < pairsList.length; i++) {
            pair = pairsList[i];
            collision = pair.collision;
            
            // never remove sleeping pairs
            if (collision.bodyA.isSleeping || collision.bodyB.isSleeping) {
                pair.timeUpdated = timestamp;
                continue;
            }

            // if pair is inactive for too long, mark it to be removed
            if (timestamp - pair.timeUpdated > Pairs._pairMaxIdleLife) {
                indexesToRemove.push(i);
            }
        }

        // remove marked pairs
        for (i = 0; i < indexesToRemove.length; i++) {
            pairIndex = indexesToRemove[i] - i;
            pair = pairsList[pairIndex];
            delete pairsTable[pair.id];
            pairsList.splice(pairIndex, 1);
        }
    };

    /**
     * Clears the given pairs structure.
     * @method clear
     * @param {pairs} pairs
     * @return {pairs} pairs
     */
    Pairs.clear = function(pairs) {
        pairs.table = {};
        pairs.list.length = 0;
        pairs.collisionStart.length = 0;
        pairs.collisionActive.length = 0;
        pairs.collisionEnd.length = 0;
        return pairs;
    };

})();

},{"../core/Common":14,"./Pair":7}],9:[function(_dereq_,module,exports){
/**
* The `Matter.Query` module contains methods for performing collision queries.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Query
*/

var Query = {};

module.exports = Query;

var Vector = _dereq_('../geometry/Vector');
var SAT = _dereq_('./SAT');
var Bounds = _dereq_('../geometry/Bounds');
var Bodies = _dereq_('../factory/Bodies');
var Vertices = _dereq_('../geometry/Vertices');

(function() {

    /**
     * Returns a list of collisions between `body` and `bodies`.
     * @method collides
     * @param {body} body
     * @param {body[]} bodies
     * @return {object[]} Collisions
     */
    Query.collides = function(body, bodies) {
        var collisions = [];

        for (var i = 0; i < bodies.length; i++) {
            var bodyA = bodies[i];
            
            if (Bounds.overlaps(bodyA.bounds, body.bounds)) {
                for (var j = bodyA.parts.length === 1 ? 0 : 1; j < bodyA.parts.length; j++) {
                    var part = bodyA.parts[j];

                    if (Bounds.overlaps(part.bounds, body.bounds)) {
                        var collision = SAT.collides(part, body);

                        if (collision.collided) {
                            collisions.push(collision);
                            break;
                        }
                    }
                }
            }
        }

        return collisions;
    };

    /**
     * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
     * @method ray
     * @param {body[]} bodies
     * @param {vector} startPoint
     * @param {vector} endPoint
     * @param {number} [rayWidth]
     * @return {object[]} Collisions
     */
    Query.ray = function(bodies, startPoint, endPoint, rayWidth) {
        rayWidth = rayWidth || 1e-100;

        var rayAngle = Vector.angle(startPoint, endPoint),
            rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)),
            rayX = (endPoint.x + startPoint.x) * 0.5,
            rayY = (endPoint.y + startPoint.y) * 0.5,
            ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }),
            collisions = Query.collides(ray, bodies);

        for (var i = 0; i < collisions.length; i += 1) {
            var collision = collisions[i];
            collision.body = collision.bodyB = collision.bodyA;            
        }

        return collisions;
    };

    /**
     * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
     * @method region
     * @param {body[]} bodies
     * @param {bounds} bounds
     * @param {bool} [outside=false]
     * @return {body[]} The bodies matching the query
     */
    Query.region = function(bodies, bounds, outside) {
        var result = [];

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i],
                overlaps = Bounds.overlaps(body.bounds, bounds);
            if ((overlaps && !outside) || (!overlaps && outside))
                result.push(body);
        }

        return result;
    };

    /**
     * Returns all bodies whose vertices contain the given point, from the given set of bodies.
     * @method point
     * @param {body[]} bodies
     * @param {vector} point
     * @return {body[]} The bodies matching the query
     */
    Query.point = function(bodies, point) {
        var result = [];

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            
            if (Bounds.contains(body.bounds, point)) {
                for (var j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
                    var part = body.parts[j];

                    if (Bounds.contains(part.bounds, point)
                        && Vertices.contains(part.vertices, point)) {
                        result.push(body);
                        break;
                    }
                }
            }
        }

        return result;
    };

})();

},{"../factory/Bodies":23,"../geometry/Bounds":26,"../geometry/Vector":28,"../geometry/Vertices":29,"./SAT":11}],10:[function(_dereq_,module,exports){
/**
* The `Matter.Resolver` module contains methods for resolving collision pairs.
*
* @class Resolver
*/

var Resolver = {};

module.exports = Resolver;

var Vertices = _dereq_('../geometry/Vertices');
var Vector = _dereq_('../geometry/Vector');
var Common = _dereq_('../core/Common');
var Bounds = _dereq_('../geometry/Bounds');

(function() {

    Resolver._restingThresh = 4;
    Resolver._restingThreshTangent = 6;
    Resolver._positionDampen = 0.9;
    Resolver._positionWarming = 0.8;
    Resolver._frictionNormalMultiplier = 5;

    /**
     * Prepare pairs for position solving.
     * @method preSolvePosition
     * @param {pair[]} pairs
     */
    Resolver.preSolvePosition = function(pairs) {
        var i,
            pair,
            activeCount;

        // find total contacts on each body
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            
            if (!pair.isActive)
                continue;
            
            activeCount = pair.activeContacts.length;
            pair.collision.parentA.totalContacts += activeCount;
            pair.collision.parentB.totalContacts += activeCount;
        }
    };

    /**
     * Find a solution for pair positions.
     * @method solvePosition
     * @param {pair[]} pairs
     * @param {number} timeScale
     */
    Resolver.solvePosition = function(pairs, timeScale) {
        var i,
            pair,
            collision,
            bodyA,
            bodyB,
            normal,
            bodyBtoA,
            contactShare,
            positionImpulse,
            contactCount = {},
            tempA = Vector._temp[0],
            tempB = Vector._temp[1],
            tempC = Vector._temp[2],
            tempD = Vector._temp[3];

        // find impulses required to resolve penetration
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            
            if (!pair.isActive || pair.isSensor)
                continue;

            collision = pair.collision;
            bodyA = collision.parentA;
            bodyB = collision.parentB;
            normal = collision.normal;

            // get current separation between body edges involved in collision
            bodyBtoA = Vector.sub(Vector.add(bodyB.positionImpulse, bodyB.position, tempA), 
                                    Vector.add(bodyA.positionImpulse, 
                                        Vector.sub(bodyB.position, collision.penetration, tempB), tempC), tempD);

            pair.separation = Vector.dot(normal, bodyBtoA);
        }
        
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];

            if (!pair.isActive || pair.isSensor)
                continue;
            
            collision = pair.collision;
            bodyA = collision.parentA;
            bodyB = collision.parentB;
            normal = collision.normal;
            positionImpulse = (pair.separation - pair.slop) * timeScale;

            if (bodyA.isStatic || bodyB.isStatic)
                positionImpulse *= 2;
            
            if (!(bodyA.isStatic || bodyA.isSleeping)) {
                contactShare = Resolver._positionDampen / bodyA.totalContacts;
                bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
                bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
            }

            if (!(bodyB.isStatic || bodyB.isSleeping)) {
                contactShare = Resolver._positionDampen / bodyB.totalContacts;
                bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
                bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
            }
        }
    };

    /**
     * Apply position resolution.
     * @method postSolvePosition
     * @param {body[]} bodies
     */
    Resolver.postSolvePosition = function(bodies) {
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            // reset contact count
            body.totalContacts = 0;

            if (body.positionImpulse.x !== 0 || body.positionImpulse.y !== 0) {
                // update body geometry
                for (var j = 0; j < body.parts.length; j++) {
                    var part = body.parts[j];
                    Vertices.translate(part.vertices, body.positionImpulse);
                    Bounds.update(part.bounds, part.vertices, body.velocity);
                    part.position.x += body.positionImpulse.x;
                    part.position.y += body.positionImpulse.y;
                }

                // move the body without changing velocity
                body.positionPrev.x += body.positionImpulse.x;
                body.positionPrev.y += body.positionImpulse.y;

                if (Vector.dot(body.positionImpulse, body.velocity) < 0) {
                    // reset cached impulse if the body has velocity along it
                    body.positionImpulse.x = 0;
                    body.positionImpulse.y = 0;
                } else {
                    // warm the next iteration
                    body.positionImpulse.x *= Resolver._positionWarming;
                    body.positionImpulse.y *= Resolver._positionWarming;
                }
            }
        }
    };

    /**
     * Prepare pairs for velocity solving.
     * @method preSolveVelocity
     * @param {pair[]} pairs
     */
    Resolver.preSolveVelocity = function(pairs) {
        var i,
            j,
            pair,
            contacts,
            collision,
            bodyA,
            bodyB,
            normal,
            tangent,
            contact,
            contactVertex,
            normalImpulse,
            tangentImpulse,
            offset,
            impulse = Vector._temp[0],
            tempA = Vector._temp[1];
        
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            
            if (!pair.isActive || pair.isSensor)
                continue;
            
            contacts = pair.activeContacts;
            collision = pair.collision;
            bodyA = collision.parentA;
            bodyB = collision.parentB;
            normal = collision.normal;
            tangent = collision.tangent;

            // resolve each contact
            for (j = 0; j < contacts.length; j++) {
                contact = contacts[j];
                contactVertex = contact.vertex;
                normalImpulse = contact.normalImpulse;
                tangentImpulse = contact.tangentImpulse;

                if (normalImpulse !== 0 || tangentImpulse !== 0) {
                    // total impulse from contact
                    impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
                    impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
                    
                    // apply impulse from contact
                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
                        offset = Vector.sub(contactVertex, bodyA.position, tempA);
                        bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
                        bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
                        bodyA.anglePrev += Vector.cross(offset, impulse) * bodyA.inverseInertia;
                    }

                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
                        offset = Vector.sub(contactVertex, bodyB.position, tempA);
                        bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
                        bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
                        bodyB.anglePrev -= Vector.cross(offset, impulse) * bodyB.inverseInertia;
                    }
                }
            }
        }
    };

    /**
     * Find a solution for pair velocities.
     * @method solveVelocity
     * @param {pair[]} pairs
     * @param {number} timeScale
     */
    Resolver.solveVelocity = function(pairs, timeScale) {
        var timeScaleSquared = timeScale * timeScale,
            impulse = Vector._temp[0],
            tempA = Vector._temp[1],
            tempB = Vector._temp[2],
            tempC = Vector._temp[3],
            tempD = Vector._temp[4],
            tempE = Vector._temp[5];
        
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            
            if (!pair.isActive || pair.isSensor)
                continue;
            
            var collision = pair.collision,
                bodyA = collision.parentA,
                bodyB = collision.parentB,
                normal = collision.normal,
                tangent = collision.tangent,
                contacts = pair.activeContacts,
                contactShare = 1 / contacts.length;

            // update body velocities
            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;

            // resolve each contact
            for (var j = 0; j < contacts.length; j++) {
                var contact = contacts[j],
                    contactVertex = contact.vertex,
                    offsetA = Vector.sub(contactVertex, bodyA.position, tempA),
                    offsetB = Vector.sub(contactVertex, bodyB.position, tempB),
                    velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity), tempC),
                    velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity), tempD), 
                    relativeVelocity = Vector.sub(velocityPointA, velocityPointB, tempE),
                    normalVelocity = Vector.dot(normal, relativeVelocity);

                var tangentVelocity = Vector.dot(tangent, relativeVelocity),
                    tangentSpeed = Math.abs(tangentVelocity),
                    tangentVelocityDirection = Common.sign(tangentVelocity);

                // raw impulses
                var normalImpulse = (1 + pair.restitution) * normalVelocity,
                    normalForce = Common.clamp(pair.separation + normalVelocity, 0, 1) * Resolver._frictionNormalMultiplier;

                // coulomb friction
                var tangentImpulse = tangentVelocity,
                    maxFriction = Infinity;

                if (tangentSpeed > pair.friction * pair.frictionStatic * normalForce * timeScaleSquared) {
                    maxFriction = tangentSpeed;
                    tangentImpulse = Common.clamp(
                        pair.friction * tangentVelocityDirection * timeScaleSquared,
                        -maxFriction, maxFriction
                    );
                }

                // modify impulses accounting for mass, inertia and offset
                var oAcN = Vector.cross(offsetA, normal),
                    oBcN = Vector.cross(offsetB, normal),
                    share = contactShare / (bodyA.inverseMass + bodyB.inverseMass + bodyA.inverseInertia * oAcN * oAcN  + bodyB.inverseInertia * oBcN * oBcN);

                normalImpulse *= share;
                tangentImpulse *= share;

                // handle high velocity and resting collisions separately
                if (normalVelocity < 0 && normalVelocity * normalVelocity > Resolver._restingThresh * timeScaleSquared) {
                    // high normal velocity so clear cached contact normal impulse
                    contact.normalImpulse = 0;
                } else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // impulse constraint tends to 0
                    var contactNormalImpulse = contact.normalImpulse;
                    contact.normalImpulse = Math.min(contact.normalImpulse + normalImpulse, 0);
                    normalImpulse = contact.normalImpulse - contactNormalImpulse;
                }

                // handle high velocity and resting collisions separately
                if (tangentVelocity * tangentVelocity > Resolver._restingThreshTangent * timeScaleSquared) {
                    // high tangent velocity so clear cached contact tangent impulse
                    contact.tangentImpulse = 0;
                } else {
                    // solve resting collision constraints using Erin Catto's method (GDC08)
                    // tangent impulse tends to -tangentSpeed or +tangentSpeed
                    var contactTangentImpulse = contact.tangentImpulse;
                    contact.tangentImpulse = Common.clamp(contact.tangentImpulse + tangentImpulse, -maxFriction, maxFriction);
                    tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
                }

                // total impulse from contact
                impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
                impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
                
                // apply impulse from contact
                if (!(bodyA.isStatic || bodyA.isSleeping)) {
                    bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
                    bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
                    bodyA.anglePrev += Vector.cross(offsetA, impulse) * bodyA.inverseInertia;
                }

                if (!(bodyB.isStatic || bodyB.isSleeping)) {
                    bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
                    bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
                    bodyB.anglePrev -= Vector.cross(offsetB, impulse) * bodyB.inverseInertia;
                }
            }
        }
    };

})();

},{"../core/Common":14,"../geometry/Bounds":26,"../geometry/Vector":28,"../geometry/Vertices":29}],11:[function(_dereq_,module,exports){
/**
* The `Matter.SAT` module contains methods for detecting collisions using the Separating Axis Theorem.
*
* @class SAT
*/

// TODO: true circles and curves

var SAT = {};

module.exports = SAT;

var Vertices = _dereq_('../geometry/Vertices');
var Vector = _dereq_('../geometry/Vector');

(function() {

    /**
     * Detect collision between two bodies using the Separating Axis Theorem.
     * @method collides
     * @param {body} bodyA
     * @param {body} bodyB
     * @param {collision} previousCollision
     * @return {collision} collision
     */
    SAT.collides = function(bodyA, bodyB, previousCollision) {
        var overlapAB,
            overlapBA, 
            minOverlap,
            collision,
            canReusePrevCol = false;

        if (previousCollision) {
            // estimate total motion
            var parentA = bodyA.parent,
                parentB = bodyB.parent,
                motion = parentA.speed * parentA.speed + parentA.angularSpeed * parentA.angularSpeed
                       + parentB.speed * parentB.speed + parentB.angularSpeed * parentB.angularSpeed;

            // we may be able to (partially) reuse collision result 
            // but only safe if collision was resting
            canReusePrevCol = previousCollision && previousCollision.collided && motion < 0.2;

            // reuse collision object
            collision = previousCollision;
        } else {
            collision = { collided: false, bodyA: bodyA, bodyB: bodyB };
        }

        if (previousCollision && canReusePrevCol) {
            // if we can reuse the collision result
            // we only need to test the previously found axis
            var axisBodyA = collision.axisBody,
                axisBodyB = axisBodyA === bodyA ? bodyB : bodyA,
                axes = [axisBodyA.axes[previousCollision.axisNumber]];

            minOverlap = SAT._overlapAxes(axisBodyA.vertices, axisBodyB.vertices, axes);
            collision.reused = true;

            if (minOverlap.overlap <= 0) {
                collision.collided = false;
                return collision;
            }
        } else {
            // if we can't reuse a result, perform a full SAT test

            overlapAB = SAT._overlapAxes(bodyA.vertices, bodyB.vertices, bodyA.axes);

            if (overlapAB.overlap <= 0) {
                collision.collided = false;
                return collision;
            }

            overlapBA = SAT._overlapAxes(bodyB.vertices, bodyA.vertices, bodyB.axes);

            if (overlapBA.overlap <= 0) {
                collision.collided = false;
                return collision;
            }

            if (overlapAB.overlap < overlapBA.overlap) {
                minOverlap = overlapAB;
                collision.axisBody = bodyA;
            } else {
                minOverlap = overlapBA;
                collision.axisBody = bodyB;
            }

            // important for reuse later
            collision.axisNumber = minOverlap.axisNumber;
        }

        collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
        collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
        collision.collided = true;
        collision.depth = minOverlap.overlap;
        collision.parentA = collision.bodyA.parent;
        collision.parentB = collision.bodyB.parent;
        
        bodyA = collision.bodyA;
        bodyB = collision.bodyB;

        // ensure normal is facing away from bodyA
        if (Vector.dot(minOverlap.axis, Vector.sub(bodyB.position, bodyA.position)) < 0) {
            collision.normal = {
                x: minOverlap.axis.x,
                y: minOverlap.axis.y
            };
        } else {
            collision.normal = {
                x: -minOverlap.axis.x,
                y: -minOverlap.axis.y
            };
        }

        collision.tangent = Vector.perp(collision.normal);

        collision.penetration = collision.penetration || {};
        collision.penetration.x = collision.normal.x * collision.depth;
        collision.penetration.y = collision.normal.y * collision.depth; 

        // find support points, there is always either exactly one or two
        var verticesB = SAT._findSupports(bodyA, bodyB, collision.normal),
            supports = [];

        // find the supports from bodyB that are inside bodyA
        if (Vertices.contains(bodyA.vertices, verticesB[0]))
            supports.push(verticesB[0]);

        if (Vertices.contains(bodyA.vertices, verticesB[1]))
            supports.push(verticesB[1]);

        // find the supports from bodyA that are inside bodyB
        if (supports.length < 2) {
            var verticesA = SAT._findSupports(bodyB, bodyA, Vector.neg(collision.normal));
                
            if (Vertices.contains(bodyB.vertices, verticesA[0]))
                supports.push(verticesA[0]);

            if (supports.length < 2 && Vertices.contains(bodyB.vertices, verticesA[1]))
                supports.push(verticesA[1]);
        }

        // account for the edge case of overlapping but no vertex containment
        if (supports.length < 1)
            supports = [verticesB[0]];
        
        collision.supports = supports;

        return collision;
    };

    /**
     * Find the overlap between two sets of vertices.
     * @method _overlapAxes
     * @private
     * @param {} verticesA
     * @param {} verticesB
     * @param {} axes
     * @return result
     */
    SAT._overlapAxes = function(verticesA, verticesB, axes) {
        var projectionA = Vector._temp[0], 
            projectionB = Vector._temp[1],
            result = { overlap: Number.MAX_VALUE },
            overlap,
            axis;

        for (var i = 0; i < axes.length; i++) {
            axis = axes[i];

            SAT._projectToAxis(projectionA, verticesA, axis);
            SAT._projectToAxis(projectionB, verticesB, axis);

            overlap = Math.min(projectionA.max - projectionB.min, projectionB.max - projectionA.min);

            if (overlap <= 0) {
                result.overlap = overlap;
                return result;
            }

            if (overlap < result.overlap) {
                result.overlap = overlap;
                result.axis = axis;
                result.axisNumber = i;
            }
        }

        return result;
    };

    /**
     * Projects vertices on an axis and returns an interval.
     * @method _projectToAxis
     * @private
     * @param {} projection
     * @param {} vertices
     * @param {} axis
     */
    SAT._projectToAxis = function(projection, vertices, axis) {
        var min = Vector.dot(vertices[0], axis),
            max = min;

        for (var i = 1; i < vertices.length; i += 1) {
            var dot = Vector.dot(vertices[i], axis);

            if (dot > max) { 
                max = dot; 
            } else if (dot < min) { 
                min = dot; 
            }
        }

        projection.min = min;
        projection.max = max;
    };
    
    /**
     * Finds supporting vertices given two bodies along a given direction using hill-climbing.
     * @method _findSupports
     * @private
     * @param {} bodyA
     * @param {} bodyB
     * @param {} normal
     * @return [vector]
     */
    SAT._findSupports = function(bodyA, bodyB, normal) {
        var nearestDistance = Number.MAX_VALUE,
            vertexToBody = Vector._temp[0],
            vertices = bodyB.vertices,
            bodyAPosition = bodyA.position,
            distance,
            vertex,
            vertexA,
            vertexB;

        // find closest vertex on bodyB
        for (var i = 0; i < vertices.length; i++) {
            vertex = vertices[i];
            vertexToBody.x = vertex.x - bodyAPosition.x;
            vertexToBody.y = vertex.y - bodyAPosition.y;
            distance = -Vector.dot(normal, vertexToBody);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                vertexA = vertex;
            }
        }

        // find next closest vertex using the two connected to it
        var prevIndex = vertexA.index - 1 >= 0 ? vertexA.index - 1 : vertices.length - 1;
        vertex = vertices[prevIndex];
        vertexToBody.x = vertex.x - bodyAPosition.x;
        vertexToBody.y = vertex.y - bodyAPosition.y;
        nearestDistance = -Vector.dot(normal, vertexToBody);
        vertexB = vertex;

        var nextIndex = (vertexA.index + 1) % vertices.length;
        vertex = vertices[nextIndex];
        vertexToBody.x = vertex.x - bodyAPosition.x;
        vertexToBody.y = vertex.y - bodyAPosition.y;
        distance = -Vector.dot(normal, vertexToBody);
        if (distance < nearestDistance) {
            vertexB = vertex;
        }

        return [vertexA, vertexB];
    };

})();

},{"../geometry/Vector":28,"../geometry/Vertices":29}],12:[function(_dereq_,module,exports){
/**
* The `Matter.Constraint` module contains methods for creating and manipulating constraints.
* Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
* The stiffness of constraints can be modified to create springs or elastic.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Constraint
*/

var Constraint = {};

module.exports = Constraint;

var Vertices = _dereq_('../geometry/Vertices');
var Vector = _dereq_('../geometry/Vector');
var Sleeping = _dereq_('../core/Sleeping');
var Bounds = _dereq_('../geometry/Bounds');
var Axes = _dereq_('../geometry/Axes');
var Common = _dereq_('../core/Common');

(function() {

    Constraint._warming = 0.4;
    Constraint._torqueDampen = 1;
    Constraint._minLength = 0.000001;

    /**
     * Creates a new constraint.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
     * For compound bodies, constraints must be applied to the parent body (not one of its parts).
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {} options
     * @return {constraint} constraint
     */
    Constraint.create = function(options) {
        var constraint = options;

        // if bodies defined but no points, use body centre
        if (constraint.bodyA && !constraint.pointA)
            constraint.pointA = { x: 0, y: 0 };
        if (constraint.bodyB && !constraint.pointB)
            constraint.pointB = { x: 0, y: 0 };

        // calculate static length using initial world space points
        var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA,
            initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB,
            length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
    
        constraint.length = typeof constraint.length !== 'undefined' ? constraint.length : length;

        // option defaults
        constraint.id = constraint.id || Common.nextId();
        constraint.label = constraint.label || 'Constraint';
        constraint.type = 'constraint';
        constraint.stiffness = constraint.stiffness || (constraint.length > 0 ? 1 : 0.7);
        constraint.damping = constraint.damping || 0;
        constraint.angularStiffness = constraint.angularStiffness || 0;
        constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
        constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
        constraint.plugin = {};

        // render
        var render = {
            visible: true,
            lineWidth: 2,
            strokeStyle: '#ffffff',
            type: 'line',
            anchors: true
        };

        if (constraint.length === 0 && constraint.stiffness > 0.1) {
            render.type = 'pin';
            render.anchors = false;
        } else if (constraint.stiffness < 0.9) {
            render.type = 'spring';
        }

        constraint.render = Common.extend(render, constraint.render);

        return constraint;
    };

    /**
     * Prepares for solving by constraint warming.
     * @private
     * @method preSolveAll
     * @param {body[]} bodies
     */
    Constraint.preSolveAll = function(bodies) {
        for (var i = 0; i < bodies.length; i += 1) {
            var body = bodies[i],
                impulse = body.constraintImpulse;

            if (body.isStatic || (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)) {
                continue;
            }

            body.position.x += impulse.x;
            body.position.y += impulse.y;
            body.angle += impulse.angle;
        }
    };

    /**
     * Solves all constraints in a list of collisions.
     * @private
     * @method solveAll
     * @param {constraint[]} constraints
     * @param {number} timeScale
     */
    Constraint.solveAll = function(constraints, timeScale) {
        // Solve fixed constraints first.
        for (var i = 0; i < constraints.length; i += 1) {
            var constraint = constraints[i],
                fixedA = !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic),
                fixedB = !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic);

            if (fixedA || fixedB) {
                Constraint.solve(constraints[i], timeScale);
            }
        }

        // Solve free constraints last.
        for (i = 0; i < constraints.length; i += 1) {
            constraint = constraints[i];
            fixedA = !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic);
            fixedB = !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic);

            if (!fixedA && !fixedB) {
                Constraint.solve(constraints[i], timeScale);
            }
        }
    };

    /**
     * Solves a distance constraint with Gauss-Siedel method.
     * @private
     * @method solve
     * @param {constraint} constraint
     * @param {number} timeScale
     */
    Constraint.solve = function(constraint, timeScale) {
        var bodyA = constraint.bodyA,
            bodyB = constraint.bodyB,
            pointA = constraint.pointA,
            pointB = constraint.pointB;

        if (!bodyA && !bodyB)
            return;

        // update reference angle
        if (bodyA && !bodyA.isStatic) {
            Vector.rotate(pointA, bodyA.angle - constraint.angleA, pointA);
            constraint.angleA = bodyA.angle;
        }
        
        // update reference angle
        if (bodyB && !bodyB.isStatic) {
            Vector.rotate(pointB, bodyB.angle - constraint.angleB, pointB);
            constraint.angleB = bodyB.angle;
        }

        var pointAWorld = pointA,
            pointBWorld = pointB;

        if (bodyA) pointAWorld = Vector.add(bodyA.position, pointA);
        if (bodyB) pointBWorld = Vector.add(bodyB.position, pointB);

        if (!pointAWorld || !pointBWorld)
            return;

        var delta = Vector.sub(pointAWorld, pointBWorld),
            currentLength = Vector.magnitude(delta);

        // prevent singularity
        if (currentLength < Constraint._minLength) {
            currentLength = Constraint._minLength;
        }

        // solve distance constraint with Gauss-Siedel method
        var difference = (currentLength - constraint.length) / currentLength,
            stiffness = constraint.stiffness < 1 ? constraint.stiffness * timeScale : constraint.stiffness,
            force = Vector.mult(delta, difference * stiffness),
            massTotal = (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0),
            inertiaTotal = (bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0),
            resistanceTotal = massTotal + inertiaTotal,
            torque,
            share,
            normal,
            normalVelocity,
            relativeVelocity;

        if (constraint.damping) {
            var zero = Vector.create();
            normal = Vector.div(delta, currentLength);

            relativeVelocity = Vector.sub(
                bodyB && Vector.sub(bodyB.position, bodyB.positionPrev) || zero,
                bodyA && Vector.sub(bodyA.position, bodyA.positionPrev) || zero
            );

            normalVelocity = Vector.dot(normal, relativeVelocity);
        }

        if (bodyA && !bodyA.isStatic) {
            share = bodyA.inverseMass / massTotal;

            // keep track of applied impulses for post solving
            bodyA.constraintImpulse.x -= force.x * share;
            bodyA.constraintImpulse.y -= force.y * share;

            // apply forces
            bodyA.position.x -= force.x * share;
            bodyA.position.y -= force.y * share;

            // apply damping
            if (constraint.damping) {
                bodyA.positionPrev.x -= constraint.damping * normal.x * normalVelocity * share;
                bodyA.positionPrev.y -= constraint.damping * normal.y * normalVelocity * share;
            }

            // apply torque
            torque = (Vector.cross(pointA, force) / resistanceTotal) * Constraint._torqueDampen * bodyA.inverseInertia * (1 - constraint.angularStiffness);
            bodyA.constraintImpulse.angle -= torque;
            bodyA.angle -= torque;
        }

        if (bodyB && !bodyB.isStatic) {
            share = bodyB.inverseMass / massTotal;

            // keep track of applied impulses for post solving
            bodyB.constraintImpulse.x += force.x * share;
            bodyB.constraintImpulse.y += force.y * share;
            
            // apply forces
            bodyB.position.x += force.x * share;
            bodyB.position.y += force.y * share;

            // apply damping
            if (constraint.damping) {
                bodyB.positionPrev.x += constraint.damping * normal.x * normalVelocity * share;
                bodyB.positionPrev.y += constraint.damping * normal.y * normalVelocity * share;
            }

            // apply torque
            torque = (Vector.cross(pointB, force) / resistanceTotal) * Constraint._torqueDampen * bodyB.inverseInertia * (1 - constraint.angularStiffness);
            bodyB.constraintImpulse.angle += torque;
            bodyB.angle += torque;
        }

    };

    /**
     * Performs body updates required after solving constraints.
     * @private
     * @method postSolveAll
     * @param {body[]} bodies
     */
    Constraint.postSolveAll = function(bodies) {
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i],
                impulse = body.constraintImpulse;

            if (body.isStatic || (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)) {
                continue;
            }

            Sleeping.set(body, false);

            // update geometry and reset
            for (var j = 0; j < body.parts.length; j++) {
                var part = body.parts[j];
                
                Vertices.translate(part.vertices, impulse);

                if (j > 0) {
                    part.position.x += impulse.x;
                    part.position.y += impulse.y;
                }

                if (impulse.angle !== 0) {
                    Vertices.rotate(part.vertices, impulse.angle, body.position);
                    Axes.rotate(part.axes, impulse.angle);
                    if (j > 0) {
                        Vector.rotateAbout(part.position, impulse.angle, body.position, part.position);
                    }
                }

                Bounds.update(part.bounds, part.vertices, body.velocity);
            }

            // dampen the cached impulse for warming next step
            impulse.angle *= Constraint._warming;
            impulse.x *= Constraint._warming;
            impulse.y *= Constraint._warming;
        }
    };

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
     *
     * @property id
     * @type number
     */

    /**
     * A `String` denoting the type of object.
     *
     * @property type
     * @type string
     * @default "constraint"
     * @readOnly
     */

    /**
     * An arbitrary `String` name to help the user identify and manage bodies.
     *
     * @property label
     * @type string
     * @default "Constraint"
     */

    /**
     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
     *
     * @property render
     * @type object
     */

    /**
     * A flag that indicates if the constraint should be rendered.
     *
     * @property render.visible
     * @type boolean
     * @default true
     */

    /**
     * A `Number` that defines the line width to use when rendering the constraint outline.
     * A value of `0` means no outline will be rendered.
     *
     * @property render.lineWidth
     * @type number
     * @default 2
     */

    /**
     * A `String` that defines the stroke style to use when rendering the constraint outline.
     * It is the same as when using a canvas, so it accepts CSS style property values.
     *
     * @property render.strokeStyle
     * @type string
     * @default a random colour
     */

    /**
     * A `String` that defines the constraint rendering type. 
     * The possible values are 'line', 'pin', 'spring'.
     * An appropriate render type will be automatically chosen unless one is given in options.
     *
     * @property render.type
     * @type string
     * @default 'line'
     */

    /**
     * A `Boolean` that defines if the constraint's anchor points should be rendered.
     *
     * @property render.anchors
     * @type boolean
     * @default true
     */

    /**
     * The first possible `Body` that this constraint is attached to.
     *
     * @property bodyA
     * @type body
     * @default null
     */

    /**
     * The second possible `Body` that this constraint is attached to.
     *
     * @property bodyB
     * @type body
     * @default null
     */

    /**
     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
     *
     * @property pointA
     * @type vector
     * @default { x: 0, y: 0 }
     */

    /**
     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyB` if defined, otherwise a world-space position.
     *
     * @property pointB
     * @type vector
     * @default { x: 0, y: 0 }
     */

    /**
     * A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`.
     * A value of `1` means the constraint should be very stiff.
     * A value of `0.2` means the constraint acts like a soft spring.
     *
     * @property stiffness
     * @type number
     * @default 1
     */

    /**
     * A `Number` that specifies the damping of the constraint, 
     * i.e. the amount of resistance applied to each body based on their velocities to limit the amount of oscillation.
     * Damping will only be apparent when the constraint also has a very low `stiffness`.
     * A value of `0.1` means the constraint will apply heavy damping, resulting in little to no oscillation.
     * A value of `0` means the constraint will apply no damping.
     *
     * @property damping
     * @type number
     * @default 0
     */

    /**
     * A `Number` that specifies the target resting length of the constraint. 
     * It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
     *
     * @property length
     * @type number
     */

    /**
     * An object reserved for storing plugin-specific properties.
     *
     * @property plugin
     * @type {}
     */

})();

},{"../core/Common":14,"../core/Sleeping":22,"../geometry/Axes":25,"../geometry/Bounds":26,"../geometry/Vector":28,"../geometry/Vertices":29}],13:[function(_dereq_,module,exports){
/**
* The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
* Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class MouseConstraint
*/

var MouseConstraint = {};

module.exports = MouseConstraint;

var Vertices = _dereq_('../geometry/Vertices');
var Sleeping = _dereq_('../core/Sleeping');
var Mouse = _dereq_('../core/Mouse');
var Events = _dereq_('../core/Events');
var Detector = _dereq_('../collision/Detector');
var Constraint = _dereq_('./Constraint');
var Composite = _dereq_('../body/Composite');
var Common = _dereq_('../core/Common');
var Bounds = _dereq_('../geometry/Bounds');

(function() {

    /**
     * Creates a new mouse constraint.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {engine} engine
     * @param {} options
     * @return {MouseConstraint} A new MouseConstraint
     */
    MouseConstraint.create = function(engine, options) {
        var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);

        if (!mouse) {
            if (engine && engine.render && engine.render.canvas) {
                mouse = Mouse.create(engine.render.canvas);
            } else if (options && options.element) {
                mouse = Mouse.create(options.element);
            } else {
                mouse = Mouse.create();
                Common.warn('MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected');
            }
        }

        var constraint = Constraint.create({ 
            label: 'Mouse Constraint',
            pointA: mouse.position,
            pointB: { x: 0, y: 0 },
            length: 0.01, 
            stiffness: 0.1,
            angularStiffness: 1,
            render: {
                strokeStyle: '#90EE90',
                lineWidth: 3
            }
        });

        var defaults = {
            type: 'mouseConstraint',
            mouse: mouse,
            element: null,
            body: null,
            constraint: constraint,
            collisionFilter: {
                category: 0x0001,
                mask: 0xFFFFFFFF,
                group: 0
            }
        };

        var mouseConstraint = Common.extend(defaults, options);

        Events.on(engine, 'beforeUpdate', function() {
            var allBodies = Composite.allBodies(engine.world);
            MouseConstraint.update(mouseConstraint, allBodies);
            MouseConstraint._triggerEvents(mouseConstraint);
        });

        return mouseConstraint;
    };

    /**
     * Updates the given mouse constraint.
     * @private
     * @method update
     * @param {MouseConstraint} mouseConstraint
     * @param {body[]} bodies
     */
    MouseConstraint.update = function(mouseConstraint, bodies) {
        var mouse = mouseConstraint.mouse,
            constraint = mouseConstraint.constraint,
            body = mouseConstraint.body;

        if (mouse.button === 0) {
            if (!constraint.bodyB) {
                for (var i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (Bounds.contains(body.bounds, mouse.position) 
                            && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
                        for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                            var part = body.parts[j];
                            if (Vertices.contains(part.vertices, mouse.position)) {
                                constraint.pointA = mouse.position;
                                constraint.bodyB = mouseConstraint.body = body;
                                constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y };
                                constraint.angleB = body.angle;

                                Sleeping.set(body, false);
                                Events.trigger(mouseConstraint, 'startdrag', { mouse: mouse, body: body });

                                break;
                            }
                        }
                    }
                }
            } else {
                Sleeping.set(constraint.bodyB, false);
                constraint.pointA = mouse.position;
            }
        } else {
            constraint.bodyB = mouseConstraint.body = null;
            constraint.pointB = null;

            if (body)
                Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body });
        }
    };

    /**
     * Triggers mouse constraint events.
     * @method _triggerEvents
     * @private
     * @param {mouse} mouseConstraint
     */
    MouseConstraint._triggerEvents = function(mouseConstraint) {
        var mouse = mouseConstraint.mouse,
            mouseEvents = mouse.sourceEvents;

        if (mouseEvents.mousemove)
            Events.trigger(mouseConstraint, 'mousemove', { mouse: mouse });

        if (mouseEvents.mousedown)
            Events.trigger(mouseConstraint, 'mousedown', { mouse: mouse });

        if (mouseEvents.mouseup)
            Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse });

        // reset the mouse state ready for the next step
        Mouse.clearSourceEvents(mouse);
    };

    /*
    *
    *  Events Documentation
    *
    */

    /**
    * Fired when the mouse has moved (or a touch moves) during the last step
    *
    * @event mousemove
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when the mouse is down (or a touch has started) during the last step
    *
    * @event mousedown
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when the mouse is up (or a touch has ended) during the last step
    *
    * @event mouseup
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when the user starts dragging a body
    *
    * @event startdrag
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {body} event.body The body being dragged
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired when the user ends dragging a body
    *
    * @event enddrag
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {body} event.body The body that has stopped being dragged
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * A `String` denoting the type of object.
     *
     * @property type
     * @type string
     * @default "constraint"
     * @readOnly
     */

    /**
     * The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
     *
     * @property mouse
     * @type mouse
     * @default mouse
     */

    /**
     * The `Body` that is currently being moved by the user, or `null` if no body.
     *
     * @property body
     * @type body
     * @default null
     */

    /**
     * The `Constraint` object that is used to move the body during interaction.
     *
     * @property constraint
     * @type constraint
     */

    /**
     * An `Object` that specifies the collision filter properties.
     * The collision filter allows the user to define which types of body this mouse constraint can interact with.
     * See `body.collisionFilter` for more information.
     *
     * @property collisionFilter
     * @type object
     */

})();

},{"../body/Composite":2,"../collision/Detector":5,"../core/Common":14,"../core/Events":16,"../core/Mouse":19,"../core/Sleeping":22,"../geometry/Bounds":26,"../geometry/Vertices":29,"./Constraint":12}],14:[function(_dereq_,module,exports){
(function (global){
/**
* The `Matter.Common` module contains utility functions that are common to all modules.
*
* @class Common
*/

var Common = {};

module.exports = Common;

(function() {

    Common._nextId = 0;
    Common._seed = 0;
    Common._nowStartTime = +(new Date());

    /**
     * Extends the object in the first argument using the object in the second argument.
     * @method extend
     * @param {} obj
     * @param {boolean} deep
     * @return {} obj extended
     */
    Common.extend = function(obj, deep) {
        var argsStart,
            args,
            deepClone;

        if (typeof deep === 'boolean') {
            argsStart = 2;
            deepClone = deep;
        } else {
            argsStart = 1;
            deepClone = true;
        }

        for (var i = argsStart; i < arguments.length; i++) {
            var source = arguments[i];

            if (source) {
                for (var prop in source) {
                    if (deepClone && source[prop] && source[prop].constructor === Object) {
                        if (!obj[prop] || obj[prop].constructor === Object) {
                            obj[prop] = obj[prop] || {};
                            Common.extend(obj[prop], deepClone, source[prop]);
                        } else {
                            obj[prop] = source[prop];
                        }
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        }
        
        return obj;
    };

    /**
     * Creates a new clone of the object, if deep is true references will also be cloned.
     * @method clone
     * @param {} obj
     * @param {bool} deep
     * @return {} obj cloned
     */
    Common.clone = function(obj, deep) {
        return Common.extend({}, deep, obj);
    };

    /**
     * Returns the list of keys for the given object.
     * @method keys
     * @param {} obj
     * @return {string[]} keys
     */
    Common.keys = function(obj) {
        if (Object.keys)
            return Object.keys(obj);

        // avoid hasOwnProperty for performance
        var keys = [];
        for (var key in obj)
            keys.push(key);
        return keys;
    };

    /**
     * Returns the list of values for the given object.
     * @method values
     * @param {} obj
     * @return {array} Array of the objects property values
     */
    Common.values = function(obj) {
        var values = [];
        
        if (Object.keys) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                values.push(obj[keys[i]]);
            }
            return values;
        }
        
        // avoid hasOwnProperty for performance
        for (var key in obj)
            values.push(obj[key]);
        return values;
    };

    /**
     * Gets a value from `base` relative to the `path` string.
     * @method get
     * @param {} obj The base object
     * @param {string} path The path relative to `base`, e.g. 'Foo.Bar.baz'
     * @param {number} [begin] Path slice begin
     * @param {number} [end] Path slice end
     * @return {} The object at the given path
     */
    Common.get = function(obj, path, begin, end) {
        path = path.split('.').slice(begin, end);

        for (var i = 0; i < path.length; i += 1) {
            obj = obj[path[i]];
        }

        return obj;
    };

    /**
     * Sets a value on `base` relative to the given `path` string.
     * @method set
     * @param {} obj The base object
     * @param {string} path The path relative to `base`, e.g. 'Foo.Bar.baz'
     * @param {} val The value to set
     * @param {number} [begin] Path slice begin
     * @param {number} [end] Path slice end
     * @return {} Pass through `val` for chaining
     */
    Common.set = function(obj, path, val, begin, end) {
        var parts = path.split('.').slice(begin, end);
        Common.get(obj, path, 0, -1)[parts[parts.length - 1]] = val;
        return val;
    };

    /**
     * Shuffles the given array in-place.
     * The function uses a seeded random generator.
     * @method shuffle
     * @param {array} array
     * @return {array} array shuffled randomly
     */
    Common.shuffle = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Common.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    /**
     * Randomly chooses a value from a list with equal probability.
     * The function uses a seeded random generator.
     * @method choose
     * @param {array} choices
     * @return {object} A random choice object from the array
     */
    Common.choose = function(choices) {
        return choices[Math.floor(Common.random() * choices.length)];
    };

    /**
     * Returns true if the object is a HTMLElement, otherwise false.
     * @method isElement
     * @param {object} obj
     * @return {boolean} True if the object is a HTMLElement, otherwise false
     */
    Common.isElement = function(obj) {
        if (typeof HTMLElement !== 'undefined') {
            return obj instanceof HTMLElement;
        }

        return !!(obj && obj.nodeType && obj.nodeName);
    };

    /**
     * Returns true if the object is an array.
     * @method isArray
     * @param {object} obj
     * @return {boolean} True if the object is an array, otherwise false
     */
    Common.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /**
     * Returns true if the object is a function.
     * @method isFunction
     * @param {object} obj
     * @return {boolean} True if the object is a function, otherwise false
     */
    Common.isFunction = function(obj) {
        return typeof obj === "function";
    };

    /**
     * Returns true if the object is a plain object.
     * @method isPlainObject
     * @param {object} obj
     * @return {boolean} True if the object is a plain object, otherwise false
     */
    Common.isPlainObject = function(obj) {
        return typeof obj === 'object' && obj.constructor === Object;
    };

    /**
     * Returns true if the object is a string.
     * @method isString
     * @param {object} obj
     * @return {boolean} True if the object is a string, otherwise false
     */
    Common.isString = function(obj) {
        return toString.call(obj) === '[object String]';
    };
    
    /**
     * Returns the given value clamped between a minimum and maximum value.
     * @method clamp
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @return {number} The value clamped between min and max inclusive
     */
    Common.clamp = function(value, min, max) {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    };
    
    /**
     * Returns the sign of the given value.
     * @method sign
     * @param {number} value
     * @return {number} -1 if negative, +1 if 0 or positive
     */
    Common.sign = function(value) {
        return value < 0 ? -1 : 1;
    };
    
    /**
     * Returns the current timestamp since the time origin (e.g. from page load).
     * The result will be high-resolution including decimal places if available.
     * @method now
     * @return {number} the current timestamp
     */
    Common.now = function() {
        if (window.performance) {
            if (window.performance.now) {
                return window.performance.now();
            } else if (window.performance.webkitNow) {
                return window.performance.webkitNow();
            }
        }

        return (new Date()) - Common._nowStartTime;
    };
    
    /**
     * Returns a random value between a minimum and a maximum value inclusive.
     * The function uses a seeded random generator.
     * @method random
     * @param {number} min
     * @param {number} max
     * @return {number} A random number between min and max inclusive
     */
    Common.random = function(min, max) {
        min = (typeof min !== "undefined") ? min : 0;
        max = (typeof max !== "undefined") ? max : 1;
        return min + _seededRandom() * (max - min);
    };

    var _seededRandom = function() {
        // https://en.wikipedia.org/wiki/Linear_congruential_generator
        Common._seed = (Common._seed * 9301 + 49297) % 233280;
        return Common._seed / 233280;
    };

    /**
     * Converts a CSS hex colour string into an integer.
     * @method colorToNumber
     * @param {string} colorString
     * @return {number} An integer representing the CSS hex string
     */
    Common.colorToNumber = function(colorString) {
        colorString = colorString.replace('#','');

        if (colorString.length == 3) {
            colorString = colorString.charAt(0) + colorString.charAt(0)
                        + colorString.charAt(1) + colorString.charAt(1)
                        + colorString.charAt(2) + colorString.charAt(2);
        }

        return parseInt(colorString, 16);
    };

    /**
     * The console logging level to use, where each level includes all levels above and excludes the levels below.
     * The default level is 'debug' which shows all console messages.  
     *
     * Possible level values are:
     * - 0 = None
     * - 1 = Debug
     * - 2 = Info
     * - 3 = Warn
     * - 4 = Error
     * @property Common.logLevel
     * @type {Number}
     * @default 1
     */
    Common.logLevel = 1;

    /**
     * Shows a `console.log` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-js' to make it easily identifiable.
     * @method log
     * @param ...objs {} The objects to log.
     */
    Common.log = function() {
        if (console && Common.logLevel > 0 && Common.logLevel <= 3) {
            console.log.apply(console, ['matter-js:'].concat(Array.prototype.slice.call(arguments)));
        }
    };

    /**
     * Shows a `console.info` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-js' to make it easily identifiable.
     * @method info
     * @param ...objs {} The objects to log.
     */
    Common.info = function() {
        if (console && Common.logLevel > 0 && Common.logLevel <= 2) {
            console.info.apply(console, ['matter-js:'].concat(Array.prototype.slice.call(arguments)));
        }
    };

    /**
     * Shows a `console.warn` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-js' to make it easily identifiable.
     * @method warn
     * @param ...objs {} The objects to log.
     */
    Common.warn = function() {
        if (console && Common.logLevel > 0 && Common.logLevel <= 3) {
            console.warn.apply(console, ['matter-js:'].concat(Array.prototype.slice.call(arguments)));
        }
    };

    /**
     * Returns the next unique sequential ID.
     * @method nextId
     * @return {Number} Unique sequential ID
     */
    Common.nextId = function() {
        return Common._nextId++;
    };

    /**
     * A cross browser compatible indexOf implementation.
     * @method indexOf
     * @param {array} haystack
     * @param {object} needle
     * @return {number} The position of needle in haystack, otherwise -1.
     */
    Common.indexOf = function(haystack, needle) {
        if (haystack.indexOf)
            return haystack.indexOf(needle);

        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle)
                return i;
        }

        return -1;
    };

    /**
     * A cross browser compatible array map implementation.
     * @method map
     * @param {array} list
     * @param {function} func
     * @return {array} Values from list transformed by func.
     */
    Common.map = function(list, func) {
        if (list.map) {
            return list.map(func);
        }

        var mapped = [];

        for (var i = 0; i < list.length; i += 1) {
            mapped.push(func(list[i]));
        }

        return mapped;
    };

    /**
     * Takes a directed graph and returns the partially ordered set of vertices in topological order.
     * Circular dependencies are allowed.
     * @method topologicalSort
     * @param {object} graph
     * @return {array} Partially ordered set of vertices in topological order.
     */
    Common.topologicalSort = function(graph) {
        // https://github.com/mgechev/javascript-algorithms
        // Copyright (c) Minko Gechev (MIT license)
        // Modifications: tidy formatting and naming
        var result = [],
            visited = [],
            temp = [];

        for (var node in graph) {
            if (!visited[node] && !temp[node]) {
                Common._topologicalSort(node, visited, temp, graph, result);
            }
        }

        return result;
    };

    Common._topologicalSort = function(node, visited, temp, graph, result) {
        var neighbors = graph[node] || [];
        temp[node] = true;

        for (var i = 0; i < neighbors.length; i += 1) {
            var neighbor = neighbors[i];

            if (temp[neighbor]) {
                // skip circular dependencies
                continue;
            }

            if (!visited[neighbor]) {
                Common._topologicalSort(neighbor, visited, temp, graph, result);
            }
        }

        temp[node] = false;
        visited[node] = true;

        result.push(node);
    };

    /**
     * Takes _n_ functions as arguments and returns a new function that calls them in order.
     * The arguments applied when calling the new function will also be applied to every function passed.
     * The value of `this` refers to the last value returned in the chain that was not `undefined`.
     * Therefore if a passed function does not return a value, the previously returned value is maintained.
     * After all passed functions have been called the new function returns the last returned value (if any).
     * If any of the passed functions are a chain, then the chain will be flattened.
     * @method chain
     * @param ...funcs {function} The functions to chain.
     * @return {function} A new function that calls the passed functions in order.
     */
    Common.chain = function() {
        var funcs = [];

        for (var i = 0; i < arguments.length; i += 1) {
            var func = arguments[i];

            if (func._chained) {
                // flatten already chained functions
                funcs.push.apply(funcs, func._chained);
            } else {
                funcs.push(func);
            }
        }

        var chain = function() {
            // https://github.com/GoogleChrome/devtools-docs/issues/53#issuecomment-51941358
            var lastResult,
                args = new Array(arguments.length);

            for (var i = 0, l = arguments.length; i < l; i++) {
                args[i] = arguments[i];
            }

            for (i = 0; i < funcs.length; i += 1) {
                var result = funcs[i].apply(lastResult, args);

                if (typeof result !== 'undefined') {
                    lastResult = result;
                }
            }

            return lastResult;
        };

        chain._chained = funcs;

        return chain;
    };

    /**
     * Chains a function to excute before the original function on the given `path` relative to `base`.
     * See also docs for `Common.chain`.
     * @method chainPathBefore
     * @param {} base The base object
     * @param {string} path The path relative to `base`
     * @param {function} func The function to chain before the original
     * @return {function} The chained function that replaced the original
     */
    Common.chainPathBefore = function(base, path, func) {
        return Common.set(base, path, Common.chain(
            func,
            Common.get(base, path)
        ));
    };

    /**
     * Chains a function to excute after the original function on the given `path` relative to `base`.
     * See also docs for `Common.chain`.
     * @method chainPathAfter
     * @param {} base The base object
     * @param {string} path The path relative to `base`
     * @param {function} func The function to chain after the original
     * @return {function} The chained function that replaced the original
     */
    Common.chainPathAfter = function(base, path, func) {
        return Common.set(base, path, Common.chain(
            Common.get(base, path),
            func
        ));
    };

    /**
     * Used to require external libraries outside of the bundle.
     * It first looks for the `globalName` on the environment's global namespace.
     * If the global is not found, it will fall back to using the standard `require` using the `moduleName`.
     * @private
     * @method _requireGlobal
     * @param {string} globalName The global module name
     * @param {string} moduleName The fallback CommonJS module name
     * @return {} The loaded module
     */
    Common._requireGlobal = function(globalName, moduleName) {
        var obj = (typeof window !== 'undefined' ? window[globalName] : typeof global !== 'undefined' ? global[globalName] : null);
        return obj || _dereq_(moduleName);
    };
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(_dereq_,module,exports){
/**
* The `Matter.Engine` module contains methods for creating and manipulating engines.
* An engine is a controller that manages updating the simulation of the world.
* See `Matter.Runner` for an optional game loop utility.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Engine
*/

var Engine = {};

module.exports = Engine;

var World = _dereq_('../body/World');
var Sleeping = _dereq_('./Sleeping');
var Resolver = _dereq_('../collision/Resolver');
var Render = _dereq_('../render/Render');
var Pairs = _dereq_('../collision/Pairs');
var Metrics = _dereq_('./Metrics');
var Grid = _dereq_('../collision/Grid');
var Events = _dereq_('./Events');
var Composite = _dereq_('../body/Composite');
var Constraint = _dereq_('../constraint/Constraint');
var Common = _dereq_('./Common');
var Body = _dereq_('../body/Body');

(function() {

    /**
     * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {object} [options]
     * @return {engine} engine
     */
    Engine.create = function(element, options) {
        // options may be passed as the first (and only) argument
        options = Common.isElement(element) ? options : element;
        element = Common.isElement(element) ? element : null;
        options = options || {};

        if (element || options.render) {
            Common.warn('Engine.create: engine.render is deprecated (see docs)');
        }

        var defaults = {
            positionIterations: 6,
            velocityIterations: 4,
            constraintIterations: 2,
            enableSleeping: false,
            events: [],
            plugin: {},
            timing: {
                timestamp: 0,
                timeScale: 1
            },
            broadphase: {
                controller: Grid
            }
        };

        var engine = Common.extend(defaults, options);

        // @deprecated
        if (element || engine.render) {
            var renderDefaults = {
                element: element,
                controller: Render
            };
            
            engine.render = Common.extend(renderDefaults, engine.render);
        }

        // @deprecated
        if (engine.render && engine.render.controller) {
            engine.render = engine.render.controller.create(engine.render);
        }

        // @deprecated
        if (engine.render) {
            engine.render.engine = engine;
        }

        engine.world = options.world || World.create(engine.world);
        engine.pairs = Pairs.create();
        engine.broadphase = engine.broadphase.controller.create(engine.broadphase);
        engine.metrics = engine.metrics || { extended: false };


        return engine;
    };

    /**
     * Moves the simulation forward in time by `delta` ms.
     * The `correction` argument is an optional `Number` that specifies the time correction factor to apply to the update.
     * This can help improve the accuracy of the simulation in cases where `delta` is changing between updates.
     * The value of `correction` is defined as `delta / lastDelta`, i.e. the percentage change of `delta` over the last step.
     * Therefore the value is always `1` (no correction) when `delta` constant (or when no correction is desired, which is the default).
     * See the paper on <a href="http://lonesock.net/article/verlet.html">Time Corrected Verlet</a> for more information.
     *
     * Triggers `beforeUpdate` and `afterUpdate` events.
     * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
     * @method update
     * @param {engine} engine
     * @param {number} [delta=16.666]
     * @param {number} [correction=1]
     */
    Engine.update = function(engine, delta, correction) {
        delta = delta || 1000 / 60;
        correction = correction || 1;

        var world = engine.world,
            timing = engine.timing,
            broadphase = engine.broadphase,
            broadphasePairs = [],
            i;

        // increment timestamp
        timing.timestamp += delta * timing.timeScale;

        // create an event object
        var event = {
            timestamp: timing.timestamp
        };

        Events.trigger(engine, 'beforeUpdate', event);

        // get lists of all bodies and constraints, no matter what composites they are in
        var allBodies = Composite.allBodies(world),
            allConstraints = Composite.allConstraints(world);


        // if sleeping enabled, call the sleeping controller
        if (engine.enableSleeping)
            Sleeping.update(allBodies, timing.timeScale);

        // applies gravity to all bodies
        Engine._bodiesApplyGravity(allBodies, world.gravity);

        // update all body position and rotation by integration
        Engine._bodiesUpdate(allBodies, delta, timing.timeScale, correction, world.bounds);

        // update all constraints (first pass)
        Constraint.preSolveAll(allBodies);
        for (i = 0; i < engine.constraintIterations; i++) {
            Constraint.solveAll(allConstraints, timing.timeScale);
        }
        Constraint.postSolveAll(allBodies);

        // broadphase pass: find potential collision pairs
        if (broadphase.controller) {
            // if world is dirty, we must flush the whole grid
            if (world.isModified)
                broadphase.controller.clear(broadphase);

            // update the grid buckets based on current bodies
            broadphase.controller.update(broadphase, allBodies, engine, world.isModified);
            broadphasePairs = broadphase.pairsList;
        } else {
            // if no broadphase set, we just pass all bodies
            broadphasePairs = allBodies;
        }

        // clear all composite modified flags
        if (world.isModified) {
            Composite.setModified(world, false, false, true);
        }

        // narrowphase pass: find actual collisions, then create or update collision pairs
        var collisions = broadphase.detector(broadphasePairs, engine);

        // update collision pairs
        var pairs = engine.pairs,
            timestamp = timing.timestamp;
        Pairs.update(pairs, collisions, timestamp);
        Pairs.removeOld(pairs, timestamp);

        // wake up bodies involved in collisions
        if (engine.enableSleeping)
            Sleeping.afterCollisions(pairs.list, timing.timeScale);

        // trigger collision events
        if (pairs.collisionStart.length > 0)
            Events.trigger(engine, 'collisionStart', { pairs: pairs.collisionStart });

        // iteratively resolve position between collisions
        Resolver.preSolvePosition(pairs.list);
        for (i = 0; i < engine.positionIterations; i++) {
            Resolver.solvePosition(pairs.list, timing.timeScale);
        }
        Resolver.postSolvePosition(allBodies);

        // update all constraints (second pass)
        Constraint.preSolveAll(allBodies);
        for (i = 0; i < engine.constraintIterations; i++) {
            Constraint.solveAll(allConstraints, timing.timeScale);
        }
        Constraint.postSolveAll(allBodies);

        // iteratively resolve velocity between collisions
        Resolver.preSolveVelocity(pairs.list);
        for (i = 0; i < engine.velocityIterations; i++) {
            Resolver.solveVelocity(pairs.list, timing.timeScale);
        }

        // trigger collision events
        if (pairs.collisionActive.length > 0)
            Events.trigger(engine, 'collisionActive', { pairs: pairs.collisionActive });

        if (pairs.collisionEnd.length > 0)
            Events.trigger(engine, 'collisionEnd', { pairs: pairs.collisionEnd });


        // clear force buffers
        Engine._bodiesClearForces(allBodies);

        Events.trigger(engine, 'afterUpdate', event);

        return engine;
    };
    
    /**
     * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
     * @method merge
     * @param {engine} engineA
     * @param {engine} engineB
     */
    Engine.merge = function(engineA, engineB) {
        Common.extend(engineA, engineB);
        
        if (engineB.world) {
            engineA.world = engineB.world;

            Engine.clear(engineA);

            var bodies = Composite.allBodies(engineA.world);

            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                Sleeping.set(body, false);
                body.id = Common.nextId();
            }
        }
    };

    /**
     * Clears the engine including the world, pairs and broadphase.
     * @method clear
     * @param {engine} engine
     */
    Engine.clear = function(engine) {
        var world = engine.world;
        
        Pairs.clear(engine.pairs);

        var broadphase = engine.broadphase;
        if (broadphase.controller) {
            var bodies = Composite.allBodies(world);
            broadphase.controller.clear(broadphase);
            broadphase.controller.update(broadphase, bodies, engine, true);
        }
    };

    /**
     * Zeroes the `body.force` and `body.torque` force buffers.
     * @method _bodiesClearForces
     * @private
     * @param {body[]} bodies
     */
    Engine._bodiesClearForces = function(bodies) {
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            // reset force buffers
            body.force.x = 0;
            body.force.y = 0;
            body.torque = 0;
        }
    };

    /**
     * Applys a mass dependant force to all given bodies.
     * @method _bodiesApplyGravity
     * @private
     * @param {body[]} bodies
     * @param {vector} gravity
     */
    Engine._bodiesApplyGravity = function(bodies, gravity) {
        var gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001;

        if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
            return;
        }
        
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (body.isStatic || body.isSleeping)
                continue;

            // apply gravity
            body.force.y += body.mass * gravity.y * gravityScale;
            body.force.x += body.mass * gravity.x * gravityScale;
        }
    };

    /**
     * Applys `Body.update` to all given `bodies`.
     * @method _bodiesUpdate
     * @private
     * @param {body[]} bodies
     * @param {number} deltaTime 
     * The amount of time elapsed between updates
     * @param {number} timeScale
     * @param {number} correction 
     * The Verlet correction factor (deltaTime / lastDeltaTime)
     * @param {bounds} worldBounds
     */
    Engine._bodiesUpdate = function(bodies, deltaTime, timeScale, correction, worldBounds) {
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (body.isStatic || body.isSleeping)
                continue;

            Body.update(body, deltaTime, timeScale, correction);
        }
    };

    /**
     * An alias for `Runner.run`, see `Matter.Runner` for more information.
     * @method run
     * @param {engine} engine
     */

    /**
    * Fired just before an update
    *
    * @event beforeUpdate
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after engine update and all collision events
    *
    * @event afterUpdate
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after engine update, provides a list of all pairs that have started to collide in the current tick (if any)
    *
    * @event collisionStart
    * @param {} event An event object
    * @param {} event.pairs List of affected pairs
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after engine update, provides a list of all pairs that are colliding in the current tick (if any)
    *
    * @event collisionActive
    * @param {} event An event object
    * @param {} event.pairs List of affected pairs
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after engine update, provides a list of all pairs that have ended collision in the current tick (if any)
    *
    * @event collisionEnd
    * @param {} event An event object
    * @param {} event.pairs List of affected pairs
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * An integer `Number` that specifies the number of position iterations to perform each update.
     * The higher the value, the higher quality the simulation will be at the expense of performance.
     *
     * @property positionIterations
     * @type number
     * @default 6
     */

    /**
     * An integer `Number` that specifies the number of velocity iterations to perform each update.
     * The higher the value, the higher quality the simulation will be at the expense of performance.
     *
     * @property velocityIterations
     * @type number
     * @default 4
     */

    /**
     * An integer `Number` that specifies the number of constraint iterations to perform each update.
     * The higher the value, the higher quality the simulation will be at the expense of performance.
     * The default value of `2` is usually very adequate.
     *
     * @property constraintIterations
     * @type number
     * @default 2
     */

    /**
     * A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module.
     * Sleeping can improve stability and performance, but often at the expense of accuracy.
     *
     * @property enableSleeping
     * @type boolean
     * @default false
     */

    /**
     * An `Object` containing properties regarding the timing systems of the engine. 
     *
     * @property timing
     * @type object
     */

    /**
     * A `Number` that specifies the global scaling factor of time for all bodies.
     * A value of `0` freezes the simulation.
     * A value of `0.1` gives a slow-motion effect.
     * A value of `1.2` gives a speed-up effect.
     *
     * @property timing.timeScale
     * @type number
     * @default 1
     */

    /**
     * A `Number` that specifies the current simulation-time in milliseconds starting from `0`. 
     * It is incremented on every `Engine.update` by the given `delta` argument. 
     *
     * @property timing.timestamp
     * @type number
     * @default 0
     */

    /**
     * An instance of a `Render` controller. The default value is a `Matter.Render` instance created by `Engine.create`.
     * One may also develop a custom renderer module based on `Matter.Render` and pass an instance of it to `Engine.create` via `options.render`.
     *
     * A minimal custom renderer object must define at least three functions: `create`, `clear` and `world` (see `Matter.Render`).
     * It is also possible to instead pass the _module_ reference via `options.render.controller` and `Engine.create` will instantiate one for you.
     *
     * @property render
     * @type render
     * @deprecated see Demo.js for an example of creating a renderer
     * @default a Matter.Render instance
     */

    /**
     * An instance of a broadphase controller. The default value is a `Matter.Grid` instance created by `Engine.create`.
     *
     * @property broadphase
     * @type grid
     * @default a Matter.Grid instance
     */

    /**
     * A `World` composite object that will contain all simulated bodies and constraints.
     *
     * @property world
     * @type world
     * @default a Matter.World instance
     */

    /**
     * An object reserved for storing plugin-specific properties.
     *
     * @property plugin
     * @type {}
     */

})();

},{"../body/Body":1,"../body/Composite":2,"../body/World":3,"../collision/Grid":6,"../collision/Pairs":8,"../collision/Resolver":10,"../constraint/Constraint":12,"../render/Render":31,"./Common":14,"./Events":16,"./Metrics":18,"./Sleeping":22}],16:[function(_dereq_,module,exports){
/**
* The `Matter.Events` module contains methods to fire and listen to events on other objects.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Events
*/

var Events = {};

module.exports = Events;

var Common = _dereq_('./Common');

(function() {

    /**
     * Subscribes a callback function to the given object's `eventName`.
     * @method on
     * @param {} object
     * @param {string} eventNames
     * @param {function} callback
     */
    Events.on = function(object, eventNames, callback) {
        var names = eventNames.split(' '),
            name;

        for (var i = 0; i < names.length; i++) {
            name = names[i];
            object.events = object.events || {};
            object.events[name] = object.events[name] || [];
            object.events[name].push(callback);
        }

        return callback;
    };

    /**
     * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all events.
     * @method off
     * @param {} object
     * @param {string} eventNames
     * @param {function} callback
     */
    Events.off = function(object, eventNames, callback) {
        if (!eventNames) {
            object.events = {};
            return;
        }

        // handle Events.off(object, callback)
        if (typeof eventNames === 'function') {
            callback = eventNames;
            eventNames = Common.keys(object.events).join(' ');
        }

        var names = eventNames.split(' ');

        for (var i = 0; i < names.length; i++) {
            var callbacks = object.events[names[i]],
                newCallbacks = [];

            if (callback && callbacks) {
                for (var j = 0; j < callbacks.length; j++) {
                    if (callbacks[j] !== callback)
                        newCallbacks.push(callbacks[j]);
                }
            }

            object.events[names[i]] = newCallbacks;
        }
    };

    /**
     * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
     * @method trigger
     * @param {} object
     * @param {string} eventNames
     * @param {} event
     */
    Events.trigger = function(object, eventNames, event) {
        var names,
            name,
            callbacks,
            eventClone;

        if (object.events) {
            if (!event)
                event = {};

            names = eventNames.split(' ');

            for (var i = 0; i < names.length; i++) {
                name = names[i];
                callbacks = object.events[name];

                if (callbacks) {
                    eventClone = Common.clone(event, false);
                    eventClone.name = name;
                    eventClone.source = object;

                    for (var j = 0; j < callbacks.length; j++) {
                        callbacks[j].apply(object, [eventClone]);
                    }
                }
            }
        }
    };

})();

},{"./Common":14}],17:[function(_dereq_,module,exports){
/**
* The `Matter` module is the top level namespace. It also includes a function for installing plugins on top of the library.
*
* @class Matter
*/

var Matter = {};

module.exports = Matter;

var Plugin = _dereq_('./Plugin');
var Common = _dereq_('./Common');

(function() {

    /**
     * The library name.
     * @property name
     * @readOnly
     * @type {String}
     */
    Matter.name = 'matter-js';

    /**
     * The library version.
     * @property version
     * @readOnly
     * @type {String}
     */
    Matter.version = '0.14.2';

    /**
     * A list of plugin dependencies to be installed. These are normally set and installed through `Matter.use`.
     * Alternatively you may set `Matter.uses` manually and install them by calling `Plugin.use(Matter)`.
     * @property uses
     * @type {Array}
     */
    Matter.uses = [];

    /**
     * The plugins that have been installed through `Matter.Plugin.install`. Read only.
     * @property used
     * @readOnly
     * @type {Array}
     */
    Matter.used = [];

    /**
     * Installs the given plugins on the `Matter` namespace.
     * This is a short-hand for `Plugin.use`, see it for more information.
     * Call this function once at the start of your code, with all of the plugins you wish to install as arguments.
     * Avoid calling this function multiple times unless you intend to manually control installation order.
     * @method use
     * @param ...plugin {Function} The plugin(s) to install on `base` (multi-argument).
     */
    Matter.use = function() {
        Plugin.use(Matter, Array.prototype.slice.call(arguments));
    };

    /**
     * Chains a function to excute before the original function on the given `path` relative to `Matter`.
     * See also docs for `Common.chain`.
     * @method before
     * @param {string} path The path relative to `Matter`
     * @param {function} func The function to chain before the original
     * @return {function} The chained function that replaced the original
     */
    Matter.before = function(path, func) {
        path = path.replace(/^Matter./, '');
        return Common.chainPathBefore(Matter, path, func);
    };

    /**
     * Chains a function to excute after the original function on the given `path` relative to `Matter`.
     * See also docs for `Common.chain`.
     * @method after
     * @param {string} path The path relative to `Matter`
     * @param {function} func The function to chain after the original
     * @return {function} The chained function that replaced the original
     */
    Matter.after = function(path, func) {
        path = path.replace(/^Matter./, '');
        return Common.chainPathAfter(Matter, path, func);
    };

})();

},{"./Common":14,"./Plugin":20}],18:[function(_dereq_,module,exports){

},{"../body/Composite":2,"./Common":14}],19:[function(_dereq_,module,exports){
/**
* The `Matter.Mouse` module contains methods for creating and manipulating mouse inputs.
*
* @class Mouse
*/

var Mouse = {};

module.exports = Mouse;

var Common = _dereq_('../core/Common');

(function() {

    /**
     * Creates a mouse input.
     * @method create
     * @param {HTMLElement} element
     * @return {mouse} A new mouse
     */
    Mouse.create = function(element) {
        var mouse = {};

        if (!element) {
            Common.log('Mouse.create: element was undefined, defaulting to document.body', 'warn');
        }
        
        mouse.element = element || document.body;
        mouse.absolute = { x: 0, y: 0 };
        mouse.position = { x: 0, y: 0 };
        mouse.mousedownPosition = { x: 0, y: 0 };
        mouse.mouseupPosition = { x: 0, y: 0 };
        mouse.offset = { x: 0, y: 0 };
        mouse.scale = { x: 1, y: 1 };
        mouse.wheelDelta = 0;
        mouse.button = -1;
        mouse.pixelRatio = mouse.element.getAttribute('data-pixel-ratio') || 1;

        mouse.sourceEvents = {
            mousemove: null,
            mousedown: null,
            mouseup: null,
            mousewheel: null
        };
        
        mouse.mousemove = function(event) { 
            var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
                touches = event.changedTouches;

            if (touches) {
                mouse.button = 0;
                event.preventDefault();
            }

            mouse.absolute.x = position.x;
            mouse.absolute.y = position.y;
            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
            mouse.sourceEvents.mousemove = event;
        };
        
        mouse.mousedown = function(event) {
            var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
                touches = event.changedTouches;

            if (touches) {
                mouse.button = 0;
                event.preventDefault();
            } else {
                mouse.button = event.button;
            }

            mouse.absolute.x = position.x;
            mouse.absolute.y = position.y;
            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
            mouse.mousedownPosition.x = mouse.position.x;
            mouse.mousedownPosition.y = mouse.position.y;
            mouse.sourceEvents.mousedown = event;
        };
        
        mouse.mouseup = function(event) {
            var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
                touches = event.changedTouches;

            if (touches) {
                event.preventDefault();
            }
            
            mouse.button = -1;
            mouse.absolute.x = position.x;
            mouse.absolute.y = position.y;
            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
            mouse.mouseupPosition.x = mouse.position.x;
            mouse.mouseupPosition.y = mouse.position.y;
            mouse.sourceEvents.mouseup = event;
        };

        mouse.mousewheel = function(event) {
            mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
            event.preventDefault();
        };

        Mouse.setElement(mouse, mouse.element);

        return mouse;
    };

    /**
     * Sets the element the mouse is bound to (and relative to).
     * @method setElement
     * @param {mouse} mouse
     * @param {HTMLElement} element
     */
    Mouse.setElement = function(mouse, element) {
        mouse.element = element;

        element.addEventListener('mousemove', mouse.mousemove);
        element.addEventListener('mousedown', mouse.mousedown);
        element.addEventListener('mouseup', mouse.mouseup);
        
        element.addEventListener('mousewheel', mouse.mousewheel);
        element.addEventListener('DOMMouseScroll', mouse.mousewheel);

        element.addEventListener('touchmove', mouse.mousemove);
        element.addEventListener('touchstart', mouse.mousedown);
        element.addEventListener('touchend', mouse.mouseup);
    };

    /**
     * Clears all captured source events.
     * @method clearSourceEvents
     * @param {mouse} mouse
     */
    Mouse.clearSourceEvents = function(mouse) {
        mouse.sourceEvents.mousemove = null;
        mouse.sourceEvents.mousedown = null;
        mouse.sourceEvents.mouseup = null;
        mouse.sourceEvents.mousewheel = null;
        mouse.wheelDelta = 0;
    };

    /**
     * Sets the mouse position offset.
     * @method setOffset
     * @param {mouse} mouse
     * @param {vector} offset
     */
    Mouse.setOffset = function(mouse, offset) {
        mouse.offset.x = offset.x;
        mouse.offset.y = offset.y;
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    };

    /**
     * Sets the mouse position scale.
     * @method setScale
     * @param {mouse} mouse
     * @param {vector} scale
     */
    Mouse.setScale = function(mouse, scale) {
        mouse.scale.x = scale.x;
        mouse.scale.y = scale.y;
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    };
    
    /**
     * Gets the mouse position relative to an element given a screen pixel ratio.
     * @method _getRelativeMousePosition
     * @private
     * @param {} event
     * @param {} element
     * @param {number} pixelRatio
     * @return {}
     */
    Mouse._getRelativeMousePosition = function(event, element, pixelRatio) {
        var elementBounds = element.getBoundingClientRect(),
            rootNode = (document.documentElement || document.body.parentNode || document.body),
            scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft,
            scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop,
            touches = event.changedTouches,
            x, y;
        
        if (touches) {
            x = touches[0].pageX - elementBounds.left - scrollX;
            y = touches[0].pageY - elementBounds.top - scrollY;
        } else {
            x = event.pageX - elementBounds.left - scrollX;
            y = event.pageY - elementBounds.top - scrollY;
        }

        return { 
            x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
            y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
        };
    };

})();

},{"../core/Common":14}],20:[function(_dereq_,module,exports){
/**
* The `Matter.Plugin` module contains functions for registering and installing plugins on modules.
*
* @class Plugin
*/

var Plugin = {};

module.exports = Plugin;

var Common = _dereq_('./Common');

(function() {

    Plugin._registry = {};

    /**
     * Registers a plugin object so it can be resolved later by name.
     * @method register
     * @param plugin {} The plugin to register.
     * @return {object} The plugin.
     */
    Plugin.register = function(plugin) {
        if (!Plugin.isPlugin(plugin)) {
            Common.warn('Plugin.register:', Plugin.toString(plugin), 'does not implement all required fields.');
        }

        if (plugin.name in Plugin._registry) {
            var registered = Plugin._registry[plugin.name],
                pluginVersion = Plugin.versionParse(plugin.version).number,
                registeredVersion = Plugin.versionParse(registered.version).number;

            if (pluginVersion > registeredVersion) {
                Common.warn('Plugin.register:', Plugin.toString(registered), 'was upgraded to', Plugin.toString(plugin));
                Plugin._registry[plugin.name] = plugin;
            } else if (pluginVersion < registeredVersion) {
                Common.warn('Plugin.register:', Plugin.toString(registered), 'can not be downgraded to', Plugin.toString(plugin));
            } else if (plugin !== registered) {
                Common.warn('Plugin.register:', Plugin.toString(plugin), 'is already registered to different plugin object');
            }
        } else {
            Plugin._registry[plugin.name] = plugin;
        }

        return plugin;
    };

    /**
     * Resolves a dependency to a plugin object from the registry if it exists. 
     * The `dependency` may contain a version, but only the name matters when resolving.
     * @method resolve
     * @param dependency {string} The dependency.
     * @return {object} The plugin if resolved, otherwise `undefined`.
     */
    Plugin.resolve = function(dependency) {
        return Plugin._registry[Plugin.dependencyParse(dependency).name];
    };

    /**
     * Returns a pretty printed plugin name and version.
     * @method toString
     * @param plugin {} The plugin.
     * @return {string} Pretty printed plugin name and version.
     */
    Plugin.toString = function(plugin) {
        return typeof plugin === 'string' ? plugin : (plugin.name || 'anonymous') + '@' + (plugin.version || plugin.range || '0.0.0');
    };

    /**
     * Returns `true` if the object meets the minimum standard to be considered a plugin.
     * This means it must define the following properties:
     * - `name`
     * - `version`
     * - `install`
     * @method isPlugin
     * @param obj {} The obj to test.
     * @return {boolean} `true` if the object can be considered a plugin otherwise `false`.
     */
    Plugin.isPlugin = function(obj) {
        return obj && obj.name && obj.version && obj.install;
    };

    /**
     * Returns `true` if a plugin with the given `name` been installed on `module`.
     * @method isUsed
     * @param module {} The module.
     * @param name {string} The plugin name.
     * @return {boolean} `true` if a plugin with the given `name` been installed on `module`, otherwise `false`.
     */
    Plugin.isUsed = function(module, name) {
        return module.used.indexOf(name) > -1;
    };

    /**
     * Returns `true` if `plugin.for` is applicable to `module` by comparing against `module.name` and `module.version`.
     * If `plugin.for` is not specified then it is assumed to be applicable.
     * The value of `plugin.for` is a string of the format `'module-name'` or `'module-name@version'`.
     * @method isFor
     * @param plugin {} The plugin.
     * @param module {} The module.
     * @return {boolean} `true` if `plugin.for` is applicable to `module`, otherwise `false`.
     */
    Plugin.isFor = function(plugin, module) {
        var parsed = plugin.for && Plugin.dependencyParse(plugin.for);
        return !plugin.for || (module.name === parsed.name && Plugin.versionSatisfies(module.version, parsed.range));
    };

    /**
     * Installs the plugins by calling `plugin.install` on each plugin specified in `plugins` if passed, otherwise `module.uses`.
     * For installing plugins on `Matter` see the convenience function `Matter.use`.
     * Plugins may be specified either by their name or a reference to the plugin object.
     * Plugins themselves may specify further dependencies, but each plugin is installed only once.
     * Order is important, a topological sort is performed to find the best resulting order of installation.
     * This sorting attempts to satisfy every dependency's requested ordering, but may not be exact in all cases.
     * This function logs the resulting status of each dependency in the console, along with any warnings.
     * - A green tick ✅ indicates a dependency was resolved and installed.
     * - An orange diamond 🔶 indicates a dependency was resolved but a warning was thrown for it or one if its dependencies.
     * - A red cross ❌ indicates a dependency could not be resolved.
     * Avoid calling this function multiple times on the same module unless you intend to manually control installation order.
     * @method use
     * @param module {} The module install plugins on.
     * @param [plugins=module.uses] {} The plugins to install on module (optional, defaults to `module.uses`).
     */
    Plugin.use = function(module, plugins) {
        module.uses = (module.uses || []).concat(plugins || []);

        if (module.uses.length === 0) {
            Common.warn('Plugin.use:', Plugin.toString(module), 'does not specify any dependencies to install.');
            return;
        }

        var dependencies = Plugin.dependencies(module),
            sortedDependencies = Common.topologicalSort(dependencies),
            status = [];

        for (var i = 0; i < sortedDependencies.length; i += 1) {
            if (sortedDependencies[i] === module.name) {
                continue;
            }

            var plugin = Plugin.resolve(sortedDependencies[i]);

            if (!plugin) {
                status.push('❌ ' + sortedDependencies[i]);
                continue;
            }

            if (Plugin.isUsed(module, plugin.name)) {
                continue;
            }

            if (!Plugin.isFor(plugin, module)) {
                Common.warn('Plugin.use:', Plugin.toString(plugin), 'is for', plugin.for, 'but installed on', Plugin.toString(module) + '.');
                plugin._warned = true;
            }

            if (plugin.install) {
                plugin.install(module);
            } else {
                Common.warn('Plugin.use:', Plugin.toString(plugin), 'does not specify an install function.');
                plugin._warned = true;
            }

            if (plugin._warned) {
                status.push('🔶 ' + Plugin.toString(plugin));
                delete plugin._warned;
            } else {
                status.push('✅ ' + Plugin.toString(plugin));
            }

            module.used.push(plugin.name);
        }

        if (status.length > 0) {
            Common.info(status.join('  '));
        }
    };

    /**
     * Recursively finds all of a module's dependencies and returns a flat dependency graph.
     * @method dependencies
     * @param module {} The module.
     * @return {object} A dependency graph.
     */
    Plugin.dependencies = function(module, tracked) {
        var parsedBase = Plugin.dependencyParse(module),
            name = parsedBase.name;

        tracked = tracked || {};

        if (name in tracked) {
            return;
        }

        module = Plugin.resolve(module) || module;

        tracked[name] = Common.map(module.uses || [], function(dependency) {
            if (Plugin.isPlugin(dependency)) {
                Plugin.register(dependency);
            }

            var parsed = Plugin.dependencyParse(dependency),
                resolved = Plugin.resolve(dependency);

            if (resolved && !Plugin.versionSatisfies(resolved.version, parsed.range)) {
                Common.warn(
                    'Plugin.dependencies:', Plugin.toString(resolved), 'does not satisfy',
                    Plugin.toString(parsed), 'used by', Plugin.toString(parsedBase) + '.'
                );

                resolved._warned = true;
                module._warned = true;
            } else if (!resolved) {
                Common.warn(
                    'Plugin.dependencies:', Plugin.toString(dependency), 'used by',
                    Plugin.toString(parsedBase), 'could not be resolved.'
                );

                module._warned = true;
            }

            return parsed.name;
        });

        for (var i = 0; i < tracked[name].length; i += 1) {
            Plugin.dependencies(tracked[name][i], tracked);
        }

        return tracked;
    };

    /**
     * Parses a dependency string into its components.
     * The `dependency` is a string of the format `'module-name'` or `'module-name@version'`.
     * See documentation for `Plugin.versionParse` for a description of the format.
     * This function can also handle dependencies that are already resolved (e.g. a module object).
     * @method dependencyParse
     * @param dependency {string} The dependency of the format `'module-name'` or `'module-name@version'`.
     * @return {object} The dependency parsed into its components.
     */
    Plugin.dependencyParse = function(dependency) {
        if (Common.isString(dependency)) {
            var pattern = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-]+)?))?$/;

            if (!pattern.test(dependency)) {
                Common.warn('Plugin.dependencyParse:', dependency, 'is not a valid dependency string.');
            }

            return {
                name: dependency.split('@')[0],
                range: dependency.split('@')[1] || '*'
            };
        }

        return {
            name: dependency.name,
            range: dependency.range || dependency.version
        };
    };

    /**
     * Parses a version string into its components.  
     * Versions are strictly of the format `x.y.z` (as in [semver](http://semver.org/)).
     * Versions may optionally have a prerelease tag in the format `x.y.z-alpha`.
     * Ranges are a strict subset of [npm ranges](https://docs.npmjs.com/misc/semver#advanced-range-syntax).
     * Only the following range types are supported:
     * - Tilde ranges e.g. `~1.2.3`
     * - Caret ranges e.g. `^1.2.3`
     * - Exact version e.g. `1.2.3`
     * - Any version `*`
     * @method versionParse
     * @param range {string} The version string.
     * @return {object} The version range parsed into its components.
     */
    Plugin.versionParse = function(range) {
        var pattern = /^\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-]+)?$/;

        if (!pattern.test(range)) {
            Common.warn('Plugin.versionParse:', range, 'is not a valid version or range.');
        }

        var identifiers = range.split('-');
        range = identifiers[0];

        var isRange = isNaN(Number(range[0])),
            version = isRange ? range.substr(1) : range,
            parts = Common.map(version.split('.'), function(part) {
                return Number(part);
            });

        return {
            isRange: isRange,
            version: version,
            range: range,
            operator: isRange ? range[0] : '',
            parts: parts,
            prerelease: identifiers[1],
            number: parts[0] * 1e8 + parts[1] * 1e4 + parts[2]
        };
    };

    /**
     * Returns `true` if `version` satisfies the given `range`.
     * See documentation for `Plugin.versionParse` for a description of the format.
     * If a version or range is not specified, then any version (`*`) is assumed to satisfy.
     * @method versionSatisfies
     * @param version {string} The version string.
     * @param range {string} The range string.
     * @return {boolean} `true` if `version` satisfies `range`, otherwise `false`.
     */
    Plugin.versionSatisfies = function(version, range) {
        range = range || '*';

        var rangeParsed = Plugin.versionParse(range),
            rangeParts = rangeParsed.parts,
            versionParsed = Plugin.versionParse(version),
            versionParts = versionParsed.parts;

        if (rangeParsed.isRange) {
            if (rangeParsed.operator === '*' || version === '*') {
                return true;
            }

            if (rangeParsed.operator === '~') {
                return versionParts[0] === rangeParts[0] && versionParts[1] === rangeParts[1] && versionParts[2] >= rangeParts[2];
            }

            if (rangeParsed.operator === '^') {
                if (rangeParts[0] > 0) {
                    return versionParts[0] === rangeParts[0] && versionParsed.number >= rangeParsed.number;
                }

                if (rangeParts[1] > 0) {
                    return versionParts[1] === rangeParts[1] && versionParts[2] >= rangeParts[2];
                }

                return versionParts[2] === rangeParts[2];
            }
        }

        return version === range || version === '*';
    };

})();

},{"./Common":14}],21:[function(_dereq_,module,exports){
/**
* The `Matter.Runner` module is an optional utility which provides a game loop, 
* that handles continuously updating a `Matter.Engine` for you within a browser.
* It is intended for development and debugging purposes, but may also be suitable for simple games.
* If you are using your own game loop instead, then you do not need the `Matter.Runner` module.
* Instead just call `Engine.update(engine, delta)` in your own loop.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Runner
*/

var Runner = {};

module.exports = Runner;

var Events = _dereq_('./Events');
var Engine = _dereq_('./Engine');
var Common = _dereq_('./Common');

(function() {

    var _requestAnimationFrame,
        _cancelAnimationFrame;

    if (typeof window !== 'undefined') {
        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
                                      || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
   
        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
                                      || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
    }

    if (!_requestAnimationFrame) {
        var _frameTimeout;

        _requestAnimationFrame = function(callback){ 
            _frameTimeout = setTimeout(function() { 
                callback(Common.now()); 
            }, 1000 / 60);
        };

        _cancelAnimationFrame = function() {
            clearTimeout(_frameTimeout);
        };
    }

    /**
     * Creates a new Runner. The options parameter is an object that specifies any properties you wish to override the defaults.
     * @method create
     * @param {} options
     */
    Runner.create = function(options) {
        var defaults = {
            fps: 60,
            correction: 1,
            deltaSampleSize: 60,
            counterTimestamp: 0,
            frameCounter: 0,
            deltaHistory: [],
            timePrev: null,
            timeScalePrev: 1,
            frameRequestId: null,
            isFixed: false,
            enabled: true
        };

        var runner = Common.extend(defaults, options);

        runner.delta = runner.delta || 1000 / runner.fps;
        runner.deltaMin = runner.deltaMin || 1000 / runner.fps;
        runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5);
        runner.fps = 1000 / runner.delta;

        return runner;
    };

    /**
     * Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event.
     * @method run
     * @param {engine} engine
     */
    Runner.run = function(runner, engine) {
        // create runner if engine is first argument
        if (typeof runner.positionIterations !== 'undefined') {
            engine = runner;
            runner = Runner.create();
        }

        (function render(time){
            runner.frameRequestId = _requestAnimationFrame(render);

            if (time && runner.enabled) {
                Runner.tick(runner, engine, time);
            }
        })();

        return runner;
    };

    /**
     * A game loop utility that updates the engine and renderer by one step (a 'tick').
     * Features delta smoothing, time correction and fixed or dynamic timing.
     * Triggers `beforeTick`, `tick` and `afterTick` events on the engine.
     * Consider just `Engine.update(engine, delta)` if you're using your own loop.
     * @method tick
     * @param {runner} runner
     * @param {engine} engine
     * @param {number} time
     */
    Runner.tick = function(runner, engine, time) {
        var timing = engine.timing,
            correction = 1,
            delta;

        // create an event object
        var event = {
            timestamp: timing.timestamp
        };

        Events.trigger(runner, 'beforeTick', event);
        Events.trigger(engine, 'beforeTick', event); // @deprecated

        if (runner.isFixed) {
            // fixed timestep
            delta = runner.delta;
        } else {
            // dynamic timestep based on wall clock between calls
            delta = (time - runner.timePrev) || runner.delta;
            runner.timePrev = time;

            // optimistically filter delta over a few frames, to improve stability
            runner.deltaHistory.push(delta);
            runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
            delta = Math.min.apply(null, runner.deltaHistory);
            
            // limit delta
            delta = delta < runner.deltaMin ? runner.deltaMin : delta;
            delta = delta > runner.deltaMax ? runner.deltaMax : delta;

            // correction for delta
            correction = delta / runner.delta;

            // update engine timing object
            runner.delta = delta;
        }

        // time correction for time scaling
        if (runner.timeScalePrev !== 0)
            correction *= timing.timeScale / runner.timeScalePrev;

        if (timing.timeScale === 0)
            correction = 0;

        runner.timeScalePrev = timing.timeScale;
        runner.correction = correction;

        // fps counter
        runner.frameCounter += 1;
        if (time - runner.counterTimestamp >= 1000) {
            runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
            runner.counterTimestamp = time;
            runner.frameCounter = 0;
        }

        Events.trigger(runner, 'tick', event);
        Events.trigger(engine, 'tick', event); // @deprecated

        // if world has been modified, clear the render scene graph
        if (engine.world.isModified 
            && engine.render
            && engine.render.controller
            && engine.render.controller.clear) {
            engine.render.controller.clear(engine.render); // @deprecated
        }

        // update
        Events.trigger(runner, 'beforeUpdate', event);
        Engine.update(engine, delta, correction);
        Events.trigger(runner, 'afterUpdate', event);

        // render
        // @deprecated
        if (engine.render && engine.render.controller) {
            Events.trigger(runner, 'beforeRender', event);
            Events.trigger(engine, 'beforeRender', event); // @deprecated

            engine.render.controller.world(engine.render);

            Events.trigger(runner, 'afterRender', event);
            Events.trigger(engine, 'afterRender', event); // @deprecated
        }

        Events.trigger(runner, 'afterTick', event);
        Events.trigger(engine, 'afterTick', event); // @deprecated
    };

    /**
     * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
     * If you wish to only temporarily pause the engine, see `engine.enabled` instead.
     * @method stop
     * @param {runner} runner
     */
    Runner.stop = function(runner) {
        _cancelAnimationFrame(runner.frameRequestId);
    };

    /**
     * Alias for `Runner.run`.
     * @method start
     * @param {runner} runner
     * @param {engine} engine
     */
    Runner.start = function(runner, engine) {
        Runner.run(runner, engine);
    };

    /*
    *
    *  Events Documentation
    *
    */

    /**
    * Fired at the start of a tick, before any updates to the engine or timing
    *
    * @event beforeTick
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after engine timing updated, but just before update
    *
    * @event tick
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired at the end of a tick, after engine update and after rendering
    *
    * @event afterTick
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired before update
    *
    * @event beforeUpdate
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after update
    *
    * @event afterUpdate
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired before rendering
    *
    * @event beforeRender
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    * @deprecated
    */

    /**
    * Fired after rendering
    *
    * @event afterRender
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    * @deprecated
    */

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * A flag that specifies whether the runner is running or not.
     *
     * @property enabled
     * @type boolean
     * @default true
     */

    /**
     * A `Boolean` that specifies if the runner should use a fixed timestep (otherwise it is variable).
     * If timing is fixed, then the apparent simulation speed will change depending on the frame rate (but behaviour will be deterministic).
     * If the timing is variable, then the apparent simulation speed will be constant (approximately, but at the cost of determininism).
     *
     * @property isFixed
     * @type boolean
     * @default false
     */

    /**
     * A `Number` that specifies the time step between updates in milliseconds.
     * If `engine.timing.isFixed` is set to `true`, then `delta` is fixed.
     * If it is `false`, then `delta` can dynamically change to maintain the correct apparent simulation speed.
     *
     * @property delta
     * @type number
     * @default 1000 / 60
     */

})();

},{"./Common":14,"./Engine":15,"./Events":16}],22:[function(_dereq_,module,exports){
/**
* The `Matter.Sleeping` module contains methods to manage the sleeping state of bodies.
*
* @class Sleeping
*/

var Sleeping = {};

module.exports = Sleeping;

var Events = _dereq_('./Events');

(function() {

    Sleeping._motionWakeThreshold = 0.18;
    Sleeping._motionSleepThreshold = 0.08;
    Sleeping._minBias = 0.9;

    /**
     * Puts bodies to sleep or wakes them up depending on their motion.
     * @method update
     * @param {body[]} bodies
     * @param {number} timeScale
     */
    Sleeping.update = function(bodies, timeScale) {
        var timeFactor = timeScale * timeScale * timeScale;

        // update bodies sleeping status
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i],
                motion = body.speed * body.speed + body.angularSpeed * body.angularSpeed;

            // wake up bodies if they have a force applied
            if (body.force.x !== 0 || body.force.y !== 0) {
                Sleeping.set(body, false);
                continue;
            }

            var minMotion = Math.min(body.motion, motion),
                maxMotion = Math.max(body.motion, motion);
        
            // biased average motion estimation between frames
            body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
            
            if (body.sleepThreshold > 0 && body.motion < Sleeping._motionSleepThreshold * timeFactor) {
                body.sleepCounter += 1;
                
                if (body.sleepCounter >= body.sleepThreshold)
                    Sleeping.set(body, true);
            } else if (body.sleepCounter > 0) {
                body.sleepCounter -= 1;
            }
        }
    };

    /**
     * Given a set of colliding pairs, wakes the sleeping bodies involved.
     * @method afterCollisions
     * @param {pair[]} pairs
     * @param {number} timeScale
     */
    Sleeping.afterCollisions = function(pairs, timeScale) {
        var timeFactor = timeScale * timeScale * timeScale;

        // wake up bodies involved in collisions
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            
            // don't wake inactive pairs
            if (!pair.isActive)
                continue;

            var collision = pair.collision,
                bodyA = collision.bodyA.parent, 
                bodyB = collision.bodyB.parent;
        
            // don't wake if at least one body is static
            if ((bodyA.isSleeping && bodyB.isSleeping) || bodyA.isStatic || bodyB.isStatic)
                continue;
        
            if (bodyA.isSleeping || bodyB.isSleeping) {
                var sleepingBody = (bodyA.isSleeping && !bodyA.isStatic) ? bodyA : bodyB,
                    movingBody = sleepingBody === bodyA ? bodyB : bodyA;

                if (!sleepingBody.isStatic && movingBody.motion > Sleeping._motionWakeThreshold * timeFactor) {
                    Sleeping.set(sleepingBody, false);
                }
            }
        }
    };
  
    /**
     * Set a body as sleeping or awake.
     * @method set
     * @param {body} body
     * @param {boolean} isSleeping
     */
    Sleeping.set = function(body, isSleeping) {
        var wasSleeping = body.isSleeping;

        if (isSleeping) {
            body.isSleeping = true;
            body.sleepCounter = body.sleepThreshold;

            body.positionImpulse.x = 0;
            body.positionImpulse.y = 0;

            body.positionPrev.x = body.position.x;
            body.positionPrev.y = body.position.y;

            body.anglePrev = body.angle;
            body.speed = 0;
            body.angularSpeed = 0;
            body.motion = 0;

            if (!wasSleeping) {
                Events.trigger(body, 'sleepStart');
            }
        } else {
            body.isSleeping = false;
            body.sleepCounter = 0;

            if (wasSleeping) {
                Events.trigger(body, 'sleepEnd');
            }
        }
    };

})();

},{"./Events":16}],23:[function(_dereq_,module,exports){
/**
* The `Matter.Bodies` module contains factory methods for creating rigid body models 
* with commonly used body configurations (such as rectangles, circles and other polygons).
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Bodies
*/

// TODO: true circle bodies

var Bodies = {};

module.exports = Bodies;

var Vertices = _dereq_('../geometry/Vertices');
var Common = _dereq_('../core/Common');
var Body = _dereq_('../body/Body');
var Bounds = _dereq_('../geometry/Bounds');
var Vector = _dereq_('../geometry/Vector');
var decomp;

(function() {

    /**
     * Creates a new rigid body model with a rectangle hull. 
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method rectangle
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {object} [options]
     * @return {body} A new rectangle body
     */
    Bodies.rectangle = function(x, y, width, height, options) {
        options = options || {};

        var rectangle = { 
            label: 'Rectangle Body',
            position: { x: x, y: y },
            vertices: Vertices.fromPath('L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height)
        };

        if (options.chamfer) {
            var chamfer = options.chamfer;
            rectangle.vertices = Vertices.chamfer(rectangle.vertices, chamfer.radius, 
                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
            delete options.chamfer;
        }

        return Body.create(Common.extend({}, rectangle, options));
    };
    
    /**
     * Creates a new rigid body model with a trapezoid hull. 
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method trapezoid
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} slope
     * @param {object} [options]
     * @return {body} A new trapezoid body
     */
    Bodies.trapezoid = function(x, y, width, height, slope, options) {
        options = options || {};

        slope *= 0.5;
        var roof = (1 - (slope * 2)) * width;
        
        var x1 = width * slope,
            x2 = x1 + roof,
            x3 = x2 + x1,
            verticesPath;

        if (slope < 0.5) {
            verticesPath = 'L 0 0 L ' + x1 + ' ' + (-height) + ' L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0';
        } else {
            verticesPath = 'L 0 0 L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0';
        }

        var trapezoid = { 
            label: 'Trapezoid Body',
            position: { x: x, y: y },
            vertices: Vertices.fromPath(verticesPath)
        };

        if (options.chamfer) {
            var chamfer = options.chamfer;
            trapezoid.vertices = Vertices.chamfer(trapezoid.vertices, chamfer.radius, 
                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
            delete options.chamfer;
        }

        return Body.create(Common.extend({}, trapezoid, options));
    };

    /**
     * Creates a new rigid body model with a circle hull. 
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method circle
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {object} [options]
     * @param {number} [maxSides]
     * @return {body} A new circle body
     */
    Bodies.circle = function(x, y, radius, options, maxSides) {
        options = options || {};

        var circle = {
            label: 'Circle Body',
            circleRadius: radius
        };
        
        // approximate circles with polygons until true circles implemented in SAT
        maxSides = maxSides || 25;
        var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));

        // optimisation: always use even number of sides (half the number of unique axes)
        if (sides % 2 === 1)
            sides += 1;

        return Bodies.polygon(x, y, sides, radius, Common.extend({}, circle, options));
    };

    /**
     * Creates a new rigid body model with a regular polygon hull with the given number of sides. 
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method polygon
     * @param {number} x
     * @param {number} y
     * @param {number} sides
     * @param {number} radius
     * @param {object} [options]
     * @return {body} A new regular polygon body
     */
    Bodies.polygon = function(x, y, sides, radius, options) {
        options = options || {};

        if (sides < 3)
            return Bodies.circle(x, y, radius, options);

        var theta = 2 * Math.PI / sides,
            path = '',
            offset = theta * 0.5;

        for (var i = 0; i < sides; i += 1) {
            var angle = offset + (i * theta),
                xx = Math.cos(angle) * radius,
                yy = Math.sin(angle) * radius;

            path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
        }

        var polygon = { 
            label: 'Polygon Body',
            position: { x: x, y: y },
            vertices: Vertices.fromPath(path)
        };

        if (options.chamfer) {
            var chamfer = options.chamfer;
            polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, 
                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
            delete options.chamfer;
        }

        return Body.create(Common.extend({}, polygon, options));
    };

    /**
     * Creates a body using the supplied vertices (or an array containing multiple sets of vertices).
     * If the vertices are convex, they will pass through as supplied.
     * Otherwise if the vertices are concave, they will be decomposed if [poly-decomp.js](https://github.com/schteppe/poly-decomp.js) is available.
     * Note that this process is not guaranteed to support complex sets of vertices (e.g. those with holes may fail).
     * By default the decomposition will discard collinear edges (to improve performance).
     * It can also optionally discard any parts that have an area less than `minimumArea`.
     * If the vertices can not be decomposed, the result will fall back to using the convex hull.
     * The options parameter is an object that specifies any `Matter.Body` properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method fromVertices
     * @param {number} x
     * @param {number} y
     * @param [[vector]] vertexSets
     * @param {object} [options]
     * @param {bool} [flagInternal=false]
     * @param {number} [removeCollinear=0.01]
     * @param {number} [minimumArea=10]
     * @return {body}
     */
    Bodies.fromVertices = function(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea) {
        if (!decomp) {
            decomp = Common._requireGlobal('decomp', 'poly-decomp');
        }

        var body,
            parts,
            isConvex,
            vertices,
            i,
            j,
            k,
            v,
            z;

        options = options || {};
        parts = [];

        flagInternal = typeof flagInternal !== 'undefined' ? flagInternal : false;
        removeCollinear = typeof removeCollinear !== 'undefined' ? removeCollinear : 0.01;
        minimumArea = typeof minimumArea !== 'undefined' ? minimumArea : 10;

        if (!decomp) {
            Common.warn('Bodies.fromVertices: poly-decomp.js required. Could not decompose vertices. Fallback to convex hull.');
        }

        // ensure vertexSets is an array of arrays
        if (!Common.isArray(vertexSets[0])) {
            vertexSets = [vertexSets];
        }

        for (v = 0; v < vertexSets.length; v += 1) {
            vertices = vertexSets[v];
            isConvex = Vertices.isConvex(vertices);

            if (isConvex || !decomp) {
                if (isConvex) {
                    vertices = Vertices.clockwiseSort(vertices);
                } else {
                    // fallback to convex hull when decomposition is not possible
                    vertices = Vertices.hull(vertices);
                }

                parts.push({
                    position: { x: x, y: y },
                    vertices: vertices
                });
            } else {
                // initialise a decomposition
                var concave = vertices.map(function(vertex) {
                    return [vertex.x, vertex.y];
                });

                // vertices are concave and simple, we can decompose into parts
                decomp.makeCCW(concave);
                if (removeCollinear !== false)
                    decomp.removeCollinearPoints(concave, removeCollinear);

                // use the quick decomposition algorithm (Bayazit)
                var decomposed = decomp.quickDecomp(concave);

                // for each decomposed chunk
                for (i = 0; i < decomposed.length; i++) {
                    var chunk = decomposed[i];

                    // convert vertices into the correct structure
                    var chunkVertices = chunk.map(function(vertices) {
                        return {
                            x: vertices[0],
                            y: vertices[1]
                        };
                    });

                    // skip small chunks
                    if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea)
                        continue;

                    // create a compound part
                    parts.push({
                        position: Vertices.centre(chunkVertices),
                        vertices: chunkVertices
                    });
                }
            }
        }

        // create body parts
        for (i = 0; i < parts.length; i++) {
            parts[i] = Body.create(Common.extend(parts[i], options));
        }

        // flag internal edges (coincident part edges)
        if (flagInternal) {
            var coincident_max_dist = 5;

            for (i = 0; i < parts.length; i++) {
                var partA = parts[i];

                for (j = i + 1; j < parts.length; j++) {
                    var partB = parts[j];

                    if (Bounds.overlaps(partA.bounds, partB.bounds)) {
                        var pav = partA.vertices,
                            pbv = partB.vertices;

                        // iterate vertices of both parts
                        for (k = 0; k < partA.vertices.length; k++) {
                            for (z = 0; z < partB.vertices.length; z++) {
                                // find distances between the vertices
                                var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])),
                                    db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));

                                // if both vertices are very close, consider the edge concident (internal)
                                if (da < coincident_max_dist && db < coincident_max_dist) {
                                    pav[k].isInternal = true;
                                    pbv[z].isInternal = true;
                                }
                            }
                        }

                    }
                }
            }
        }

        if (parts.length > 1) {
            // create the parent body to be returned, that contains generated compound parts
            body = Body.create(Common.extend({ parts: parts.slice(0) }, options));
            Body.setPosition(body, { x: x, y: y });

            return body;
        } else {
            return parts[0];
        }
    };

})();

},{"../body/Body":1,"../core/Common":14,"../geometry/Bounds":26,"../geometry/Vector":28,"../geometry/Vertices":29}],24:[function(_dereq_,module,exports){
/**
* The `Matter.Composites` module contains factory methods for creating composite bodies
* with commonly used configurations (such as stacks and chains).
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Composites
*/

var Composites = {};

module.exports = Composites;

var Composite = _dereq_('../body/Composite');
var Constraint = _dereq_('../constraint/Constraint');
var Common = _dereq_('../core/Common');
var Body = _dereq_('../body/Body');
var Bodies = _dereq_('./Bodies');

(function() {

    /**
     * Create a new composite containing bodies created in the callback in a grid arrangement.
     * This function uses the body's bounds to prevent overlaps.
     * @method stack
     * @param {number} xx
     * @param {number} yy
     * @param {number} columns
     * @param {number} rows
     * @param {number} columnGap
     * @param {number} rowGap
     * @param {function} callback
     * @return {composite} A new composite containing objects created in the callback
     */
    Composites.stack = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
        var stack = Composite.create({ label: 'Stack' }),
            x = xx,
            y = yy,
            lastBody,
            i = 0;

        for (var row = 0; row < rows; row++) {
            var maxHeight = 0;
            
            for (var column = 0; column < columns; column++) {
                var body = callback(x, y, column, row, lastBody, i);
                    
                if (body) {
                    var bodyHeight = body.bounds.max.y - body.bounds.min.y,
                        bodyWidth = body.bounds.max.x - body.bounds.min.x; 

                    if (bodyHeight > maxHeight)
                        maxHeight = bodyHeight;
                    
                    Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });

                    x = body.bounds.max.x + columnGap;

                    Composite.addBody(stack, body);
                    
                    lastBody = body;
                    i += 1;
                } else {
                    x += columnGap;
                }
            }
            
            y += maxHeight + rowGap;
            x = xx;
        }

        return stack;
    };
    
    /**
     * Chains all bodies in the given composite together using constraints.
     * @method chain
     * @param {composite} composite
     * @param {number} xOffsetA
     * @param {number} yOffsetA
     * @param {number} xOffsetB
     * @param {number} yOffsetB
     * @param {object} options
     * @return {composite} A new composite containing objects chained together with constraints
     */
    Composites.chain = function(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
        var bodies = composite.bodies;
        
        for (var i = 1; i < bodies.length; i++) {
            var bodyA = bodies[i - 1],
                bodyB = bodies[i],
                bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y,
                bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, 
                bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y,
                bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
        
            var defaults = {
                bodyA: bodyA,
                pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
                bodyB: bodyB,
                pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB }
            };
            
            var constraint = Common.extend(defaults, options);
        
            Composite.addConstraint(composite, Constraint.create(constraint));
        }

        composite.label += ' Chain';
        
        return composite;
    };

    /**
     * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
     * @method mesh
     * @param {composite} composite
     * @param {number} columns
     * @param {number} rows
     * @param {boolean} crossBrace
     * @param {object} options
     * @return {composite} The composite containing objects meshed together with constraints
     */
    Composites.mesh = function(composite, columns, rows, crossBrace, options) {
        var bodies = composite.bodies,
            row,
            col,
            bodyA,
            bodyB,
            bodyC;
        
        for (row = 0; row < rows; row++) {
            for (col = 1; col < columns; col++) {
                bodyA = bodies[(col - 1) + (row * columns)];
                bodyB = bodies[col + (row * columns)];
                Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
            }

            if (row > 0) {
                for (col = 0; col < columns; col++) {
                    bodyA = bodies[col + ((row - 1) * columns)];
                    bodyB = bodies[col + (row * columns)];
                    Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));

                    if (crossBrace && col > 0) {
                        bodyC = bodies[(col - 1) + ((row - 1) * columns)];
                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
                    }

                    if (crossBrace && col < columns - 1) {
                        bodyC = bodies[(col + 1) + ((row - 1) * columns)];
                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
                    }
                }
            }
        }

        composite.label += ' Mesh';
        
        return composite;
    };
    
    /**
     * Create a new composite containing bodies created in the callback in a pyramid arrangement.
     * This function uses the body's bounds to prevent overlaps.
     * @method pyramid
     * @param {number} xx
     * @param {number} yy
     * @param {number} columns
     * @param {number} rows
     * @param {number} columnGap
     * @param {number} rowGap
     * @param {function} callback
     * @return {composite} A new composite containing objects created in the callback
     */
    Composites.pyramid = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
        return Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y, column, row, lastBody, i) {
            var actualRows = Math.min(rows, Math.ceil(columns / 2)),
                lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
            
            if (row > actualRows)
                return;
            
            // reverse row order
            row = actualRows - row;
            
            var start = row,
                end = columns - 1 - row;

            if (column < start || column > end)
                return;
            
            // retroactively fix the first body's position, since width was unknown
            if (i === 1) {
                Body.translate(lastBody, { x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, y: 0 });
            }

            var xOffset = lastBody ? column * lastBodyWidth : 0;
            
            return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
        });
    };

    /**
     * Creates a composite with a Newton's Cradle setup of bodies and constraints.
     * @method newtonsCradle
     * @param {number} xx
     * @param {number} yy
     * @param {number} number
     * @param {number} size
     * @param {number} length
     * @return {composite} A new composite newtonsCradle body
     */
    Composites.newtonsCradle = function(xx, yy, number, size, length) {
        var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });

        for (var i = 0; i < number; i++) {
            var separation = 1.9,
                circle = Bodies.circle(xx + i * (size * separation), yy + length, size, 
                            { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 1 }),
                constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });

            Composite.addBody(newtonsCradle, circle);
            Composite.addConstraint(newtonsCradle, constraint);
        }

        return newtonsCradle;
    };
    
    /**
     * Creates a composite with simple car setup of bodies and constraints.
     * @method car
     * @param {number} xx
     * @param {number} yy
     * @param {number} width
     * @param {number} height
     * @param {number} wheelSize
     * @return {composite} A new composite car body
     */
    Composites.car = function(xx, yy, width, height, wheelSize) {
        var group = Body.nextGroup(true),
            wheelBase = 20,
            wheelAOffset = -width * 0.5 + wheelBase,
            wheelBOffset = width * 0.5 - wheelBase,
            wheelYOffset = 0;
    
        var car = Composite.create({ label: 'Car' }),
            body = Bodies.rectangle(xx, yy, width, height, { 
                collisionFilter: {
                    group: group
                },
                chamfer: {
                    radius: height * 0.5
                },
                density: 0.0002
            });
    
        var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, { 
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });
                    
        var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, { 
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });
                    
        var axelA = Constraint.create({
            bodyB: body,
            pointB: { x: wheelAOffset, y: wheelYOffset },
            bodyA: wheelA,
            stiffness: 1,
            length: 0
        });
                        
        var axelB = Constraint.create({
            bodyB: body,
            pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: wheelB,
            stiffness: 1,
            length: 0
        });
        
        Composite.addBody(car, body);
        Composite.addBody(car, wheelA);
        Composite.addBody(car, wheelB);
        Composite.addConstraint(car, axelA);
        Composite.addConstraint(car, axelB);

        return car;
    };

    /**
     * Creates a simple soft body like object.
     * @method softBody
     * @param {number} xx
     * @param {number} yy
     * @param {number} columns
     * @param {number} rows
     * @param {number} columnGap
     * @param {number} rowGap
     * @param {boolean} crossBrace
     * @param {number} particleRadius
     * @param {} particleOptions
     * @param {} constraintOptions
     * @return {composite} A new composite softBody
     */
    Composites.softBody = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
        particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
        constraintOptions = Common.extend({ stiffness: 0.2, render: { type: 'line', anchors: false } }, constraintOptions);

        var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
            return Bodies.circle(x, y, particleRadius, particleOptions);
        });

        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

        softBody.label = 'Soft Body';

        return softBody;
    };

})();

},{"../body/Body":1,"../body/Composite":2,"../constraint/Constraint":12,"../core/Common":14,"./Bodies":23}],25:[function(_dereq_,module,exports){
/**
* The `Matter.Axes` module contains methods for creating and manipulating sets of axes.
*
* @class Axes
*/

var Axes = {};

module.exports = Axes;

var Vector = _dereq_('../geometry/Vector');
var Common = _dereq_('../core/Common');

(function() {

    /**
     * Creates a new set of axes from the given vertices.
     * @method fromVertices
     * @param {vertices} vertices
     * @return {axes} A new axes from the given vertices
     */
    Axes.fromVertices = function(vertices) {
        var axes = {};

        // find the unique axes, using edge normal gradients
        for (var i = 0; i < vertices.length; i++) {
            var j = (i + 1) % vertices.length, 
                normal = Vector.normalise({ 
                    x: vertices[j].y - vertices[i].y, 
                    y: vertices[i].x - vertices[j].x
                }),
                gradient = (normal.y === 0) ? Infinity : (normal.x / normal.y);
            
            // limit precision
            gradient = gradient.toFixed(3).toString();
            axes[gradient] = normal;
        }

        return Common.values(axes);
    };

    /**
     * Rotates a set of axes by the given angle.
     * @method rotate
     * @param {axes} axes
     * @param {number} angle
     */
    Axes.rotate = function(axes, angle) {
        if (angle === 0)
            return;
        
        var cos = Math.cos(angle),
            sin = Math.sin(angle);

        for (var i = 0; i < axes.length; i++) {
            var axis = axes[i],
                xx;
            xx = axis.x * cos - axis.y * sin;
            axis.y = axis.x * sin + axis.y * cos;
            axis.x = xx;
        }
    };

})();

},{"../core/Common":14,"../geometry/Vector":28}],26:[function(_dereq_,module,exports){
/**
* The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
*
* @class Bounds
*/

var Bounds = {};

module.exports = Bounds;

(function() {

    /**
     * Creates a new axis-aligned bounding box (AABB) for the given vertices.
     * @method create
     * @param {vertices} vertices
     * @return {bounds} A new bounds object
     */
    Bounds.create = function(vertices) {
        var bounds = { 
            min: { x: 0, y: 0 }, 
            max: { x: 0, y: 0 }
        };

        if (vertices)
            Bounds.update(bounds, vertices);
        
        return bounds;
    };

    /**
     * Updates bounds using the given vertices and extends the bounds given a velocity.
     * @method update
     * @param {bounds} bounds
     * @param {vertices} vertices
     * @param {vector} velocity
     */
    Bounds.update = function(bounds, vertices, velocity) {
        bounds.min.x = Infinity;
        bounds.max.x = -Infinity;
        bounds.min.y = Infinity;
        bounds.max.y = -Infinity;

        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            if (vertex.x > bounds.max.x) bounds.max.x = vertex.x;
            if (vertex.x < bounds.min.x) bounds.min.x = vertex.x;
            if (vertex.y > bounds.max.y) bounds.max.y = vertex.y;
            if (vertex.y < bounds.min.y) bounds.min.y = vertex.y;
        }
        
        if (velocity) {
            if (velocity.x > 0) {
                bounds.max.x += velocity.x;
            } else {
                bounds.min.x += velocity.x;
            }
            
            if (velocity.y > 0) {
                bounds.max.y += velocity.y;
            } else {
                bounds.min.y += velocity.y;
            }
        }
    };

    /**
     * Returns true if the bounds contains the given point.
     * @method contains
     * @param {bounds} bounds
     * @param {vector} point
     * @return {boolean} True if the bounds contain the point, otherwise false
     */
    Bounds.contains = function(bounds, point) {
        return point.x >= bounds.min.x && point.x <= bounds.max.x 
               && point.y >= bounds.min.y && point.y <= bounds.max.y;
    };

    /**
     * Returns true if the two bounds intersect.
     * @method overlaps
     * @param {bounds} boundsA
     * @param {bounds} boundsB
     * @return {boolean} True if the bounds overlap, otherwise false
     */
    Bounds.overlaps = function(boundsA, boundsB) {
        return (boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x
                && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y);
    };

    /**
     * Translates the bounds by the given vector.
     * @method translate
     * @param {bounds} bounds
     * @param {vector} vector
     */
    Bounds.translate = function(bounds, vector) {
        bounds.min.x += vector.x;
        bounds.max.x += vector.x;
        bounds.min.y += vector.y;
        bounds.max.y += vector.y;
    };

    /**
     * Shifts the bounds to the given position.
     * @method shift
     * @param {bounds} bounds
     * @param {vector} position
     */
    Bounds.shift = function(bounds, position) {
        var deltaX = bounds.max.x - bounds.min.x,
            deltaY = bounds.max.y - bounds.min.y;
            
        bounds.min.x = position.x;
        bounds.max.x = position.x + deltaX;
        bounds.min.y = position.y;
        bounds.max.y = position.y + deltaY;
    };
    
})();

},{}],27:[function(_dereq_,module,exports){
/**
* The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
*
* To use this module you also need the SVGPathSeg polyfill: https://github.com/progers/pathseg
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Svg
*/

var Svg = {};

module.exports = Svg;

var Bounds = _dereq_('../geometry/Bounds');
var Common = _dereq_('../core/Common');

(function() {

    /**
     * Converts an SVG path into an array of vector points.
     * If the input path forms a concave shape, you must decompose the result into convex parts before use.
     * See `Bodies.fromVertices` which provides support for this.
     * Note that this function is not guaranteed to support complex paths (such as those with holes).
     * You must load the `pathseg.js` polyfill on newer browsers.
     * @method pathToVertices
     * @param {SVGPathElement} path
     * @param {Number} [sampleLength=15]
     * @return {Vector[]} points
     */
    Svg.pathToVertices = function(path, sampleLength) {
        if (typeof window !== 'undefined' && !('SVGPathSeg' in window)) {
            Common.warn('Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.');
        }

        // https://github.com/wout/svg.topoly.js/blob/master/svg.topoly.js
        var i, il, total, point, segment, segments, 
            segmentsQueue, lastSegment, 
            lastPoint, segmentIndex, points = [],
            lx, ly, length = 0, x = 0, y = 0;

        sampleLength = sampleLength || 15;

        var addPoint = function(px, py, pathSegType) {
            // all odd-numbered path types are relative except PATHSEG_CLOSEPATH (1)
            var isRelative = pathSegType % 2 === 1 && pathSegType > 1;

            // when the last point doesn't equal the current point add the current point
            if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
                if (lastPoint && isRelative) {
                    lx = lastPoint.x;
                    ly = lastPoint.y;
                } else {
                    lx = 0;
                    ly = 0;
                }

                var point = {
                    x: lx + px,
                    y: ly + py
                };

                // set last point
                if (isRelative || !lastPoint) {
                    lastPoint = point;
                }

                points.push(point);

                x = lx + px;
                y = ly + py;
            }
        };

        var addSegmentPoint = function(segment) {
            var segType = segment.pathSegTypeAsLetter.toUpperCase();

            // skip path ends
            if (segType === 'Z') 
                return;

            // map segment to x and y
            switch (segType) {

            case 'M':
            case 'L':
            case 'T':
            case 'C':
            case 'S':
            case 'Q':
                x = segment.x;
                y = segment.y;
                break;
            case 'H':
                x = segment.x;
                break;
            case 'V':
                y = segment.y;
                break;
            }

            addPoint(x, y, segment.pathSegType);
        };

        // ensure path is absolute
        Svg._svgPathToAbsolute(path);

        // get total length
        total = path.getTotalLength();

        // queue segments
        segments = [];
        for (i = 0; i < path.pathSegList.numberOfItems; i += 1)
            segments.push(path.pathSegList.getItem(i));

        segmentsQueue = segments.concat();

        // sample through path
        while (length < total) {
            // get segment at position
            segmentIndex = path.getPathSegAtLength(length);
            segment = segments[segmentIndex];

            // new segment
            if (segment != lastSegment) {
                while (segmentsQueue.length && segmentsQueue[0] != segment)
                    addSegmentPoint(segmentsQueue.shift());

                lastSegment = segment;
            }

            // add points in between when curving
            // TODO: adaptive sampling
            switch (segment.pathSegTypeAsLetter.toUpperCase()) {

            case 'C':
            case 'T':
            case 'S':
            case 'Q':
            case 'A':
                point = path.getPointAtLength(length);
                addPoint(point.x, point.y, 0);
                break;

            }

            // increment by sample value
            length += sampleLength;
        }

        // add remaining segments not passed by sampling
        for (i = 0, il = segmentsQueue.length; i < il; ++i)
            addSegmentPoint(segmentsQueue[i]);

        return points;
    };

    Svg._svgPathToAbsolute = function(path) {
        // http://phrogz.net/convert-svg-path-to-all-absolute-commands
        // Copyright (c) Gavin Kistner
        // http://phrogz.net/js/_ReuseLicense.txt
        // Modifications: tidy formatting and naming
        var x0, y0, x1, y1, x2, y2, segs = path.pathSegList,
            x = 0, y = 0, len = segs.numberOfItems;

        for (var i = 0; i < len; ++i) {
            var seg = segs.getItem(i),
                segType = seg.pathSegTypeAsLetter;

            if (/[MLHVCSQTA]/.test(segType)) {
                if ('x' in seg) x = seg.x;
                if ('y' in seg) y = seg.y;
            } else {
                if ('x1' in seg) x1 = x + seg.x1;
                if ('x2' in seg) x2 = x + seg.x2;
                if ('y1' in seg) y1 = y + seg.y1;
                if ('y2' in seg) y2 = y + seg.y2;
                if ('x' in seg) x += seg.x;
                if ('y' in seg) y += seg.y;

                switch (segType) {

                case 'm':
                    segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                    break;
                case 'l':
                    segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                    break;
                case 'h':
                    segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                    break;
                case 'v':
                    segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                    break;
                case 'c':
                    segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                    break;
                case 's':
                    segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                    break;
                case 'q':
                    segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                    break;
                case 't':
                    segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                    break;
                case 'a':
                    segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                    break;
                case 'z':
                case 'Z':
                    x = x0;
                    y = y0;
                    break;

                }
            }

            if (segType == 'M' || segType == 'm') {
                x0 = x;
                y0 = y;
            }
        }
    };

})();
},{"../core/Common":14,"../geometry/Bounds":26}],28:[function(_dereq_,module,exports){
/**
* The `Matter.Vector` module contains methods for creating and manipulating vectors.
* Vectors are the basis of all the geometry related operations in the engine.
* A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Vector
*/

// TODO: consider params for reusing vector objects

var Vector = {};

module.exports = Vector;

(function() {

    /**
     * Creates a new vector.
     * @method create
     * @param {number} x
     * @param {number} y
     * @return {vector} A new vector
     */
    Vector.create = function(x, y) {
        return { x: x || 0, y: y || 0 };
    };

    /**
     * Returns a new vector with `x` and `y` copied from the given `vector`.
     * @method clone
     * @param {vector} vector
     * @return {vector} A new cloned vector
     */
    Vector.clone = function(vector) {
        return { x: vector.x, y: vector.y };
    };

    /**
     * Returns the magnitude (length) of a vector.
     * @method magnitude
     * @param {vector} vector
     * @return {number} The magnitude of the vector
     */
    Vector.magnitude = function(vector) {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    };

    /**
     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
     * @method magnitudeSquared
     * @param {vector} vector
     * @return {number} The squared magnitude of the vector
     */
    Vector.magnitudeSquared = function(vector) {
        return (vector.x * vector.x) + (vector.y * vector.y);
    };

    /**
     * Rotates the vector about (0, 0) by specified angle.
     * @method rotate
     * @param {vector} vector
     * @param {number} angle
     * @param {vector} [output]
     * @return {vector} The vector rotated about (0, 0)
     */
    Vector.rotate = function(vector, angle, output) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        if (!output) output = {};
        var x = vector.x * cos - vector.y * sin;
        output.y = vector.x * sin + vector.y * cos;
        output.x = x;
        return output;
    };

    /**
     * Rotates the vector about a specified point by specified angle.
     * @method rotateAbout
     * @param {vector} vector
     * @param {number} angle
     * @param {vector} point
     * @param {vector} [output]
     * @return {vector} A new vector rotated about the point
     */
    Vector.rotateAbout = function(vector, angle, point, output) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        if (!output) output = {};
        var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
        output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
        output.x = x;
        return output;
    };

    /**
     * Normalises a vector (such that its magnitude is `1`).
     * @method normalise
     * @param {vector} vector
     * @return {vector} A new vector normalised
     */
    Vector.normalise = function(vector) {
        var magnitude = Vector.magnitude(vector);
        if (magnitude === 0)
            return { x: 0, y: 0 };
        return { x: vector.x / magnitude, y: vector.y / magnitude };
    };

    /**
     * Returns the dot-product of two vectors.
     * @method dot
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @return {number} The dot product of the two vectors
     */
    Vector.dot = function(vectorA, vectorB) {
        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
    };

    /**
     * Returns the cross-product of two vectors.
     * @method cross
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @return {number} The cross product of the two vectors
     */
    Vector.cross = function(vectorA, vectorB) {
        return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x);
    };

    /**
     * Returns the cross-product of three vectors.
     * @method cross3
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @param {vector} vectorC
     * @return {number} The cross product of the three vectors
     */
    Vector.cross3 = function(vectorA, vectorB, vectorC) {
        return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
    };

    /**
     * Adds the two vectors.
     * @method add
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @param {vector} [output]
     * @return {vector} A new vector of vectorA and vectorB added
     */
    Vector.add = function(vectorA, vectorB, output) {
        if (!output) output = {};
        output.x = vectorA.x + vectorB.x;
        output.y = vectorA.y + vectorB.y;
        return output;
    };

    /**
     * Subtracts the two vectors.
     * @method sub
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @param {vector} [output]
     * @return {vector} A new vector of vectorA and vectorB subtracted
     */
    Vector.sub = function(vectorA, vectorB, output) {
        if (!output) output = {};
        output.x = vectorA.x - vectorB.x;
        output.y = vectorA.y - vectorB.y;
        return output;
    };

    /**
     * Multiplies a vector and a scalar.
     * @method mult
     * @param {vector} vector
     * @param {number} scalar
     * @return {vector} A new vector multiplied by scalar
     */
    Vector.mult = function(vector, scalar) {
        return { x: vector.x * scalar, y: vector.y * scalar };
    };

    /**
     * Divides a vector and a scalar.
     * @method div
     * @param {vector} vector
     * @param {number} scalar
     * @return {vector} A new vector divided by scalar
     */
    Vector.div = function(vector, scalar) {
        return { x: vector.x / scalar, y: vector.y / scalar };
    };

    /**
     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
     * @method perp
     * @param {vector} vector
     * @param {bool} [negate=false]
     * @return {vector} The perpendicular vector
     */
    Vector.perp = function(vector, negate) {
        negate = negate === true ? -1 : 1;
        return { x: negate * -vector.y, y: negate * vector.x };
    };

    /**
     * Negates both components of a vector such that it points in the opposite direction.
     * @method neg
     * @param {vector} vector
     * @return {vector} The negated vector
     */
    Vector.neg = function(vector) {
        return { x: -vector.x, y: -vector.y };
    };

    /**
     * Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
     * @method angle
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @return {number} The angle in radians
     */
    Vector.angle = function(vectorA, vectorB) {
        return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
    };

    /**
     * Temporary vector pool (not thread-safe).
     * @property _temp
     * @type {vector[]}
     * @private
     */
    Vector._temp = [
        Vector.create(), Vector.create(), 
        Vector.create(), Vector.create(), 
        Vector.create(), Vector.create()
    ];

})();
},{}],29:[function(_dereq_,module,exports){
/**
* The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
* A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
* A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class Vertices
*/

var Vertices = {};

module.exports = Vertices;

var Vector = _dereq_('../geometry/Vector');
var Common = _dereq_('../core/Common');

(function() {

    /**
     * Creates a new set of `Matter.Body` compatible vertices.
     * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
     *
     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
     *
     * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
     * but with some additional references required for efficient collision detection routines.
     *
     * Vertices must be specified in clockwise order.
     *
     * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
     *
     * @method create
     * @param {vector[]} points
     * @param {body} body
     */
    Vertices.create = function(points, body) {
        var vertices = [];

        for (var i = 0; i < points.length; i++) {
            var point = points[i],
                vertex = {
                    x: point.x,
                    y: point.y,
                    index: i,
                    body: body,
                    isInternal: false
                };

            vertices.push(vertex);
        }

        return vertices;
    };

    /**
     * Parses a string containing ordered x y pairs separated by spaces (and optionally commas), 
     * into a `Matter.Vertices` object for the given `Matter.Body`.
     * For parsing SVG paths, see `Svg.pathToVertices`.
     * @method fromPath
     * @param {string} path
     * @param {body} body
     * @return {vertices} vertices
     */
    Vertices.fromPath = function(path, body) {
        var pathPattern = /L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/ig,
            points = [];

        path.replace(pathPattern, function(match, x, y) {
            points.push({ x: parseFloat(x), y: parseFloat(y) });
        });

        return Vertices.create(points, body);
    };

    /**
     * Returns the centre (centroid) of the set of vertices.
     * @method centre
     * @param {vertices} vertices
     * @return {vector} The centre point
     */
    Vertices.centre = function(vertices) {
        var area = Vertices.area(vertices, true),
            centre = { x: 0, y: 0 },
            cross,
            temp,
            j;

        for (var i = 0; i < vertices.length; i++) {
            j = (i + 1) % vertices.length;
            cross = Vector.cross(vertices[i], vertices[j]);
            temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
            centre = Vector.add(centre, temp);
        }

        return Vector.div(centre, 6 * area);
    };

    /**
     * Returns the average (mean) of the set of vertices.
     * @method mean
     * @param {vertices} vertices
     * @return {vector} The average point
     */
    Vertices.mean = function(vertices) {
        var average = { x: 0, y: 0 };

        for (var i = 0; i < vertices.length; i++) {
            average.x += vertices[i].x;
            average.y += vertices[i].y;
        }

        return Vector.div(average, vertices.length);
    };

    /**
     * Returns the area of the set of vertices.
     * @method area
     * @param {vertices} vertices
     * @param {bool} signed
     * @return {number} The area
     */
    Vertices.area = function(vertices, signed) {
        var area = 0,
            j = vertices.length - 1;

        for (var i = 0; i < vertices.length; i++) {
            area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
            j = i;
        }

        if (signed)
            return area / 2;

        return Math.abs(area) / 2;
    };

    /**
     * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
     * @method inertia
     * @param {vertices} vertices
     * @param {number} mass
     * @return {number} The polygon's moment of inertia
     */
    Vertices.inertia = function(vertices, mass) {
        var numerator = 0,
            denominator = 0,
            v = vertices,
            cross,
            j;

        // find the polygon's moment of inertia, using second moment of area
        // from equations at http://www.physicsforums.com/showthread.php?t=25293
        for (var n = 0; n < v.length; n++) {
            j = (n + 1) % v.length;
            cross = Math.abs(Vector.cross(v[j], v[n]));
            numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
            denominator += cross;
        }

        return (mass / 6) * (numerator / denominator);
    };

    /**
     * Translates the set of vertices in-place.
     * @method translate
     * @param {vertices} vertices
     * @param {vector} vector
     * @param {number} scalar
     */
    Vertices.translate = function(vertices, vector, scalar) {
        var i;
        if (scalar) {
            for (i = 0; i < vertices.length; i++) {
                vertices[i].x += vector.x * scalar;
                vertices[i].y += vector.y * scalar;
            }
        } else {
            for (i = 0; i < vertices.length; i++) {
                vertices[i].x += vector.x;
                vertices[i].y += vector.y;
            }
        }

        return vertices;
    };

    /**
     * Rotates the set of vertices in-place.
     * @method rotate
     * @param {vertices} vertices
     * @param {number} angle
     * @param {vector} point
     */
    Vertices.rotate = function(vertices, angle, point) {
        if (angle === 0)
            return;

        var cos = Math.cos(angle),
            sin = Math.sin(angle);

        for (var i = 0; i < vertices.length; i++) {
            var vertice = vertices[i],
                dx = vertice.x - point.x,
                dy = vertice.y - point.y;
                
            vertice.x = point.x + (dx * cos - dy * sin);
            vertice.y = point.y + (dx * sin + dy * cos);
        }

        return vertices;
    };

    /**
     * Returns `true` if the `point` is inside the set of `vertices`.
     * @method contains
     * @param {vertices} vertices
     * @param {vector} point
     * @return {boolean} True if the vertices contains point, otherwise false
     */
    Vertices.contains = function(vertices, point) {
        for (var i = 0; i < vertices.length; i++) {
            var vertice = vertices[i],
                nextVertice = vertices[(i + 1) % vertices.length];
            if ((point.x - vertice.x) * (nextVertice.y - vertice.y) + (point.y - vertice.y) * (vertice.x - nextVertice.x) > 0) {
                return false;
            }
        }

        return true;
    };

    /**
     * Scales the vertices from a point (default is centre) in-place.
     * @method scale
     * @param {vertices} vertices
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {vector} point
     */
    Vertices.scale = function(vertices, scaleX, scaleY, point) {
        if (scaleX === 1 && scaleY === 1)
            return vertices;

        point = point || Vertices.centre(vertices);

        var vertex,
            delta;

        for (var i = 0; i < vertices.length; i++) {
            vertex = vertices[i];
            delta = Vector.sub(vertex, point);
            vertices[i].x = point.x + delta.x * scaleX;
            vertices[i].y = point.y + delta.y * scaleY;
        }

        return vertices;
    };

    /**
     * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
     * The radius parameter is a single number or an array to specify the radius for each vertex.
     * @method chamfer
     * @param {vertices} vertices
     * @param {number[]} radius
     * @param {number} quality
     * @param {number} qualityMin
     * @param {number} qualityMax
     */
    Vertices.chamfer = function(vertices, radius, quality, qualityMin, qualityMax) {
        if (typeof radius === 'number') {
            radius = [radius];
        } else {
            radius = radius || [8];
        }

        // quality defaults to -1, which is auto
        quality = (typeof quality !== 'undefined') ? quality : -1;
        qualityMin = qualityMin || 2;
        qualityMax = qualityMax || 14;

        var newVertices = [];

        for (var i = 0; i < vertices.length; i++) {
            var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1],
                vertex = vertices[i],
                nextVertex = vertices[(i + 1) % vertices.length],
                currentRadius = radius[i < radius.length ? i : radius.length - 1];

            if (currentRadius === 0) {
                newVertices.push(vertex);
                continue;
            }

            var prevNormal = Vector.normalise({ 
                x: vertex.y - prevVertex.y, 
                y: prevVertex.x - vertex.x
            });

            var nextNormal = Vector.normalise({ 
                x: nextVertex.y - vertex.y, 
                y: vertex.x - nextVertex.x
            });

            var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)),
                radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius),
                midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)),
                scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));

            var precision = quality;

            if (quality === -1) {
                // automatically decide precision
                precision = Math.pow(currentRadius, 0.32) * 1.75;
            }

            precision = Common.clamp(precision, qualityMin, qualityMax);

            // use an even value for precision, more likely to reduce axes by using symmetry
            if (precision % 2 === 1)
                precision += 1;

            var alpha = Math.acos(Vector.dot(prevNormal, nextNormal)),
                theta = alpha / precision;

            for (var j = 0; j < precision; j++) {
                newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
            }
        }

        return newVertices;
    };

    /**
     * Sorts the input vertices into clockwise order in place.
     * @method clockwiseSort
     * @param {vertices} vertices
     * @return {vertices} vertices
     */
    Vertices.clockwiseSort = function(vertices) {
        var centre = Vertices.mean(vertices);

        vertices.sort(function(vertexA, vertexB) {
            return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB);
        });

        return vertices;
    };

    /**
     * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
     * @method isConvex
     * @param {vertices} vertices
     * @return {bool} `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
     */
    Vertices.isConvex = function(vertices) {
        // http://paulbourke.net/geometry/polygonmesh/
        // Copyright (c) Paul Bourke (use permitted)

        var flag = 0,
            n = vertices.length,
            i,
            j,
            k,
            z;

        if (n < 3)
            return null;

        for (i = 0; i < n; i++) {
            j = (i + 1) % n;
            k = (i + 2) % n;
            z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
            z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);

            if (z < 0) {
                flag |= 1;
            } else if (z > 0) {
                flag |= 2;
            }

            if (flag === 3) {
                return false;
            }
        }

        if (flag !== 0){
            return true;
        } else {
            return null;
        }
    };

    /**
     * Returns the convex hull of the input vertices as a new array of points.
     * @method hull
     * @param {vertices} vertices
     * @return [vertex] vertices
     */
    Vertices.hull = function(vertices) {
        // http://geomalgorithms.com/a10-_hull-1.html

        var upper = [],
            lower = [], 
            vertex,
            i;

        // sort vertices on x-axis (y-axis for ties)
        vertices = vertices.slice(0);
        vertices.sort(function(vertexA, vertexB) {
            var dx = vertexA.x - vertexB.x;
            return dx !== 0 ? dx : vertexA.y - vertexB.y;
        });

        // build lower hull
        for (i = 0; i < vertices.length; i += 1) {
            vertex = vertices[i];

            while (lower.length >= 2 
                   && Vector.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) {
                lower.pop();
            }

            lower.push(vertex);
        }

        // build upper hull
        for (i = vertices.length - 1; i >= 0; i -= 1) {
            vertex = vertices[i];

            while (upper.length >= 2 
                   && Vector.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) {
                upper.pop();
            }

            upper.push(vertex);
        }

        // concatenation of the lower and upper hulls gives the convex hull
        // omit last points because they are repeated at the beginning of the other list
        upper.pop();
        lower.pop();

        return upper.concat(lower);
    };

})();

},{"../core/Common":14,"../geometry/Vector":28}],30:[function(_dereq_,module,exports){
var Matter = module.exports = _dereq_('../core/Matter');

Matter.Body = _dereq_('../body/Body');
Matter.Composite = _dereq_('../body/Composite');
Matter.World = _dereq_('../body/World');

Matter.Contact = _dereq_('../collision/Contact');
Matter.Detector = _dereq_('../collision/Detector');
Matter.Grid = _dereq_('../collision/Grid');
Matter.Pairs = _dereq_('../collision/Pairs');
Matter.Pair = _dereq_('../collision/Pair');
Matter.Query = _dereq_('../collision/Query');
Matter.Resolver = _dereq_('../collision/Resolver');
Matter.SAT = _dereq_('../collision/SAT');

Matter.Constraint = _dereq_('../constraint/Constraint');
Matter.MouseConstraint = _dereq_('../constraint/MouseConstraint');

Matter.Common = _dereq_('../core/Common');
Matter.Engine = _dereq_('../core/Engine');
Matter.Events = _dereq_('../core/Events');
Matter.Mouse = _dereq_('../core/Mouse');
Matter.Runner = _dereq_('../core/Runner');
Matter.Sleeping = _dereq_('../core/Sleeping');
Matter.Plugin = _dereq_('../core/Plugin');


Matter.Bodies = _dereq_('../factory/Bodies');
Matter.Composites = _dereq_('../factory/Composites');

Matter.Axes = _dereq_('../geometry/Axes');
Matter.Bounds = _dereq_('../geometry/Bounds');
Matter.Svg = _dereq_('../geometry/Svg');
Matter.Vector = _dereq_('../geometry/Vector');
Matter.Vertices = _dereq_('../geometry/Vertices');

Matter.Render = _dereq_('../render/Render');
Matter.RenderPixi = _dereq_('../render/RenderPixi');

// aliases

Matter.World.add = Matter.Composite.add;
Matter.World.remove = Matter.Composite.remove;
Matter.World.addComposite = Matter.Composite.addComposite;
Matter.World.addBody = Matter.Composite.addBody;
Matter.World.addConstraint = Matter.Composite.addConstraint;
Matter.World.clear = Matter.Composite.clear;
Matter.Engine.run = Matter.Runner.run;

},{"../body/Body":1,"../body/Composite":2,"../body/World":3,"../collision/Contact":4,"../collision/Detector":5,"../collision/Grid":6,"../collision/Pair":7,"../collision/Pairs":8,"../collision/Query":9,"../collision/Resolver":10,"../collision/SAT":11,"../constraint/Constraint":12,"../constraint/MouseConstraint":13,"../core/Common":14,"../core/Engine":15,"../core/Events":16,"../core/Matter":17,"../core/Metrics":18,"../core/Mouse":19,"../core/Plugin":20,"../core/Runner":21,"../core/Sleeping":22,"../factory/Bodies":23,"../factory/Composites":24,"../geometry/Axes":25,"../geometry/Bounds":26,"../geometry/Svg":27,"../geometry/Vector":28,"../geometry/Vertices":29,"../render/Render":31,"../render/RenderPixi":32}],31:[function(_dereq_,module,exports){
/**
* The `Matter.Render` module is a simple HTML5 canvas based renderer for visualising instances of `Matter.Engine`.
* It is intended for development and debugging purposes, but may also be suitable for simple games.
* It includes a number of drawing options including wireframe, vector with support for sprites and viewports.
*
* @class Render
*/

var Render = {};

module.exports = Render;

var Common = _dereq_('../core/Common');
var Composite = _dereq_('../body/Composite');
var Bounds = _dereq_('../geometry/Bounds');
var Events = _dereq_('../core/Events');
var Grid = _dereq_('../collision/Grid');
var Vector = _dereq_('../geometry/Vector');
var Mouse = _dereq_('../core/Mouse');

(function() {

    var _requestAnimationFrame,
        _cancelAnimationFrame;

    if (typeof window !== 'undefined') {
        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
                                      || window.mozRequestAnimationFrame || window.msRequestAnimationFrame
                                      || function(callback){ window.setTimeout(function() { callback(Common.now()); }, 1000 / 60); };

        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
                                      || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
    }

    /**
     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {object} [options]
     * @return {render} A new renderer
     */
    Render.create = function(options) {
        var defaults = {
            controller: Render,
            engine: null,
            element: null,
            canvas: null,
            mouse: null,
            frameRequestId: null,
            options: {
                width: 800,
                height: 600,
                pixelRatio: 1,
                background: '#18181d',
                wireframeBackground: '#0f0f13',
                hasBounds: !!options.bounds,
                enabled: true,
                wireframes: true,
                showSleeping: true,
                showDebug: false,
                showBroadphase: false,
                showBounds: false,
                showVelocity: false,
                showCollisions: false,
                showSeparations: false,
                showAxes: false,
                showPositions: false,
                showAngleIndicator: false,
                showIds: false,
                showShadows: false,
                showVertexNumbers: false,
                showConvexHulls: false,
                showInternalEdges: false,
                showMousePosition: false
            }
        };

        var render = Common.extend(defaults, options);

        if (render.canvas) {
            render.canvas.width = render.options.width || render.canvas.width;
            render.canvas.height = render.options.height || render.canvas.height;
        }

        render.mouse = options.mouse;
        render.engine = options.engine;
        render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
        render.context = render.canvas.getContext('2d');
        render.textures = {};

        render.bounds = render.bounds || {
            min: {
                x: 0,
                y: 0
            },
            max: {
                x: render.canvas.width,
                y: render.canvas.height
            }
        };

        if (render.options.pixelRatio !== 1) {
            Render.setPixelRatio(render, render.options.pixelRatio);
        }

        if (Common.isElement(render.element)) {
            render.element.appendChild(render.canvas);
        } else if (!render.canvas.parentNode) {
            Common.log('Render.create: options.element was undefined, render.canvas was created but not appended', 'warn');
        }

        return render;
    };

    /**
     * Continuously updates the render canvas on the `requestAnimationFrame` event.
     * @method run
     * @param {render} render
     */
    Render.run = function(render) {
        (function loop(time){
            render.frameRequestId = _requestAnimationFrame(loop);
            Render.world(render);
        })();
    };

    /**
     * Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
     * @method stop
     * @param {render} render
     */
    Render.stop = function(render) {
        _cancelAnimationFrame(render.frameRequestId);
    };

    /**
     * Sets the pixel ratio of the renderer and updates the canvas.
     * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
     * @method setPixelRatio
     * @param {render} render
     * @param {number} pixelRatio
     */
    Render.setPixelRatio = function(render, pixelRatio) {
        var options = render.options,
            canvas = render.canvas;

        if (pixelRatio === 'auto') {
            pixelRatio = _getPixelRatio(canvas);
        }

        options.pixelRatio = pixelRatio;
        canvas.setAttribute('data-pixel-ratio', pixelRatio);
        canvas.width = options.width * pixelRatio;
        canvas.height = options.height * pixelRatio;
        canvas.style.width = options.width + 'px';
        canvas.style.height = options.height + 'px';
        render.context.scale(pixelRatio, pixelRatio);
    };

    /**
     * Positions and sizes the viewport around the given object bounds.
     * Objects must have at least one of the following properties:
     * - `object.bounds`
     * - `object.position`
     * - `object.min` and `object.max`
     * - `object.x` and `object.y`
     * @method lookAt
     * @param {render} render
     * @param {object[]} objects
     * @param {vector} [padding]
     * @param {bool} [center=true]
     */
    Render.lookAt = function(render, objects, padding, center) {
        center = typeof center !== 'undefined' ? center : true;
        objects = Common.isArray(objects) ? objects : [objects];
        padding = padding || {
            x: 0,
            y: 0
        };

        // find bounds of all objects
        var bounds = {
            min: { x: Infinity, y: Infinity },
            max: { x: -Infinity, y: -Infinity }
        };

        for (var i = 0; i < objects.length; i += 1) {
            var object = objects[i],
                min = object.bounds ? object.bounds.min : (object.min || object.position || object),
                max = object.bounds ? object.bounds.max : (object.max || object.position || object);

            if (min && max) {
                if (min.x < bounds.min.x)
                    bounds.min.x = min.x;

                if (max.x > bounds.max.x)
                    bounds.max.x = max.x;

                if (min.y < bounds.min.y)
                    bounds.min.y = min.y;

                if (max.y > bounds.max.y)
                    bounds.max.y = max.y;
            }
        }

        // find ratios
        var width = (bounds.max.x - bounds.min.x) + 2 * padding.x,
            height = (bounds.max.y - bounds.min.y) + 2 * padding.y,
            viewHeight = render.canvas.height,
            viewWidth = render.canvas.width,
            outerRatio = viewWidth / viewHeight,
            innerRatio = width / height,
            scaleX = 1,
            scaleY = 1;

        // find scale factor
        if (innerRatio > outerRatio) {
            scaleY = innerRatio / outerRatio;
        } else {
            scaleX = outerRatio / innerRatio;
        }

        // enable bounds
        render.options.hasBounds = true;

        // position and size
        render.bounds.min.x = bounds.min.x;
        render.bounds.max.x = bounds.min.x + width * scaleX;
        render.bounds.min.y = bounds.min.y;
        render.bounds.max.y = bounds.min.y + height * scaleY;

        // center
        if (center) {
            render.bounds.min.x += width * 0.5 - (width * scaleX) * 0.5;
            render.bounds.max.x += width * 0.5 - (width * scaleX) * 0.5;
            render.bounds.min.y += height * 0.5 - (height * scaleY) * 0.5;
            render.bounds.max.y += height * 0.5 - (height * scaleY) * 0.5;
        }

        // padding
        render.bounds.min.x -= padding.x;
        render.bounds.max.x -= padding.x;
        render.bounds.min.y -= padding.y;
        render.bounds.max.y -= padding.y;

        // update mouse
        if (render.mouse) {
            Mouse.setScale(render.mouse, {
                x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
                y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height
            });

            Mouse.setOffset(render.mouse, render.bounds.min);
        }
    };

    /**
     * Applies viewport transforms based on `render.bounds` to a render context.
     * @method startViewTransform
     * @param {render} render
     */
    Render.startViewTransform = function(render) {
        var boundsWidth = render.bounds.max.x - render.bounds.min.x,
            boundsHeight = render.bounds.max.y - render.bounds.min.y,
            boundsScaleX = boundsWidth / render.options.width,
            boundsScaleY = boundsHeight / render.options.height;

        render.context.scale(1 / boundsScaleX, 1 / boundsScaleY);
        render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
    };

    /**
     * Resets all transforms on the render context.
     * @method endViewTransform
     * @param {render} render
     */
    Render.endViewTransform = function(render) {
        render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
    };

    /**
     * Renders the given `engine`'s `Matter.World` object.
     * This is the entry point for all rendering and should be called every time the scene changes.
     * @method world
     * @param {render} render
     */
    Render.world = function(render) {
        var engine = render.engine,
            world = engine.world,
            canvas = render.canvas,
            context = render.context,
            options = render.options,
            allBodies = Composite.allBodies(world),
            allConstraints = Composite.allConstraints(world),
            background = options.wireframes ? options.wireframeBackground : options.background,
            bodies = [],
            constraints = [],
            i;

        var event = {
            timestamp: engine.timing.timestamp
        };

        Events.trigger(render, 'beforeRender', event);

        // apply background if it has changed
        if (render.currentBackground !== background)
            _applyBackground(render, background);

        // clear the canvas with a transparent fill, to allow the canvas background to show
        context.globalCompositeOperation = 'source-in';
        context.fillStyle = "transparent";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-over';

        // handle bounds
        if (options.hasBounds) {
            // filter out bodies that are not in view
            for (i = 0; i < allBodies.length; i++) {
                var body = allBodies[i];
                if (Bounds.overlaps(body.bounds, render.bounds))
                    bodies.push(body);
            }

            // filter out constraints that are not in view
            for (i = 0; i < allConstraints.length; i++) {
                var constraint = allConstraints[i],
                    bodyA = constraint.bodyA,
                    bodyB = constraint.bodyB,
                    pointAWorld = constraint.pointA,
                    pointBWorld = constraint.pointB;

                if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
                if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

                if (!pointAWorld || !pointBWorld)
                    continue;

                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
                    constraints.push(constraint);
            }

            // transform the view
            Render.startViewTransform(render);

            // update mouse
            if (render.mouse) {
                Mouse.setScale(render.mouse, {
                    x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
                    y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height
                });

                Mouse.setOffset(render.mouse, render.bounds.min);
            }
        } else {
            constraints = allConstraints;
            bodies = allBodies;
        }

        if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
            // fully featured rendering of bodies
            Render.bodies(render, bodies, context);
        } else {
            if (options.showConvexHulls)
                Render.bodyConvexHulls(render, bodies, context);

            // optimised method for wireframes only
            Render.bodyWireframes(render, bodies, context);
        }

        if (options.showBounds)
            Render.bodyBounds(render, bodies, context);

        if (options.showAxes || options.showAngleIndicator)
            Render.bodyAxes(render, bodies, context);

        if (options.showPositions)
            Render.bodyPositions(render, bodies, context);

        if (options.showVelocity)
            Render.bodyVelocity(render, bodies, context);

        if (options.showIds)
            Render.bodyIds(render, bodies, context);

        if (options.showSeparations)
            Render.separations(render, engine.pairs.list, context);

        if (options.showCollisions)
            Render.collisions(render, engine.pairs.list, context);

        if (options.showVertexNumbers)
            Render.vertexNumbers(render, bodies, context);

        if (options.showMousePosition)
            Render.mousePosition(render, render.mouse, context);

        Render.constraints(constraints, context);

        if (options.showBroadphase && engine.broadphase.controller === Grid)
            Render.grid(render, engine.broadphase, context);

        if (options.showDebug)
            Render.debug(render, context);

        if (options.hasBounds) {
            // revert view transforms
            Render.endViewTransform(render);
        }

        Events.trigger(render, 'afterRender', event);
    };

    /**
     * Description
     * @private
     * @method debug
     * @param {render} render
     * @param {RenderingContext} context
     */
    Render.debug = function(render, context) {
        var c = context,
            engine = render.engine,
            world = engine.world,
            metrics = engine.metrics,
            options = render.options,
            bodies = Composite.allBodies(world),
            space = "    ";

        if (engine.timing.timestamp - (render.debugTimestamp || 0) >= 500) {
            var text = "";

            if (metrics.timing) {
                text += "fps: " + Math.round(metrics.timing.fps) + space;
            }


            render.debugString = text;
            render.debugTimestamp = engine.timing.timestamp;
        }

        if (render.debugString) {
            c.font = "12px Arial";

            if (options.wireframes) {
                c.fillStyle = 'rgba(255,255,255,0.5)';
            } else {
                c.fillStyle = 'rgba(0,0,0,0.5)';
            }

            var split = render.debugString.split('\n');

            for (var i = 0; i < split.length; i++) {
                c.fillText(split[i], 50, 50 + i * 18);
            }
        }
    };

    /**
     * Description
     * @private
     * @method constraints
     * @param {constraint[]} constraints
     * @param {RenderingContext} context
     */
    Render.constraints = function(constraints, context) {
        var c = context;

        for (var i = 0; i < constraints.length; i++) {
            var constraint = constraints[i];

            if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
                continue;

            var bodyA = constraint.bodyA,
                bodyB = constraint.bodyB,
                start,
                end;

            if (bodyA) {
                start = Vector.add(bodyA.position, constraint.pointA);
            } else {
                start = constraint.pointA;
            }

            if (constraint.render.type === 'pin') {
                c.beginPath();
                c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                c.closePath();
            } else {
                if (bodyB) {
                    end = Vector.add(bodyB.position, constraint.pointB);
                } else {
                    end = constraint.pointB;
                }

                c.beginPath();
                c.moveTo(start.x, start.y);

                if (constraint.render.type === 'spring') {
                    var delta = Vector.sub(end, start),
                        normal = Vector.perp(Vector.normalise(delta)),
                        coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20)),
                        offset;

                    for (var j = 1; j < coils; j += 1) {
                        offset = j % 2 === 0 ? 1 : -1;

                        c.lineTo(
                            start.x + delta.x * (j / coils) + normal.x * offset * 4,
                            start.y + delta.y * (j / coils) + normal.y * offset * 4
                        );
                    }
                }

                c.lineTo(end.x, end.y);
            }

            if (constraint.render.lineWidth) {
                c.lineWidth = constraint.render.lineWidth;
                c.strokeStyle = constraint.render.strokeStyle;
                c.stroke();
            }

            if (constraint.render.anchors) {
                c.fillStyle = constraint.render.strokeStyle;
                c.beginPath();
                c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                c.arc(end.x, end.y, 3, 0, 2 * Math.PI);
                c.closePath();
                c.fill();
            }
        }
    };

    /**
     * Description
     * @private
     * @method bodyShadows
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyShadows = function(render, bodies, context) {
        var c = context,
            engine = render.engine;

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (!body.render.visible)
                continue;

            if (body.circleRadius) {
                c.beginPath();
                c.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
                c.closePath();
            } else {
                c.beginPath();
                c.moveTo(body.vertices[0].x, body.vertices[0].y);
                for (var j = 1; j < body.vertices.length; j++) {
                    c.lineTo(body.vertices[j].x, body.vertices[j].y);
                }
                c.closePath();
            }

            var distanceX = body.position.x - render.options.width * 0.5,
                distanceY = body.position.y - render.options.height * 0.2,
                distance = Math.abs(distanceX) + Math.abs(distanceY);

            c.shadowColor = 'rgba(0,0,0,0.15)';
            c.shadowOffsetX = 0.05 * distanceX;
            c.shadowOffsetY = 0.05 * distanceY;
            c.shadowBlur = 1 + 12 * Math.min(1, distance / 1000);

            c.fill();

            c.shadowColor = null;
            c.shadowOffsetX = null;
            c.shadowOffsetY = null;
            c.shadowBlur = null;
        }
    };

    /**
     * Description
     * @private
     * @method bodies
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodies = function(render, bodies, context) {
        var c = context,
            engine = render.engine,
            options = render.options,
            showInternalEdges = options.showInternalEdges || !options.wireframes,
            body,
            part,
            i,
            k;

        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];

            if (!body.render.visible)
                continue;

            // handle compound parts
            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                part = body.parts[k];

                if (!part.render.visible)
                    continue;

                if (options.showSleeping && body.isSleeping) {
                    c.globalAlpha = 0.5 * part.render.opacity;
                } else if (part.render.opacity !== 1) {
                    c.globalAlpha = part.render.opacity;
                }

                if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
                    // part sprite
                    var sprite = part.render.sprite,
                        texture = _getTexture(render, sprite.texture);

                    c.translate(part.position.x, part.position.y);
                    c.rotate(part.angle);

                    c.drawImage(
                        texture,
                        texture.width * -sprite.xOffset * sprite.xScale,
                        texture.height * -sprite.yOffset * sprite.yScale,
                        texture.width * sprite.xScale,
                        texture.height * sprite.yScale
                    );

                    // revert translation, hopefully faster than save / restore
                    c.rotate(-part.angle);
                    c.translate(-part.position.x, -part.position.y);
                } else {
                    // part polygon
                    if (part.circleRadius) {
                        c.beginPath();
                        c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
                    } else {
                        c.beginPath();
                        c.moveTo(part.vertices[0].x, part.vertices[0].y);

                        for (var j = 1; j < part.vertices.length; j++) {
                            if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                                c.lineTo(part.vertices[j].x, part.vertices[j].y);
                            } else {
                                c.moveTo(part.vertices[j].x, part.vertices[j].y);
                            }

                            if (part.vertices[j].isInternal && !showInternalEdges) {
                                c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                            }
                        }

                        c.lineTo(part.vertices[0].x, part.vertices[0].y);
                        c.closePath();
                    }

                    if (!options.wireframes) {
                        c.fillStyle = part.render.fillStyle;

                        if (part.render.lineWidth) {
                            c.lineWidth = part.render.lineWidth;
                            c.strokeStyle = part.render.strokeStyle;
                            c.stroke();
                        }

                        c.fill();
                    } else {
                        c.lineWidth = 1;
                        c.strokeStyle = '#bbb';
                        c.stroke();
                    }
                }

                c.globalAlpha = 1;
            }
        }
    };

    /**
     * Optimised method for drawing body wireframes in one pass
     * @private
     * @method bodyWireframes
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyWireframes = function(render, bodies, context) {
        var c = context,
            showInternalEdges = render.options.showInternalEdges,
            body,
            part,
            i,
            j,
            k;

        c.beginPath();

        // render all bodies
        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];

            if (!body.render.visible)
                continue;

            // handle compound parts
            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                part = body.parts[k];

                c.moveTo(part.vertices[0].x, part.vertices[0].y);

                for (j = 1; j < part.vertices.length; j++) {
                    if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                        c.lineTo(part.vertices[j].x, part.vertices[j].y);
                    } else {
                        c.moveTo(part.vertices[j].x, part.vertices[j].y);
                    }

                    if (part.vertices[j].isInternal && !showInternalEdges) {
                        c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                    }
                }

                c.lineTo(part.vertices[0].x, part.vertices[0].y);
            }
        }

        c.lineWidth = 1;
        c.strokeStyle = '#bbb';
        c.stroke();
    };

    /**
     * Optimised method for drawing body convex hull wireframes in one pass
     * @private
     * @method bodyConvexHulls
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyConvexHulls = function(render, bodies, context) {
        var c = context,
            body,
            part,
            i,
            j,
            k;

        c.beginPath();

        // render convex hulls
        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];

            if (!body.render.visible || body.parts.length === 1)
                continue;

            c.moveTo(body.vertices[0].x, body.vertices[0].y);

            for (j = 1; j < body.vertices.length; j++) {
                c.lineTo(body.vertices[j].x, body.vertices[j].y);
            }

            c.lineTo(body.vertices[0].x, body.vertices[0].y);
        }

        c.lineWidth = 1;
        c.strokeStyle = 'rgba(255,255,255,0.2)';
        c.stroke();
    };

    /**
     * Renders body vertex numbers.
     * @private
     * @method vertexNumbers
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.vertexNumbers = function(render, bodies, context) {
        var c = context,
            i,
            j,
            k;

        for (i = 0; i < bodies.length; i++) {
            var parts = bodies[i].parts;
            for (k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
                var part = parts[k];
                for (j = 0; j < part.vertices.length; j++) {
                    c.fillStyle = 'rgba(255,255,255,0.2)';
                    c.fillText(i + '_' + j, part.position.x + (part.vertices[j].x - part.position.x) * 0.8, part.position.y + (part.vertices[j].y - part.position.y) * 0.8);
                }
            }
        }
    };

    /**
     * Renders mouse position.
     * @private
     * @method mousePosition
     * @param {render} render
     * @param {mouse} mouse
     * @param {RenderingContext} context
     */
    Render.mousePosition = function(render, mouse, context) {
        var c = context;
        c.fillStyle = 'rgba(255,255,255,0.8)';
        c.fillText(mouse.position.x + '  ' + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
    };

    /**
     * Draws body bounds
     * @private
     * @method bodyBounds
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyBounds = function(render, bodies, context) {
        var c = context,
            engine = render.engine,
            options = render.options;

        c.beginPath();

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (body.render.visible) {
                var parts = bodies[i].parts;
                for (var j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    var part = parts[j];
                    c.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
                }
            }
        }

        if (options.wireframes) {
            c.strokeStyle = 'rgba(255,255,255,0.08)';
        } else {
            c.strokeStyle = 'rgba(0,0,0,0.1)';
        }

        c.lineWidth = 1;
        c.stroke();
    };

    /**
     * Draws body angle indicators and axes
     * @private
     * @method bodyAxes
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyAxes = function(render, bodies, context) {
        var c = context,
            engine = render.engine,
            options = render.options,
            part,
            i,
            j,
            k;

        c.beginPath();

        for (i = 0; i < bodies.length; i++) {
            var body = bodies[i],
                parts = body.parts;

            if (!body.render.visible)
                continue;

            if (options.showAxes) {
                // render all axes
                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    part = parts[j];
                    for (k = 0; k < part.axes.length; k++) {
                        var axis = part.axes[k];
                        c.moveTo(part.position.x, part.position.y);
                        c.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
                    }
                }
            } else {
                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    part = parts[j];
                    for (k = 0; k < part.axes.length; k++) {
                        // render a single axis indicator
                        c.moveTo(part.position.x, part.position.y);
                        c.lineTo((part.vertices[0].x + part.vertices[part.vertices.length-1].x) / 2,
                                 (part.vertices[0].y + part.vertices[part.vertices.length-1].y) / 2);
                    }
                }
            }
        }

        if (options.wireframes) {
            c.strokeStyle = 'indianred';
            c.lineWidth = 1;
        } else {
            c.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            c.globalCompositeOperation = 'overlay';
            c.lineWidth = 2;
        }

        c.stroke();
        c.globalCompositeOperation = 'source-over';
    };

    /**
     * Draws body positions
     * @private
     * @method bodyPositions
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyPositions = function(render, bodies, context) {
        var c = context,
            engine = render.engine,
            options = render.options,
            body,
            part,
            i,
            k;

        c.beginPath();

        // render current positions
        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];

            if (!body.render.visible)
                continue;

            // handle compound parts
            for (k = 0; k < body.parts.length; k++) {
                part = body.parts[k];
                c.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
                c.closePath();
            }
        }

        if (options.wireframes) {
            c.fillStyle = 'indianred';
        } else {
            c.fillStyle = 'rgba(0,0,0,0.5)';
        }
        c.fill();

        c.beginPath();

        // render previous positions
        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];
            if (body.render.visible) {
                c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
                c.closePath();
            }
        }

        c.fillStyle = 'rgba(255,165,0,0.8)';
        c.fill();
    };

    /**
     * Draws body velocity
     * @private
     * @method bodyVelocity
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyVelocity = function(render, bodies, context) {
        var c = context;

        c.beginPath();

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (!body.render.visible)
                continue;

            c.moveTo(body.position.x, body.position.y);
            c.lineTo(body.position.x + (body.position.x - body.positionPrev.x) * 2, body.position.y + (body.position.y - body.positionPrev.y) * 2);
        }

        c.lineWidth = 3;
        c.strokeStyle = 'cornflowerblue';
        c.stroke();
    };

    /**
     * Draws body ids
     * @private
     * @method bodyIds
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    Render.bodyIds = function(render, bodies, context) {
        var c = context,
            i,
            j;

        for (i = 0; i < bodies.length; i++) {
            if (!bodies[i].render.visible)
                continue;

            var parts = bodies[i].parts;
            for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                var part = parts[j];
                c.font = "12px Arial";
                c.fillStyle = 'rgba(255,255,255,0.5)';
                c.fillText(part.id, part.position.x + 10, part.position.y - 10);
            }
        }
    };

    /**
     * Description
     * @private
     * @method collisions
     * @param {render} render
     * @param {pair[]} pairs
     * @param {RenderingContext} context
     */
    Render.collisions = function(render, pairs, context) {
        var c = context,
            options = render.options,
            pair,
            collision,
            corrected,
            bodyA,
            bodyB,
            i,
            j;

        c.beginPath();

        // render collision positions
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];

            if (!pair.isActive)
                continue;

            collision = pair.collision;
            for (j = 0; j < pair.activeContacts.length; j++) {
                var contact = pair.activeContacts[j],
                    vertex = contact.vertex;
                c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
            }
        }

        if (options.wireframes) {
            c.fillStyle = 'rgba(255,255,255,0.7)';
        } else {
            c.fillStyle = 'orange';
        }
        c.fill();

        c.beginPath();

        // render collision normals
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];

            if (!pair.isActive)
                continue;

            collision = pair.collision;

            if (pair.activeContacts.length > 0) {
                var normalPosX = pair.activeContacts[0].vertex.x,
                    normalPosY = pair.activeContacts[0].vertex.y;

                if (pair.activeContacts.length === 2) {
                    normalPosX = (pair.activeContacts[0].vertex.x + pair.activeContacts[1].vertex.x) / 2;
                    normalPosY = (pair.activeContacts[0].vertex.y + pair.activeContacts[1].vertex.y) / 2;
                }

                if (collision.bodyB === collision.supports[0].body || collision.bodyA.isStatic === true) {
                    c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
                } else {
                    c.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
                }

                c.lineTo(normalPosX, normalPosY);
            }
        }

        if (options.wireframes) {
            c.strokeStyle = 'rgba(255,165,0,0.7)';
        } else {
            c.strokeStyle = 'orange';
        }

        c.lineWidth = 1;
        c.stroke();
    };

    /**
     * Description
     * @private
     * @method separations
     * @param {render} render
     * @param {pair[]} pairs
     * @param {RenderingContext} context
     */
    Render.separations = function(render, pairs, context) {
        var c = context,
            options = render.options,
            pair,
            collision,
            corrected,
            bodyA,
            bodyB,
            i,
            j;

        c.beginPath();

        // render separations
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i];

            if (!pair.isActive)
                continue;

            collision = pair.collision;
            bodyA = collision.bodyA;
            bodyB = collision.bodyB;

            var k = 1;

            if (!bodyB.isStatic && !bodyA.isStatic) k = 0.5;
            if (bodyB.isStatic) k = 0;

            c.moveTo(bodyB.position.x, bodyB.position.y);
            c.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);

            k = 1;

            if (!bodyB.isStatic && !bodyA.isStatic) k = 0.5;
            if (bodyA.isStatic) k = 0;

            c.moveTo(bodyA.position.x, bodyA.position.y);
            c.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
        }

        if (options.wireframes) {
            c.strokeStyle = 'rgba(255,165,0,0.5)';
        } else {
            c.strokeStyle = 'orange';
        }
        c.stroke();
    };

    /**
     * Description
     * @private
     * @method grid
     * @param {render} render
     * @param {grid} grid
     * @param {RenderingContext} context
     */
    Render.grid = function(render, grid, context) {
        var c = context,
            options = render.options;

        if (options.wireframes) {
            c.strokeStyle = 'rgba(255,180,0,0.1)';
        } else {
            c.strokeStyle = 'rgba(255,180,0,0.5)';
        }

        c.beginPath();

        var bucketKeys = Common.keys(grid.buckets);

        for (var i = 0; i < bucketKeys.length; i++) {
            var bucketId = bucketKeys[i];

            if (grid.buckets[bucketId].length < 2)
                continue;

            var region = bucketId.split(/C|R/);
            c.rect(0.5 + parseInt(region[1], 10) * grid.bucketWidth,
                    0.5 + parseInt(region[2], 10) * grid.bucketHeight,
                    grid.bucketWidth,
                    grid.bucketHeight);
        }

        c.lineWidth = 1;
        c.stroke();
    };

    /**
     * Description
     * @private
     * @method inspector
     * @param {inspector} inspector
     * @param {RenderingContext} context
     */
    Render.inspector = function(inspector, context) {
        var engine = inspector.engine,
            selected = inspector.selected,
            render = inspector.render,
            options = render.options,
            bounds;

        if (options.hasBounds) {
            var boundsWidth = render.bounds.max.x - render.bounds.min.x,
                boundsHeight = render.bounds.max.y - render.bounds.min.y,
                boundsScaleX = boundsWidth / render.options.width,
                boundsScaleY = boundsHeight / render.options.height;

            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
            context.translate(-render.bounds.min.x, -render.bounds.min.y);
        }

        for (var i = 0; i < selected.length; i++) {
            var item = selected[i].data;

            context.translate(0.5, 0.5);
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(255,165,0,0.9)';
            context.setLineDash([1,2]);

            switch (item.type) {

            case 'body':

                // render body selections
                bounds = item.bounds;
                context.beginPath();
                context.rect(Math.floor(bounds.min.x - 3), Math.floor(bounds.min.y - 3),
                             Math.floor(bounds.max.x - bounds.min.x + 6), Math.floor(bounds.max.y - bounds.min.y + 6));
                context.closePath();
                context.stroke();

                break;

            case 'constraint':

                // render constraint selections
                var point = item.pointA;
                if (item.bodyA)
                    point = item.pointB;
                context.beginPath();
                context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                context.closePath();
                context.stroke();

                break;

            }

            context.setLineDash([]);
            context.translate(-0.5, -0.5);
        }

        // render selection region
        if (inspector.selectStart !== null) {
            context.translate(0.5, 0.5);
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(255,165,0,0.6)';
            context.fillStyle = 'rgba(255,165,0,0.1)';
            bounds = inspector.selectBounds;
            context.beginPath();
            context.rect(Math.floor(bounds.min.x), Math.floor(bounds.min.y),
                         Math.floor(bounds.max.x - bounds.min.x), Math.floor(bounds.max.y - bounds.min.y));
            context.closePath();
            context.stroke();
            context.fill();
            context.translate(-0.5, -0.5);
        }

        if (options.hasBounds)
            context.setTransform(1, 0, 0, 1, 0, 0);
    };

    /**
     * Description
     * @method _createCanvas
     * @private
     * @param {} width
     * @param {} height
     * @return canvas
     */
    var _createCanvas = function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.oncontextmenu = function() { return false; };
        canvas.onselectstart = function() { return false; };
        return canvas;
    };

    /**
     * Gets the pixel ratio of the canvas.
     * @method _getPixelRatio
     * @private
     * @param {HTMLElement} canvas
     * @return {Number} pixel ratio
     */
    var _getPixelRatio = function(canvas) {
        var context = canvas.getContext('2d'),
            devicePixelRatio = window.devicePixelRatio || 1,
            backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio
                                      || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio
                                      || context.backingStorePixelRatio || 1;

        return devicePixelRatio / backingStorePixelRatio;
    };

    /**
     * Gets the requested texture (an Image) via its path
     * @method _getTexture
     * @private
     * @param {render} render
     * @param {string} imagePath
     * @return {Image} texture
     */
    var _getTexture = function(render, imagePath) {
        var image = render.textures[imagePath];

        if (image)
            return image;

        image = render.textures[imagePath] = new Image();
        image.src = imagePath;

        return image;
    };

    /**
     * Applies the background to the canvas using CSS.
     * @method applyBackground
     * @private
     * @param {render} render
     * @param {string} background
     */
    var _applyBackground = function(render, background) {
        var cssBackground = background;

        if (/(jpg|gif|png)$/.test(background))
            cssBackground = 'url(' + background + ')';

        render.canvas.style.background = cssBackground;
        render.canvas.style.backgroundSize = "contain";
        render.currentBackground = background;
    };

    /*
    *
    *  Events Documentation
    *
    */

    /**
    * Fired before rendering
    *
    * @event beforeRender
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /**
    * Fired after rendering
    *
    * @event afterRender
    * @param {} event An event object
    * @param {number} event.timestamp The engine.timing.timestamp of the event
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

    /*
    *
    *  Properties Documentation
    *
    */

    /**
     * A back-reference to the `Matter.Render` module.
     *
     * @property controller
     * @type render
     */

    /**
     * A reference to the `Matter.Engine` instance to be used.
     *
     * @property engine
     * @type engine
     */

    /**
     * A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
     *
     * @property element
     * @type HTMLElement
     * @default null
     */

    /**
     * The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
     *
     * @property canvas
     * @type HTMLCanvasElement
     * @default null
     */

    /**
     * The configuration options of the renderer.
     *
     * @property options
     * @type {}
     */

    /**
     * The target width in pixels of the `render.canvas` to be created.
     *
     * @property options.width
     * @type number
     * @default 800
     */

    /**
     * The target height in pixels of the `render.canvas` to be created.
     *
     * @property options.height
     * @type number
     * @default 600
     */

    /**
     * A flag that specifies if `render.bounds` should be used when rendering.
     *
     * @property options.hasBounds
     * @type boolean
     * @default false
     */

    /**
     * A `Bounds` object that specifies the drawing view region.
     * Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
     * This allows for creating views that can pan or zoom around the scene.
     * You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
     *
     * @property bounds
     * @type bounds
     */

    /**
     * The 2d rendering context from the `render.canvas` element.
     *
     * @property context
     * @type CanvasRenderingContext2D
     */

    /**
     * The sprite texture cache.
     *
     * @property textures
     * @type {}
     */

})();

},{"../body/Composite":2,"../collision/Grid":6,"../core/Common":14,"../core/Events":16,"../core/Mouse":19,"../geometry/Bounds":26,"../geometry/Vector":28}],32:[function(_dereq_,module,exports){
/**
* The `Matter.RenderPixi` module is an example renderer using pixi.js.
* See also `Matter.Render` for a canvas based renderer.
*
* @class RenderPixi
* @deprecated the Matter.RenderPixi module will soon be removed from the Matter.js core.
* It will likely be moved to its own repository (but maintenance will be limited).
*/

var RenderPixi = {};

module.exports = RenderPixi;

var Bounds = _dereq_('../geometry/Bounds');
var Composite = _dereq_('../body/Composite');
var Common = _dereq_('../core/Common');
var Events = _dereq_('../core/Events');
var Vector = _dereq_('../geometry/Vector');

(function() {

    var _requestAnimationFrame,
        _cancelAnimationFrame;

    if (typeof window !== 'undefined') {
        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
                                      || window.mozRequestAnimationFrame || window.msRequestAnimationFrame 
                                      || function(callback){ window.setTimeout(function() { callback(Common.now()); }, 1000 / 60); };
   
        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
                                      || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
    }
    
    /**
     * Creates a new Pixi.js WebGL renderer
     * @method create
     * @param {object} options
     * @return {RenderPixi} A new renderer
     * @deprecated
     */
    RenderPixi.create = function(options) {
        Common.warn('RenderPixi.create: Matter.RenderPixi is deprecated (see docs)');

        var defaults = {
            controller: RenderPixi,
            engine: null,
            element: null,
            frameRequestId: null,
            canvas: null,
            renderer: null,
            container: null,
            spriteContainer: null,
            pixiOptions: null,
            options: {
                width: 800,
                height: 600,
                background: '#fafafa',
                wireframeBackground: '#222',
                hasBounds: false,
                enabled: true,
                wireframes: true,
                showSleeping: true,
                showDebug: false,
                showBroadphase: false,
                showBounds: false,
                showVelocity: false,
                showCollisions: false,
                showAxes: false,
                showPositions: false,
                showAngleIndicator: false,
                showIds: false,
                showShadows: false
            }
        };

        var render = Common.extend(defaults, options),
            transparent = !render.options.wireframes && render.options.background === 'transparent';

        // init pixi
        render.pixiOptions = render.pixiOptions || {
            view: render.canvas,
            transparent: transparent,
            antialias: true,
            backgroundColor: options.background
        };

        render.mouse = options.mouse;
        render.engine = options.engine;
        render.renderer = render.renderer || new PIXI.WebGLRenderer(render.options.width, render.options.height, render.pixiOptions);
        render.container = render.container || new PIXI.Container();
        render.spriteContainer = render.spriteContainer || new PIXI.Container();
        render.canvas = render.canvas || render.renderer.view;
        render.bounds = render.bounds || { 
            min: {
                x: 0,
                y: 0
            }, 
            max: { 
                x: render.options.width,
                y: render.options.height
            }
        };

        // event listeners
        Events.on(render.engine, 'beforeUpdate', function() {
            RenderPixi.clear(render);
        });

        // caches
        render.textures = {};
        render.sprites = {};
        render.primitives = {};

        // use a sprite batch for performance
        render.container.addChild(render.spriteContainer);

        // insert canvas
        if (Common.isElement(render.element)) {
            render.element.appendChild(render.canvas);
        } else {
            Common.warn('No "render.element" passed, "render.canvas" was not inserted into document.');
        }

        // prevent menus on canvas
        render.canvas.oncontextmenu = function() { return false; };
        render.canvas.onselectstart = function() { return false; };

        return render;
    };

    /**
     * Continuously updates the render canvas on the `requestAnimationFrame` event.
     * @method run
     * @param {render} render
     * @deprecated
     */
    RenderPixi.run = function(render) {
        (function loop(time){
            render.frameRequestId = _requestAnimationFrame(loop);
            RenderPixi.world(render);
        })();
    };

    /**
     * Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
     * @method stop
     * @param {render} render
     * @deprecated
     */
    RenderPixi.stop = function(render) {
        _cancelAnimationFrame(render.frameRequestId);
    };

    /**
     * Clears the scene graph
     * @method clear
     * @param {RenderPixi} render
     * @deprecated
     */
    RenderPixi.clear = function(render) {
        var container = render.container,
            spriteContainer = render.spriteContainer;

        // clear stage container
        while (container.children[0]) { 
            container.removeChild(container.children[0]); 
        }

        // clear sprite batch
        while (spriteContainer.children[0]) { 
            spriteContainer.removeChild(spriteContainer.children[0]); 
        }

        var bgSprite = render.sprites['bg-0'];

        // clear caches
        render.textures = {};
        render.sprites = {};
        render.primitives = {};

        // set background sprite
        render.sprites['bg-0'] = bgSprite;
        if (bgSprite)
            container.addChildAt(bgSprite, 0);

        // add sprite batch back into container
        render.container.addChild(render.spriteContainer);

        // reset background state
        render.currentBackground = null;

        // reset bounds transforms
        container.scale.set(1, 1);
        container.position.set(0, 0);
    };

    /**
     * Sets the background of the canvas 
     * @method setBackground
     * @param {RenderPixi} render
     * @param {string} background
     * @deprecated
     */
    RenderPixi.setBackground = function(render, background) {
        if (render.currentBackground !== background) {
            var isColor = background.indexOf && background.indexOf('#') !== -1,
                bgSprite = render.sprites['bg-0'];

            if (isColor) {
                // if solid background color
                var color = Common.colorToNumber(background);
                render.renderer.backgroundColor = color;

                // remove background sprite if existing
                if (bgSprite)
                    render.container.removeChild(bgSprite); 
            } else {
                // initialise background sprite if needed
                if (!bgSprite) {
                    var texture = _getTexture(render, background);

                    bgSprite = render.sprites['bg-0'] = new PIXI.Sprite(texture);
                    bgSprite.position.x = 0;
                    bgSprite.position.y = 0;
                    render.container.addChildAt(bgSprite, 0);
                }
            }

            render.currentBackground = background;
        }
    };

    /**
     * Description
     * @method world
     * @param {engine} engine
     * @deprecated
     */
    RenderPixi.world = function(render) {
        var engine = render.engine,
            world = engine.world,
            renderer = render.renderer,
            container = render.container,
            options = render.options,
            bodies = Composite.allBodies(world),
            allConstraints = Composite.allConstraints(world),
            constraints = [],
            i;

        if (options.wireframes) {
            RenderPixi.setBackground(render, options.wireframeBackground);
        } else {
            RenderPixi.setBackground(render, options.background);
        }

        // handle bounds
        var boundsWidth = render.bounds.max.x - render.bounds.min.x,
            boundsHeight = render.bounds.max.y - render.bounds.min.y,
            boundsScaleX = boundsWidth / render.options.width,
            boundsScaleY = boundsHeight / render.options.height;

        if (options.hasBounds) {
            // Hide bodies that are not in view
            for (i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                body.render.sprite.visible = Bounds.overlaps(body.bounds, render.bounds);
            }

            // filter out constraints that are not in view
            for (i = 0; i < allConstraints.length; i++) {
                var constraint = allConstraints[i],
                    bodyA = constraint.bodyA,
                    bodyB = constraint.bodyB,
                    pointAWorld = constraint.pointA,
                    pointBWorld = constraint.pointB;

                if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
                if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

                if (!pointAWorld || !pointBWorld)
                    continue;

                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
                    constraints.push(constraint);
            }

            // transform the view
            container.scale.set(1 / boundsScaleX, 1 / boundsScaleY);
            container.position.set(-render.bounds.min.x * (1 / boundsScaleX), -render.bounds.min.y * (1 / boundsScaleY));
        } else {
            constraints = allConstraints;
        }

        for (i = 0; i < bodies.length; i++)
            RenderPixi.body(render, bodies[i]);

        for (i = 0; i < constraints.length; i++)
            RenderPixi.constraint(render, constraints[i]);

        renderer.render(container);
    };


    /**
     * Description
     * @method constraint
     * @param {engine} engine
     * @param {constraint} constraint
     * @deprecated
     */
    RenderPixi.constraint = function(render, constraint) {
        var engine = render.engine,
            bodyA = constraint.bodyA,
            bodyB = constraint.bodyB,
            pointA = constraint.pointA,
            pointB = constraint.pointB,
            container = render.container,
            constraintRender = constraint.render,
            primitiveId = 'c-' + constraint.id,
            primitive = render.primitives[primitiveId];

        // initialise constraint primitive if not existing
        if (!primitive)
            primitive = render.primitives[primitiveId] = new PIXI.Graphics();

        // don't render if constraint does not have two end points
        if (!constraintRender.visible || !constraint.pointA || !constraint.pointB) {
            primitive.clear();
            return;
        }

        // add to scene graph if not already there
        if (Common.indexOf(container.children, primitive) === -1)
            container.addChild(primitive);

        // render the constraint on every update, since they can change dynamically
        primitive.clear();
        primitive.beginFill(0, 0);
        primitive.lineStyle(constraintRender.lineWidth, Common.colorToNumber(constraintRender.strokeStyle), 1);
        
        if (bodyA) {
            primitive.moveTo(bodyA.position.x + pointA.x, bodyA.position.y + pointA.y);
        } else {
            primitive.moveTo(pointA.x, pointA.y);
        }

        if (bodyB) {
            primitive.lineTo(bodyB.position.x + pointB.x, bodyB.position.y + pointB.y);
        } else {
            primitive.lineTo(pointB.x, pointB.y);
        }

        primitive.endFill();
    };
    
    /**
     * Description
     * @method body
     * @param {engine} engine
     * @param {body} body
     * @deprecated
     */
    RenderPixi.body = function(render, body) {
        var engine = render.engine,
            bodyRender = body.render;

        if (!bodyRender.visible)
            return;

        if (bodyRender.sprite && bodyRender.sprite.texture) {
            var spriteId = 'b-' + body.id,
                sprite = render.sprites[spriteId],
                spriteContainer = render.spriteContainer;

            // initialise body sprite if not existing
            if (!sprite)
                sprite = render.sprites[spriteId] = _createBodySprite(render, body);

            // add to scene graph if not already there
            if (Common.indexOf(spriteContainer.children, sprite) === -1)
                spriteContainer.addChild(sprite);

            // update body sprite
            sprite.position.x = body.position.x;
            sprite.position.y = body.position.y;
            sprite.rotation = body.angle;
            sprite.scale.x = bodyRender.sprite.xScale || 1;
            sprite.scale.y = bodyRender.sprite.yScale || 1;
        } else {
            var primitiveId = 'b-' + body.id,
                primitive = render.primitives[primitiveId],
                container = render.container;

            // initialise body primitive if not existing
            if (!primitive) {
                primitive = render.primitives[primitiveId] = _createBodyPrimitive(render, body);
                primitive.initialAngle = body.angle;
            }

            // add to scene graph if not already there
            if (Common.indexOf(container.children, primitive) === -1)
                container.addChild(primitive);

            // update body primitive
            primitive.position.x = body.position.x;
            primitive.position.y = body.position.y;
            primitive.rotation = body.angle - primitive.initialAngle;
        }
    };

    /**
     * Creates a body sprite
     * @method _createBodySprite
     * @private
     * @param {RenderPixi} render
     * @param {body} body
     * @return {PIXI.Sprite} sprite
     * @deprecated
     */
    var _createBodySprite = function(render, body) {
        var bodyRender = body.render,
            texturePath = bodyRender.sprite.texture,
            texture = _getTexture(render, texturePath),
            sprite = new PIXI.Sprite(texture);

        sprite.anchor.x = body.render.sprite.xOffset;
        sprite.anchor.y = body.render.sprite.yOffset;

        return sprite;
    };

    /**
     * Creates a body primitive
     * @method _createBodyPrimitive
     * @private
     * @param {RenderPixi} render
     * @param {body} body
     * @return {PIXI.Graphics} graphics
     * @deprecated
     */
    var _createBodyPrimitive = function(render, body) {
        var bodyRender = body.render,
            options = render.options,
            primitive = new PIXI.Graphics(),
            fillStyle = Common.colorToNumber(bodyRender.fillStyle),
            strokeStyle = Common.colorToNumber(bodyRender.strokeStyle),
            strokeStyleIndicator = Common.colorToNumber(bodyRender.strokeStyle),
            strokeStyleWireframe = Common.colorToNumber('#bbb'),
            strokeStyleWireframeIndicator = Common.colorToNumber('#CD5C5C'),
            part;

        primitive.clear();

        // handle compound parts
        for (var k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
            part = body.parts[k];

            if (!options.wireframes) {
                primitive.beginFill(fillStyle, 1);
                primitive.lineStyle(bodyRender.lineWidth, strokeStyle, 1);
            } else {
                primitive.beginFill(0, 0);
                primitive.lineStyle(1, strokeStyleWireframe, 1);
            }

            primitive.moveTo(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);

            for (var j = 1; j < part.vertices.length; j++) {
                primitive.lineTo(part.vertices[j].x - body.position.x, part.vertices[j].y - body.position.y);
            }

            primitive.lineTo(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);

            primitive.endFill();

            // angle indicator
            if (options.showAngleIndicator || options.showAxes) {
                primitive.beginFill(0, 0);

                if (options.wireframes) {
                    primitive.lineStyle(1, strokeStyleWireframeIndicator, 1);
                } else {
                    primitive.lineStyle(1, strokeStyleIndicator);
                }

                primitive.moveTo(part.position.x - body.position.x, part.position.y - body.position.y);
                primitive.lineTo(((part.vertices[0].x + part.vertices[part.vertices.length-1].x) / 2 - body.position.x), 
                                 ((part.vertices[0].y + part.vertices[part.vertices.length-1].y) / 2 - body.position.y));

                primitive.endFill();
            }
        }

        return primitive;
    };

    /**
     * Gets the requested texture (a PIXI.Texture) via its path
     * @method _getTexture
     * @private
     * @param {RenderPixi} render
     * @param {string} imagePath
     * @return {PIXI.Texture} texture
     * @deprecated
     */
    var _getTexture = function(render, imagePath) {
        var texture = render.textures[imagePath];

        if (!texture)
            texture = render.textures[imagePath] = PIXI.Texture.fromImage(imagePath);

        return texture;
    };

})();

},{"../body/Composite":2,"../core/Common":14,"../core/Events":16,"../geometry/Bounds":26,"../geometry/Vector":28}]},{},[30])(30)
});

},{}],"raycast_es6.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.raycast = raycast;

var _matterJs = require("matter-js");

var Matter = _interopRequireWildcard(_matterJs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

///
///				code by Isaiah Smith
///		technostalgic.itch.io  |  @technostalgicGM
///
///						repo:
///	https://github.com/Technostalgic/MatterJS_Raycast.git
///
//raycast functionality integrated with matter.js since there 
//is no built-in method for raycasting that returns the ray's
//intersection points
//function 'raycast' - returns an array of 'raycol' objects
//param 'bodies' - bodies to check collision with; passed 
//	through 'Matter.Query.ray()'
//param 'start' - start point of raycast
//param 'end' - end point of raycast
//param 'sort' - whether or not the ray collisions should be
//	sorted based on distance from the origin
function raycast(bodies, start, end, sort) {
    if (sort === void 0) {
        sort = true;
    }
    //convert the start & end parameters to my custom
    //'vec2' object type
    start = vec2.fromOther(start);
    end = vec2.fromOther(end);
    //The bodies that the raycast will be tested against
    //are queried and stored in the variable 'query'.
    //This uses the built-in raycast method which takes
    //advantage of the broad-phase collision optomizations
    //instead of iterating through each body in the list
    var query = Matter.Query.ray(bodies, start, end);
    //'cols': the array that will contain the ray 
    //collision information
    var cols = [];
    //'raytest': the ray object that will be tested for
    //collision against the bodies
    var raytest = new ray(start, end);
    //Next, since all the bodies that the ray collides with
    //have already been queried, we iterate through each
    //one to see where the ray intersects with the body
    //and gather other information
    for (var i = query.length - 1; i >= 0; i--) {
        var bcols = ray.bodyCollisions(raytest, query[i].body);
        for (var k = bcols.length - 1; k >= 0; k--) {
            cols.push(bcols[k]);
        }
    }
    //if desired, we then sort the collisions based on the
    //distance from the ray's start
    if (sort) cols.sort(function (a, b) {
        return a.point.distance(start) - b.point.distance(start);
    });
    return cols;
}
//data type that contains information about an intersection 
//between a ray and a body
var raycol = /** @class */function () {
    //initailizes a 'raycol' object with the given data
    //param 'body' - stores the body that the ray has 
    //	collided with
    //param 'point' - stores the collision point
    //param 'normal' - stores the normal of the edge that
    //	the ray collides with
    //param 'verts' - stores the vertices of the edge that
    //	the ray collides with
    function raycol(body, point, normal, verts) {
        this.body = body;
        this.point = point;
        this.normal = normal;
        this.verts = verts;
    }
    return raycol;
}();
//data type that contains information and methods for a 
//ray object
var ray = /** @class */function () {
    //initializes a ray instance with the given parameters
    //param 'start' - the starting point of the ray
    //param 'end' - the ending point of the ray
    function ray(start, end) {
        this.start = start;
        this.end = end;
    }
    ray.prototype.yValueAt = function (x) {
        //returns the y value on the ray at the specified x
        //slope-intercept form:
        //y = m * x + b
        return this.offsetY + this.slope * x;
    };
    ray.prototype.xValueAt = function (y) {
        //returns the x value on the ray at the specified y
        //slope-intercept form:
        //x = (y - b) / m
        return (y - this.offsetY) / this.slope;
    };
    ray.prototype.pointInBounds = function (point) {
        //checks to see if the specified point is within
        //the ray's bounding box (inclusive)
        var minX = Math.min(this.start.x, this.end.x);
        var maxX = Math.max(this.start.x, this.end.x);
        var minY = Math.min(this.start.y, this.end.y);
        var maxY = Math.max(this.start.y, this.end.y);
        return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    };
    ray.prototype.calculateNormal = function (ref) {
        //calulates the normal based on a specified
        //reference point
        var dif = this.difference;
        //gets the two possible normals as points that lie
        //perpendicular to the ray
        var norm1 = dif.normalized().rotate(Math.PI / 2);
        var norm2 = dif.normalized().rotate(Math.PI / -2);
        //returns the normal that is closer to the provided
        //reference point
        if (this.start.plus(norm1).distance(ref) < this.start.plus(norm2).distance(ref)) return norm1;
        return norm2;
    };
    Object.defineProperty(ray.prototype, "difference", {
        get: function get() {
            //pretty self explanitory
            return this.end.minus(this.start);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "slope", {
        get: function get() {
            var dif = this.difference;
            return dif.y / dif.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "offsetY", {
        get: function get() {
            //the y-offset at x = 0, in slope-intercept form:
            //b = y - m * x
            //offsetY = start.y - slope * start.x
            return this.start.y - this.slope * this.start.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "isHorizontal", {
        get: function get() {
            return compareNum(this.start.y, this.end.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ray.prototype, "isVertical", {
        get: function get() {
            return compareNum(this.start.x, this.end.x);
        },
        enumerable: true,
        configurable: true
    });
    ray.intersect = function (rayA, rayB) {
        //returns the intersection point between two rays
        //null if no intersection
        //conditional checks for axis aligned rays
        if (rayA.isVertical && rayB.isVertical) return null;
        if (rayA.isVertical) return new vec2(rayA.start.x, rayB.yValueAt(rayA.start.x));
        if (rayB.isVertical) return new vec2(rayB.start.x, rayA.yValueAt(rayB.start.x));
        if (compareNum(rayA.slope, rayB.slope)) return null;
        if (rayA.isHorizontal) return new vec2(rayB.xValueAt(rayA.start.y), rayA.start.y);
        if (rayB.isHorizontal) return new vec2(rayA.xValueAt(rayB.start.y), rayB.start.y);
        //slope intercept form:
        //y1 = m2 * x + b2; where y1 = m1 * x + b1:
        //m1 * x + b1 = m2 * x + b2:
        //x = (b2 - b1) / (m1 - m2)
        var x = (rayB.offsetY - rayA.offsetY) / (rayA.slope - rayB.slope);
        return new vec2(x, rayA.yValueAt(x));
    };
    ray.collisionPoint = function (rayA, rayB) {
        //returns the collision point of two rays
        //null if no collision
        var intersection = ray.intersect(rayA, rayB);
        if (!intersection) return null;
        if (!rayA.pointInBounds(intersection)) return null;
        if (!rayB.pointInBounds(intersection)) return null;
        return intersection;
    };
    ray.bodyEdges = function (body) {
        //returns all of the edges of a body in the
        //form of an array of ray objects
        var r = [];
        for (var i = body.parts.length - 1; i >= 0; i--) {
            for (var k = body.parts[i].vertices.length - 1; k >= 0; k--) {
                var k2 = k + 1;
                if (k2 >= body.parts[i].vertices.length) k2 = 0;
                var tray = new ray(vec2.fromOther(body.parts[i].vertices[k]), vec2.fromOther(body.parts[i].vertices[k2]));
                //stores the vertices inside the edge
                //ray for future reference
                tray.verts = [body.parts[i].vertices[k], body.parts[i].vertices[k2]];
                r.push(tray);
            }
        }
        return r;
    };
    ray.bodyCollisions = function (rayA, body) {
        //returns all the collisions between a specified ray
        //and body in the form of an array of 'raycol' objects
        var r = [];
        //gets the edge rays from the body
        var edges = ray.bodyEdges(body);
        //iterates through each edge and tests for collision
        //with 'rayA'
        for (var i = edges.length - 1; i >= 0; i--) {
            //gets the collision point
            var colpoint = ray.collisionPoint(rayA, edges[i]);
            //if there is no collision, then go to next edge
            if (!colpoint) continue;
            //calculates the edge's normal
            var normal = edges[i].calculateNormal(rayA.start);
            //adds the ray collision to the return array
            r.push(new raycol(body, colpoint, normal, edges[i].verts));
        }
        return r;
    };
    return ray;
}();
//in order to avoid miscalculations due to floating point
//errors
//example:
//	var m = 6; m -= 1; m -= 3; m += 4
//	now 'm' probably equals 6.0000000008361 or something stupid
function compareNum(a, b, leniency) {
    if (leniency === void 0) {
        leniency = 0.00001;
    }
    return Math.abs(b - a) <= leniency;
}
//
//included external dependencies:
//
//2d vector data type; contains information and methods for
//2-dimensional vectors
var vec2 = /** @class */function () {
    //initailizes a 'vec2' object with specified values
    function vec2(x, y) {
        if (x === void 0) {
            x = 0;
        }
        if (y === void 0) {
            y = x;
        }
        this.x = x;
        this.y = y;
    }
    vec2.prototype.normalized = function (magnitude) {
        if (magnitude === void 0) {
            magnitude = 1;
        }
        //returns a vector 2 with the same direction as this but
        //with a specified magnitude
        return this.multiply(magnitude / this.distance());
    };
    Object.defineProperty(vec2.prototype, "inverted", {
        get: function get() {
            //returns the opposite of this vector
            return this.multiply(-1);
        },
        enumerable: true,
        configurable: true
    });
    vec2.prototype.multiply = function (factor) {
        //returns this multiplied by a specified factor    
        return new vec2(this.x * factor, this.y * factor);
    };
    vec2.prototype.plus = function (vec) {
        //returns the result of this added to another
        //specified 'vec2' object
        return new vec2(this.x + vec.x, this.y + vec.y);
    };
    vec2.prototype.minus = function (vec) {
        //returns the result of this subtracted by another
        //specified 'vec2' object
        return this.plus(vec.inverted);
    };
    vec2.prototype.rotate = function (rot) {
        //rotates the vector by the specified angle
        var ang = this.direction;
        var mag = this.distance();
        ang += rot;
        return vec2.fromAng(ang, mag);
    };
    vec2.prototype.toPhysVector = function () {
        //converts this to a vector compatible with the
        //matter.js physics engine
        return Matter.Vector.create(this.x, this.y);
    };
    Object.defineProperty(vec2.prototype, "direction", {
        get: function get() {
            //returns the angle this vector is pointing in radians
            return Math.atan2(this.y, this.x);
        },
        enumerable: true,
        configurable: true
    });
    vec2.prototype.distance = function (vec) {
        if (vec === void 0) {
            vec = new vec2();
        }
        //returns the distance between this and a specified
        //'vec2' object
        var d = Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
        return d;
    };
    vec2.prototype.clone = function () {
        //returns a new instance of a 'vec2' object with the
        //same value
        return new vec2(this.x, this.y);
    };
    vec2.fromAng = function (angle, magnitude) {
        if (magnitude === void 0) {
            magnitude = 1;
        }
        //returns a vector which points in the specified angle
        //and has the specified magnitude
        return new vec2(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
    };
    vec2.fromOther = function (vector) {
        //converts other data types that contain 'x' and 'y'
        //properties to a 'vec2' object type
        return new vec2(vector.x, vector.y);
    };
    vec2.prototype.toString = function () {
        return "vector<" + this.x + ", " + this.y + ">";
    };
    return vec2;
}();
},{"matter-js":"../node_modules/matter-js/build/matter.js"}],"RobotEnvironment.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ultrasonicDistance = undefined;

var _matterJs = require("matter-js");

var _index = require("./index.ts");

var _raycast_es = require("./raycast_es6");

var ultrasonicDistance = exports.ultrasonicDistance = 400;
var myCanvas = document.getElementById('world');
var engine = _matterJs.Engine.create();
engine.world.gravity.y = 0;
var render = _matterJs.Render.create({
    canvas: myCanvas,
    engine: engine,
    options: {
        width: 800,
        height: 800,
        wireframes: false
    }
});
var topWall = _matterJs.Bodies.rectangle(300, 50, 500, 20, { isStatic: true });
topWall.label = "topwall";
var rightWall = _matterJs.Bodies.rectangle(750, 450, 20, 720, { isStatic: true });
rightWall.label = "rightwall";
var wheel1 = _matterJs.Bodies.rectangle(40, 232, 20, 6);
var robotBody = _matterJs.Bodies.rectangle(50, 250, 50, 30);
var wheel2 = _matterJs.Bodies.rectangle(40, 268, 20, 5);
var sensor2 = createPartCircle(65, 108, 50, 200, -0, {}); //, {chamfer: { radius: [0, 100, 0] }});
_matterJs.Body.setAngle(sensor2, -3 * Math.PI / 8);
sensor2.isSensor = true;
sensor2.render.opacity = 0.2;
_matterJs.Body.setMass(sensor2, 0);
_matterJs.Body.setInertia(sensor2, 0);
sensor2.area = 0;
var robot = _matterJs.Body.create({ parts: [wheel1, robotBody, wheel2, sensor2] });
_matterJs.Body.setAngle(robot, 1.7);
var sensor = _matterJs.Bodies.rectangle(400, 200, 150, 150, {
    chamfer: { radius: [140, 0, 20, 0] }
});
_matterJs.Body.setAngle(sensor, 0.785398);
_matterJs.Body.setMass(robot, 1000);
robot.friction = 0.9;
robot.frictionAir = 0.5;
_matterJs.Body.setPosition(robot, { x: 200, y: 400 });
//add obstacle
var obstacle = _matterJs.Bodies.circle(500, 500, 50);
_matterJs.Body.setMass(obstacle, 100000000); //make it very heavy
_matterJs.World.add(engine.world, [topWall, rightWall, robot, obstacle]);
var obstacles = [topWall, rightWall, obstacle];
_matterJs.Engine.run(engine);
_matterJs.Render.run(render);
_matterJs.Events.on(engine, "afterUpdate", function (event) {
    //console.log(robot.mass);
    var multiplier = 0.001;
    var angle = robot.angle;
    var x = robot.position.x;
    var y = robot.position.y;
    //get center position wrt axis of the robot
    var xprime = x * Math.cos(angle) + y * Math.sin(angle);
    var yprime = -x * Math.sin(angle) + y * Math.cos(angle);
    //get value of xprime - w and yprime += h in game axis
    var w = 0;
    var h = 20;
    var leftx = (xprime - w) * Math.cos(angle) - (yprime - h) * Math.sin(angle);
    var lefty = (yprime - h) * Math.cos(angle) + (xprime - w) * Math.sin(angle);
    var rightx = (xprime - w) * Math.cos(angle) - (yprime + h) * Math.sin(angle);
    var righty = (yprime + h) * Math.cos(angle) + (xprime - w) * Math.sin(angle);
    var leftWheelForce = { x: Math.cos(angle) * multiplier * _index.leftMotorSpeed * leftx, y: Math.sin(angle) * multiplier * _index.leftMotorSpeed * lefty };
    var rightWheelForce = { x: Math.cos(angle) * multiplier * _index.rightMotorSpeed * rightx, y: Math.sin(angle) * multiplier * _index.rightMotorSpeed * righty };
    _matterJs.Body.applyForce(robot, { x: leftx, y: lefty }, leftWheelForce);
    _matterJs.Body.applyForce(robot, { x: rightx, y: righty }, rightWheelForce);
    /* if (event.timestamp % 5000 < 50)
         console.log(robot.position)*/
});
// add mouse control
var mouse = _matterJs.Mouse.create(render.canvas),
    mouseConstraint = _matterJs.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
_matterJs.World.add(engine.world, mouseConstraint);
// keep the mouse in sync with rendering
render.mouse = mouse;
render.options.showCollisions = true;
render.options.showSeparations = true;
_matterJs.Events.on(engine, 'collisionActive', function (event) {
    var sensorStartingPoint = getTranformedPointOfBody(robot, 15, -10);
    var startingAngle = robot.angle - Math.PI / 2 + Math.PI / 8;
    exports.ultrasonicDistance = ultrasonicDistance = findMinimumDistanceToObstacle(sensorStartingPoint, startingAngle, 200, obstacles);
});
_matterJs.Events.on(engine, 'collisionEnd', function (event) {
    exports.ultrasonicDistance = ultrasonicDistance = 400;
});
var resetCarButton = document.querySelector('#reset-car');
resetCarButton.addEventListener('click', function () {
    _matterJs.Body.setPosition(robot, { x: 200, y: 200 });
    _matterJs.Body.setAngle(robot, 0);
});
function getTranformedPointOfBody(body, offsetx, offsety) {
    var angle = body.angle;
    var x = body.position.x;
    var y = body.position.y;
    //get center position wrt axis of the robot
    var xprime = x * Math.cos(angle) + y * Math.sin(angle);
    var yprime = -x * Math.sin(angle) + y * Math.cos(angle);
    //get value of xprime - w and yprime += h in game axis
    var w = offsetx;
    var h = offsety;
    return {
        x: (xprime + w) * Math.cos(angle) - (yprime + h) * Math.sin(angle),
        y: (yprime + h) * Math.cos(angle) + (xprime + w) * Math.sin(angle)
    };
}
function getTranformedPoint(position, angle, offsetx, offsety) {
    var x = position.x;
    var y = position.y;
    //get center position wrt axis of the robot
    var xprime = x * Math.cos(angle) + y * Math.sin(angle);
    var yprime = -x * Math.sin(angle) + y * Math.cos(angle);
    //get value of xprime - w and yprime += h in game axis
    var w = offsetx;
    var h = offsety;
    return {
        x: (xprime + w) * Math.cos(angle) - (yprime + h) * Math.sin(angle),
        y: (yprime + h) * Math.cos(angle) + (xprime + w) * Math.sin(angle)
    };
}
function commonExtend(obj, deep) {
    var argsStart, args, deepClone;
    if (typeof deep === 'boolean') {
        argsStart = 2;
        deepClone = deep;
    } else {
        argsStart = 1;
        deepClone = true;
    }
    for (var i = argsStart; i < arguments.length; i++) {
        var source = arguments[i];
        if (source) {
            for (var prop in source) {
                if (deepClone && source[prop] && source[prop].constructor === Object) {
                    if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {};
                        commonExtend(obj[prop], deepClone, source[prop]);
                    } else {
                        obj[prop] = source[prop];
                    }
                } else {
                    obj[prop] = source[prop];
                }
            }
        }
    }
    return obj;
}
;
function createPartCircle(x, y, sides, radius, angleOffset, options) {
    options = options || {};
    var path = '';
    path += x.toFixed(3) + ' ' + y.toFixed(3) + ' ';
    var offset = -Math.PI / (4 * sides);
    for (var i = 0; i < sides; i += 1) {
        var angle = angleOffset + i * offset;
        var newPoint = getTranformedPoint({ x: x, y: y }, angle, radius, 0);
        path += newPoint.x.toFixed(3) + ' ' + newPoint.y.toFixed(3) + ' ';
    }
    var polygon = {
        label: 'Polygon Body',
        position: { x: x, y: y },
        vertices: _matterJs.Vertices.fromPath(path)
    };
    if (options.chamfer) {
        var chamfer = options.chamfer;
        polygon.vertices = _matterJs.Vertices.chamfer(polygon.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
        delete options.chamfer;
    }
    return _matterJs.Body.create(commonExtend({}, polygon, options));
}
;
function findMinimumDistanceToObstacle(startingPosition, startingAngle, radius, obstacles) {
    var minDistance = radius + 10000;
    var numberOfRays = 45;
    for (var i = 0; i < numberOfRays; i += 1) {
        var endPoint = getTranformedPoint(startingPosition, startingAngle - i * Math.PI / 180, 220, 0);
        //var newBody =  Bodies.circle(endPoint.x, endPoint.y, 5,{isSensor : true, label:"test"});
        //World.add(engine.world, [newBody]);
        var rays = (0, _raycast_es.raycast)(obstacles, startingPosition, endPoint, true);
        if (rays.length != 0) {
            var nearestPoint = rays[0].point;
            var distance = Math.sqrt((nearestPoint.x - startingPosition.x) * (nearestPoint.x - startingPosition.x) + (nearestPoint.y - startingPosition.y) * (nearestPoint.y - startingPosition.y));
            if (distance < minDistance) minDistance = distance;
        }
    }
    return minDistance;
}
},{"matter-js":"../node_modules/matter-js/build/matter.js","./index.ts":"index.ts","./raycast_es6":"raycast_es6.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isrightMotorReverse = exports.rightMotorSpeed = exports.isleftMotorReverse = exports.leftMotorSpeed = undefined;

require("@wokwi/elements");

var _compile = require("./compile");

var _execute = require("./execute");

var _formatTime = require("./format-time");

require("./index.css");

var _cpuPerformance = require("./cpu-performance");

var _editorHistory = require("./utils/editor-history.util");

var _RobotEnvironment = require("./RobotEnvironment");

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = undefined && undefined.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var editor; // eslint-disable-line @typescript-eslint/no-explicit-any
var BLINK_CODE = "\nvoid setUpMotors()\n{\n  pinMode(8, OUTPUT);\n  pinMode(9, OUTPUT);\n  pinMode(11, OUTPUT);\n  pinMode(12, OUTPUT);\n}\nvoid setLeftWheelSpeed(int speed)\n{\n switch(speed)\n {\n   case 0: \n    digitalWrite(8, LOW);\n    digitalWrite(9, LOW);\n    break;\n   case 1:\n    digitalWrite(8, HIGH);\n    digitalWrite(9, LOW);\n    break;\n   case 2: \n    digitalWrite(8, LOW);\n    digitalWrite(9, HIGH);\n    break;\n   case 3:\n    digitalWrite(8, HIGH);\n    digitalWrite(9, HIGH);\n    break;\n   default:\n    digitalWrite(8, LOW);\n    digitalWrite(9, LOW);\n }\n}\nvoid setRightWheelSpeed(int speed)\n{\n switch(speed)\n {\n   case 0: \n    digitalWrite(11, LOW);\n    digitalWrite(12, LOW);\n    break;\n   case 1:\n    digitalWrite(11, HIGH);\n    digitalWrite(12, LOW);\n    break;\n   case 2: \n    digitalWrite(11, LOW);\n    digitalWrite(12, HIGH);\n    break;\n   case 3:\n    digitalWrite(11, HIGH);\n    digitalWrite(12, HIGH);\n    break;\n   default:\n    digitalWrite(11, LOW);\n    digitalWrite(12, LOW);\n }\n}\nvoid setup() {\n  Serial.begin(115200);\n  setUpMotors();\n\n}\nvoid loop() {\n  /*\n  //move forward slowly\n  setRightWheelSpeed(1);\n  setLeftWheelSpeed(1);\n  delay(5000);\n\n  //rotate right (left wheel on)\n  setRightWheelSpeed(0);\n  setLeftWheelSpeed(1);\n  delay(5000);\n  */\n  int value = analogRead(A0);\n  Serial.println(value);\n  delay(5000);\n  \n}".trim();
window.require.config({
    paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }
});
window.require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.querySelector('.code-editor'), {
        value: _editorHistory.EditorHistoryUtil.getValue() || BLINK_CODE,
        language: 'cpp',
        minimap: { enabled: false }
    });
});
// set up motor states
var leftMotorSpeed = exports.leftMotorSpeed = 0;
var isleftMotorReverse = exports.isleftMotorReverse = false;
var rightMotorSpeed = exports.rightMotorSpeed = 0;
var isrightMotorReverse = exports.isrightMotorReverse = false;
// Set up toolbar
var runner;
/* eslint-disable @typescript-eslint/no-use-before-define */
var runButton = document.querySelector('#run-button');
runButton.addEventListener('click', compileAndRun);
var stopButton = document.querySelector('#stop-button');
stopButton.addEventListener('click', stopCode);
var revertButton = document.querySelector('#revert-button');
revertButton.addEventListener('click', setBlinkSnippet);
var statusLabel = document.querySelector('#status-label');
var compilerOutputText = document.querySelector('#compiler-output-text');
var serialOutputText = document.querySelector('#serial-output-text');
function executeProgram(hex) {
    runner = new _execute.AVRRunner(hex);
    var MHZ = 16000000;
    // Hook to PORTB Pins 8 to 13
    runner.portB.addListener(function (value) {
        exports.leftMotorSpeed = leftMotorSpeed = value & 0x03;
        exports.isleftMotorReverse = isleftMotorReverse = value & 0x04 ? true : false;
        exports.rightMotorSpeed = rightMotorSpeed = value >>> 3 & 0x03;
        exports.isrightMotorReverse = isrightMotorReverse = value >>> 3 & 0x04 ? true : false;
    });
    //update value of sensor to A0
    runner.cpu.writeHooks[0x7a] = function (value) {
        if (value & 1 << 6) {
            runner.cpu.data[0x7a] = value & ~(1 << 6); // clear bit - conversion done
            var analogValue = _RobotEnvironment.ultrasonicDistance;
            runner.cpu.data[0x78] = analogValue & 0xff;
            runner.cpu.data[0x79] = analogValue >> 8 & 0x3;
            return true; // don't update
        }
    };
    runner.usart.onByteTransmit = function (value) {
        serialOutputText.textContent += String.fromCharCode(value);
    };
    var cpuPerf = new _cpuPerformance.CPUPerformance(runner.cpu, MHZ);
    runner.execute(function (cpu) {
        var time = (0, _formatTime.formatTime)(cpu.cycles / MHZ);
        var speed = (cpuPerf.update() * 100).toFixed(0);
        statusLabel.textContent = "Simulation time: " + time + " (" + speed + "%)";
    });
}
function compileAndRun() {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storeUserSnippet();
                    runButton.setAttribute('disabled', '1');
                    revertButton.setAttribute('disabled', '1');
                    serialOutputText.textContent = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    statusLabel.textContent = 'Compiling...';
                    return [4 /*yield*/, (0, _compile.buildHex)(editor.getModel().getValue())];
                case 2:
                    result = _a.sent();
                    compilerOutputText.textContent = result.stderr || result.stdout;
                    if (result.hex) {
                        compilerOutputText.textContent += '\nProgram running...';
                        stopButton.removeAttribute('disabled');
                        executeProgram(result.hex);
                    } else {
                        runButton.removeAttribute('disabled');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    runButton.removeAttribute('disabled');
                    revertButton.removeAttribute('disabled');
                    alert('Failed: ' + err_1);
                    return [3 /*break*/, 5];
                case 4:
                    statusLabel.textContent = '';
                    return [7 /*endfinally*/];
                case 5:
                    return [2 /*return*/];
            }
        });
    });
}
function storeUserSnippet() {
    _editorHistory.EditorHistoryUtil.clearSnippet();
    _editorHistory.EditorHistoryUtil.storeSnippet(editor.getValue());
}
function stopCode() {
    stopButton.setAttribute('disabled', '1');
    runButton.removeAttribute('disabled');
    revertButton.removeAttribute('disabled');
    if (runner) {
        runner.stop();
        runner = null;
        exports.leftMotorSpeed = leftMotorSpeed = 0;
        exports.rightMotorSpeed = rightMotorSpeed = 0;
    }
}
function setBlinkSnippet() {
    editor.setValue(BLINK_CODE);
    _editorHistory.EditorHistoryUtil.storeSnippet(editor.getValue());
}
},{"@wokwi/elements":"../node_modules/@wokwi/elements/dist/esm/index.js","./compile":"compile.ts","./execute":"execute.ts","./format-time":"format-time.ts","./index.css":"index.css","./cpu-performance":"cpu-performance.ts","./utils/editor-history.util":"utils/editor-history.util.ts","./RobotEnvironment":"RobotEnvironment.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '36563' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.0601a399.map