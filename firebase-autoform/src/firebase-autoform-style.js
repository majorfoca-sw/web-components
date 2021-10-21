import { css } from 'lit';

export const firebaseAutoformStyles = css`
  :host,
  :root {
    display: block;
  }

  fieldset {
    border: 1px solid #ddd !important;
    border-radius: 1rem;
    margin: 2rem;
    padding: 1rem;
  }

  label {
    padding: 0;
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }

  .form-group {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 1rem;
  }
`;