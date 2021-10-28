# \<firebase-autoform>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

Webcomponent to create a form based in a model schema stored in firebase.
Create dinamicaly the form and insert or update the fields based in the model schema.

Firebase realtime database has this keys:

- Model -> with the model schema
- BDD_NAME -> refered in model schema. Is an Array with jsons

It's mandatory use firebase authentication to work.
You can use @majorfoca/firebase-loginbutton to create authentication token.

## Installation

```bash
npm i firebase-autoform
```

## Usage

```html
<script type="module">
  import 'firebase-autoform/firebase-autoform.js';
</script>

<firebase-autoform></firebase-autoform>
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

# Firebase rules

## By user authenticated contains a word

```json
{
  "rules": {
    ".read": "auth.provider === 'google' && auth.token.email.matches(/fosela/)",
    ".write": "auth.provider === 'google' && auth.token.email.matches(/fosela/)"
  }
}
```

## By user authenticated can access to its own data

```json
{
  "rules": {
    "__schema__": {
      ".read": "auth.provider === 'google' && auth.token.email === auth.uid",
      ".write": "false"
    },
    "peliculas": {
      "$ uid": {
        ".read": "$uid === auth.uid",
        ".write ": "$uid === auth.uid"
      }
    }
  }
}
```
