import React from 'react';

import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client'; // Updated import
import * as serviceWorker from './serviceWorker';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorker.unregister();
