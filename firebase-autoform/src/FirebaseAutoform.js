import { html, LitElement } from 'lit';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseAutoformStyles } from './firebase-autoformStyles-style.js';

export class FirebaseAutoform extends LitElement {
  static get styles() {
    return [firebaseAutoformStyles];
  }

  static get properties() {
    return {
      path: { type: String },
      showPath: { type: Boolean, attribute: 'show-path' },
      autoSave: { type: Boolean, attribute: 'auto-save' }
    };
  }

  constructor() {
    super();
    this.path = '/';
    this.showPath = false;
    this.autoSave = true;
    
    this.model = {};
    this.data = {};
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._generateForm = this._generateForm.bind(this);
  }

  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    this.id = this.id || `firebase-loginbutton-${new Date().getTime()}`;
    
    this._generateForm();
    document.addEventListener('firebase-sigin', this._generateForm);
  }

  _getFirebaseModel() {

  }

  _getData() {

  }

  async _generateForm(event) {
    if (global.EventsDispatched) {
      if (global.EventsDispatched['firebase-signin']) {
        await this._getFirebaseModel();    
        await this._getData();
        this._drawForms();
      }
    }
    
  }

  render() {
    return html`
      <form id="autoform"></form>
    `;
  }
}
