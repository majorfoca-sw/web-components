import { css } from 'lit';

export const firebaseLoginbuttonStyles = css`
  :host,
  :root {
    display: block;
    --btn-primary-color: rgb(204, 204, 204);
    --btn-background-color: rgb(255, 57, 0);
    --btn-secondary-color: black;
    --btn-text-user-color: #ff0;
    --icon-bg-color-singin: #0a0;
    --icon-bg-color-singout: #a00;
  }
  svg {
    border: 0;
    border-radius: 50%;
    padding: 5px;
    padding-bottom: 6px;
  }
  .signin {
    background: var(--icon-bg-color-singin);
  }
  .signout {
    background: var(--icon-bg-color-singout);
  }
  img {
    margin: 0 5px;
  }
  .wrapper__login--button {
    display: flex;
    font-size: 1.2rem;
    background-color: var(--btn-background-color);
    color: var(--btn-primary-color);
    cursor: pointer;
    border-radius: 10px;
    padding: 10px 20px;
    flex-flow: row wrap;
    justify-content: space-around;
    max-width: 200px;
  }
  .wrapper__login--button-mobile {
    cursor: pointer;
    border: 0;
    background-color: transparent;
    padding: 0;
    flex-flow: row wrap;
    justify-content: space-around;
  }
  .button-text {
    padding-top: 5px;
  }
  .button-icon {
    padding-top: 0;
    margin-left: 5px;
  }
  .button-photo img {
    border: 0;
    width: 25px;
    padding-top: 5px;
  }
  .button-user {
    color: var(--btn-text-user-color);
    font-size: 0.8rem;
  }
  .button-email {
    font-weight: bold;
    font-size: 0.8rem;
  }
  .hide {
    display: none;
    visibility: hidden;
  }
  @media screen and (max-width: 980px) {
    .wrapper__login--button {
      font-size: 0.9rem;
      width: 110px;
      padding: 2px;
    }
    .button-email {
      display: none;
    }
    .button-user {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    .button-photo img {
      display: none;
    }
  }
`;
