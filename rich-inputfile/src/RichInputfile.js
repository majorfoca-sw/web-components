import { html, LitElement } from 'lit';
import { RichInputfileStyles } from './rich-inputfile-styles.js';

export class RichInputfile extends LitElement {


  static get is() {
    return 'rich-inputfile';
  }

  static get properties() {
    return {
      name: {
        type: String
      },
      allowedExtensions: {
        type: Array, 
        attribute: 'allowed-extensions',
        converter(value) {
          return value.split(',');
        }
      },
      value: {
        type: String
      }, 
      file: {
        type: String
      },
      fileAllowed: {
        type: Boolean
      },
      fileWidth: {
        type: Number
      },
    };
  }

  static get styles() {
     return [RichInputfileStyles];
  }

  constructor() {
    super();
    this.id = `uploadFile-${Math.random().toString(36).substr(2, 9)}`;
    this.name = `name-${Math.random().toString(36).substr(2, 9)}`;
    this.deleteBtn = false;
    this.value = '';
    this.allowedExtensions = [];
    this.fileAllowed = false;
    this.fileWidth = 50;
    this._fileValueChange = this._fileValueChange.bind(this);
    this._deleteValue = this._deleteValue.bind(this);
  }

  firstUpdated() {
    this.sdomMsgLayer = this.shadowRoot.querySelector('#msg');
    const componentCreatedEvent = new CustomEvent('wc-ready', {
      detail: {
        id: this.id,
        componentName: this.tagName,
        component: this,
      },
    });
    document.dispatchEvent(componentCreatedEvent);
    this.main();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'value') {
        const typesRegExp = new RegExp(`(?:${this.allowedExtensions.join('|')})$`);
        this.fileAllowed = (this.value.search(typesRegExp) !== -1);
      }
    });
  }

  _deleteValue() {
    this.value = '';
    this.file = '';
    this.shadowRoot.querySelector('.bloque1 button').classList.add('invisible');
    this.shadowRoot.querySelector('#fileButton').value = '';
  }

  _fileValueChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.file = URL.createObjectURL(file);
      this.value = file.name;
      this.shadowRoot.querySelector('.bloque1 button').classList.remove('invisible');
    }
  }

  main() {
    const fileButton = this.shadowRoot.querySelector('#fileButton');
    this.shadowRoot.querySelector('.bloque1 button').addEventListener('click', this._deleteValue);
    fileButton.addEventListener('change', this._fileValueChange);
  }

  render() {
    const name = this.name.split('/').pop();
    const deleteBtnClass = (this.value !== '') ? '': 'invisible';
    const fileImg = (this.fileAllowed) ? html`<img src="${this.file}" alt="file ${name}" title="${this.value}" width="${this.fileWidth}">` : html`<div class='fakefile'><div></div></div>`;
    return html`
      <section class="wrapper">
        <div class="bloque1">
          <label>${name}</label>
          <div style="display:flex">
            <label for="fileButton">Selecciona un fichero
            <input type="file" value="upload" id="fileButton">
            </label>
            <button id="delete" class="${deleteBtnClass}">Delete</button>
          </div>
        </div>
        <div class="bloque2">
          ${(this.value !== '') ? fileImg : html``}
        </div>
      </section>
      <div id="filelink"></div>
      <div id="msg"></div>
    `;
  }
}
