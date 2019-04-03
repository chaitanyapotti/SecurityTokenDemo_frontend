import React from "react";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import routes from "./routes";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <Router>
        <App>{routes}</App>
      </Router>
    </Provider>,
    rootElement
  );
} else {
  render(
    <Provider store={store}>
      <Router>
        <App>{routes}</App>
      </Router>
    </Provider>,
    rootElement
  );
}

// ReactDOM.render(
//   <Provider store={store}>
//     <Router>
//       <App>{routes}</App>
//     </Router>
//   </Provider>,
//   document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
