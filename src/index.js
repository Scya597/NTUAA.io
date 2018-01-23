import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './scss/style.scss';
import './scss/style';

const rootElement = document.getElementById('root');
const app = <App />;

render(app, rootElement);
