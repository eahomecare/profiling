import React,{Suspense} from 'react';
import ReactDOM from "react-dom";
import App from './App';
import axios from "axios";
import { Provider } from "react-redux";
import {store} from '../src/redux/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <Suspense fallback="...loading">
            <App />
        </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);