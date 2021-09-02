import { html, LitElement } from 'lit';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseLoginbuttonStyles } from './firebase-loginbutton-style.js';

/**
 * `firebase-loginbutton`
 * FirebaseLoginbutton
 *
 * @customElement firebase-loginbutton
 * @polymer
 * @litElement
 * @demo demo/index.html
 */
export class FirebaseLoginbutton extends LitElement {
  static get is() {
    return 'firebase-loginbutton';
  }

  static get styles() {
    return [firebaseLoginbuttonStyles];
  }

  static get properties() {
    return {
      appName: {
        type: String,
      },
      dataUser: {
        type: Object,
      },
      displayName: {
        type: String,
      },
      email: {
        type: String,
      },
      uid: {
        type: String,
      },
      apiKey: {
        type: String,
        attribute: 'api-key',
      },
      domain: {
        type: String,
      },
      messagingSenderId: {
        type: String,
        attribute: 'messaging-sender-id',
      },
      appId: {
        type: String,
        attribute: 'app-id',
      },
      showPhoto: {
        type: Boolean,
        attribute: 'show-photo',
      },
      showEmail: {
        type: Boolean,
        attribute: 'show-email',
      },
      showUser: {
        type: Boolean,
        attribute: 'show-user',
      },
      showIcon: {
        type: Boolean,
        attribute: 'show-icon',
      },
      hasParams: {
        type: Boolean,
        attribute: false,
      },
      iconLogout: {
        type: String,
        attribute: false,
      },
      infobtn: {
        type: String,
        attribute: false,
      },
      hideIfLogin: {
        type: Boolean,
        attribute: 'hide-if-login',
      },
      firebaseApp: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    if (typeof initializeApp === 'undefined') {
      throw new Error(
        'To work firebase-loginbutton: Please, import firebase-app and firebase-auth first'
      );
    }

    this.showEmail = false;
    this.showUser = false;
    this.showIcon = false;
    this.showPhoto = false;
    this.hideIfLogin = false;
    this.name = 'NAME'; // TODO: generate a random Name to identify the component from others.
    this.dataUser = null;

    this.dispachtSingIn = false;
    this.dispachtSingOut = false;

    this.isMobile =
      navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i
      ) !== null;

    this._dispatchSignin = this._dispatchSignin.bind(this);
    this.toggleSignIn = this.toggleSignIn.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    document.addEventListener('firebase-are-you-logged', this._dispatchSignin);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    document.removeEventListener(
      'firebase-are-you-logged',
      this._dispatchSignin
    );
  }

  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    this.id = this.id || `firebase-loginbutton-${new Date().getTime()}`;
    this.appName = this.appName || `APP-${this.id}`;
    this.firebaseInitialize();

