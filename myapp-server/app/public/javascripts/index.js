import React, {Component} from 'react';
import ReactDOM from 'react-dom';

let noNode = typeof window !== "undefined";
if(noNode){
    window.isClient = true;
    window.glo = window;
}

let Main = () => {
    return (
        <div>你好，React同构项目</div>
    );
}

if(isClient) {
    ReactDOM.render(<Main />, document.getElementById("react-app"));
} else {
    module.exports = Main;
}