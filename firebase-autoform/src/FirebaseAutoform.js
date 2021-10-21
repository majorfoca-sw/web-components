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
      autoSave: { type: Boolean, attribute: 'auto-save' },
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
      text: this._createTextareaField.bind(this),
      number: this._createTextField.bind(this),
      date: this._createTextField.bind(this),
      boolean: this._createTextField.bind(this),
      model: this._createModelFields.bind(this),
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

  _createTextareaField(modelElementName, bFieldMultiple = false) {
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    label.innerHTML = modelElementName;
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control');
    textarea.setAttribute('name', modelElementName);
    textarea.setAttribute('id', modelElementName);
    textarea.setAttribute('rows', '5');
    textarea.setAttribute('placeholder', modelElementName);
    textarea.innerHTML = '';
    textarea.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(textarea);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer);
    this.container.appendChild(divLayer);
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
    input.classList.add('form-control');
    input.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
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
    select.classList.add('form-control');
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
    model.forEach(item => {
      const option = document.createElement('option');
      option.setAttribute('value', item);
      option.innerHTML = item;
      select.appendChild(option);
    });
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer);
    this.container.appendChild(divLayer);
  }

  _getFieldset(modelElementName) {
    const fieldsetName =
      parseInt(modelElementName, 10) !== modelElementName
        ? modelElementName
        : `group_${modelElementName}`;
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
    addButton.classList.add('btn', 'btn-primary');
    addButton.addEventListener('click', () => {
      // model.push({});
      // console.log(modelElement);
      this.kk = modelElement;
    });
    return addButton;
  }

  _createModelFields(modelElementName, bFieldMultiple = false) {
    const model = this.model[modelElementName];
    const groups = this.groups[modelElementName] || [];
    if (model.constructor.name === 'Array') {
      this._createSelectField(model, modelElementName, bFieldMultiple);
    } else {
      this.container = this._getFieldset(modelElementName);
      this._drawFormFieldsModel(model, groups, bFieldMultiple);
      this.container = this.container.parentNode;
    }
  }

  _getSchema() {
    return new Promise(resolve => {
      const databaseModel = getDatabase(this.firebaseApp);
      const databaseRef = ref(databaseModel, `/__schema__`);
      onValue(databaseRef, snapshot => {
        const schema = snapshot.val();
        this.model = schema.__model__;
        this.groups = schema.__groups__;
        this.info = schema.__info__;
        resolve();
      });
    });
  }

  _getData() {
    return new Promise(resolve => {
      const databaseModel = getDatabase(this.firebaseApp);
      const databaseRef = ref(databaseModel, this.path);
      onValue(databaseRef, snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  _drawMainFieldGroups(group) {
    this.groupKeys = [];
    this.groupsObj = {};
    group.forEach(item => {
      this.groupKeys.push(Object.keys(item)[0]);
      // eslint-disable-next-line prefer-destructuring
      this.groupsObj[Object.keys(item)[0]] = Object.values(item)[0];
    });
    this.groupKeys.forEach(groupKey => {
      // const fieldsetName = this.groupsObj[groupKey];
      // console.log(groupKey, fieldsetName);
      const fieldset = this._getFieldset(groupKey);
      this.container.appendChild(fieldset);
    });
  }

  _drawFormFieldsModel(model, groups = [], _bFieldMultiple = false) {
    Object.keys(model).forEach(modelElementName => {
      const fieldData = model[modelElementName].split('_');
      const fieldType = fieldData[0];
      const bFieldMultiple =
        fieldData[1] === 'array' ||
        (fieldData[1] !== undefined && _bFieldMultiple);
      // console.log(modelElementName, fieldType, bFieldMultiple);
      if (groups.constructor.name === 'Object') {
        const groupKeys = Object.keys(groups);
        groupKeys.forEach(groupKey => {
          if (groups[groupKey].includes(modelElementName)) {
            const groupContainer =
              parseInt(groupKey, 10) !== groupKey
                ? this.container.querySelector(`#${groupKey}`)
                : this.container.querySelector(`#group_${groupKey}`);
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
    this._drawFormFieldsModel(model, this.groupsObj);
  }

  async _generateForm() {
    await this._getSchema();
    this.data = await this._getData();
    this._drawForms();
  }

  _firebaseSignedin(ev) {
    // console.log(ev.detail);
    this.user = ev.detail.user;
    this.firebaseApp = document.getElementById(ev.detail.id).firebaseApp;
    this._generateForm();
  }

  save() {
    this.kk = 'kk';
    // console.log(this.path, this.model);
    // const databaseModel = getDatabase(this.firebaseApp);
    // const databaseRef = ref(databaseModel, this.path);
    // databaseRef.set(this.model);
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      />
      <form id="form-${this.id}" class="container 100%"></form>
    `;
  }
}
