import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './index.css';
import url from "./common/url";
import selfStorage from "./common/storage";
import {getParentUrl} from "./common/utils";

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

selfStorage.setItem("accessFlag","yes");

//Widget not call this
if(!getParentUrl()){
    const hash = window.location.hash;
    if(hash && hash.indexOf("home/backup") == -1){
        const accountId = selfStorage.getItem("accountId");
        if (accountId) {
            // url.accountUnlock();
        } else {
            url.accountCreate();
        }
        document.body.style.background = 'linear-gradient(135deg, rgb(2, 0, 36) 0%, rgba(9,9,121,1) 35%, rgb(187, 103, 248) 100%)';
    }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
