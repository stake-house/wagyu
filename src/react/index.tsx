import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";

// We find our app DOM element as before
const app = document.getElementById("app");
// Finally, we render our top-level component to the actual DOM.
ReactDOM.render(<App />, app);
