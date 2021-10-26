import { css } from 'lit';

export const firebaseAutoformStyles = css`
  :host,
  :root {
    display: block;
  }

  form {
    margin:0;
  }

  fieldset {
    border: 1px solid #ddd !important;
    border-radius: 1rem;
    margin: 2rem 0;
    padding: 1rem;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 85vw;
  }

  label {
    padding: 0;
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }

  button {
    max-height:2.5rem;
  }

  .form-group {
    /*display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;*/
    display: grid;
    grid-row: 1;
    grid-template-columns: 3% 12% 70% auto;
    grid-gap: 1rem;
    width: 100vw;
    margin: 1rem 0;
  }

  .grid-field {
    margin: 0 1rem;
    z-index: 10;
    background: transparent
  }

  .bocadillo-cuadrado {
    position: absolute;
    height: 200px;
    width: 300px;
    background: white;
    box-shadow: 1px 12px 33px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 1rem;
    font-family: system-ui;
  }

  .bocadillo-cuadrado:before {
    border: 25px solid white;
    content: '';
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-right-color: transparent;
    position: absolute;
    bottom: -48px;
    left: calc(50% - 25px);
  }

  .info-icon {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABaUlEQVRIid2VPU7DQBCFPxzFDeEKHCDhDoQCShQilCtERAjIJVDEGaDi5zCIhoDABGjhAKYgBTHFzOIV2rXXSZcnjTbyzL63eZ5Zw7IjBnrADZAAXxoJcK25eF7yLvAOZCXxBuxVIY6AM4vgHjgCmsCqRgs4BsZW3Uj3lsKQfwP9kk0RcKC1RqQQXYt8M+Q0irYl0vEVxeSe9z01xg4XBpp7Bequgh655z5bigRqwIPm981Dm8h0wjkw85CsaLjwA1zob6dNL6re9BCEoKUciSuZarJRQFBkEcCa5lPzIKhvK8DY92exLfCh6/oCAmbvp0vgTtftBQR2dL11JU2bjpm/TR/516Y2YuTiypDxrypwqLkJnkEDmQVzVbR9RQ5sAVPk5e6WFY8skQHy132oISef6p7TkNNElkiGjP8JMkQNjQ1gSO75TMkrtX0HubjKPjgTAmzxoY50xBXwjExoCjwBl5rzvtDlwC8o13JbRpxVtAAAAABJRU5ErkJggg==') no-repeat scroll 0 0 transparent;
    cursor: help;
  }
  .info-space {
    grid-column: 1 / 1;
    grid-row: 1;
    width: 24px;
    height: 24px;
    margin: 7px 5px 7px 0;
  }
  .badgesLayer {
    grid-column: 3 / 3;
    grid-row: 1;
    height: 1.5rem;
    text-align: right;
  }
  .badgesLayer .badge-primary {
    color: #000;
    border-radius: 0.25rem;
    margin: 0.5rem 0;
  }
  label {
    grid-column: 2 / 2;
    grid-row: 1;
  }
  .field-control {
    grid-column: 3 / 3;
    grid-row: 1;
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    margin: 0 1rem;
    z-index: 10;
    background: transparent
  }
`;
