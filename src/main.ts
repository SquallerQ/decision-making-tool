import { Router } from "./router";


const appContainer = document.createElement("div");
document.body.appendChild(appContainer);

new Router(appContainer);
