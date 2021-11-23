import { html, LitElement } from 'lit';
import { ValidateForm } from 'automatic_form_validation';
import { jsonAutoformStyles } from './json-autoform-style.js';

export class JsonAutoform extends LitElement {
  static get styles() {
    return [jsonAutoformStyles];
  }

  static get properties() {
    return {
      modelName: { type: String, attribute: 'model-name' },
      name: { type: String },
      showName: { type: Boolean, attribute: 'show-name' },
      level: { type: Number, reflect: true },
    };
  }

  constructor(modelName = '', name = '', showName = false) {
    super();
    this.modelName = modelName;
    this.name = name;
    this.showName = showName;
    this.level = 0;

    this.model = {};
    this.groups = {};
    this.info = {};
    this.types = {};
    this.data = {};
    this.formValues = {};
    this.user = null;

    this.container = null;

    this.fnTypes = {
      single: this._drawSingleFields.bind(this),
      newbbdd: this._drawNewBbddFields.bind(this),
      multiple: this._drawMultipleFields.bind(this),
    };

    this.fnFormTypes = {
      string: this._createInputField.bind(this),
      password: this._createInputField.bind(this),
      textarea: this._createTextareaField.bind(this),
      file: this._createFileField.bind(this),
      number: this._createInputField.bind(this),
      date: this._createInputField.bind(this),
      radio: this._createRadioButtonField.bind(this),
      checkbox: this._createCheckboxField.bind(this),
      model: this._createModelFields.bind(this),
    };

    this.linkStyles =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />';

    this.htmlInputAttributes = [
      'maxlength',
      'minlength',
      'size',
      'max',
      'min',
      'step',
      'pattern',
      'placeholder',
    ];
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    document.removeEventListener('click', this._hideBocadillo.bind(this));
  }

  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    this.id = this.id || `json-autoform-${new Date().getTime()}`;
    document.addEventListener('click', this._hideBocadillo.bind(this));
    this.container = this.shadowRoot.querySelector('.container');
    this._createBocadillo();
    const componentCreatedEvent = new CustomEvent('wc-ready', {
      detail: {
        id: this.id,
        componentName: this.tagName,
        component: this,
      },
    });
    document.dispatchEvent(componentCreatedEvent);
  }

  _getContainer(modelElementName) {
    let { container } = this;
    this.groupsKeys.forEach(groupKey => {
      if (this.groups[groupKey].includes(modelElementName)) {
        // console.log(modelElementName, this.shadowRoot.querySelector(`#${groupKey}`));
        const groupKeyId = Number.isNaN(parseInt(groupKey, 10))
          ? groupKey
          : `_${groupKey}`;
        container = this.container.querySelector(`#${groupKeyId}`);
      }
    });
    return container;
  }

  /** DRAW TYPES */
  _drawSingleFields(fieldFormType, modelElementName) {
    const field = this.fnFormTypes[fieldFormType](
      modelElementName,
      fieldFormType
    );
    const container = this._getContainer(modelElementName);
    container.appendChild(field);
    this._createInfoIcon(field, modelElementName);
  }

  _drawNewBbddFields(fieldFormType, modelElementName) {
    this._drawSingleFields(fieldFormType, modelElementName);
  }

  _drawMultipleFields(fieldFormType, modelElementName) {
    const field = this.fnFormTypes[fieldFormType](
      modelElementName,
      fieldFormType
    );
    const container = this._getContainer(modelElementName);
    const addButton = this._createAddButton(modelElementName);
    container.appendChild(field);
    this._createInfoIcon(field, modelElementName);
    field.appendChild(addButton);
  }

  /** DRAW FIELDS FORM */
  _drawFormMainFieldGroups() {
    const { groups } = this;
    if (groups) {
      this.groupsKeys = Object.keys(groups);
      this.groupsKeys.forEach(groupKey => {
        const fieldset = this._createFieldset(groupKey);
        this.container.appendChild(fieldset);
      });
    }
  }

  _getAllGroupValues() {
    let all = [];
    const arr = Object.values(this.groups);
    arr.reduce((acum, el) => {
      all = [...all, ...el];
      return all;
    }, []);
    return all;
  }

  _drawFormFieldsModel() {
    const { model } = this;
    this.allGroupValues = this._getAllGroupValues();
    Object.keys(model).forEach(modelElementName => {
      const [fieldType, fieldFormType] = model[modelElementName].split('_');
      this.fnTypes[fieldType](fieldFormType, modelElementName);
    });
  }

  _drawFormScaffolding() {
    this.container.innerHTML = '';
    this.container.appendChild(this.bocadillo);
    this._drawFormMainFieldGroups();
    this._drawFormFieldsModel();
    this.validateForm = new ValidateForm(this.isFormUpdated, {
      scope: this.shadowRoot,
    });
  }

  _drawMultiple(bFieldMultiple, modelElementName, divLayer, type) {
    const fnTypes = {
      input: this._createAddInputBtn.bind(this, modelElementName),
      textarea: this._createAddTextareaBtn.bind(this, modelElementName),
      select: this._createAddSelectBtn.bind(this, modelElementName),
      model: this._createAddModelBtn.bind(this, modelElementName),
    };

    if (bFieldMultiple) {
      const addButton = fnTypes[type](modelElementName);
      divLayer.appendChild(addButton);
    }
  }

  /** CREATE FORM ELEMENTS */
  _createLabel(modelElementName) {
    this.kk = 'kk';
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    label.classList.add('main-form-label');
    label.innerHTML = modelElementName.replace(/_/g, ' ');
    return label;
  }

  _createInput(modelElementName, fieldType = 'text') {
    const input = document.createElement('input');
    input.setAttribute('type', fieldType);
    input.setAttribute('name', modelElementName);
    input.setAttribute('id', this._getNewId(modelElementName));
    input.setAttribute('value', '');
    input.classList.add('form-control');
    return this._addValidation(input, modelElementName);
  }

  _createTextarea(modelElementName) {
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control');
    textarea.setAttribute('name', modelElementName);
    textarea.setAttribute('id', this._getNewId(modelElementName));
    textarea.setAttribute('rows', '5');
    textarea.innerHTML = '';
    this._addTextareaEvents(textarea, modelElementName);
    return this._addValidation(textarea, modelElementName);
  }

  _createRadioButton(modelElementName, radioName = modelElementName, row) {
    const radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.classList.add('form-check-input');
    radio.style.gridRow = `${row} / ${row}`;
    radio.setAttribute('name', radioName);
    radio.setAttribute('id', this._getNewId(radioName));
    this._addInputEvents(radio, modelElementName);
    return this._addValidation(radio, modelElementName);
  }

  _createCheckbox(modelElementName) {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('form-check-input');
    checkbox.setAttribute('name', modelElementName);
    checkbox.setAttribute('id', this._getNewId(modelElementName));
    this._addInputEvents(checkbox, modelElementName);
    return this._addValidation(checkbox, modelElementName);
  }

  _createOptions(select, model) {
    this.kk = 'kk';
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
  }

  _createSelect(modelElementName) {
    this.kk = 'kk';
    const select = document.createElement('select');
    select.setAttribute('name', modelElementName);
    select.setAttribute('id', this._getNewId(modelElementName));
    select.classList.add('form-control');
    return this._addValidation(select, modelElementName);
  }

  _createInfoIcon(element, modelElementName) {
    if (this.info) {
      const label = element.querySelector('label');
      const infoIcon = document.createElement('div');
      infoIcon.classList.add('info-space');
      element.insertBefore(infoIcon, label);
      if (this.info[modelElementName]) {
        infoIcon.classList.add('info-icon');
        infoIcon.addEventListener('click', ev => {
          ev.stopPropagation();
          ev.preventDefault();
          const targetInfo = ev.target.getClientRects();
          const bocadillo = this.info[modelElementName];
          this._showBocadillo(targetInfo, bocadillo);
        });
      }
    }
  }

  _createFieldset(modelElementName) {
    const fieldsetName = Number.isNaN(parseInt(modelElementName, 10))
      ? modelElementName
      : `_${modelElementName}`;
    const fieldset = document.createElement('fieldset');
    fieldset.setAttribute('id', fieldsetName);
    fieldset.setAttribute('name', fieldsetName);
    const styleLegend = Number.isNaN(parseInt(modelElementName, 10))
      ? ''
      : ' style="display:none;"';
    fieldset.innerHTML = `<legend${styleLegend}>${modelElementName}</legend>`;
    this.container.appendChild(fieldset);
    return fieldset;
  }

  /** CREATE FROM FIELDS (div with label, form element and icon info) */
  _createInputField(modelElementName, fieldType = 'text') {
    const label = this._createLabel(modelElementName);
    const input = this._createInput(modelElementName, fieldType);
    this._addInputEvents(input, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    return divLayer;
  }

  _createTextareaField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const textarea = this._createTextarea(modelElementName);
    textarea.style.maxHeight = '8rem';
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(textarea);
    return divLayer;
  }

  _createFileField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const input = this._createInput(modelElementName, 'file');
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    return divLayer;
  }

  _createRadioButtonField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const radiobuttons = this.schema[modelElementName];
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    if (radiobuttons) {
      radiobuttons.forEach((item, index) => {
        const radio = this._createRadioButton(
          item,
          modelElementName,
          index + 2
        );
        const subLabel = this._createLabel(item);
        subLabel.classList.add('form-check-label');
        divLayer.appendChild(radio);
        divLayer.appendChild(subLabel);
      });
    } else {
      const radio = this._createRadioButton(
        modelElementName,
        modelElementName,
        2
      );
      divLayer.appendChild(radio);
    }
    return divLayer;
  }

  _createCheckboxField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const checkboxes = this.schema[modelElementName];
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    if (checkboxes) {
      checkboxes.forEach(item => {
        const checkbox = this._createCheckbox(item, modelElementName);
        const subLabel = this._createLabel(item);
        subLabel.classList.add('form-check-label');
        divLayer.appendChild(checkbox);
        divLayer.appendChild(subLabel);
      });
    } else {
      const checkbox = this._createCheckbox(modelElementName);
      divLayer.appendChild(checkbox);
    }
    return divLayer;
  }

  _createSelectField(model, modelElementName) {
    const label = this._createLabel(modelElementName);
    const select = this._createSelect(modelElementName);
    this._addSelectEvents(select, modelElementName);
    this._createOptions(select, model);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    return divLayer;
  }

  _createModelFields(modelElementName) {
    let modelFormElement = null;
    if (Array.isArray(this.schema[modelElementName])) {
      const select = this._createSelectField(
        this.schema[modelElementName],
        modelElementName,
        true
      );
      modelFormElement = select;
    } else {
      const fieldset = this._createFieldset(modelElementName);
      // const jsonAutoform = new JsonAutoform(modelElementName, modelElementName);
      const jsonAutoform = document.createElement('json-autoform');
      jsonAutoform.setAttribute('name', modelElementName);
      jsonAutoform.setAttribute('model-name', modelElementName);
      jsonAutoform.setAttribute('id', this._getNewId(modelElementName));
      jsonAutoform.setAttribute('level', this.level + 1);
      this.addEventListener('component-created', e => {
        // console.log('component-created', e.detail);
        if (e.detail.componentName.toLowerCase() === 'json-autoform') {
          jsonAutoform.setSchema(this.schema);
        }
      });
      fieldset.appendChild(jsonAutoform);
      modelFormElement = fieldset;
    }
    return modelFormElement;
  }

  /** CREATE ADD BUTTONS */
  _addBtnProperties(btn, modelElementName) {
    const addButton = btn;
    this.kk = 'kk';
    addButton.title = `Add new ${modelElementName}`;
    addButton.innerHTML = 'Add';
    addButton.classList.add('btn', 'btn-primary');
    addButton.setAttribute('tabindex', 0);
  }

  _createAddButton(modelElementName) {
    const addButton = document.createElement('button');
    this._addBtnProperties(addButton, modelElementName);
    return addButton;
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
      const { scrollY } = window;
      const targetInfoTop = targetInfo[0].top;
      const targetInfoHeight = targetInfo[0].height;
      const bocadilloInfoHeight = this.bocadillo.getBoundingClientRect().height;
      const targetInfoBottom =
        targetInfoTop - targetInfoHeight - bocadilloInfoHeight + scrollY;
      this.bocadillo.innerHTML = `<p>${bocadillo}</p>`;
      this.bocadillo.style.top = `${targetInfoBottom}px`;
    }
  }

  _hideBocadillo(ev) {
    if (ev.target.id !== 'bocadillo') {
      this.bocadillo.style.display = 'none';
    }
  }

  /** SETTERS */
  setSchema(schema) {
    this.schema = schema;
    // console.log(`modelName: ${this.modelName}`);
    this.model = this.schema[this.modelName].__model__;
    this.groups = this.schema[this.modelName].__groups__;
    this.info = this.schema[this.modelName].__info__;
    this.validation = this.schema[this.modelName].__validation__;

    this.generateForm();
  }

  /** GETTERS */
  _getNewId(modelElementName) {
    const parentId = this.container.id;
    const fieldsWithSameName = this.shadowRoot.querySelectorAll(
      `[name="${modelElementName}"]`
    );
    const N = fieldsWithSameName.length;
    return `${parentId}-${modelElementName}-${N}`;
  }

  getFieldsetElements(layer = this.container) {
    const myStorage = {};
    const fieldsetElements = layer.querySelectorAll(':scope > fieldset');
    // console.log(`Get Fieldsets from ${layer.id}`);
    fieldsetElements.forEach(fieldset => {
      const legend = fieldset.querySelector('legend');
      myStorage[legend.innerText] = this.getFormValues(fieldset);
    });
    return myStorage;
  }

  getFormValues(layer) {
    const storage = {};
    const formElements = layer.querySelectorAll(
      'div > input, div > textarea, div > select, :scope > fieldset'
    );
    // console.log(`Get form values from ${layer.id}`);
    formElements.forEach(formElement => {
      const modelElementName = formElement.getAttribute('name');
      if (formElement.tagName === 'SELECT') {
        storage[modelElementName] = formElement.value;
      } else if (formElement.tagName === 'INPUT') {
        storage[modelElementName] = formElement.value;
      } else if (formElement.tagName === 'TEXTAREA') {
        storage[modelElementName] = formElement.value;
      } else if (formElement.tagName === 'FIELDSET') {
        storage[modelElementName] = this.getFieldsetElements(formElement);
      }
    });
    return storage;
  }

  /** ADD EVENTS */
  _addSelectEvents(select, modelElementName) {
    select.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
    select.addEventListener('focus', ev => {
      const targetInfo = ev.target.getClientRects();
      const bocadillo = this.info[modelElementName];
      this._showBocadillo(targetInfo, bocadillo);
    });
  }

  _addInputEvents(input, modelElementName) {
    input.addEventListener('blur', e => {
      this.model[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
  }

  _addTextareaEvents(textarea, modelElementName) {
    textarea.addEventListener('change', e => {
      this.model[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
  }

  /** ADD FORM ELEMENTS */
  _addNewModel(modelElementName, bFieldMultiple, fieldType, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const fieldset = this._createFieldset(modelElementName);
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
  generateForm() {
    if (this.schema) {
      this._drawFormScaffolding();
    } else {
      const errObj = {
        message: 'No schema defined',
        type: 'error',
      };
      throw errObj();
    }
  }

  isFormUpdated() {
    const updateEvent = new CustomEvent('form-updated', {
      detail: {
        model: this.model,
      },
    });
    document.dispatchEvent(updateEvent);
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      />
      <form
        id="form-${this.id}"
        class="container 100%"
        data-validate="true"
        data-checkrealtime="true"
      ></form>
    `;
  }
}
