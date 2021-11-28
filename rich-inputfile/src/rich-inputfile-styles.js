import { css } from 'lit';

export const RichInputfileStyles = css`
      /* CSS CUSTOM VARS
        --progress-bg-color, #eee;
        --progress-color1: #09c;
        --progress-color2: #f44;
        --bgcolor-button: #106BA0;
        --color-button: #FFF;
        --input-width: 300px
      */
      :host {
        display: flex;
        padding: 0;
        margin: 30px 0;
        align-items: start;
        justify-content: center;
        flex-direction: column;
      }

      #uploader {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        margin-bottom: 10px;
      }
      #msg {
        color: #F00;
        font-weight: bold;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
      }
      label {
        font-weight: bold;
        margin: 5px 0;
      }
      .wrapper {
        display:flex;
      }
      .bloque1 {
        width: var(--input-width, 300px);
      }
      .bloque2 {
        margin-left:20px;
        display: flex;
        justify-content: center;
        justify-items: center;
        align-items: center;
      }
      .bloque2 a {
        display: block;
      }
      .bloque2 img {
        transform: scale(1);
        transition: transform 0.5s;
      }
      .bloque2 img:hover {
        transform: scale(2);
        transition: transform 0.5s;
      }
      .fakefile {
        width:80px;
        height: 80px;
        border:2px solid black;
      }
      .fakefile > div::before {
        transform: rotate(-45deg);
        content: "FILE";
      }
      .invisible {
        visibility: hidden;
      }
      progress[value]::-webkit-progress-bar {
        background-color: var(--progress-bg-color, #eee);
        border-radius: 2px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
      }
      progress[value]::-webkit-progress-value {
        background-image:
          -webkit-linear-gradient(-45deg, transparent 33%, rgba(0, 0, 0, .1) 33%, rgba(0,0, 0, .1) 66%, transparent 66%),
          -webkit-linear-gradient(top, rgba(255, 255, 255, .25), rgba(0, 0, 0, .25)), 
          -webkit-linear-gradient(left, var(--progress-color1, #09c), var(--progress-color2, #f44));
        border-radius: 2px; 
        background-size: 35px 20px, 100% 100%, 100% 100%;
        -webkit-animation: animate-stripes 5s linear infinite;
        animation: animate-stripes 5s linear infinite;
      }
      progress[value]::-moz-progress-bar { 
        background-image:
          -moz-linear-gradient(135deg, transparent 33%, rgba(0, 0, 0, 0.1) 33%, rgba(0, 0, 0, 0.1) 66%, transparent 66%),
          -moz-linear-gradient(top, rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.25)),
          -moz-linear-gradient(left, var(--progress-color1, #09c), var(--progress-color2, #f44));
        border-radius: 2px; 
        background-size: 35px 20px, 100% 100%, 100% 100%;
        animation: animate-stripes 5s linear infinite;
      }
      input[type="file"] {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
      }
      label[for="fileButton"] {
        padding: 0.5rem;
      }
      label[for="fileButton"], button {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-button, #FFF);
        background-color: var(--bgcolor-button, #106BA0);
        display: inline-block;
        transition: all .5s;
        cursor: pointer;
        text-transform: uppercase;
        width: fit-content;
        text-align: center;
        border: 2px outset var(--bgcolor-button, #106BA0);
        border-radius: 10px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
      .bloque1 button {
        margin:0.3rem;
        padding: 0.5rem;
      }
      .lds-dual-ring {
        display: inline-block;
        width: 80px;
        height: 80px;
      }
      .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: lds-dual-ring 1.2s linear infinite;
      }
      @keyframes lds-dual-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @-webkit-keyframes animate-stripes {
        100% { background-position: -100px 0px; }
      }
      @keyframes animate-stripes {
        100% { background-position: -100px 0px; }
      }
    `;