import { html } from 'lit';
import '../firebase-loginbutton.js';

export default {
  title: 'FirebaseLoginbutton',
  component: 'firebase-loginbutton',
  argTypes: {
    id: { control: 'text' },
    apiKey: { control: 'text' },
    domain: { control: 'text' },
    messagingSenderId: { control: 'text' },
    appId: { control: 'text' },
  },
};

function Template({
  id = 'btn1',
  apiKey = 'AIzaSyCVpVjyqS9qNcTsTDuQ8qBL1i4VPy5CdpY',
  domain = 'coleccion-peliculas',
  messagingSenderId = '852819704247',
  appId = '1:852819704247:web:9ac0a093401920ed',
}) {
  return html`
    <firebase-loginbutton
      id="${id}"
      api-key="${apiKey}"
      domain="${domain}"
      messaging-sender-id="${messagingSenderId}"
      app-id="${appId}"
    >
    </firebase-loginbutton>
  `;
}

export const Regular = Template.bind({});

export const CustomId = Template.bind({});
CustomId.args = {
  id: 'btn1',
};

export const CustomApiKey = Template.bind({});
CustomApiKey.args = {
  apiKey: 'AIzaSyCVpVjyqS9qNcTsTDuQ8qBL1i4VPy5CdpY',
};

export const CustomDomain = Template.bind({});
CustomDomain.args = {
  domain: 'coleccion-peliculas',
};

export const CustomMessagingSenderId = Template.bind({});
CustomMessagingSenderId.args = {
  messagingSenderId: '852819704247',
};

export const CustomappId = Template.bind({});
CustomappId.args = {
  appId: '1:852819704247:web:9ac0a093401920ed',
};
