import { css } from 'lit';

export const jsonAutoformStyles = css`
  :host,
  :root {
    display: block;
  }

  fieldset {
    border: 1px solid #ddd !important;
    border-radius: 1rem;
    margin: 2rem;
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
    width: 12%;
  }

  button {
    max-height: 2.5rem;
  }

  .form-group {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 70vw;
    margin: 1rem 0;
    align-items: center;
  }

  .form-control {
    max-height: 2rem;
    max-width: 74%;
    margin: 0 1rem;
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
  }
`;
