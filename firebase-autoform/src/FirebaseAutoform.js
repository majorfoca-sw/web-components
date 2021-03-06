import { html, LitElement } from 'lit';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ValidateForm } from 'automatic_form_validation';
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
    this.info = {};
    this.types = {};
    this.data = {};
    this.user = null;
    this.firebaseApp = null;

    this.container = null;

    this.fn = {
      string: this._createTextField.bind(this),
      password: this._createTextField.bind(this),
      text: this._createTextareaField.bind(this),
      number: this._createTextField.bind(this),
      date: this._createTextField.bind(this),
      boolean: this._createRadioButtonField.bind(this),
      model: this._createModelFields.bind(this),
    };

    this.htmlInputAttributes = ['maxlength', 'minlength', 'size', 'max', 'min', 'step', 'pattern', 'placeholder'];
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
    this.pathName = this.path.substring(1);
    this.id = this.id || `firebase-autoform-${new Date().getTime()}`;
    document.addEventListener('click', this._hideBocadillo.bind(this));
    this.container = this.shadowRoot.querySelector('.container');
    this._createBocadillo();
  }

  /** DRAW FIELDS FORM */
  _drawMainFieldGroups(groups) {
    this.groupKeys = [];
    this.groupsObj = {};
    if (groups) {
      groups.forEach(group => {
        this.groupKeys.push(Object.keys(group)[0]);
        // eslint-disable-next-line prefer-destructuring
        this.groupsObj[Object.keys(group)[0]] = Object.values(group)[0];
      });
      this.groupKeys.forEach(groupKey => {
        // const fieldsetName = this.groupsObj[groupKey];
        // console.log(groupKey, fieldsetName);
        const fieldset = this._getFieldset(groupKey);
        this.container.appendChild(fieldset);
      });
    }
  }

  _drawFormFieldsModel(model, groups = [], _bFieldMultiple = false) {
    const getAllGroupValues = (grps) => {
      let all = [];
      const arr = Object.values(grps);
      arr.reduce((acum, el)=>{
          all = [...all, ...el];
          return all;
      }, []);
      return all;
    };
    const allGroupValues = (groups.constructor.name === 'Object') ? getAllGroupValues(groups) : [];
    const groupKeys = Object.keys(groups);
    Object.keys(model).forEach(modelElementName => {
      const fieldData = model[modelElementName].split('_');
      const fieldType = fieldData[0];
      const bFieldMultiple =
        fieldData[1] === 'array' ||
        (fieldData[1] !== undefined && _bFieldMultiple);
      // console.log(modelElementName, fieldType, bFieldMultiple);

      if (!allGroupValues.includes(modelElementName)) {
        this.fn[fieldType](modelElementName, bFieldMultiple, fieldType);
      } else if (groupKeys.length > 0) {
        groupKeys.forEach(groupKey => {

          // ?????? COMO ORDENAR EL MODELO EN FUNCION DEL ORDEN DE LOS GRUPOS ???         
          // QUIZ??S AL RECUPERAR EL MODELO DE FIREBASE, ORDENARLO POR EL ORDEN DE LOS GRUPOS  ??.findIndex?

          if (groups[groupKey].includes(modelElementName)) {
            const groupContainer = Number.isNaN(groupKey)
                ? this.container.querySelector(`#${groupKey}`)
                : this.container.querySelector(`#group_${groupKey}`);
            this.container = groupContainer;
            this.fn[fieldType](modelElementName, bFieldMultiple, fieldType);
            this.container = this.container.parentNode;
          }
        });
      } else {
        this.fn[fieldType](modelElementName, bFieldMultiple, fieldType);
      }
    });
  }

  _drawFormScaffolding() {
    this.container.innerHTML = '';
    this.container.appendChild(this.bocadillo);    
    const model = this.model[this.pathName];
    const {groups} = this;
    this._drawMainFieldGroups(groups);
    this._drawFormFieldsModel(model, this.groupsObj);
    this.validateForm = new ValidateForm(this.save,{scope: this.shadowRoot});
  }

  _drawMultiple(bFieldMultiple, modelElementName, divLayer, type) {
    const fnTypes = {
      'input': this._createAddInputBtn.bind(this, modelElementName),
      'textarea': this._createAddTextareaBtn.bind(this, modelElementName),
      'select': this._createAddSelectBtn.bind(this, modelElementName),
      'model': this._createAddModelBtn.bind(this, modelElementName),
    };

    if (bFieldMultiple) {
      const addButton = fnTypes[type](modelElementName);
      divLayer.appendChild(addButton);
    }
  }

  /** CREATE ELEMENTS */
  _createRadioButton(modelElementName) {
    const password = document.createElement('input');
    password.setAttribute('type', 'radio');
    password.classList.add('form-control');
    password.setAttribute('name', modelElementName);
    password.setAttribute('id', this._getNewId(modelElementName));
    this._addInputEvents(password, modelElementName);
    return password;
  }

  _createRadioButtonField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const password = this._createRadioButton(modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(password);
    this.container.appendChild(divLayer);
    this._createInfoIcon(password, modelElementName);
  }

  _createTextarea(modelElementName) {
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control');
    textarea.setAttribute('name', modelElementName);
    textarea.setAttribute('id', this._getNewId(modelElementName));
    textarea.setAttribute('rows', '5');
    textarea.innerHTML = '';
    this._addTextareaEvents(textarea, modelElementName);
    return textarea;
  }

  _createTextareaField(modelElementName, bFieldMultiple = false) {
    const label = this._createLabel(modelElementName);
    const textarea = this._createTextarea(modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(textarea);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer, 'textarea');
    this.container.appendChild(divLayer);
    this._createInfoIcon(textarea, modelElementName);
  }

  _createLabel(modelElementName) {
    this.kk = 'kk';
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    label.innerHTML = modelElementName.replace(/_/g, ' ');
    return label;
  }

  _createInput(modelElementName, fieldType) {
    const input = document.createElement('input');
    input.setAttribute('type', fieldType);
    input.setAttribute('name', modelElementName);
    input.setAttribute('id', this._getNewId(modelElementName));
    input.setAttribute('value', '');
    input.classList.add('form-control');
    return this._addValidation(input, modelElementName);
  }

  _createTextField(modelElementName, bFieldMultiple = false, fieldType = 'text') {
    const label = this._createLabel(modelElementName);
    const input = this._createInput(modelElementName, fieldType);
    this._addInputEvents(input, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer, 'input');
    this.container.appendChild(divLayer);
    this._createInfoIcon(label, modelElementName);
  }

  _createOptions(select, model) {
    this.kk = 'kk';
    const optionDefault = document.createElement('option');
    optionDefault.setAttribute('value', '');
    optionDefault.innerHTML = 'Selecciona una opci??n';
    select.appendChild(optionDefault);
    model.forEach(item => {
      const option = document.createElement('option');
      option.setAttribute('value', item);
      option.innerHTML = item;
      select.appendChild(option);
    });
  }

  _createSelect(modelElementName) {
    this.kk = 'kk';
    const select = document.createElement('select');
    select.setAttribute('name', modelElementName);
    select.setAttribute('id', this._getNewId(modelElementName));
    select.classList.add('form-control');
    return select;
  }

  _createSelectField(model, modelElementName, bFieldMultiple = false) {
    const label = this._createLabel(modelElementName);
    const select = this._createSelect(modelElementName);
    this._addSelectEvents(select, modelElementName);
    this._createOptions(select, model);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    this._drawMultiple(bFieldMultiple, modelElementName, divLayer, 'select');
    this.container.appendChild(divLayer);
    this._createInfoIcon(label, modelElementName);
  }

  _createInfoIcon(element, modelElementName) {
    if (this.info) {
      const infoIcon = document.createElement('div');
      infoIcon.classList.add('info-space');
      element.parentNode.insertBefore(infoIcon, element);
      if (this.info[modelElementName]) {
        infoIcon.classList.add('info-icon');
        infoIcon.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          const targetInfo = ev.target.getClientRects();
          const bocadillo = this.info[modelElementName];
          this._showBocadillo(targetInfo, bocadillo);
        });
      }
    }
  };

  _addBtnProperties(btn, modelElementName) {
    const addButton = btn;
    this.kk = 'kk';
    addButton.title = `Add new ${modelElementName}`;
    addButton.innerHTML = 'Add';
    addButton.classList.add('btn', 'btn-primary');
  }

  _createAddInputBtn(modelElementName) {
    const modelElement = this.model[modelElementName];
    const addButton = document.createElement('button');
    this._addBtnProperties(addButton, modelElementName);
    addButton.addEventListener('click', this._addNewInput.bind(this, modelElementName, modelElement));
    return addButton;
  }

  _createAddSelectBtn(modelElementName) {
    const modelElement = this.model[modelElementName];
    const addButton = document.createElement('button');
    this._addBtnProperties(addButton, modelElementName);
    addButton.addEventListener('click', this._addNewSelect.bind(this, modelElementName, modelElement));
    return addButton;
  }

  _createAddTextareaBtn(modelElementName) {
    const modelElement = this.model[modelElementName];
    const addButton = document.createElement('button');
    this._addBtnProperties(addButton, modelElementName);
    addButton.addEventListener('click', this._addNewTextarea.bind(this, modelElementName, modelElement));
    return addButton;
  }

  _createAddModelBtn(modelElementName) {
    const modelElement = this.model[modelElementName];
    const addButton = document.createElement('button');
    this._addBtnProperties(addButton, modelElementName);
    addButton.addEventListener('click', this._addNewModel.bind(this, modelElementName, modelElement, 'model'));
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
      this._drawMultiple(bFieldMultiple, modelElementName, this.container.parentNode, 'model');
      this.container = this.container.parentNode;
    }
  }

  /** BOCADILLO */
  _createBocadillo() {
    this.bocadillo = document.createElement('div');
    this.bocadillo.setAttribute('id', 'bocadillo');
    this.bocadillo.setAttribute('style', 'display: none;');
    this.bocadillo.classList.add('bocadillo-cuadrado');
  }

  _showBocadillo(targetInfo, bocadillo) {
    if (bocadillo) {
      this.bocadillo.style.display = 'block';
      const {scrollY} = window;
      const targetInfoTop = targetInfo[0].top;
      const targetInfoHeight = targetInfo[0].height;
      const bocadilloInfoHeight = this.bocadillo.getBoundingClientRect().height;
      const targetInfoBottom = targetInfoTop - targetInfoHeight - bocadilloInfoHeight + scrollY;
      this.bocadillo.innerHTML = `<p>${bocadillo}</p>`;
      this.bocadillo.style.top = `${targetInfoBottom}px`;
    }
  }
  
  _hideBocadillo(ev) {
    if (ev.target.id !== 'bocadillo') {
      this.bocadillo.style.display = 'none';
    } 
  }

  /** GETTERS */
  _getFieldset(modelElementName) {
    const fieldsetName = Number.isNaN(modelElementName)
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

  _getSchema() {
    return new Promise(resolve => {
      const databaseModel = getDatabase(this.firebaseApp);
      const databaseRef = ref(databaseModel, `/__schema__/${this.pathName}`);
      onValue(databaseRef, snapshot => {
        const schema = snapshot.val();
        this.model = schema.__model__;
        this.groups = schema.__groups__;
        this.info = schema.__info__;
        this.validation = schema.__validation__;
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

  _getNewId(modelElementName) {
    const fieldsWithSameName = this.shadowRoot.querySelectorAll(`[name="${modelElementName}"]`);
    const N = fieldsWithSameName.length;
    return `${modelElementName}-${N}`;
  }

  /** ADD EVENTS */
  _addSelectEvents(select, modelElementName) {
    select.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
    select.addEventListener('focus', (ev) => {
      const targetInfo = ev.target.getClientRects();
      const bocadillo = this.info[modelElementName];
      this._showBocadillo(targetInfo, bocadillo);
    });
  }

  _addInputEvents(input, modelElementName) {
    input.addEventListener('blur', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
  }

  _addTextareaEvents(textarea, modelElementName) {
    textarea.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      if (this.autoSave) {
        this.save();
      }
    });
  }

  /** ADD FORM ELEMENTS */
  _addNewModel(modelElementName, bFieldMultiple, fieldType, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const fieldset = this._getFieldset(modelElementName);
    this.container.appendChild(fieldset);
    this.fn[fieldType](modelElementName, bFieldMultiple, fieldType);
  }

  _addNewInput(modelElementName, modelElement, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    const input = this._createInput(modelElementName, modelElement);
    this._addInputEvents(input, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    const brotherLayer = ev.target.parentNode;
    brotherLayer.parentNode.insertBefore(divLayer, brotherLayer.nextSibling);
    this._createInfoIcon(label, '');
  }

  _addNewSelect(modelElementName, modelElement, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    const select = this._createSelect(modelElementName, modelElement);
    this._createOptions(select, modelElement);
    this._addSelectEvents(select, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    const brotherLayer = ev.target.parentNode;
    brotherLayer.parentNode.insertBefore(divLayer, brotherLayer.nextSibling);
    this._createInfoIcon(label, '');
  }

  _addNewTextarea(modelElementName, modelElement, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    const textarea = this._createTextarea(modelElementName, modelElement);
    this._addInputEvents(textarea, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(textarea);
    const brotherLayer = ev.target.parentNode;
    brotherLayer.parentNode.insertBefore(divLayer, brotherLayer.nextSibling);
    this._createInfoIcon(label, '');
  }

  _addValidation(formElement, modelElementName) {
    const element = formElement;
    const validation = this.validation[modelElementName];
    if (validation) {
      const validationKeys = Object.keys(validation);
      validationKeys.forEach(validationKey => {
        const validationValue = validation[validationKey];
        if (this.htmlInputAttributes.includes(validationKey)) {
          element.setAttribute(validationKey, validationValue);
        } else {
          element.dataset[validationKey] = validationValue;
        }
      });
    }
    return element;
  }

  /** MAIN METHODS */
  async _generateForm() {
    await this._getSchema();
    this.data = await this._getData();
    this._drawFormScaffolding();
  }

  _firebaseSignedin(ev) {
    // console.log(ev.detail);
    this.user = ev.detail.user;
    this.firebaseApp = document.getElementById(ev.detail.id).firebaseApp;
    this._generateForm();
  }

  getFormValues() {
    // for each form field get the value and save it in the model
    const formElements = this.container.querySelectorAll('input, select, textarea');
    formElements.forEach(formElement => {
      const modelElementName = formElement.getAttribute('name');
      if (formElement.tagName === 'SELECT') {
        this.model[modelElementName] = formElement.value;
      } else if (formElement.tagName === 'INPUT') {
        this.model[modelElementName] = formElement.value;
      } else if (formElement.tagName === 'TEXTAREA') {
        this.model[modelElementName] = formElement.value;
      }
    });
  }

  save() {
    console.log(`save ${this.path}`);
    this.getFormValues();
    console.log(this.model);
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
      <form id="form-${this.id}" class="container 100%" data-validate="true" data-checkrealtime="true"></form>
    `;
  }
}