    this.shadowRoot
      .querySelector('#quickstart-sign-in')
      .addEventListener('click', this.toggleSignIn);
  }

  attributeChangedCallback(name, oldval, newval) {
    if (super.attributeChangedCallback) {
      super.attributeChangedCallback(name, oldval, newval);
    }
    this.hasParams = !!(
      this.apiKey &&
      this.domain &&
      this.messagingSenderId &&
      this.appId
    );
  }

  _addGlobalEvent(eventName, detail) {
    if (!global.EventsDispatched) {
      global.EventsDispatched = {};
    }
    global.EventsDispatched[eventName] = detail;
  }

  _dispatchSignin() {
    const detail = {
      user: this.dataUser,
      firebaseApp: this.firebaseApp,
      name: this.appName,
      id: this.id,
    };
    document.dispatchEvent(
      new CustomEvent('firebase-signin', {
        detail,
      })
    );
    this._addGlobalEvent('firebase-signin', detail);
  }

  async firebaseInitialize() {
    if (!this.firebaseApp) {
      const firebaseConfig = {
        apiKey: this.apiKey,
        authDomain: `${this.domain}.firebaseapp.com`,
        databaseURL: `https://${this.domain}.firebaseio.com`,
        projectId: this.domain,
        storageBucket: `${this.domain}.appspot.com`,
        messagingSenderId: this.messagingSenderId,
        appId: this.appId,
      };
      this.firebaseApp = await initializeApp(firebaseConfig, this.appName);
      this.authStateChangedListener();
    } else {
      throw new Error('firebaseApp not found');
    }
  }

  _checkEventsLogin(user) {
    if (user) {
      if (!this.dispachtSingIn) {
        const detail = { detail: { user, name: this.name, id: this.id } };
        document.dispatchEvent(new CustomEvent('firebase-signin', detail));
        this.dispachtSingIn = true;
        this.dispachtSingOut = false;
      }
    } else if (!this.dispachtSingOut) {
      document.dispatchEvent(
        new CustomEvent('firebase-signout', {
          detail: { user: this.email, name: this.name, id: this.id },
        })
      );
      this.dispachtSingIn = false;
      this.dispachtSingOut = true;
    }
  }

  _getUserInfo(user) {
    if (user) {
      this.displayName = user.displayName;
      this.email = user.email;
      this.uid = user.uid;
      this.photo = user.photoURL;
    }
  }

  _drawButtonLogin() {
    const sR = this.shadowRoot;
    const button = this.shadowRoot.querySelector('#quickstart-sign-in');
    if (!this.isMobile) {
      if (this.hideIfLogin && this.dataUser !== null) {
        sR.querySelector('.wrapper__layer--login').classList.add('hide');
      } else {
        button.innerHTML = '<div class="button-text">Sign out</div>';
        if (this.showPhoto) {
          const div = document.createElement('div');
          div.classList.add('button-photo');
          div.innerHTML = `<img src="${this.photo}" />`;
          button.appendChild(div);
        }

        if (this.showIcon) {
          const div = document.createElement('div');
          div.classList.add('button-icon');
          div.innerHTML = `${this.iconLogout}`;
          button.appendChild(div);
        }

        if (this.showUser) {
          const div = document.createElement('div');
          div.classList.add('button-user');
          div.innerHTML = `${this.displayName}`;
          button.appendChild(div);
        }

        if (this.showEmail) {
          const div = document.createElement('div');
          div.classList.add('button-email');
          div.innerHTML = `${this.email}`;
          button.appendChild(div);
        }

        sR.querySelector('#quickstart-sign-in').classList.add(
          'wrapper__login--button'
        );
        sR.querySelector('#quickstart-sign-in').classList.remove(
          'wrapper__login--button-mobile'
        );
      }
    } else {
      const div = document.createElement('div');
      div.classList.add('button-icon');
      div.innerHTML = `${this.iconLogout}`;
      button.appendChild(div);
      if (this.hideIfLogin && this.dataUser !== null) {
        sR.querySelector('.wrapper__layer--login').classList.add('hide');
      } else {
        sR.querySelector('#quickstart-sign-in').classList.remove(
          'wrapper__login--button'
        );
        sR.querySelector('#quickstart-sign-in').classList.add(
          'wrapper__login--button-mobile'
        );
      }
    }
    if (this.showIcon) {
      sR.querySelector('.button-icon svg').classList.remove('signin');
      sR.querySelector('.button-icon svg').classList.add('signout');
    }
  }

  _drawButtonLogout() {
    const sR = this.shadowRoot;
    const button = this.shadowRoot.querySelector('#quickstart-sign-in');
    button.innerHTML = '<div class="button-text">Sign in</div>';

    if (!this.isMobile) {
      if (this.showIcon) {
        const div = document.createElement('div');
        div.classList.add('button-icon');
        div.innerHTML = `${this.iconLogout}`;
        button.appendChild(div);
      }
      sR.querySelector('#quickstart-sign-in').classList.add(
        'wrapper__login--button'
      );
      sR.querySelector('#quickstart-sign-in').classList.remove(
        'wrapper__login--button-mobile'
      );
    } else {
      if (this.showIcon) {
        const div = document.createElement('div');
        div.classList.add('button-text');
        div.innerHTML = `${this.iconLogout}`;
        button.appendChild(div);
      }
      sR.querySelector('#quickstart-sign-in').classList.remove(
        'wrapper__login--button'
      );
      sR.querySelector('#quickstart-sign-in').classList.add(
        'wrapper__login--button-mobile'
      );
    }
    sR.querySelector('.wrapper__layer--login').classList.remove('hide');
    if (this.showIcon) {
      sR.querySelector('.button-icon svg').classList.add('signin');
      sR.querySelector('.button-icon svg').classList.remove('signout');
    }
    this.displayName = undefined;
    this.email = undefined;
    this.uid = undefined;
  }

  authStateChangedListener() {
    this.auth = getAuth(this.firebaseApp);
    onAuthStateChanged(this.auth, user => {
      this.dataUser = user;
      this.iconLogout =
        '<svg id="logout-icon" width="23" height="21" class="signout"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>';
      this._getUserInfo(user);
      this.shadowRoot.querySelector('#quickstart-sign-in').disabled = false;
      if (user) {
        this._drawButtonLogin();
      } else {
        this._drawButtonLogout();
      }
      this._checkEventsLogin(user);
    });
  }

  async toggleSignIn() {
    if (!this.auth.currentUser) {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await signInWithPopup(this.auth, provider);
    } else {
      this.auth.signOut();
    }
    // this.shadowRoot.querySelector('#quickstart-sign-in').disabled = true;
  }

  render() {
    return html`
      <section class="wrapper__layer--login">
        ${this.hasParams
          ? html`
              <div id="user" class="wrapper__user"></div>
              <button disabled id="quickstart-sign-in" title="${this.infobtn}">
                <div class="button-text"></div>
              </button>
            `
          : html` <p>Faltan parámetros en la definición del componente</p> `}
      </section>
    `;
  }
}
