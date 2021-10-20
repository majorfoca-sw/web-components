import { html, LitElement } from 'lit';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseAutoformStyles } from './firebase-autoform-style.js';

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
    this.groups = {};
    this.data = {};
    this.user = null;
    this.firebaseApp = null;

    this.container = null;

    this.fn = {
      string: this._createTextField.bind(this),
      number: this._createTextField.bind(this),
      date: this._createTextField.bind(this),
      boolean: this._createTextField.bind(this),
      model: this._createModelFields.bind(this)
    };
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._firebaseSignedin = this._firebaseSignedin.bind(this);
    document.addEventListener('firebase-signin', this._firebaseSignedin);
  }

  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    this.id = this.id || `firebase-autoform-${new Date().getTime()}`;
    this.container = this.shadowRoot.querySelector('.container');
  }

  _drawMultiple(bFieldMultiple, modelElementName, divLayer) {
    if (bFieldMultiple) {
      const addButton = this._createAddBtn(modelElementName);
      divLayer.appendChild(addButton);
    }
  }

  _createTextField(modelElementName, bFieldMultiple = false) {
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    label.innerHTML = modelElementName;
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', modelElementName);
    input.setAttribute('id', modelElementName);
    input.setAttribute('value', '');
    input.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
    const divLayer = document.createElement('div');
    divLayer.setAttribute('class', 'layer');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer);
    this.container.appendChild(divLayer);
  }

  _createSelectField(model, modelElementName, bFieldMultiple = false) {
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    label.innerHTML = modelElementName;
    const select = document.createElement('select');
    select.setAttribute('name', modelElementName);
    select.setAttribute('id', modelElementName);
    select.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
    const optionDefault = document.createElement('option');
    optionDefault.setAttribute('value', '');
    optionDefault.innerHTML = 'Selecciona una opción';
    select.appendChild(optionDefault);
    model.forEach((item) => {
      const option = document.createElement('option');
      option.setAttribute('value', item);
      option.innerHTML = item;
      select.appendChild(option);
    });
    const divLayer = document.createElement('div');
    divLayer.setAttribute('class', 'layer');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer);
    this.container.appendChild(divLayer);
  }

  _getFieldset(modelElementName) {
    const fieldsetName = (parseInt(modelElementName, 10) != modelElementName) ? modelElementName: `group_${modelElementName}`
    const fieldset = document.createElement('fieldset');
    fieldset.setAttribute('id', fieldsetName);
    fieldset.setAttribute('name', fieldsetName);
    // eslint-disable-next-line eqeqeq
    if (parseInt(modelElementName, 10) != modelElementName) {
      fieldset.innerHTML = `<legend>${modelElementName}</legend>`;
    }
    this.container.appendChild(fieldset);
    return fieldset;
  }

  _createAddBtn(modelElementName) {
    const modelElement = this.model[modelElementName];
    const addButton = document.createElement('button');
    addButton.innerHTML = 'Add';
    addButton.addEventListener('click', () => {
      // model.push({});
      console.log(modelElement);
    });
    return addButton;
  }

  _createModelFields(modelElementName, bFieldMultiple = false) {
    const model = this.model[modelElementName];
    const groups = this.groups[modelElementName] || [];
    if (model.constructor.name === "Array") {
      this._createSelectField(model, modelElementName, bFieldMultiple);
    } else {
      this.container = this._getFieldset(modelElementName);
      this._drawFormFieldsModel(model, groups, bFieldMultiple);
      this.container = this.container.parentNode;
    }
  }

  _getFirebaseModel() {
    return new Promise((resolve) => {
      const databaseModel = getDatabase(this.firebaseApp);
      const databaseRef = ref(databaseModel, `/__model__`);
      onValue(databaseRef,(snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  _getFirebaseGroups() {
    return new Promise((resolve) => {
      const databaseModel = getDatabase(this.firebaseApp);
      const databaseRef = ref(databaseModel, `/__groups__`);
      onValue(databaseRef,(snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  _getData() {
    return new Promise((resolve) => {
      const databaseModel = getDatabase(this.firebaseApp);
      const databaseRef = ref(databaseModel, this.path);
      onValue(databaseRef,(snapshot) => {
        resolve(snapshot.val());
      });
    });
  }
  
  _drawMainFieldGroups(group) {
    const groupKeys = Object.keys(group);
    groupKeys.forEach((groupKey) => {
      const fieldsetName = group[groupKey];
      console.log(groupKey, fieldsetName);
      const fieldset = this._getFieldset(groupKey);
      this.container.appendChild(fieldset);
    });
  }
  
  _drawFormFieldsModel(model, groups = [], _bFieldMultiple = false) {
    Object.keys(model).forEach((modelElementName) => {
      const fieldData = model[modelElementName].split('_');
      const fieldType = fieldData[0];
      const bFieldMultiple = (fieldData[1] === 'array') || (fieldData[1] !== undefined && _bFieldMultiple);
      // console.log(modelElementName, fieldType, bFieldMultiple);
      if (groups.constructor.name === "Object") {
        this.groupKeys = Object.keys(groups);
        this.groupKeys.forEach((groupKey) => {
          if (groups[groupKey].includes(modelElementName)) {
            const groupContainer = (parseInt(groupKey, 10) != groupKey) ? this.container.querySelector(`#${groupKey}`) : this.container.querySelector(`#group_${groupKey}`);
            this.container = groupContainer;
            this.fn[fieldType](modelElementName, bFieldMultiple);
            this.container = this.container.parentNode;
          }
        });
      } else {
        this.fn[fieldType](modelElementName, bFieldMultiple);
      }
    });
  }

  _drawForms() {
    this.container.innerHTML = '';
    const path = this.path.split('/')[1];
    const model = this.model[path];
    const groups = this.groups[path];
    this.pathName = path;
    this._drawMainFieldGroups(groups);
    this._drawFormFieldsModel(model, groups);
  }

  async _generateForm() {
    this.model = await this._getFirebaseModel();
    this.groups = await this._getFirebaseGroups();
    this.data = await this._getData();
    this._drawForms();
  }

  _firebaseSignedin(ev) {
    console.log(ev.detail);
    this.user = ev.detail.user;
    this.firebaseApp = document.getElementById(ev.detail.id).firebaseApp;
    this._generateForm();
  }

  save() {
    console.log(this.path, this.model);
    // const databaseModel = getDatabase(this.firebaseApp);
    // const databaseRef = ref(databaseModel, this.path);
    // databaseRef.set(this.model);
  }

  render() {
    return html`
      <form id="form-${this.id}">
        <div class="container 100%">
        </div>
      </form>
    `;
  }
}
