import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";

// eslint-disable-next-line
import styles from "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
