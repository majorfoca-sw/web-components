# \<json-autoform>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i json-autoform
```

## Usage

```html
<script type="module">
  import 'json-autoform/json-autoform.js';
</script>

<json-autoform></json-autoform>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

## FIELD TYPES

### PREFIX

- single
- newbbdd
- multiple

### SUFFIX

- number
- string
- textarea
- radio
- checkboxes
- model

## VALIDATIONS:

- int, integer, float, number, numero
- alpha, alfa, text, texto, text-, alphaNumericSpace, textspace, alphaNumeric, textnum
- email, correo
- iccid
- nummovil, movil, mobile
- numfijo, fijo, landphone
- telefono, tel, telephone
- cp, postalcode
- cuentabancaria, accountnumber
- tarjetacredito, creditcard
- nif
- cif
- nie
- fecha, date
- pattern (TODO)
