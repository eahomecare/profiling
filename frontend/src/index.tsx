import React, { Fragment, Suspense } from 'react';
import ReactDOM from "react-dom";
import App from './App';
import axios from "axios";
import { Provider } from "react-redux";
import { store } from '../src/redux/store'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Suspense fallback="...loading">
            <App />
          </Suspense>
        </Fragment>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);


// import React,{Suspense} from "react";
// import ReactDOM from "react-dom";
// import axios from "axios";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import "./index.css";
// import './i18n.js'
// import App from "./App";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// const theme = createTheme({});

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;


// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <ThemeProvider theme={theme}>
//         <Suspense fallback="...loading">
//             <App />
//         </Suspense>
//         </ThemeProvider>
//       </BrowserRouter>
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );