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
    width: 15%;
  }

  .form-group {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 60rem;
    margin: 1rem 0;
  }

  .form-control {
    width: 75%;
    margin: 0 1rem;
  }
`;
