import { css } from 'lit';

export const jsonAutoformStyles = css`
  :host,
  :root {
    display: block;
  }

  fieldset {
    border: 1px solid #ddd !important;
    border-radius: 1rem;
    margin: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  label {
    padding: 0;
    margin-top: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .form-main-label {
    grid-area: 1 / 2 / 1 / 3;
  }

  input,
  rich-inputfile,
  textarea,
  select {
    grid-area: 2 / 2 / 2 / 3;
  }

  button {
    max-height: 2.5rem;
  }

  .form-group {
    display: grid;
    margin: 1rem;
    grid-template-columns: min-content 7fr 2fr;
    grid-template-rows: max-content;
  }

  .form-control {
    max-height: 2rem;
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
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABaUlEQVRIid2VPU7DQBCFPxzFDeEKHCDhDoQCShQilCtERAjIJVDEGaDi5zCIhoDABGjhAKYgBTHFzOIV2rXXSZcnjTbyzL63eZ5Zw7IjBnrADZAAXxoJcK25eF7yLvAOZCXxBuxVIY6AM4vgHjgCmsCqRgs4BsZW3Uj3lsKQfwP9kk0RcKC1RqQQXYt8M+Q0irYl0vEVxeSe9z01xg4XBpp7Bequgh655z5bigRqwIPm981Dm8h0wjkw85CsaLjwA1zob6dNL6re9BCEoKUciSuZarJRQFBkEcCa5lPzIKhvK8DY92exLfCh6/oCAmbvp0vgTtftBQR2dL11JU2bjpm/TR/516Y2YuTiypDxrypwqLkJnkEDmQVzVbR9RQ5sAVPk5e6WFY8skQHy132oISef6p7TkNNElkiGjP8JMkQNjQ1gSO75TMkrtX0HubjKPjgTAmzxoY50xBXwjExoCjwBl5rzvtDlwC8o13JbRpxVtAAAAABJRU5ErkJggg==')
      no-repeat scroll 0 0 transparent;
    cursor: help;
  }
  .info-space {
    width: 24px;
    height: 24px;
    margin: 7px 5px 7px 0;
    grid-area: 1 / 1 / 1 / 1;
  }

  .form-check-input {
    width: 1rem;
    height: 1rem;
    margin: 0.25rem 2rem 0 0.5rem;
    vertical-align: top;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 1px solid rgba(0, 0, 0, 0.25);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  .form-check-input[type='radio'] {
    border-radius: 50%;
    grid-column: 1 / 1;
  }

  .form-check-label {
    grid-column: 2 / 3;
  }

  .btn {
    display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    max-width: 9rem;
  }

  .btn-primary {
    color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
    grid-area: 2 / 3 / 2 / 3;
    margin-left: 1rem;
  }
`;
