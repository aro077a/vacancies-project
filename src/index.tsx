import 'react-image-crop/dist/ReactCrop.css';
import 'react-day-picker/lib/style.css';
import 'draft-js/dist/Draft.css';
import './view/styles/global.scss';

import { Worker } from '@react-pdf-viewer/core';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '~/store';
import { App } from '~/view/components/app';

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js">
          <App />
        </Worker>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
